import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import { fullyTestedFederations } from '@/data/testedFederations';
import { getFederationsForCountry } from '@/data/federationCountryMap';
import { getDivisionSqlCondition } from '@/lib/divisionMapping';
import { getEquipmentSqlCondition } from '@/lib/equipmentMapping';

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

    // add date filter for current rankings - hybrid logic:
    // April onwards: current year only
    // Jan-Mar: rolling 12 months (includes previous year data)
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed (0 = Jan, 3 = April)
    const isBeforeApril = currentMonth < 3; // Jan, Feb, Mar
    let dateFilterDescription: string = '';

    if (rankType === 'current') {
        if (isBeforeApril) {
            // Jan-Mar: use rolling 12 months
            const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
            const rolling12MonthDate = twelveMonthsAgo.toISOString().split('T')[0];
            baseConditions.push(`date >= $${baseParams.length + 1}`);
            baseParams.push(rolling12MonthDate);
            dateFilterDescription = `rolling12m_from_${rolling12MonthDate}`;
        } else {
            // April onwards: current year only
            const currentYearStr = currentYear.toString();
            baseConditions.push(`date::text LIKE $${baseParams.length + 1}`);
            baseParams.push(`${currentYearStr}%`);
            dateFilterDescription = `year_${currentYear}`;
        }
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

    // debugging
    console.log('Nearby Athletes Query:', nearbyQuery);
    console.log('Query Params:', nearbyParams);
    console.log('Filters:', { federation, equipment, weightClass, division, liftCategory, rankType });

    try {
        // get searched athlete's all-time best (no filters except name)
        let athleteAllTimeBest: number | null = null;
        if (name) {
            const athleteBestQuery = `
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
            const athleteBestResult = await pool.query(athleteBestQuery, [name]);
            athleteAllTimeBest = parseFloat(athleteBestResult.rows[0]?.best_value) || null;
        }

        const result = await pool.query(nearbyQuery, nearbyParams);
        
        let athletes = result.rows.map(row => ({
            name: row.name,
            rank: parseInt(row.rank, 10),
            value: parseFloat(row.best_value),
            isCurrentAthlete: name ? row.name === name : false
        }));

        // update searched athlete's value to their all-time best and re-sort
        if (name && athleteAllTimeBest !== null) {
            const athleteIndex = athletes.findIndex(a => a.isCurrentAthlete);
            if (athleteIndex >= 0) {
                athletes[athleteIndex].value = athleteAllTimeBest;
                
                // re-sort by value descending to get correct positioning
                athletes.sort((a, b) => b.value - a.value);
                
                // recalculate rank numbers based on new sorted positions
                athletes.forEach((athlete, index) => {
                    athlete.rank = startRank + index;
                });
                
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
            dateFilter: dateFilterDescription,
            isRolling12Months: isBeforeApril,
        });
    } catch (error) {
        console.error('Error fetching nearby athletes:', error);
        return NextResponse.json({ error: 'Failed to fetch nearby athletes' }, { status: 500 });
    }
}