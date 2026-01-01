import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    const athleteRank = searchParams.get('rank');
    const rankType = searchParams.get('rankType') || 'current'; // 'current' or 'all time'
    const federation = searchParams.get('federation');
    const equipment = searchParams.get('equipment');
    const weightClass = searchParams.get('weightClass');
    const division = searchParams.get('division');
    const liftCategory = searchParams.get('lift') || 'Total';
    const range = parseInt(searchParams.get('range') || '5', 10); // how many athletes above/below to show

    if (!athleteRank) {
        return NextResponse.json({ error: 'Rank is required' }, { status: 400 });
    }

    const rank = parseInt(athleteRank, 10);

    // determine which column to use for ranking
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

    // add year filter for current rankings
    let effectiveYear = new Date().getFullYear();
    let hasCurrentYearData = true;

    if (rankType === 'current') {
        let currentYearStr = effectiveYear.toString();
        baseConditions.push(`date::text LIKE $${baseParams.length + 1}`);
        baseParams.push(`${currentYearStr}%`);
    }

    let baseWhere = baseConditions.length > 0 
        ? `WHERE ${baseConditions.join(' AND ')}`
        : '';

    // get nearby athletes
    const nearbyQuery = `
        WITH ranked_lifters AS (
            SELECT 
                name,
                MAX(CAST(${rankColumn} AS FLOAT)) as best_value,
                MAX(CAST(dots AS FLOAT)) as dots_value,
                ROW_NUMBER() OVER (
                    ORDER BY 
                        MAX(CAST(${rankColumn} AS FLOAT)) DESC
                        ${rankColumn === 'totalkg' ? ', MAX(CAST(dots AS FLOAT)) DESC' : ''}
                ) as rank
            FROM (
                SELECT name, CAST(${rankColumn} AS FLOAT) as ${rankColumn}, CAST(dots AS FLOAT) as dots
                FROM opl.opl_raw
                ${baseWhere}
                ${baseWhere ? 'AND' : 'WHERE'} CAST(${rankColumn} AS FLOAT) > 0
                
                UNION ALL
                
                SELECT name, CAST(${rankColumn} AS FLOAT) as ${rankColumn}, CAST(dots AS FLOAT) as dots
                FROM opl.ipf_raw
                ${baseWhere}
                ${baseWhere ? 'AND' : 'WHERE'} CAST(${rankColumn} AS FLOAT) > 0
            ) combined
            GROUP BY name
        )
        SELECT name, best_value, rank
        FROM ranked_lifters
        WHERE rank >= $${baseParams.length + 1} AND rank <= $${baseParams.length + 2}
        ORDER BY rank ASC
    `;

    const startRank = Math.max(1, rank - range);
    const endRank = rank + range;
    const nearbyParams = [...baseParams, startRank, endRank];

    try {
        let result = await pool.query(nearbyQuery, nearbyParams);

        // fallback on prev year if no data for current year
        if (rankType === 'current' && result.rows.length === 0) {
            effectiveYear = new Date().getFullYear() - 1;
            hasCurrentYearData = false;

            const currentYearStr = effectiveYear.toString();
            
            // rebuild conditions with previous year
            const fallbackConditions: string[] = [];
            const fallbackParams: (string | null)[] = [];

            if (federation && federation !== 'all') {
                fallbackConditions.push(`LOWER(federation) = $${fallbackParams.length + 1}`);
                fallbackParams.push(federation.toLowerCase());
            }

            if (equipment && equipment !== 'all') {
                fallbackConditions.push(`LOWER(equipment) = $${fallbackParams.length + 1}`);
                fallbackParams.push(equipment.toLowerCase());
            }

            if (weightClass && weightClass !== 'All classes') {
                const wcNum = weightClass.replace(' kg', '').replace('+', '');
                fallbackConditions.push(`weightclasskg = $${fallbackParams.length + 1}`);
                fallbackParams.push(wcNum);
            }

            if (division && division !== 'All Divisions') {
                if (division === 'Junior') {
                    fallbackConditions.push(`(division = $${fallbackParams.length + 1} OR division = $${fallbackParams.length + 2})`);
                    fallbackParams.push('Junior', 'Juniors');
                } else if (division === 'Sub-Junior') {
                    fallbackConditions.push(`(division = $${fallbackParams.length + 1} OR division = $${fallbackParams.length + 2})`);
                    fallbackParams.push('Sub-Junior', 'Sub-Juniors');
                } else {
                    fallbackConditions.push(`division = $${fallbackParams.length + 1}`);
                    fallbackParams.push(division);
                }
            }

            fallbackConditions.push(`date::text LIKE $${fallbackParams.length + 1}`);
            fallbackParams.push(`${currentYearStr}%`);

            baseWhere = fallbackConditions.length > 0 
                ? `WHERE ${fallbackConditions.join(' AND ')}`
                : '';

            const fallbackQuery = `
                WITH ranked_lifters AS (
                    SELECT 
                        name,
                        MAX(CAST(${rankColumn} AS FLOAT)) as best_value,
                        MAX(CAST(dots AS FLOAT)) as dots_value,
                        ROW_NUMBER() OVER (
                            ORDER BY 
                                MAX(CAST(${rankColumn} AS FLOAT)) DESC
                                ${rankColumn === 'totalkg' ? ', MAX(CAST(dots AS FLOAT)) DESC' : ''}
                        ) as rank
                    FROM (
                        SELECT name, CAST(${rankColumn} AS FLOAT) as ${rankColumn}, CAST(dots AS FLOAT) as dots
                        FROM opl.opl_raw
                        ${baseWhere}
                        ${baseWhere ? 'AND' : 'WHERE'} CAST(${rankColumn} AS FLOAT) > 0
                        
                        UNION ALL
                        
                        SELECT name, CAST(${rankColumn} AS FLOAT) as ${rankColumn}, CAST(dots AS FLOAT) as dots
                        FROM opl.ipf_raw
                        ${baseWhere}
                        ${baseWhere ? 'AND' : 'WHERE'} CAST(${rankColumn} AS FLOAT) > 0
                    ) combined
                    GROUP BY name
                )
                SELECT name, best_value, rank
                FROM ranked_lifters
                WHERE rank >= $${fallbackParams.length + 1} AND rank <= $${fallbackParams.length + 2}
                ORDER BY rank ASC
            `;

            const fallbackNearbyParams = [...fallbackParams, startRank, endRank];
            result = await pool.query(fallbackQuery, fallbackNearbyParams);
        } else {
            hasCurrentYearData = true;
        }
        
        // searched athlete's all time best
        let athleteAllTimeBest: number | null = null;
        if (name) {
            const allTimeBestQuery = `
                SELECT MAX(CAST(${rankColumn} AS FLOAT)) as best_value
                FROM (
                    SELECT CAST(${rankColumn} AS FLOAT) as ${rankColumn}
                    FROM opl.opl_raw
                    WHERE name = $1 AND CAST(${rankColumn} AS FLOAT) > 0
                    
                    UNION ALL
                    
                    SELECT CAST(${rankColumn} AS FLOAT) as ${rankColumn}
                    FROM opl.ipf_raw
                    WHERE name = $1 AND CAST(${rankColumn} AS FLOAT) > 0
                ) combined
            `;
            const allTimeBestResult = await pool.query(allTimeBestQuery, [name]);
            athleteAllTimeBest = parseFloat(allTimeBestResult.rows[0]?.best_value) || null;
        }
        
        let athletes = result.rows.map(row => ({
            name: row.name,
            rank: parseInt(row.rank, 10),
            value: parseFloat(row.best_value),
            isCurrentAthlete: name ? row.name === name : false
        }));

        // if searched athlete exists, update their value to all-time best and re-sort
        if (name && athleteAllTimeBest !== null) {
            const searchedAthleteIndex = athletes.findIndex(a => a.isCurrentAthlete);
            
            if (searchedAthleteIndex >= 0) {
                // update value to all-time best
                athletes[searchedAthleteIndex].value = athleteAllTimeBest;
                
                // re-sort by value descending to get correct positioning
                athletes.sort((a, b) => b.value - a.value);
                
                // find the searched athlete's new position in the sorted list
                const searchedAthletePosition = athletes.findIndex(a => a.isCurrentAthlete);
                
                // keep only athletes around the searched athlete (by position, not rank)
                const startPosition = Math.max(0, searchedAthletePosition - range);
                const endPosition = Math.min(athletes.length - 1, searchedAthletePosition + range);
                athletes = athletes.slice(startPosition, endPosition + 1);
            }
        }

        return NextResponse.json({
            athletes,
            isPoints,
            liftCategory,
            unit: isPoints ? 'pts' : 'kg',
            currentYear: effectiveYear,
            isCurrentYearData: hasCurrentYearData,
        });
    } catch (error) {
        console.error('Error fetching nearby athletes:', error);
        return NextResponse.json({ error: 'Failed to fetch nearby athletes' }, { status: 500 });
    }
}