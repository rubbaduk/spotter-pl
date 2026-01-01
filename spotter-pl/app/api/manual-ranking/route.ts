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

    // calculate dots score for tie-breaking
    let athleteDotsScore = 0;
    if (rankColumn === 'totalkg' && bodyweight > 0 && gender) {
        const total = squat + bench + deadlift;
        athleteDotsScore = calculateDots(gender, bodyweight, total);
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
        if (division === 'Junior') {
            baseConditions.push(`(division = $${baseParams.length + 1} OR division = $${baseParams.length + 2})`);
            baseParams.push('Junior', 'Juniors');
        } else if (division === 'Sub-Junior') {
            baseConditions.push(`(division = $${baseParams.length + 1} OR division = $${baseParams.length + 2})`);
            baseParams.push('Sub-Junior', 'Sub-Juniors');
        } else {
            baseConditions.push(`division = $${baseParams.length + 1}`);
            baseParams.push(division);
        }
    }

    const baseWhere = baseConditions.length > 0 
        ? `WHERE ${baseConditions.join(' AND ')}`
        : '';

    // current rankings (current year only)
    const currentYear = new Date().getFullYear();
    let effectiveYear = currentYear;
    let hasCurrentYearData = true;

    let currentYearStr = effectiveYear.toString();
    
    let currentConditions = [...baseConditions];
    currentConditions.push(`date::text LIKE $${baseParams.length + 1}`);
    let currentParams = [...baseParams, `${currentYearStr}%`];
    
    let currentWhere = currentConditions.length > 0 
        ? `WHERE ${currentConditions.join(' AND ')}`
        : '';

    // count all lifters in current category
    const currentCountQuery = `
        SELECT COUNT(DISTINCT name) as total
        FROM (
            SELECT name
            FROM opl.opl_raw
            ${currentWhere}
            AND CAST(${rankColumn} AS FLOAT) > 0
            
            UNION
            
            SELECT name
            FROM opl.ipf_raw
            ${currentWhere}
            AND CAST(${rankColumn} AS FLOAT) > 0
        ) combined
    `;
    let currentCountResult = await pool.query(currentCountQuery, currentParams);
    let totalCurrent = parseInt(currentCountResult.rows[0]?.total || '0', 10);

    // fallback on prev year if no data for current year
    if (totalCurrent === 0) {
        effectiveYear = currentYear - 1;
        hasCurrentYearData = false;

        currentYearStr = effectiveYear.toString();

        currentConditions = [...baseConditions];
        currentConditions.push(`date::text LIKE $${baseParams.length + 1}`);
        currentParams = [...baseParams, `${currentYearStr}%`];

        currentWhere = currentConditions.length > 0
            ? `WHERE ${currentConditions.join(' AND ')}`
            : '';

        currentCountResult = await pool.query(currentCountQuery, currentParams);
        totalCurrent = parseInt(currentCountResult.rows[0]?.total || '0', 10);
    } else {
        hasCurrentYearData = true;
    }

    // count how many lifters have a better value than the manual entry
    const currentRankQuery = `
        SELECT COUNT(DISTINCT name) as better_count
        FROM (
            SELECT name, MAX(CAST(${rankColumn} AS FLOAT)) as best_value${rankColumn === 'totalkg' ? ', MAX(CAST(dots AS FLOAT)) as dots_value' : ''}
            FROM opl.opl_raw
            ${currentWhere}
            AND CAST(${rankColumn} AS FLOAT) > 0
            GROUP BY name
            
            UNION
            
            SELECT name, MAX(CAST(${rankColumn} AS FLOAT)) as best_value${rankColumn === 'totalkg' ? ', MAX(CAST(dots AS FLOAT)) as dots_value' : ''}
            FROM opl.ipf_raw
            ${currentWhere}
            AND CAST(${rankColumn} AS FLOAT) > 0
            GROUP BY name
        ) subquery
        WHERE best_value > $${currentParams.length + 1}
            ${rankColumn === 'totalkg' ? `OR (best_value = $${currentParams.length + 1} AND dots_value > $${currentParams.length + 2})` : ''}
    `;
    const currentRankParams = rankColumn === 'totalkg'
        ? [...currentParams, athleteBest, athleteDotsScore]
        : [...currentParams, athleteBest];
    const currentRankResult = await pool.query(currentRankQuery, currentRankParams);
    const betterThanCurrent = parseInt(currentRankResult.rows[0]?.better_count || '0', 10);
    const currentRank = totalCurrent > 0 ? betterThanCurrent + 1 : null;

    // all time rankings
    const allTimeCountQuery = `
        SELECT COUNT(DISTINCT name) as total
        FROM (
            SELECT name
            FROM opl.opl_raw
            ${baseWhere}
            ${baseWhere ? 'AND' : 'WHERE'} CAST(${rankColumn} AS FLOAT) > 0
            
            UNION
            
            SELECT name
            FROM opl.ipf_raw
            ${baseWhere}
            ${baseWhere ? 'AND' : 'WHERE'} CAST(${rankColumn} AS FLOAT) > 0
        ) combined
    `;
    const allTimeCountResult = await pool.query(allTimeCountQuery, baseParams);
    const totalAllTime = parseInt(allTimeCountResult.rows[0]?.total || '0', 10);

    // count how many lifters have a better value than the manual entry (all time)
    const allTimeRankQuery = `
        SELECT COUNT(DISTINCT name) as better_count
        FROM (
            SELECT name, MAX(CAST(${rankColumn} AS FLOAT)) as best_value${rankColumn === 'totalkg' ? ', MAX(CAST(dots AS FLOAT)) as dots_value' : ''}
            FROM opl.opl_raw
            ${baseWhere}
            ${baseWhere ? 'AND' : 'WHERE'} CAST(${rankColumn} AS FLOAT) > 0
            GROUP BY name
            
            UNION
            
            SELECT name, MAX(CAST(${rankColumn} AS FLOAT)) as best_value${rankColumn === 'totalkg' ? ', MAX(CAST(dots AS FLOAT)) as dots_value' : ''}
            FROM opl.ipf_raw
            ${baseWhere}
            ${baseWhere ? 'AND' : 'WHERE'} CAST(${rankColumn} AS FLOAT) > 0
            GROUP BY name
        ) subquery
        WHERE best_value > $${baseParams.length + 1}
            ${rankColumn === 'totalkg' ? `OR (best_value = $${baseParams.length + 1} AND dots_value > $${baseParams.length + 2})` : ''}
    `;
    const allTimeRankParams = rankColumn === 'totalkg'
        ? [...baseParams, athleteBest, athleteDotsScore]
        : [...baseParams, athleteBest];
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
        currentYear: effectiveYear,
        isCurrentYearData: hasCurrentYearData,
    });
}
