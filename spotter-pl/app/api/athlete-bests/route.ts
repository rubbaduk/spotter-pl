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

    // build query with optional filters
    let query = `
        SELECT 
            name,
            date,
            federation,
            meetname,
            equipment,
            weightclasskg,
            division,
            bodyweightkg,
            best3squatkg,
            best3benchkg,
            best3deadliftkg,
            totalkg,
            dots,
            wilks,
            glossbrenner,
            goodlift
        FROM opl.opl_raw
        WHERE name = $1
    `;
    const params: (string | null)[] = [name];
    let paramIndex = 2;

    if (federation && federation !== 'all') {
        query += ` AND LOWER(federation) = $${paramIndex}`;
        params.push(federation.toLowerCase());
        paramIndex++;
    }

    if (equipment && equipment !== 'all') {
        query += ` AND LOWER(equipment) = $${paramIndex}`;
        params.push(equipment.toLowerCase());
        paramIndex++;
    }

    // weight class comes as "83 kg", need to extract just the number
    if (weightClass && weightClass !== 'All classes') {
        const wcNum = weightClass.replace(' kg', '').replace('+', '');
        query += ` AND weightclasskg = $${paramIndex}`;
        params.push(wcNum);
        paramIndex++;
    }

    if (division && division !== 'All Divisions') {
        query += ` AND division = $${paramIndex}`;
        params.push(division);
        paramIndex++;
    }

    query += ` ORDER BY date DESC`;

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
        return NextResponse.json({ 
            name,
            bestSquat: null,
            bestBench: null,
            bestDeadlift: null,
            bestTotal: null,
            competitions: [],
        });
    }

    // find best lifts across all competitions
    let bestSquat = { value: 0, date: '', meet: '', federation: '' };
    let bestBench = { value: 0, date: '', meet: '', federation: '' };
    let bestDeadlift = { value: 0, date: '', meet: '', federation: '' };
    let bestTotal = { value: 0, date: '', meet: '', federation: '' };
    let bestGoodlift = 0;
    let bestDots = 0;

    for (const row of result.rows) {
        const squat = parseFloat(row.best3squatkg) || 0;
        const bench = parseFloat(row.best3benchkg) || 0;
        const deadlift = parseFloat(row.best3deadliftkg) || 0;
        const total = parseFloat(row.totalkg) || 0;
        const goodlift = parseFloat(row.goodlift) || 0;
        const dots = parseFloat(row.dots) || 0;

        if (squat > bestSquat.value) {
            bestSquat = { value: squat, date: row.date, meet: row.meetname, federation: row.federation };
        }
        if (bench > bestBench.value) {
            bestBench = { value: bench, date: row.date, meet: row.meetname, federation: row.federation };
        }
        if (deadlift > bestDeadlift.value) {
            bestDeadlift = { value: deadlift, date: row.date, meet: row.meetname, federation: row.federation };
        }
        if (total > bestTotal.value) {
            bestTotal = { value: total, date: row.date, meet: row.meetname, federation: row.federation };
        }
        if (goodlift > bestGoodlift) bestGoodlift = goodlift;
        if (dots > bestDots) bestDots = dots;
    }

    // get recent competitions (last 5)
    const recentComps = result.rows.slice(0, 5).map(row => ({
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

    return NextResponse.json({
        name,
        totalMeets: result.rows.length,
        bestSquat: bestSquat.value > 0 ? bestSquat : null,
        bestBench: bestBench.value > 0 ? bestBench : null,
        bestDeadlift: bestDeadlift.value > 0 ? bestDeadlift : null,
        bestTotal: bestTotal.value > 0 ? bestTotal : null,
        bestGoodlift: bestGoodlift > 0 ? bestGoodlift : null,
        bestDots: bestDots > 0 ? bestDots : null,
        recentCompetitions: recentComps,
    });
}

