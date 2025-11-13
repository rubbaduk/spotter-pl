import pool from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 25);

    if (q.length < 2) {
        return NextResponse.json({ results: [] });
    }

    let rows;
    if (q.length >= 3) {
    // fuzzy (requires pg_trgm index)
    rows = (await pool.query(
        `
        select name, sex, country, earliest_year, latest_year, federations, meets_count,
                similarity(name, $1) as score
        from opl.lifter_search
        where name % $1
        order by score desc, latest_year desc
        limit $2
        `,
        [q, limit]
    )).rows;
    } else {
    // fast prefix fallback (w/out trigram)
    rows = (await pool.query(
        `
        select name, sex, country, earliest_year, latest_year, federations, meets_count
        from opl.lifter_search
        where name ilike $1 || '%'
        order by latest_year desc, meets_count desc
        limit $2
        `,
        [q, limit]
    )).rows;
    }

  return NextResponse.json({ results: rows });
}
