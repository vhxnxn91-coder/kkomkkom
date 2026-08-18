// 2026년 기준 4대보험 요율 & 소득세 계산 로직
// 참고: 국민연금 4.75%(근로자), 건강보험 3.595%, 장기요양 13.14%(건강보험료 기준), 고용보험 0.9%

const PENSION_RATE = 0.0475; // 국민연금 근로자 부담
const PENSION_BASE_MAX = 6370000; // 기준소득월액 상한 (2026)
const PENSION_BASE_MIN = 400000; // 기준소득월액 하한 (2026)

const HEALTH_RATE = 0.03595; // 건강보험 근로자 부담
const LONGTERM_CARE_RATE = 0.1314; // 장기요양보험 = 건강보험료 x 13.14%
const EMPLOYMENT_RATE = 0.009; // 고용보험 근로자 부담

export interface SalaryInput {
  annualSalary: number; // 연봉 (세전, 원)
  dependents: number; // 부양가족 수 (본인 포함)
  nonTaxable: number; // 비과세액 (월, 원) - 식대 등
}

export interface SalaryResult {
  monthlyGross: number;
  monthlyTaxableGross: number;
  pension: number;
  health: number;
  longtermCare: number;
  employment: number;
  totalInsurance: number;
  incomeTax: number;
  localIncomeTax: number;
  totalTax: number;
  monthlyNet: number;
  annualNet: number;
}

function round(n: number) {
  return Math.round(n);
}

// 근로소득공제 (연간 총급여 기준)
export function earnedIncomeDeduction(annualGross: number): number {
  if (annualGross <= 5_000_000) return annualGross * 0.7;
  if (annualGross <= 15_000_000) return 3_500_000 + (annualGross - 5_000_000) * 0.4;
  if (annualGross <= 45_000_000) return 7_500_000 + (annualGross - 15_000_000) * 0.15;
  if (annualGross <= 100_000_000) return 12_000_000 + (annualGross - 45_000_000) * 0.05;
  return 14_750_000 + (annualGross - 100_000_000) * 0.02;
}

// 종합소득세 누진세율 (과세표준 기준)
export function progressiveTax(base: number): number {
  if (base <= 0) return 0;
  if (base <= 14_000_000) return base * 0.06;
  if (base <= 50_000_000) return base * 0.15 - 1_260_000;
  if (base <= 88_000_000) return base * 0.24 - 5_760_000;
  if (base <= 150_000_000) return base * 0.35 - 15_440_000;
  if (base <= 300_000_000) return base * 0.38 - 19_940_000;
  if (base <= 500_000_000) return base * 0.4 - 25_940_000;
  if (base <= 1_000_000_000) return base * 0.42 - 35_940_000;
  return base * 0.45 - 65_940_000;
}

// 근로소득세액공제
function earnedIncomeTaxCredit(calculatedTax: number, annualGross: number): number {
  let credit: number;
  if (calculatedTax <= 1_300_000) {
    credit = calculatedTax * 0.55;
  } else {
    credit = 715_000 + (calculatedTax - 1_300_000) * 0.3;
  }

  let limit: number;
  if (annualGross <= 33_000_000) {
    limit = 740_000;
  } else if (annualGross <= 70_000_000) {
    limit = Math.max(740_000 - (annualGross - 33_000_000) * 0.008, 660_000);
  } else {
    limit = Math.max(660_000 - (annualGross - 70_000_000) * 0.5, 500_000);
  }

  return Math.min(credit, limit);
}

export interface InsuranceResult {
  pension: number;
  health: number;
  longtermCare: number;
  employment: number;
  total: number;
  companyPension: number;
  companyHealth: number;
  companyLongtermCare: number;
  companyEmployment: number;
  companyTotal: number;
}

// 월급 기준 4대보험료만 별도로 계산 (근로자 + 회사 부담분)
export function calculateInsuranceFromMonthly(
  monthlyTaxableGross: number
): InsuranceResult {
  const pensionBase = Math.min(
    Math.max(monthlyTaxableGross, PENSION_BASE_MIN),
    PENSION_BASE_MAX
  );
  const pension = round(pensionBase * PENSION_RATE);
  const health = round(monthlyTaxableGross * HEALTH_RATE);
  const longtermCare = round(health * LONGTERM_CARE_RATE);
  const employment = round(monthlyTaxableGross * EMPLOYMENT_RATE);
  const total = pension + health + longtermCare + employment;

  // 회사는 국민연금/건강보험/장기요양 동일 부담, 고용보험은 사업주 추가요율(고용안정 등) 존재하나 근로자와 동일요율로 단순화하지 않고 대략 1.15% 적용
  const companyPension = pension;
  const companyHealth = health;
  const companyLongtermCare = longtermCare;
  const companyEmployment = round(monthlyTaxableGross * 0.0115);
  const companyTotal =
    companyPension + companyHealth + companyLongtermCare + companyEmployment;

  return {
    pension,
    health,
    longtermCare,
    employment,
    total,
    companyPension,
    companyHealth,
    companyLongtermCare,
    companyEmployment,
    companyTotal,
  };
}

export function calculateSalary(input: SalaryInput): SalaryResult {
  const monthlyGross = input.annualSalary / 12;
  const monthlyTaxableGross = Math.max(monthlyGross - input.nonTaxable, 0);

  // 국민연금: 기준소득월액 상하한 적용 (과세소득 기준, 천원 미만 절사 관행은 생략)
  const pensionBase = Math.min(
    Math.max(monthlyTaxableGross, PENSION_BASE_MIN),
    PENSION_BASE_MAX
  );
  const pension = round(pensionBase * PENSION_RATE);

  const health = round(monthlyTaxableGross * HEALTH_RATE);
  const longtermCare = round(health * LONGTERM_CARE_RATE);
  const employment = round(monthlyTaxableGross * EMPLOYMENT_RATE);
  const totalInsurance = pension + health + longtermCare + employment;

  // 연간 기준 소득세 계산
  const annualTaxableGross = monthlyTaxableGross * 12;
  const deduction = earnedIncomeDeduction(annualTaxableGross);
  const earnedIncomeAmount = Math.max(annualTaxableGross - deduction, 0);

  const personalDeduction = 1_500_000 * Math.max(input.dependents, 1);
  const insuranceDeductionAnnual = totalInsurance * 12;

  const taxBase = Math.max(
    earnedIncomeAmount - personalDeduction - insuranceDeductionAnnual,
    0
  );

  const calculatedTax = progressiveTax(taxBase);
  const credit = earnedIncomeTaxCredit(calculatedTax, annualTaxableGross);
  const annualIncomeTax = Math.max(calculatedTax - credit, 0);

  const incomeTax = round(annualIncomeTax / 12);
  const localIncomeTax = round(incomeTax * 0.1);
  const totalTax = incomeTax + localIncomeTax;

  const monthlyNet = monthlyGross - totalInsurance - totalTax;

  return {
    monthlyGross: round(monthlyGross),
    monthlyTaxableGross: round(monthlyTaxableGross),
    pension,
    health,
    longtermCare,
    employment,
    totalInsurance,
    incomeTax,
    localIncomeTax,
    totalTax,
    monthlyNet: round(monthlyNet),
    annualNet: round(monthlyNet * 12),
  };
}
