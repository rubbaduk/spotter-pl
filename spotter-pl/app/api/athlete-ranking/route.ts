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
        SELECT MAX(best_value) as best_value
        FROM (
            SELECT MAX(CAST(${rankColumn} AS FLOAT)) as best_value
            FROM opl.opl_raw
            WHERE name = $1
            AND CAST(${rankColumn} AS FLOAT) > 0
            
            UNION ALL
            
            SELECT MAX(CAST(${rankColumn} AS FLOAT)) as best_value
            FROM opl.ipf_raw
            WHERE name = $1
            AND CAST(${rankColumn} AS FLOAT) > 0
        ) combined
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
    let effectiveYear = currentYear;
    let hasCurrentYearData = true;

    let currentYearStr = effectiveYear.toString();
    
    let currentConditions = [...baseConditions];
    // date field might be stored as "2025" or "2025-01-15", so check if it starts with current year
    currentConditions.push(`date::text LIKE $${baseParams.length + 1}`);
    let currentParams = [...baseParams, `${currentYearStr}%`];
    
    let currentWhere = currentConditions.length > 0 
        ? `WHERE ${currentConditions.join(' AND ')}`
        : '';

    // combine count and rank in each query
    const currentRankingQuery = `
        SELECT 
            COUNT(DISTINCT CASE WHEN best_value > 0 THEN name END) as total,
            COUNT(DISTINCT CASE WHEN best_value > $${currentParams.length + 1} THEN name END) + 1 as rank
        FROM (
            SELECT name, MAX(CAST(${rankColumn} AS FLOAT)) as best_value
            FROM opl.opl_raw
            ${currentWhere}
            GROUP BY name
            
            UNION ALL
            
            SELECT name, MAX(CAST(${rankColumn} AS FLOAT)) as best_value
            FROM opl.ipf_raw
            ${currentWhere}
            GROUP BY name
        ) combined
        WHERE best_value > 0
    `;
    let currentRankingParams = [...currentParams, athleteBest];
    let currentRankingResult = await pool.query(currentRankingQuery, currentRankingParams);
    
    let totalCurrent = parseInt(currentRankingResult.rows[0]?.total || '0', 10);
    
    // fallback on prev year if not data for current year
    // this was done on 1/1/2026 lol

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
    

        currentRankingParams = [...currentParams, athleteBest];
        currentRankingResult = await pool.query(currentRankingQuery, currentRankingParams);

        totalCurrent = parseInt(currentRankingResult.rows[0]?.total || '0', 10);
    } else {
        hasCurrentYearData = true;
    }

    const currentRank = totalCurrent > 0 ? (currentRankingResult.rows[0]?.rank ?? null) : null;

    // all time rankings - combine count and rank
    const allTimeRankingQuery = `
        SELECT 
            COUNT(DISTINCT CASE WHEN best_value > 0 THEN name END) as total,
            COUNT(DISTINCT CASE WHEN best_value > $${baseParams.length + 1} THEN name END) + 1 as rank
        FROM (
            SELECT name, MAX(CAST(${rankColumn} AS FLOAT)) as best_value
            FROM opl.opl_raw
            ${baseWhere}
            ${baseWhere ? 'AND' : 'WHERE'} CAST(${rankColumn} AS FLOAT) > 0
            GROUP BY name
            
            UNION ALL
            
            SELECT name, MAX(CAST(${rankColumn} AS FLOAT)) as best_value
            FROM opl.ipf_raw
            ${baseWhere}
            ${baseWhere ? 'AND' : 'WHERE'} CAST(${rankColumn} AS FLOAT) > 0
            GROUP BY name
        ) combined
    `;
    const allTimeRankingParams = [...baseParams, athleteBest];
    const allTimeRankingResult = await pool.query(allTimeRankingQuery, allTimeRankingParams);
    
    const totalAllTime = parseInt(allTimeRankingResult.rows[0]?.total || '0', 10);
    const allTimeRank = allTimeRankingResult.rows[0]?.rank || null;
    
    // calculate milestones
    const milestones = [100, 50, 20, 10, 5, 1];
    
    // calculate all-time milestone
    let allTimeMilestoneInfo = null;
    if (allTimeRank && allTimeRank > 1) {
        // find the next milestone the athlete is aiming for
        const targetMilestone = milestones.find(m => allTimeRank > m) || 1;
        
        // get the lift value at that milestone position
        const milestoneQuery = `
            WITH ranked_lifters AS (
                SELECT 
                    name,
                    best_value,
                    ROW_NUMBER() OVER (ORDER BY best_value DESC) as rank
                FROM (
                    SELECT name, MAX(CAST(${rankColumn} AS FLOAT)) as best_value
                    FROM opl.opl_raw
                    ${baseWhere}
                    ${baseWhere ? 'AND' : 'WHERE'} CAST(${rankColumn} AS FLOAT) > 0
                    GROUP BY name
                    
                    UNION ALL
                    
                    SELECT name, MAX(CAST(${rankColumn} AS FLOAT)) as best_value
                    FROM opl.ipf_raw
                    ${baseWhere}
                    ${baseWhere ? 'AND' : 'WHERE'} CAST(${rankColumn} AS FLOAT) > 0
                    GROUP BY name
                ) combined
            )
            SELECT best_value
            FROM ranked_lifters
            WHERE rank = $${baseParams.length + 1}
        `;
        const milestoneResult = await pool.query(milestoneQuery, [...baseParams, targetMilestone]);
        
        if (milestoneResult.rows.length > 0) {
            const milestoneValue = parseFloat(milestoneResult.rows[0].best_value) || 0;
            const difference = milestoneValue - athleteBest;
            
            allTimeMilestoneInfo = {
                targetRank: targetMilestone,
                targetValue: milestoneValue,
                difference: difference > 0 ? difference : 0,
                unit: isPoints ? 'points' : 'kg'
            };
        }
    }
    
    // calculate current-year milestone
    let currentMilestoneInfo = null;
    if (currentRank && currentRank > 1) {
        // find the next milestone the athlete is aiming for
        const targetMilestone = milestones.find(m => currentRank > m) || 1;
        
        // get the lift value at that milestone position for current year
        const currentMilestoneQuery = `
            WITH ranked_lifters AS (
                SELECT 
                    name,
                    best_value,
                    ROW_NUMBER() OVER (ORDER BY best_value DESC) as rank
                FROM (
                    SELECT name, MAX(CAST(${rankColumn} AS FLOAT)) as best_value
                    FROM opl.opl_raw
                    ${currentWhere}
                    AND CAST(${rankColumn} AS FLOAT) > 0
                    GROUP BY name
                    
                    UNION ALL
                    
                    SELECT name, MAX(CAST(${rankColumn} AS FLOAT)) as best_value
                    FROM opl.ipf_raw
                    ${currentWhere}
                    AND CAST(${rankColumn} AS FLOAT) > 0
                    GROUP BY name
                ) combined
            )
            SELECT best_value
            FROM ranked_lifters
            WHERE rank = $${currentParams.length + 1}
        `;
        const currentMilestoneResult = await pool.query(currentMilestoneQuery, [...currentParams, targetMilestone]);
        
        if (currentMilestoneResult.rows.length > 0) {
            const milestoneValue = parseFloat(currentMilestoneResult.rows[0].best_value) || 0;
            const difference = milestoneValue - athleteBest;
            
            currentMilestoneInfo = {
                targetRank: targetMilestone,
                targetValue: milestoneValue,
                difference: difference > 0 ? difference : 0,
                unit: isPoints ? 'points' : 'kg'
            };
        }
    }
    
    return NextResponse.json({
        name,
        currentRank,
        allTimeRank,
        totalCurrent,
        totalAllTime,
        liftCategory,
        athleteBest,
        isPoints,
        currentMilestoneInfo,
        allTimeMilestoneInfo,
        currentYear: effectiveYear,
        isCurrentYearData: hasCurrentYearData,
    });
}
