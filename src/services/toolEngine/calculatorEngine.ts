/**
 * LESS CREATION — Production-Grade Calculator Engine
 * 
 * Verifiable, decimal-safe mathematical computations:
 * - EMI calculator with standard financial banking formula & amortization
 * - GST inclusive / exclusive with CGST / SGST split
 * - Exact Age calculator with leap year & variable month lengths
 * - Date difference with inclusive / exclusive toggles
 * - Standard Indian & International Land Area converter
 */

export interface EmiCalculationResult {
  monthlyEmi: number;
  principalAmount: number;
  totalInterest: number;
  totalPayment: number;
  amortizationPreview: {
    year: number;
    principalPaid: number;
    interestPaid: number;
    remainingBalance: number;
  }[];
}

export interface GstCalculationResult {
  netAmount: number;
  gstAmount: number;
  totalAmount: number;
  cgst: number;
  sgst: number;
  rate: number;
  type: 'exclusive' | 'inclusive';
}

export interface AgeCalculationResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  dayOfWeekBorn: string;
  daysUntilNextBirthday: number;
  nextBirthdayDayOfWeek: string;
}

export interface DateDifferenceResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  businessDays: number; // Excludes Saturdays & Sundays
}

/**
 * Standard Banking EMI Formula:
 * E = P * r * (1 + r)^n / ((1 + r)^n - 1)
 */
export function calculateEmi(
  principal: number,
  annualInterestRate: number,
  tenureYears: number
): EmiCalculationResult {
  if (principal <= 0 || annualInterestRate <= 0 || tenureYears <= 0) {
    return {
      monthlyEmi: 0,
      principalAmount: principal,
      totalInterest: 0,
      totalPayment: principal,
      amortizationPreview: []
    };
  }

  const P = principal;
  const r = annualInterestRate / (12 * 100); // monthly rate
  const n = Math.round(tenureYears * 12); // total months

  const factor = Math.pow(1 + r, n);
  const emi = (P * r * factor) / (factor - 1);
  const monthlyEmi = Math.round(emi);
  const totalPayment = Math.round(emi * n);
  const totalInterest = Math.max(0, totalPayment - P);

  // Generate 5-year snapshot amortization preview
  const amortizationPreview = [];
  let balance = P;
  for (let year = 1; year <= Math.min(10, Math.ceil(tenureYears)); year++) {
    let yearInterest = 0;
    let yearPrincipal = 0;
    for (let m = 0; m < 12 && balance > 0; m++) {
      const monthInterest = balance * r;
      const monthPrincipal = Math.min(balance, emi - monthInterest);
      yearInterest += monthInterest;
      yearPrincipal += monthPrincipal;
      balance -= monthPrincipal;
    }
    amortizationPreview.push({
      year,
      principalPaid: Math.round(yearPrincipal),
      interestPaid: Math.round(yearInterest),
      remainingBalance: Math.max(0, Math.round(balance))
    });
  }

  return {
    monthlyEmi,
    principalAmount: P,
    totalInterest,
    totalPayment,
    amortizationPreview
  };
}

/**
 * GST Calculation (Inclusive & Exclusive)
 */
export function calculateGst(
  amount: number,
  ratePercentage: number,
  type: 'exclusive' | 'inclusive'
): GstCalculationResult {
  if (amount <= 0 || ratePercentage <= 0) {
    return {
      netAmount: amount,
      gstAmount: 0,
      totalAmount: amount,
      cgst: 0,
      sgst: 0,
      rate: ratePercentage,
      type
    };
  }

  let netAmount = 0;
  let gstAmount = 0;
  let totalAmount = 0;

  if (type === 'exclusive') {
    // Input is pre-tax amount
    netAmount = amount;
    gstAmount = (amount * ratePercentage) / 100;
    totalAmount = netAmount + gstAmount;
  } else {
    // Input already includes GST
    totalAmount = amount;
    netAmount = (amount * 100) / (100 + ratePercentage);
    gstAmount = totalAmount - netAmount;
  }

  const roundedNet = parseFloat(netAmount.toFixed(2));
  const roundedGst = parseFloat(gstAmount.toFixed(2));
  const roundedTotal = parseFloat(totalAmount.toFixed(2));
  const halfGst = parseFloat((roundedGst / 2).toFixed(2));

  return {
    netAmount: roundedNet,
    gstAmount: roundedGst,
    totalAmount: roundedTotal,
    cgst: halfGst,
    sgst: halfGst,
    rate: ratePercentage,
    type
  };
}

