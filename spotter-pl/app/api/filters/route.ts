import pool from "@/lib/db";
import { NextResponse } from "next/server";

type FilterRow = {
  lifter_id: number;
  name: string;
  latest_federation: string | null;
  latest_country: string | null;
  weight_class: string | null;
  age_division: string | null;
  tested: boolean | null;
  equipment: string | null;
  latest_meet_date: string | null;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = (searchParams.get("name") || "").trim();

  if (!name) {
    return NextResponse.json(
      { error: "Provide lifter name" },
      { status: 400 }
    );
  }

  const sql = `
    select
      ll.id as lifter_id,
      ll.name,
      ll.federation as latest_federation,
      ll.country as latest_country,
      ll.weight_class,
      ll.age_division,
      ll.tested,
      ll.equipment,
      ll.latest_meet_date
    from opl.lifter_latest ll
    where ll.name ilike $1
    order by ll.latest_meet_date desc
    limit 1
  `;

  try {
    const row = (await pool.query<FilterRow>(sql, [name])).rows[0];
    if (!row) {
      return NextResponse.json(
        { error: "Lifter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      lifter_id: row.lifter_id,
      name: row.name,
      filters: {
        federation: row.latest_federation,
        country: row.latest_country,
        weight_class: row.weight_class,
        age_division: row.age_division,
        tested: row.tested,
        equipment: row.equipment,
      },
      latest_meet_date: row.latest_meet_date,
    });
  } catch (err) {
    console.error("filters route error", err);
    return NextResponse.json(
      { error: "Failed to load lifter filters" },
      { status: 500 }
    );
  }
}
