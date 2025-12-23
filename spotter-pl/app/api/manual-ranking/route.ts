import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { calculateDots, calculateWilks, calculateGlossbrenner, calculateGoodlift } from '@/lib/points';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    
    const squat = parseFloat(searchParams.get('squat') || '0');
    const bench = parseFloat(searchParams.get('bench') || '0');
    const deadlift = parseFloat(searchParams.get('deadlift') || '0');
    const bodyweight = parseFloat(searchParams.get('bodyweight') || '0');
    const gender = searchParams.get('gender') as 'male' | 'female' | null;
    
    const federation = searchParams.get('federation');
    const equipment = searchParams.get('equipment') || 'Raw';
    const weightClass = searchParams.get('weightClass');
    const division = searchParams.get('division');
    const liftCategory = searchParams.get('lift') || 'Total';

    // determine which column to use for ranking and calculate athlete's value
    let rankColumn = 'totalkg';
    let athleteBest = squat + bench + deadlift;
    let isPoints = false;
    
    if (liftCategory === 'Squat') {
        rankColumn = 'best3squatkg';
        athleteBest = squat;
    } else if (liftCategory === 'Bench') {
        rankColumn = 'best3benchkg';
        athleteBest = bench;
    } else if (liftCategory === 'Deadlift') {
        rankColumn = 'best3deadliftkg';
        athleteBest = deadlift;
    } else if (liftCategory === 'GL Points' || liftCategory === 'Dots' || 
               liftCategory === 'Glossbrenner' || liftCategory === 'McCulloch' || 
               liftCategory === 'Wilks') {
        if (bodyweight <= 0 || !gender) {
            const missingFields = [];
            if (bodyweight <= 0) missingFields.push('bodyweight');
            if (!gender) missingFields.push('gender');
            
            return NextResponse.json({
                currentRank: null,
                allTimeRank: null,
                totalCurrent: 0,
                totalAllTime: 0,
                liftCategory,
                athleteBest: 0,
                isPoints: true,
                message: `${missingFields.join(' and ')} required for points-based rankings`
            });
        }
        // set the appropriate column for points rankings
        if (liftCategory === 'GL Points') {
            rankColumn = 'goodlift';
        } else if (liftCategory === 'Dots') {
            rankColumn = 'dots';
        } else if (liftCategory === 'Glossbrenner') {
            rankColumn = 'glossbrenner';
        } else if (liftCategory === 'McCulloch') {
            rankColumn = 'mcculloch';
        } else if (liftCategory === 'Wilks') {
            rankColumn = 'wilks';
        }
        isPoints = true;
        // Calculate actual points based on the formula
        const total = squat + bench + deadlift;
        
        switch(liftCategory) {
            case 'GL Points':
                athleteBest = calculateGoodlift(gender!, equipment, false, bodyweight, total);
                break;
            case 'Dots':
                athleteBest = calculateDots(gender!, bodyweight, total);
                break;
            case 'Glossbrenner':
                athleteBest = calculateGlossbrenner(gender!, bodyweight, total);
                break;
            case 'Wilks':
                athleteBest = calculateWilks(gender!, bodyweight, total);
                break;
            default:
                athleteBest = total;
        }
    }

    if (athleteBest === 0) {
        return NextResponse.json({
            currentRank: null,
            allTimeRank: null,
            totalCurrent: 0,
            totalAllTime: 0,
            liftCategory,
            athleteBest: 0,
            isPoints,
        });
    }

    // build base filter conditions
    const baseConditions: string[] = [];
    const baseParams: (string | null)[] = [];

    if (federation && federation !== 'all') {
        baseConditions.push(`LOWER(federation) = $${baseParams.length + 1}`);
        baseParams.push(federation.toLowerCase());
    }

    if (equipment && equipment !== 'all') {
        baseConditions.push(`LOWER(equipment) = $${baseParams.length + 1}`);
        baseParams.push(equipment.toLowerCase());
    }

    if (weightClass && weightClass !== 'All classes') {
        const wcNum = weightClass.replace(' kg', '').replace('+', '');
        baseConditions.push(`weightclasskg = $${baseParams.length + 1}`);
        baseParams.push(wcNum);
    }

    if (division && division !== 'All Divisions') {
        baseConditions.push(`division = $${baseParams.length + 1}`);
        baseParams.push(division);
    }

    const baseWhere = baseConditions.length > 0 
        ? `WHERE ${baseConditions.join(' AND ')}`
        : '';

    // current rankings (current year only)
    const currentYear = new Date().getFullYear();
    const currentYearStr = currentYear.toString();
    
    const currentConditions = [...baseConditions];
    currentConditions.push(`date LIKE $${baseParams.length + 1} || '%'`);
    const currentParams = [...baseParams, currentYearStr];
    
    const currentWhere = currentConditions.length > 0 
        ? `WHERE ${currentConditions.join(' AND ')}`
        : '';

    // count all lifters in current category
    const currentCountQuery = `
        SELECT COUNT(DISTINCT name) as total
        FROM opl.opl_raw
        ${currentWhere}
        AND CAST(${rankColumn} AS FLOAT) > 0
    `;
    const currentCountResult = await pool.query(currentCountQuery, currentParams);
    const totalCurrent = parseInt(currentCountResult.rows[0]?.total || '0', 10);

    // count how many lifters have a better value than the manual entry
    const currentRankQuery = `
        SELECT COUNT(DISTINCT name) as better_count
        FROM (
            SELECT name, MAX(CAST(${rankColumn} AS FLOAT)) as best_value
            FROM opl.opl_raw
            ${currentWhere}
            AND CAST(${rankColumn} AS FLOAT) > 0
            GROUP BY name
        ) subquery
        WHERE best_value > $${currentParams.length + 1}
    `;
    const currentRankParams = [...currentParams, athleteBest];
    const currentRankResult = await pool.query(currentRankQuery, currentRankParams);
    const betterThanCurrent = parseInt(currentRankResult.rows[0]?.better_count || '0', 10);
    const currentRank = totalCurrent > 0 ? betterThanCurrent + 1 : null;

    // all time rankings
    const allTimeCountQuery = `
        SELECT COUNT(DISTINCT name) as total
        FROM opl.opl_raw
        ${baseWhere}
        AND CAST(${rankColumn} AS FLOAT) > 0
    `;
    const allTimeCountResult = await pool.query(allTimeCountQuery, baseParams);
    const totalAllTime = parseInt(allTimeCountResult.rows[0]?.total || '0', 10);

    // count how many lifters have a better value than the manual entry (all time)
    const allTimeRankQuery = `
        SELECT COUNT(DISTINCT name) as better_count
        FROM (
            SELECT name, MAX(CAST(${rankColumn} AS FLOAT)) as best_value
            FROM opl.opl_raw
            ${baseWhere}
            AND CAST(${rankColumn} AS FLOAT) > 0
            GROUP BY name
        ) subquery
        WHERE best_value > $${baseParams.length + 1}
    `;
    const allTimeRankParams = [...baseParams, athleteBest];
    const allTimeRankResult = await pool.query(allTimeRankQuery, allTimeRankParams);
    const betterThanAllTime = parseInt(allTimeRankResult.rows[0]?.better_count || '0', 10);
    const allTimeRank = totalAllTime > 0 ? betterThanAllTime + 1 : null;

    return NextResponse.json({
        currentRank,
        allTimeRank,
        totalCurrent,
        totalAllTime,
        liftCategory,
        athleteBest,
        isPoints,
    });
}
