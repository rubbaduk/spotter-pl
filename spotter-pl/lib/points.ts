// Powerlifting points calculation formulas
// Ref: https://openpowerlifting.gitlab.io/opl-csv/bulk-csv-docs.html

// Helper function for 4th degree polynomial evaluation
// poly4(a,b,c,d,e,x) = a*x^4 + b*x^3 + c*x^2 + d*x + e
function poly4(a: number, b: number, c: number, d: number, e: number, x: number): number {
  return a * Math.pow(x, 4) + b * Math.pow(x, 3) + c * Math.pow(x, 2) + d * x + e;
}

// Helper function for 5th degree polynomial evaluation
// poly5(a,b,c,d,e,f,x) = a*x^5 + b*x^4 + c*x^3 + d*x^2 + e*x + f
function poly5(a: number, b: number, c: number, d: number, e: number, f: number, x: number): number {
  return a * Math.pow(x, 5) + b * Math.pow(x, 4) + c * Math.pow(x, 3) + d * Math.pow(x, 2) + e * x + f;
}

// Schwartz coefficient (needed for Glossbrenner)
function schwartz_coefficient(bodyweightkg: number): number {
  const A = -0.000001093;
  const B = 0.0007391293;
  const C = -0.1918759221;
  const D = 24.0900756;
  const E = -307.75076;
  
  const adjusted = Math.max(40.0, Math.min(210.0, bodyweightkg));
  return 1000 / poly4(A, B, C, D, E, adjusted);
}

// Malone coefficient (needed for Glossbrenner)
function malone_coefficient(bodyweightkg: number): number {
  const A = -0.0000010706;
  const B = 0.0005158568;
  const C = -0.1126655495;
  const D = 13.6175032;
  const E = -57.96288;
  
  const adjusted = Math.max(40.0, Math.min(150.0, bodyweightkg));
  return 1000 / poly4(A, B, C, D, E, adjusted);
}

// DOTS coefficient for men
function dots_coefficient_men(bodyweightkg: number): number {
  const A = -0.0000010930;
  const B = 0.0007391293;
  const C = -0.1918759221;
  const D = 24.0900756;
  const E = -307.75076;

  const adjusted = Math.max(40.0, Math.min(210.0, bodyweightkg));
  return 500.0 / poly4(A, B, C, D, E, adjusted);
}

// DOTS coefficient for women
function dots_coefficient_women(bodyweightkg: number): number {
  const A = -0.0000010706;
  const B = 0.0005158568;
  const C = -0.1126655495;
  const D = 13.6175032;
  const E = -57.96288;

  const adjusted = Math.max(40.0, Math.min(150.0, bodyweightkg));
  return 500.0 / poly4(A, B, C, D, E, adjusted);
}

// Calculate DOTS points
export function calculateDots(sex: 'male' | 'female', bodyweight: number, total: number): number {
  if (bodyweight <= 0 || total <= 0) {
    return 0;
  }
  
  const coefficient = sex === 'male' 
    ? dots_coefficient_men(bodyweight)
    : dots_coefficient_women(bodyweight);
    
  return coefficient * total;
}

// Wilks coefficient for men
function wilks_coefficient_men(bodyweightkg: number): number {
  const A = -216.0475144;
  const B = 16.2606339;
  const C = -0.002388645;
  const D = -0.00113732;
  const E = 7.01863E-06;
  const F = -1.291E-08;

  const adjusted = Math.max(40.0, Math.min(201.9, bodyweightkg));
  return 500.0 / poly5(F, E, D, C, B, A, adjusted);
}

// Wilks coefficient for women
function wilks_coefficient_women(bodyweightkg: number): number {
  const A = 594.31747775582;
  const B = -27.23842536447;
  const C = 0.82112226871;
  const D = -0.00930733913;
  const E = 0.00004731582;
  const F = -0.00000009054;

  const adjusted = Math.max(26.51, Math.min(154.53, bodyweightkg));
  return 500.0 / poly5(F, E, D, C, B, A, adjusted);
}

