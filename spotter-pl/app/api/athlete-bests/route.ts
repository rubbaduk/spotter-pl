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

    // optional filters
    const federation = searchParams.get('federation');
    const equipment = searchParams.get('equipment');
    const weightClass = searchParams.get('weightClass');
    const division = searchParams.get('division');

    // filter conditions and parameters
    const filterConditions: string[] = ['name = $1'];
    const params: (string | null)[] = [name];
    let paramIndex = 2;

    if (federation && federation !== 'all') {
        if (federation === 'fully-tested') {
            // filter to only fully-tested federations
            const testedFedsList = fullyTestedFederations.map(f => `'${f}'`).join(', ');
            filterConditions.push(`LOWER(federation) IN (${testedFedsList})`);
        } else if (federation === 'all-tested') {
            // filter to only tested lifters (tested = 'Yes')
            filterConditions.push(`tested = $${paramIndex}`);
            params.push('Yes');
            paramIndex++;
        } else if (federation.startsWith('all-')) {
            // country-based filtering (e.g., 'all-usa', 'all-australia')
            const country = federation.replace('all-', '');
            const countryName = country.charAt(0).toUpperCase() + country.slice(1);
            const countryFeds = getFederationsForCountry(countryName);
            if (countryFeds.length > 0) {
                const fedsList = countryFeds.map(f => `'${f}'`).join(', ');
                filterConditions.push(`LOWER(federation) IN (${fedsList})`);
            }
        } else {
            // specific federation
            filterConditions.push(`LOWER(federation) = $${paramIndex}`);
            params.push(federation.toLowerCase());
            paramIndex++;
        }
    }

    if (equipment && equipment !== 'all') {
        const equipmentResult = getEquipmentSqlCondition(equipment, paramIndex);
        if (equipmentResult.sql) {
            filterConditions.push(equipmentResult.sql);
            params.push(...equipmentResult.values);
            paramIndex += equipmentResult.paramCount;
        }
    }

    // weight class comes as "83 kg", need to extract just the number
    if (weightClass && weightClass !== 'All classes') {
        const wcNum = weightClass.replace(' kg', '').replace('+', '');
        filterConditions.push(`weightclasskg = $${paramIndex}`);
        params.push(wcNum);
        paramIndex++;
    }

    if (division && division !== 'Open') {
        const divisionResult = getDivisionSqlCondition(division, paramIndex);
        if (divisionResult.sql) {
            filterConditions.push(divisionResult.sql);
            params.push(...divisionResult.values);
            paramIndex += divisionResult.paramCount;
        }
    }

    const whereClause = filterConditions.join(' AND ');

    // get athlete's ALL-TIME best lifts 
    const bestsQuery = `
        WITH athlete_data AS (
            SELECT 
                CAST(best3squatkg AS FLOAT) as squat,
                CAST(best3benchkg AS FLOAT) as bench,
                CAST(best3deadliftkg AS FLOAT) as deadlift,
                CAST(totalkg AS FLOAT) as total,
                CAST(goodlift AS FLOAT) as goodlift,
                CAST(dots AS FLOAT) as dots,
                meetname,
                date,
                federation
            FROM opl.opl_raw
            WHERE name = $1
            
            UNION ALL
            
            SELECT 
                CAST(best3squatkg AS FLOAT) as squat,
                CAST(best3benchkg AS FLOAT) as bench,
                CAST(best3deadliftkg AS FLOAT) as deadlift,
                CAST(totalkg AS FLOAT) as total,
                CAST(goodlift AS FLOAT) as goodlift,
                CAST(dots AS FLOAT) as dots,
                meetname,
                date,
                federation
            FROM opl.ipf_raw
            WHERE name = $1
        )
        SELECT 
            (SELECT jsonb_build_object('value', squat, 'date', date::text, 'meet', meetname, 'federation', federation)
             FROM athlete_data 
             WHERE squat > 0
             ORDER BY squat DESC, date DESC LIMIT 1) as best_squat,
            (SELECT jsonb_build_object('value', bench, 'date', date::text, 'meet', meetname, 'federation', federation)
             FROM athlete_data 
             WHERE bench > 0
             ORDER BY bench DESC, date DESC LIMIT 1) as best_bench,
            (SELECT jsonb_build_object('value', deadlift, 'date', date::text, 'meet', meetname, 'federation', federation)
             FROM athlete_data 
             WHERE deadlift > 0
             ORDER BY deadlift DESC, date DESC LIMIT 1) as best_deadlift,
            (SELECT jsonb_build_object('value', total, 'date', date::text, 'meet', meetname, 'federation', federation)
             FROM athlete_data 
             WHERE total > 0
             ORDER BY total DESC, date DESC LIMIT 1) as best_total,
            MAX(goodlift) as best_goodlift,
            MAX(dots) as best_dots
        FROM athlete_data
    `;

    const bestsResult = await pool.query(bestsQuery, [name]);
    const bests = bestsResult.rows[0];

    const bestSquat = bests.best_squat && bests.best_squat.value > 0 ? 
        { ...bests.best_squat, date: bests.best_squat.date ? new Date(bests.best_squat.date).toLocaleDateString('en-AU', { timeZone: 'Australia/Perth' }) : null } : null;
    const bestBench = bests.best_bench && bests.best_bench.value > 0 ? 
        { ...bests.best_bench, date: bests.best_bench.date ? new Date(bests.best_bench.date).toLocaleDateString('en-AU', { timeZone: 'Australia/Perth' }) : null } : null;
    const bestDeadlift = bests.best_deadlift && bests.best_deadlift.value > 0 ? 
        { ...bests.best_deadlift, date: bests.best_deadlift.date ? new Date(bests.best_deadlift.date).toLocaleDateString('en-AU', { timeZone: 'Australia/Perth' }) : null } : null;
    const bestTotal = bests.best_total && bests.best_total.value > 0 ? 
        { ...bests.best_total, date: bests.best_total.date ? new Date(bests.best_total.date).toLocaleDateString('en-AU', { timeZone: 'Australia/Perth' }) : null } : null;
    const bestGoodlift = bests.best_goodlift > 0 ? bests.best_goodlift : null;
    const bestDots = bests.best_dots > 0 ? bests.best_dots : null;

    // get last 5 comps
    const recentCompsQuery = `
        SELECT 
            date,
            meetname,
            federation,
            equipment,
            weightclasskg,
            division,
            bodyweightkg,
            best3squatkg,
            best3benchkg,
            best3deadliftkg,
            totalkg,
            dots
        FROM opl.opl_raw
        WHERE name = $1
        
        UNION
        
        SELECT 
            date,
            meetname,
            federation,
            equipment,
            weightclasskg,
            division,
            bodyweightkg,
            best3squatkg,
            best3benchkg,
            best3deadliftkg,
            totalkg,
            dots
        FROM opl.ipf_raw
        WHERE name = $1
        
        ORDER BY date DESC
        LIMIT 5
    `;
    const recentCompsResult = await pool.query(recentCompsQuery, [name]);
    
    const recentComps = recentCompsResult.rows.map(row => ({
        date: row.date ? new Date(row.date).toISOString().slice(0, 10) : null,
        meetName: row.meetname,
        federation: row.federation,
        equipment: row.equipment,
        weightClass: row.weightclasskg,
        division: row.division,
        bodyweight: row.bodyweightkg,
        squat: row.best3squatkg,
        bench: row.best3benchkg,
        deadlift: row.best3deadliftkg,
        total: row.totalkg,
        dots: row.dots,
    }));

    // get all competitions for progression chart
    const allCompsQuery = `
        SELECT 
            date,
            meetname,
            best3squatkg,
            best3benchkg,
            best3deadliftkg,
            totalkg
        FROM opl.opl_raw
        WHERE name = $1
        AND date IS NOT NULL
        
        UNION
        
        SELECT 
            date,
            meetname,
            best3squatkg,
            best3benchkg,
            best3deadliftkg,
            totalkg
        FROM opl.ipf_raw
        WHERE name = $1
        AND date IS NOT NULL
        
        ORDER BY date ASC
    `;
    const allCompsResult = await pool.query(allCompsQuery, [name]);
    
    const allCompetitions = allCompsResult.rows.map(row => ({
        date: row.date ? new Date(row.date).toLocaleDateString('en-AU', { timeZone: 'Australia/Perth' }) : null,
        meetName: row.meetname,
        squat: parseFloat(row.best3squatkg) || 0,
        bench: parseFloat(row.best3benchkg) || 0,
        deadlift: parseFloat(row.best3deadliftkg) || 0,
        total: parseFloat(row.totalkg) || 0,
    }));

    // get total meets count
    const totalMeetsQuery = `
        SELECT COUNT(*) as total
        FROM (
            SELECT date, meetname
            FROM opl.opl_raw
            WHERE name = $1
            
            UNION
            
            SELECT date, meetname
            FROM opl.ipf_raw
            WHERE name = $1
        ) combined
    `;
    const totalMeetsResult = await pool.query(totalMeetsQuery, [name]);
    const totalMeets = parseInt(totalMeetsResult.rows[0]?.total || '0', 10);

    return NextResponse.json({
        name,
        totalMeets,
        bestSquat,
        bestBench,
        bestDeadlift,
        bestTotal,
        bestGoodlift,
        bestDots,
        recentCompetitions: recentComps,
        allCompetitions,
    });
}
