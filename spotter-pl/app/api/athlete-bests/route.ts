import pool from '@/lib/db';
import { NextResponse } from 'next/server';

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

    // Build filter conditions and parameters
    const filterConditions: string[] = ['name = $1'];
    const params: (string | null)[] = [name];
    let paramIndex = 2;

    if (federation && federation !== 'all') {
        filterConditions.push(`LOWER(federation) = $${paramIndex}`);
        params.push(federation.toLowerCase());
        paramIndex++;
    }

    if (equipment && equipment !== 'all') {
        filterConditions.push(`LOWER(equipment) = $${paramIndex}`);
        params.push(equipment.toLowerCase());
        paramIndex++;
    }

    // weight class comes as "83 kg", need to extract just the number
    if (weightClass && weightClass !== 'All classes') {
        const wcNum = weightClass.replace(' kg', '').replace('+', '');
        filterConditions.push(`weightclasskg = $${paramIndex}`);
        params.push(wcNum);
        paramIndex++;
    }

    if (division && division !== 'All Divisions') {
        filterConditions.push(`division = $${paramIndex}`);
        params.push(division);
        paramIndex++;
    }

    const whereClause = filterConditions.join(' AND ');

    // Optimized: Use SQL aggregation with DISTINCT ON to find bests efficiently
    // This performs the aggregation in the database instead of fetching all rows
    const bestsQuery = `
        WITH filtered_data AS (
            SELECT 
                CAST(best3squatkg AS FLOAT) as squat,
                CAST(best3benchkg AS FLOAT) as bench,
                CAST(best3deadliftkg AS FLOAT) as deadlift,
                CAST(totalkg AS FLOAT) as total,
                CAST(goodlift AS FLOAT) as goodlift,
                CAST(dots AS FLOAT) as dots,
                date,
                meetname,
                federation
            FROM opl.opl_raw
            WHERE ${whereClause}
            AND CAST(best3squatkg AS FLOAT) > 0
        )
        SELECT 
            (SELECT jsonb_build_object('value', squat, 'date', date, 'meet', meetname, 'federation', federation)
             FROM filtered_data ORDER BY squat DESC, date DESC LIMIT 1) as best_squat,
            (SELECT jsonb_build_object('value', bench, 'date', date, 'meet', meetname, 'federation', federation)
             FROM filtered_data ORDER BY bench DESC, date DESC LIMIT 1) as best_bench,
            (SELECT jsonb_build_object('value', deadlift, 'date', date, 'meet', meetname, 'federation', federation)
             FROM filtered_data ORDER BY deadlift DESC, date DESC LIMIT 1) as best_deadlift,
            (SELECT jsonb_build_object('value', total, 'date', date, 'meet', meetname, 'federation', federation)
             FROM filtered_data ORDER BY total DESC, date DESC LIMIT 1) as best_total,
            MAX(goodlift) as best_goodlift,
            MAX(dots) as best_dots
        FROM filtered_data
    `;

    const bestsResult = await pool.query(bestsQuery, params);
    const bestsRow = bestsResult.rows[0] || {};

    const bestSquat = bestsRow.best_squat && bestsRow.best_squat.value > 0 ? bestsRow.best_squat : null;
    const bestBench = bestsRow.best_bench && bestsRow.best_bench.value > 0 ? bestsRow.best_bench : null;
    const bestDeadlift = bestsRow.best_deadlift && bestsRow.best_deadlift.value > 0 ? bestsRow.best_deadlift : null;
    const bestTotal = bestsRow.best_total && bestsRow.best_total.value > 0 ? bestsRow.best_total : null;
    const bestGoodlift = bestsRow.best_goodlift > 0 ? bestsRow.best_goodlift : null;
    const bestDots = bestsRow.best_dots > 0 ? bestsRow.best_dots : null;

    // get recent competitions (last 5) - IGNORE ALL FILTERS, just get most recent 5
    // This query uses the name index for fast lookup
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
        ORDER BY date DESC
        LIMIT 5
    `;
    const recentCompsResult = await pool.query(recentCompsQuery, [name]);
    
    const recentComps = recentCompsResult.rows.map(row => ({
        date: row.date,
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

    // get total meets count (all competitions, regardless of filters)
    // This query uses the name index for fast lookup
    const totalMeetsQuery = `
        SELECT COUNT(*) as total
        FROM opl.opl_raw
        WHERE name = $1
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
    });
}