/**
 * Exact Age Calculation honoring leap years and month lengths
 */
export function calculateExactAge(birthDateStr: string, asOfDateStr?: string): AgeCalculationResult {
  const birth = new Date(birthDateStr);
  const today = asOfDateStr ? new Date(asOfDateStr) : new Date();

  if (isNaN(birth.getTime()) || birth > today) {
    throw new Error('Please provide a valid past date of birth.');
  }

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    // Days in previous month
    const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const diffMs = today.getTime() - birth.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalHours = totalDays * 24;

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeekBorn = weekdays[birth.getDay()];

  // Next birthday
  const nextBday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBday < today) {
    nextBday.setFullYear(today.getFullYear() + 1);
  }
  const diffNextMs = nextBday.getTime() - today.getTime();
  const daysUntilNextBirthday = Math.max(0, Math.ceil(diffNextMs / (1000 * 60 * 60 * 24)));
  const nextBirthdayDayOfWeek = weekdays[nextBday.getDay()];

  return {
    years,
    months,
    days,
    totalDays,
    totalHours,
    dayOfWeekBorn,
    daysUntilNextBirthday,
    nextBirthdayDayOfWeek
  };
}

/**
 * Exact Date Difference calculation
 */
export function calculateDateDifference(
  startDateStr: string,
  endDateStr: string,
  isInclusive: boolean = false
): DateDifferenceResult {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Please select valid start and end dates.');
  }

  const [earlier, later] = start <= end ? [start, end] : [end, start];

  let years = later.getFullYear() - earlier.getFullYear();
  let months = later.getMonth() - earlier.getMonth();
  let days = later.getDate() - earlier.getDate();

  if (days < 0) {
    months--;
    const prevMonthLastDay = new Date(later.getFullYear(), later.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  let totalDays = Math.floor((later.getTime() - earlier.getTime()) / (1000 * 60 * 60 * 24));
  if (isInclusive) {
    totalDays += 1;
    days += 1;
  }

  const totalWeeks = parseFloat((totalDays / 7).toFixed(1));

  // Count business days
  let businessDays = 0;
  const current = new Date(earlier);
  const stopDate = new Date(later);
  if (isInclusive) stopDate.setDate(stopDate.getDate() + 1);

  while (current < stopDate) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      businessDays++;
    }
    current.setDate(current.getDate() + 1);
  }

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    businessDays
  };
}

/**
 * Standard Indian & International Land Area Conversion Matrix (Base unit: Square Feet)
 */
export const LAND_CONVERSION_FACTORS: Record<string, number> = {
  sqft: 1,
  sqmeter: 10.7639,
  sqyard: 9, // 1 Gaj = 9 sq ft
  acre: 43560,
  hectare: 107639.104,
  bigha_up: 27225, // 1 Standard UP Bigha = 27,225 sq ft
  guntha: 1089, // 1 Guntha (MH/KA) = 1,089 sq ft (33x33 ft)
  biswa: 1361.25, // 1 Biswa = 1/20 of UP Bigha
  marla: 272.25 // 1 Marla = 272.25 sq ft
};

export function convertLandArea(
  value: number,
  fromUnit: string,
  toUnit: string
): number {
  if (value <= 0) return 0;
  const fromFactor = LAND_CONVERSION_FACTORS[fromUnit] || 1;
  const toFactor = LAND_CONVERSION_FACTORS[toUnit] || 1;

  // Convert to Sq Feet, then to target unit
  const sqft = value * fromFactor;
  const converted = sqft / toFactor;
  return parseFloat(converted.toFixed(4));
}
