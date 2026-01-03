// Division mapping utilities for OpenPowerlifting data
// NOTE - OPL Division field is free-form text per federation (e.g., MR-O, MR-Jr, Open, Juniors 20-23)
// AgeClass is standardized with age ranges like 24-34, 20-23, 40-44, etc.

export type DivisionFilter = 
  | 'Open'        // all ages
  | 'Junior'      // 18-23
  | 'Sub-Junior'  // 14-18  
  | 'Masters 1'   // 40-49
  | 'Masters 2'   // 50-59
  | 'Masters 3'   // 60-69
  | 'Masters 4';  // 70+

// ageClass ranges for each division
const ageClassRanges: Record<DivisionFilter, { min: number; max: number } | null> = {
  'Open': null, 
  'Junior': { min: 18, max: 23 },
  'Sub-Junior': { min: 14, max: 18 },
  'Masters 1': { min: 40, max: 49 },
  'Masters 2': { min: 50, max: 59 },
  'Masters 3': { min: 60, max: 69 },
  'Masters 4': { min: 70, max: 999 },
};
// Get SQL condition for division filtering based on ageclass only
// Open = no filter, other divisions filter by age range
export function getDivisionSqlCondition(
  division: string,
  startParamIndex: number
): { sql: string; values: string[]; paramCount: number } {
  // Open or empty = no filter (all ages)
  if (!division || division === 'Open' || division === 'All Divisions') {
    return { sql: '', values: [], paramCount: 0 };
  }

  const ageRange = ageClassRanges[division as DivisionFilter];

  // unknown division = no filter
  if (!ageRange) {
    return { sql: '', values: [], paramCount: 0 };
  }

  // filter by ageclass range
  // AgeClass format is like "24-34" or "40-44" - we extract the first number
  const sql = `(ageclass IS NOT NULL AND ageclass != '' AND (
    CAST(NULLIF(SPLIT_PART(ageclass, '-', 1), '') AS INTEGER) >= ${ageRange.min}
    AND CAST(NULLIF(SPLIT_PART(ageclass, '-', 1), '') AS INTEGER) <= ${ageRange.max}
  ))`;

  return { sql, values: [], paramCount: 0 };
}
