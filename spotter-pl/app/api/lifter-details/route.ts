import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const name = (searchParams.get('name') || '').trim();

    if (!name) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // get the lifter's most recent comp data from opl_raw
    const result = await pool.query(
        `
        SELECT 
            name,
            sex,
            country,
            federation,
            weightclasskg,
            equipment,
            division,
            date
        FROM opl.opl_raw
        WHERE name = $1
        ORDER BY date DESC
        LIMIT 1
        `,
        [name]
    );

    if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Lifter not found' }, { status: 404 });
    }

    const row = result.rows[0];

    // log raw values 
    console.log('Lifter details raw:', {
        name: row.name,
        weightclasskg: row.weightclasskg,
        division: row.division,
        equipment: row.equipment,
        federation: row.federation,
        country: row.country,
    });

    // format weight class
    let weightClass = null;
    if (row.weightclasskg && row.weightclasskg.trim() !== '') {
        weightClass = `${row.weightclasskg} kg`;
    }

    // format division
    let division = null;
    if (row.division && row.division.trim() !== '') {
        division = row.division;
    }

    return NextResponse.json({
        name: row.name,
        sex: row.sex,
        country: row.country,
        federation: row.federation?.toLowerCase(),
        weightClass,
        equipment: row.equipment?.toLowerCase(),
        division,
        lastCompetition: row.date,
    });
}