// Calculate Wilks points
export function calculateWilks(sex: 'male' | 'female', bodyweight: number, total: number): number {
  if (bodyweight <= 0 || total <= 0) {
    return 0;
  }
  
  const coefficient = sex === 'male' 
    ? wilks_coefficient_men(bodyweight)
    : wilks_coefficient_women(bodyweight);
    
  return coefficient * total;
}

// Glossbrenner coefficient for men
function glossbrenner_coefficient_men(bodyweightkg: number): number {
  if (bodyweightkg < 153.05) {
    return (schwartz_coefficient(bodyweightkg) + wilks_coefficient_men(bodyweightkg)) / 2.0;
  } else {
    const A = -0.000821668402557;
    const B = 0.676940740094416;
    return (schwartz_coefficient(bodyweightkg) + A * bodyweightkg + B) / 2.0;
  }
}

// Glossbrenner coefficient for women
function glossbrenner_coefficient_women(bodyweightkg: number): number {
  if (bodyweightkg < 106.3) {
    return (malone_coefficient(bodyweightkg) + wilks_coefficient_women(bodyweightkg)) / 2.0;
  } else {
    const A = -0.000313738002024;
    const B = 0.852664892884785;
    return (malone_coefficient(bodyweightkg) + A * bodyweightkg + B) / 2.0;
  }
}

// Calculate Glossbrenner points
export function calculateGlossbrenner(sex: 'male' | 'female', bodyweight: number, total: number): number {
  if (bodyweight <= 0 || total <= 0) {
    return 0;
  }
  
  const coefficient = sex === 'male' 
    ? glossbrenner_coefficient_men(bodyweight)
    : glossbrenner_coefficient_women(bodyweight);
    
  return coefficient * total;
}

// Equipment mapping for Goodlift
type EquipmentType = 'Raw' | 'Single' | 'Wraps' | 'Multi' | 'Unlimited' | 'Straps';

function mapEquipment(equipment: string): EquipmentType {
  const lower = equipment.toLowerCase();
  switch(lower) {
    case 'raw':
    case 'wraps':
    case 'straps':
      return 'Raw';
    case 'single':
    case 'multi':
    case 'unlimited':
      return 'Single';
    default:
      return 'Raw';
  }
}

// Get Goodlift parameters
function getGoodliftParameters(sex: 'male' | 'female', equipment: EquipmentType, isBenchOnly: boolean): [number, number, number] {
  const mappedEquipment = mapEquipment(equipment);
  
  if (isBenchOnly) {
    switch(sex) {
      case 'male':
        return mappedEquipment === 'Raw' 
          ? [320.98041, 281.40258, 0.01008]
          : [381.22073, 733.79378, 0.02398];
      case 'female':
        return mappedEquipment === 'Raw'
          ? [142.40398, 442.52671, 0.04724]
          : [221.82209, 357.00377, 0.02937];
    }
  } else {
    // SBD (Squat-Bench-Deadlift)
    switch(sex) {
      case 'male':
        return mappedEquipment === 'Raw'
          ? [1199.72839, 1025.18162, 0.009210]
          : [1236.25115, 1449.21864, 0.01644];
      case 'female':
        return mappedEquipment === 'Raw'
          ? [610.32796, 1045.59282, 0.03048]
          : [758.63878, 949.31382, 0.02435];
    }
  }
  
  return [0, 0, 0];
}

// Calculate Goodlift points
export function calculateGoodlift(
  sex: 'male' | 'female', 
  equipment: string, 
  isBenchOnly: boolean,
  bodyweight: number, 
  total: number
): number {
  const [a, b, c] = getGoodliftParameters(sex, mapEquipment(equipment), isBenchOnly);
  
  if (a === 0 || bodyweight < 35 || total <= 0) {
    return 0;
  }
  
  const ePow = Math.exp(-c * bodyweight);
  const denominator = a - (b * ePow);
  
  if (denominator === 0) {
    return 0;
  }
  
  const points = total * Math.max(0, 100.0 / denominator);
  return points;
}
