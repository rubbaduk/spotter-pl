import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { fullyTestedFederations } from '@/data/testedFederations';
import { getFederationsForCountry } from '@/data/federationCountryMap';
import { getDivisionSqlCondition } from '@/lib/divisionMapping';
import { getEquipmentSqlCondition } from '@/lib/equipmentMapping';

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
        if (federation === 'fully-tested') {
            // filter to only fully-tested federations
            const testedFedsList = fullyTestedFederations.map(f => `'${f}'`).join(', ');
            baseConditions.push(`LOWER(federation) IN (${testedFedsList})`);
        } else if (federation === 'all-tested') {
            // filter to only tested lifters (tested = 'Yes')
            baseConditions.push(`tested = $${baseParams.length + 1}`);
            baseParams.push('Yes');
        } else if (federation.startsWith('all-')) {
            // country-based filtering (e.g., 'all-usa', 'all-australia')
            const country = federation.replace('all-', '');
            const countryName = country.charAt(0).toUpperCase() + country.slice(1);
            const countryFeds = getFederationsForCountry(countryName);
            if (countryFeds.length > 0) {
                const fedsList = countryFeds.map(f => `'${f}'`).join(', ');
                baseConditions.push(`LOWER(federation) IN (${fedsList})`);
            }
        } else {
            // specific federation
            baseConditions.push(`LOWER(federation) = $${baseParams.length + 1}`);
            baseParams.push(federation.toLowerCase());
        }
    }

    if (equipment && equipment !== 'all') {
        const equipmentResult = getEquipmentSqlCondition(equipment, baseParams.length + 1);
        if (equipmentResult.sql) {
            baseConditions.push(equipmentResult.sql);
            baseParams.push(...equipmentResult.values);
        }
    }

    if (weightClass && weightClass !== 'All classes') {
        const wcNum = weightClass.replace(' kg', '').replace('+', '');
        baseConditions.push(`weightclasskg = $${baseParams.length + 1}`);
        baseParams.push(wcNum);
    }

    if (division && division !== 'Open') {
        const divisionResult = getDivisionSqlCondition(division, baseParams.length + 1);
        if (divisionResult.sql) {
            baseConditions.push(divisionResult.sql);
            baseParams.push(...divisionResult.values);
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

    // get athlete's dots score for tie-breaking
    let athleteDotsScore = 0;
    if (rankColumn === 'totalkg') {
        const dotsQuery = `
            SELECT MAX(CAST(dots AS FLOAT)) as dots_value
            FROM (
                SELECT CAST(dots AS FLOAT) as dots
                FROM opl.opl_raw
                WHERE name = $1 AND CAST(dots AS FLOAT) > 0
                
                UNION ALL
                
                SELECT CAST(dots AS FLOAT) as dots
                FROM opl.ipf_raw
                WHERE name = $1 AND CAST(dots AS FLOAT) > 0
            ) combined
        `;
        const dotsResult = await pool.query(dotsQuery, [name]);
        athleteDotsScore = parseFloat(dotsResult.rows[0]?.dots_value) || 0;
    }

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

    // current rankings - hybrid date filtering:
    // April onwards: current year only
    // Jan-Mar: rolling 12 months (includes previous year data)
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed (0 = Jan, 3 = April)
    const isBeforeApril = currentMonth < 3; // Jan, Feb, Mar
    
    let dateFilterDescription: string;
    const currentConditions = [...baseConditions];
    let currentParams: (string | null)[];
    
    if (isBeforeApril) {
        // Jan-Mar: use rolling 12 months
        const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        const rolling12MonthDate = twelveMonthsAgo.toISOString().split('T')[0];
        currentConditions.push(`date >= $${baseParams.length + 1}`);
        currentParams = [...baseParams, rolling12MonthDate];
        dateFilterDescription = `rolling12m_from_${rolling12MonthDate}`;
    } else {
        // April onwards: current year only
        const currentYearStr = currentYear.toString();
        currentConditions.push(`date::text LIKE $${baseParams.length + 1}`);
        currentParams = [...baseParams, `${currentYearStr}%`];
        dateFilterDescription = `year_${currentYear}`;
    }
    
    const currentWhere = currentConditions.length > 0 
        ? `WHERE ${currentConditions.join(' AND ')}`
        : '';

    // combine count and rank in each query
    const currentRankingQuery = `
        SELECT 
            COUNT(DISTINCT CASE WHEN best_value > 0 THEN name END) as total,
            COUNT(DISTINCT CASE 
                WHEN best_value > $${currentParams.length + 1} THEN name
                ${rankColumn === 'totalkg' ? `WHEN best_value = $${currentParams.length + 1} AND dots_value > $${currentParams.length + 2} THEN name` : ''}
            END) + 1 as rank
        FROM (
            SELECT name, MAX(CAST(${rankColumn} AS FLOAT)) as best_value${rankColumn === 'totalkg' ? ', MAX(CAST(dots AS FLOAT)) as dots_value' : ''}
            FROM opl.opl_raw
            ${currentWhere}
            GROUP BY name
            
            UNION ALL
            
            SELECT name, MAX(CAST(${rankColumn} AS FLOAT)) as best_value${rankColumn === 'totalkg' ? ', MAX(CAST(dots AS FLOAT)) as dots_value' : ''}
            FROM opl.ipf_raw
            ${currentWhere}
            GROUP BY name
        ) combined
        WHERE best_value > 0
    `;
    const currentRankingParams = rankColumn === 'totalkg' 
        ? [...currentParams, athleteBest, athleteDotsScore]
        : [...currentParams, athleteBest];
    const currentRankingResult = await pool.query(currentRankingQuery, currentRankingParams);
    
    const totalCurrent = parseInt(currentRankingResult.rows[0]?.total || '0', 10);

    const currentRank = totalCurrent > 0 ? (currentRankingResult.rows[0]?.rank ?? null) : null;

    // all time rankings - combine count and rank
    const allTimeRankingQuery = `
        SELECT 
            COUNT(DISTINCT CASE WHEN best_value > 0 THEN name END) as total,
            COUNT(DISTINCT CASE 
                WHEN best_value > $${baseParams.length + 1} THEN name
                ${rankColumn === 'totalkg' ? `WHEN best_value = $${baseParams.length + 1} AND dots_value > $${baseParams.length + 2} THEN name` : ''}
            END) + 1 as rank
        FROM (
            SELECT name, MAX(CAST(${rankColumn} AS FLOAT)) as best_value${rankColumn === 'totalkg' ? ', MAX(CAST(dots AS FLOAT)) as dots_value' : ''}
            FROM opl.opl_raw
            ${baseWhere}
            ${baseWhere ? 'AND' : 'WHERE'} CAST(${rankColumn} AS FLOAT) > 0
            GROUP BY name
            
            UNION ALL
            
            SELECT name, MAX(CAST(${rankColumn} AS FLOAT)) as best_value${rankColumn === 'totalkg' ? ', MAX(CAST(dots AS FLOAT)) as dots_value' : ''}
            FROM opl.ipf_raw
            ${baseWhere}
            ${baseWhere ? 'AND' : 'WHERE'} CAST(${rankColumn} AS FLOAT) > 0
            GROUP BY name
        ) combined
    `;
    const allTimeRankingParams = rankColumn === 'totalkg'
        ? [...baseParams, athleteBest, athleteDotsScore]
        : [...baseParams, athleteBest];
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
                    ROW_NUMBER() OVER (
                        ORDER BY best_value DESC${rankColumn === 'totalkg' ? ', dots_value DESC' : ''}
                    ) as rank
                FROM (
                    SELECT name, MAX(CAST(${rankColumn} AS FLOAT)) as best_value${rankColumn === 'totalkg' ? ', MAX(CAST(dots AS FLOAT)) as dots_value' : ''}
                    FROM opl.opl_raw
                    ${baseWhere}
                    ${baseWhere ? 'AND' : 'WHERE'} CAST(${rankColumn} AS FLOAT) > 0
                    GROUP BY name
                    
                    UNION ALL
                    
                    SELECT name, MAX(CAST(${rankColumn} AS FLOAT)) as best_value${rankColumn === 'totalkg' ? ', MAX(CAST(dots AS FLOAT)) as dots_value' : ''}
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
                    ROW_NUMBER() OVER (
                        ORDER BY best_value DESC${rankColumn === 'totalkg' ? ', dots_value DESC' : ''}
                    ) as rank
                FROM (
                    SELECT name, MAX(CAST(${rankColumn} AS FLOAT)) as best_value${rankColumn === 'totalkg' ? ', MAX(CAST(dots AS FLOAT)) as dots_value' : ''}
                    FROM opl.opl_raw
                    ${currentWhere}
                    AND CAST(${rankColumn} AS FLOAT) > 0
                    GROUP BY name
                    
                    UNION ALL
                    
                    SELECT name, MAX(CAST(${rankColumn} AS FLOAT)) as best_value${rankColumn === 'totalkg' ? ', MAX(CAST(dots AS FLOAT)) as dots_value' : ''}
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
        dateFilter: dateFilterDescription,
        isRolling12Months: isBeforeApril,
    });
}
