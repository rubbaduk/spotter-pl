import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const name = (searchParams.get('name') || '').trim();

    if (!name) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const federation = searchParams.get('federation');
    const equipment = searchParams.get('equipment');
    const weightClass = searchParams.get('weightClass');
    const division = searchParams.get('division');
    const liftCategory = searchParams.get('lift') || 'Total';

    // determine which column to use for ranking (lifts or points)
    let rankColumn = 'totalkg';
    let isPoints = false;
    
    if (liftCategory === 'Squat') {
        rankColumn = 'best3squatkg';
    } else if (liftCategory === 'Bench') {
        rankColumn = 'best3benchkg';
    } else if (liftCategory === 'Deadlift') {
        rankColumn = 'best3deadliftkg';
    } else if (liftCategory === 'GL Points') {
        rankColumn = 'goodlift';
        isPoints = true;
    } else if (liftCategory === 'Dots') {
        rankColumn = 'dots';
        isPoints = true;
    } else if (liftCategory === 'Glossbrenner') {
        rankColumn = 'glossbrenner';
        isPoints = true;
    } else if (liftCategory === 'McCulloch') {
        rankColumn = 'mcculloch';
        isPoints = true;
    } else if (liftCategory === 'Wilks') {
        rankColumn = 'wilks';
        isPoints = true;
    }
    // else: Total (default to totalkg)

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

    // get athlete's best lifts
    const athleteQuery = `
        SELECT MAX(CAST(${rankColumn} AS FLOAT)) as best_value
        FROM opl.opl_raw
        WHERE name = $1
        AND CAST(${rankColumn} AS FLOAT) > 0
    `;

    const athleteResult = await pool.query(athleteQuery, [name]);
    const athleteBest = parseFloat(athleteResult.rows[0]?.best_value) || 0;

    if (athleteBest === 0) {
        return NextResponse.json({
            name,
            currentRank: null,
            allTimeRank: null,
            totalCurrent: 0,
            totalAllTime: 0,
            liftCategory,
            isPoints,
        });
    }

    // current rankings (current year only)
    const currentYear = new Date().getFullYear();
    const currentYearStr = currentYear.toString();
    
    const currentConditions = [...baseConditions];
    // date field might be stored as "2025" or "2025-01-15", so check if it starts with current year
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

    // athletes position in current rankings (count athletes with better values)
    const currentRankingQuery = `
        SELECT COUNT(DISTINCT name) + 1 as rank
        FROM opl.opl_raw
        ${currentWhere}
        AND CAST(${rankColumn} AS FLOAT) > $${currentParams.length + 1}
    `;
    const currentRankingParams = [...currentParams, athleteBest];
    const currentRankingResult = await pool.query(currentRankingQuery, currentRankingParams);
    
    const currentRank = currentRankingResult.rows[0]?.rank || null;

    // all time rankings
    // count all lifters in all-time category 
    const allTimeCountQuery = `
        SELECT COUNT(DISTINCT name) as total
        FROM opl.opl_raw
        ${baseWhere}
        AND CAST(${rankColumn} AS FLOAT) > 0
    `;
    const allTimeCountResult = await pool.query(allTimeCountQuery, baseParams);
    const totalAllTime = parseInt(allTimeCountResult.rows[0]?.total || '0', 10);

    // get all-time rankings
    const allTimeRankingQuery = `
        SELECT COUNT(DISTINCT name) + 1 as rank
        FROM opl.opl_raw
        ${baseWhere}
        AND CAST(${rankColumn} AS FLOAT) > $${baseParams.length + 1}
    `;
    const allTimeRankingParams = [...baseParams, athleteBest];
    const allTimeRankingResult = await pool.query(allTimeRankingQuery, allTimeRankingParams);
    
    const allTimeRank = allTimeRankingResult.rows[0]?.rank || null;
    
    return NextResponse.json({
        name,
        currentRank: currentRankingResult.rows[0]?.rank || null,
        allTimeRank,
        totalCurrent,
        totalAllTime,
        liftCategory,
        athleteBest,
        isPoints,
    });
}
