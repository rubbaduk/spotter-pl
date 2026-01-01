import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const name = (searchParams.get('name') || '').trim();

    if (!name) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // get recent competitions to find non-null values
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
        
        UNION ALL
        
        SELECT 
            name,
            sex,
            country,
            federation,
            weightclasskg,
            equipment,
            division,
            date
        FROM opl.ipf_raw
        WHERE name = $1
        
        ORDER BY date DESC
        LIMIT 10
        `,
        [name]
    );

    if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Lifter not found' }, { status: 404 });
    }

    // helper if first query value is null -> use next non-null value
    const firstNonEmpty = (field: string): string | null => {
        for (const row of result.rows) {
            const val = row[field];
            if (val && typeof val === 'string' && val.trim() !== '') {
                return val.trim();
            }
        }
        return null;
    };

    const name_ = firstNonEmpty('name');
    const sex = firstNonEmpty('sex');
    const country = firstNonEmpty('country');
    const federation = firstNonEmpty('federation');
    const weightclasskg = firstNonEmpty('weightclasskg');
    const equipment = firstNonEmpty('equipment');
    const division = firstNonEmpty('division');
    const lastCompetition = result.rows[0].date; // always use most recent date

    // log raw values 
    console.log('Lifter details (first non-null):', {
        name: name_,
        weightclasskg,
        division,
        equipment,
        federation,
        country,
    });

    return NextResponse.json({
        name: name_,
        sex,
        country,
        federation: federation?.toLowerCase(),
        weightClass: weightclasskg ? `${weightclasskg} kg` : null,
        equipment: equipment?.toLowerCase(),
        division,
        lastCompetition,
    });
}
