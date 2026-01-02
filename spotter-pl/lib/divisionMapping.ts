// Division mapping utilities for OpenPowerlifting data
// NOTE - OPL Division field is free-form text per federation (e.g., MR-O, MR-Jr, Open, Juniors 20-23)
// AgeClass is more standardized with age ranges like 24-34, 20-23, 40-44, etc.
// this file provides SQL conditions to match divisions across different federation formats

export type DivisionFilter = 
  | 'All Divisions'
  | 'Open'
  | 'Junior'
  | 'Sub-Junior'
  | 'Masters 1'
  | 'Masters 2'
  | 'Masters 3'
  | 'Masters 4'
  | 'Special Olympics';

// common division name patterns found in OPL data

const divisionPatterns: Record<DivisionFilter, string[]> = {
  'All Divisions': [],
  'Open': [
    'Open', 'O', 'MR-O', 'FR-O', 'MR-O-APF', 'FR-O-APF',
    'M-O', 'F-O', 'Raw Open', 'Equipped Open', 'Pro Open'
  ],
  'Junior': [
    'Junior', 'Juniors', 'Jr', 'MR-Jr', 'FR-Jr', 'M-Jr', 'F-Jr',
    'Juniors 20-23', 'Junior 20-23', 'Juniors 18-23', 'Junior 18-23',
    'MR-Jr-APF', 'FR-Jr-APF'
  ],
  'Sub-Junior': [
    'Sub-Junior', 'Sub-Juniors', 'Subjunior', 'Subjuniors', 'SJ',
    'MR-SJ', 'FR-SJ', 'M-SJ', 'F-SJ', 'Teen', 'Teens',
    'Teen 1', 'Teen 2', 'Teen 3', 'T1', 'T2', 'T3',
    'MR-T1', 'MR-T2', 'MR-T3', 'FR-T1', 'FR-T2', 'FR-T3'
  ],
  'Masters 1': [
    'Masters 1', 'Master 1', 'M1', 'MR-M1', 'FR-M1', 'M-M1', 'F-M1',
    'Masters 40-44', 'Masters 45-49', 'Masters 40-49',
    'MR-M1-APF', 'FR-M1-APF'
  ],
  'Masters 2': [
    'Masters 2', 'Master 2', 'M2', 'MR-M2', 'FR-M2', 'M-M2', 'F-M2',
    'Masters 50-54', 'Masters 55-59', 'Masters 50-59',
    'MR-M2-APF', 'FR-M2-APF'
  ],
  'Masters 3': [
    'Masters 3', 'Master 3', 'M3', 'MR-M3', 'FR-M3', 'M-M3', 'F-M3',
    'Masters 60-64', 'Masters 65-69', 'Masters 60-69',
    'MR-M3-APF', 'FR-M3-APF'
  ],
  'Masters 4': [
    'Masters 4', 'Master 4', 'M4', 'MR-M4', 'FR-M4', 'M-M4', 'F-M4',
    'Masters 70-74', 'Masters 75-79', 'Masters 80+', 'Masters 70+',
    'MR-M4-APF', 'FR-M4-APF'
  ],
  'Special Olympics': [
    'Special Olympics', 'SO', 'Adaptive', 'Para'
  ]
};

// AgeClass ranges that correspond to each division
// AgeClass values are like: 24-34, 35-39, 40-44, 20-23, 18-19, 14-15, etc.
const ageClassRanges: Record<DivisionFilter, { min: number; max: number } | null> = {
  'All Divisions': null,
  'Open': { min: 24, max: 39 },
  'Junior': { min: 18, max: 23 },
  'Sub-Junior': { min: 14, max: 18 },
  'Masters 1': { min: 40, max: 49 },
  'Masters 2': { min: 50, max: 59 },
  'Masters 3': { min: 60, max: 69 },
  'Masters 4': { min: 70, max: 999 },
  'Special Olympics': null
};


// @param division - division filter value from UI
// @param paramIndex - current parameter index for SQL placeholders
// @returns object with SQL condition string and parameters array
 
