// Equipment mapping utilities for OpenPowerlifting data
// Supports combined equipment filters like "Raw + Wraps" used by some federations

export type EquipmentFilter = 
  | 'all'
  | 'raw'
  | 'wraps'
  | 'raw+wraps'
  | 'single-ply'
  | 'multi-ply'
  | 'unlimited'
  | 'straps';

// Equipment values as they appear in the database (lowercase)
const equipmentValues: Record<EquipmentFilter, string[]> = {
  'all': [],
  'raw': ['raw'],
  'wraps': ['wraps'],
  'raw+wraps': ['raw', 'wraps'],
  'single-ply': ['single-ply'],
  'multi-ply': ['multi-ply'],
  'unlimited': ['unlimited'],
  'straps': ['straps'],
};

/**
 * Get SQL condition for equipment filtering
 * @param equipment - equipment filter value from UI
 * @param paramIndex - current parameter index for SQL placeholders
 * @returns object with SQL condition string and parameters array
 */
export function getEquipmentSqlCondition(
  equipment: string | null,
  paramIndex: number
): { sql: string; values: string[]; paramCount: number } {
  if (!equipment || equipment === 'all') {
    return { sql: '', values: [], paramCount: 0 };
  }

  const normalizedEquipment = equipment.toLowerCase() as EquipmentFilter;
  const equipmentList = equipmentValues[normalizedEquipment];

  if (!equipmentList || equipmentList.length === 0) {
    // Unknown equipment type, try exact match
    return {
      sql: `LOWER(equipment) = $${paramIndex}`,
      values: [equipment.toLowerCase()],
      paramCount: 1
    };
  }

  if (equipmentList.length === 1) {
    // Single equipment type
    return {
      sql: `LOWER(equipment) = $${paramIndex}`,
      values: [equipmentList[0]],
      paramCount: 1
    };
  }

  // Multiple equipment types (e.g., raw+wraps)
  const placeholders = equipmentList.map((_, i) => `$${paramIndex + i}`);
  return {
    sql: `LOWER(equipment) IN (${placeholders.join(', ')})`,
    values: equipmentList,
    paramCount: equipmentList.length
  };
}

// UI options for equipment dropdown
export const equipmentOptions = [
  { value: 'all', label: 'All Equipment' },
  { value: 'raw', label: 'Raw' },
  { value: 'wraps', label: 'Wraps' },
  { value: 'raw+wraps', label: 'Raw + Wraps' },
  { value: 'single-ply', label: 'Single-ply' },
  { value: 'multi-ply', label: 'Multi-ply' },
  { value: 'unlimited', label: 'Unlimited' },
];