export function buildDivisionCondition(
  division: string,
  paramIndex: number
): { condition: string; params: string[]; nextParamIndex: number } {
  if (!division || division === 'All Divisions') {
    return { condition: '', params: [], nextParamIndex: paramIndex };
  }

  const patterns = divisionPatterns[division as DivisionFilter];
  const ageRange = ageClassRanges[division as DivisionFilter];

  if (!patterns && !ageRange) {
    // unknown division, try exact match
    return {
      condition: `division = $${paramIndex}`,
      params: [division],
      nextParamIndex: paramIndex + 1
    };
  }

  const conditions: string[] = [];
  const params: string[] = [];
  let currentIndex = paramIndex;

  // build Division pattern matching conditions
  if (patterns && patterns.length > 0) {
    const patternConditions = patterns.map((pattern) => {
      params.push(pattern);
      return `LOWER(division) = LOWER($${currentIndex++})`;
    });
    
    // add LIKE patterns for partial matches (e.g., "MR-O" in "MR-O-APF")
    const likePatterns = patterns.slice(0, 5).map((pattern) => {
      params.push(`%${pattern}%`);
      return `LOWER(division) LIKE LOWER($${currentIndex++})`;
    });
    
    conditions.push(`(${[...patternConditions, ...likePatterns].join(' OR ')})`);
  }

  // build AgeClass range condition
  // AgeClass format is like "24-34" or "40-44" - we extract the first number
  if (ageRange) {
    // match ageclass where the starting age falls within our range
    // e.g - for Junior (18-23), match ageclass starting with 18, 19, 20, 21, 22, 23
    conditions.push(
      `(ageclass IS NOT NULL AND (
        CAST(SPLIT_PART(ageclass, '-', 1) AS INTEGER) >= ${ageRange.min}
        AND CAST(SPLIT_PART(ageclass, '-', 1) AS INTEGER) <= ${ageRange.max}
      ))`
    );
  }

  return {
    condition: conditions.length > 0 ? `(${conditions.join(' OR ')})` : '',
    params,
    nextParamIndex: currentIndex
  };
}


// simplified version that returns just the SQL fragment with placeholders
// for use in existing code that manages its own parameter arrays

export function getDivisionSqlCondition(
  division: string,
  startParamIndex: number
): { sql: string; values: string[]; paramCount: number } {
  if (!division || division === 'All Divisions') {
    return { sql: '', values: [], paramCount: 0 };
  }

  const patterns = divisionPatterns[division as DivisionFilter] || [];
  const ageRange = ageClassRanges[division as DivisionFilter];

  const values: string[] = [];
  const sqlParts: string[] = [];
  let idx = startParamIndex;

  // add exact and partial Division matches
  if (patterns.length > 0) {
    const exactMatches: string[] = [];
    const likeMatches: string[] = [];
    
    for (const pattern of patterns) {
      values.push(pattern.toLowerCase());
      exactMatches.push(`LOWER(division) = $${idx++}`);
    }
    
    // add LIKE patterns for first few patterns to catch variations
    for (const pattern of patterns.slice(0, 3)) {
      values.push(`%${pattern.toLowerCase()}%`);
      likeMatches.push(`LOWER(division) LIKE $${idx++}`);
    }
    
    sqlParts.push(`(${[...exactMatches, ...likeMatches].join(' OR ')})`);
  }

  // add AgeClass range condition (uses literals)
  if (ageRange) {
    sqlParts.push(
      `(ageclass IS NOT NULL AND ageclass != '' AND (
        CAST(NULLIF(SPLIT_PART(ageclass, '-', 1), '') AS INTEGER) >= ${ageRange.min}
        AND CAST(NULLIF(SPLIT_PART(ageclass, '-', 1), '') AS INTEGER) <= ${ageRange.max}
      ))`
    );
  }

  if (sqlParts.length === 0) {
    // fallback to exact match
    values.push(division);
    return { sql: `division = $${idx}`, values, paramCount: 1 };
  }

  return {
    sql: `(${sqlParts.join(' OR ')})`,
    values,
    paramCount: values.length
  };
}
