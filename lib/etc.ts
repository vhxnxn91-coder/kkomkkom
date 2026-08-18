// 퇴직금 계산 (평균임금 기준 단순화 버전)
export interface SeveranceInput {
  last3MonthsWage: number; // 최근 3개월 총 급여(세전 합계)
  annualBonus: number; // 연간 상여금 총액
  annualLeaveAllowance: number; // 연차수당 총액
  workDays: number; // 총 재직일수
}

export interface SeveranceResult {
  dailyAverageWage: number;
  severancePay: number;
}

export function calculateSeverance(input: SeveranceInput): SeveranceResult {
  // 상여금·연차수당은 재직기간 중 3/12만 반영 (관행적 단순화)
  const bonusPortion = (input.annualBonus * 3) / 12;
  const leavePortion = (input.annualLeaveAllowance * 3) / 12;
  const totalWage = input.last3MonthsWage + bonusPortion + leavePortion;
  const dailyAverageWage = totalWage / 90;
  const severancePay = dailyAverageWage * 30 * (input.workDays / 365);
  return {
    dailyAverageWage: Math.round(dailyAverageWage),
    severancePay: Math.round(severancePay),
  };
}

// 육아휴직급여 (2025년 개편 기준: 전 기간 통상임금의 80%, 구간별 상한액 상이)
export interface ParentalLeaveInput {
  monthlyOrdinaryWage: number;
  months: number; // 육아휴직 총 개월수 (최대 12개월 가정)
}

export interface ParentalLeaveMonthDetail {
  month: number;
  cap: number;
  payBeforeCap: number;
  pay: number;
}

export interface ParentalLeaveResult {
  details: ParentalLeaveMonthDetail[];
  totalDuringLeave: number; // 육아휴직 중 지급되는 75%(1~3개월은 다름)
  totalHeldBack: number; // 복직 후 지급되는 사후지급분
  total: number;
}

function capForMonth(month: number): number {
  if (month <= 3) return 2_500_000;
  if (month <= 6) return 2_000_000;
  return 1_600_000;
}

export function calculateParentalLeave(
  input: ParentalLeaveInput
): ParentalLeaveResult {
  const details: ParentalLeaveMonthDetail[] = [];
  let total = 0;

  for (let m = 1; m <= input.months; m++) {
    const cap = capForMonth(m);
    const payBeforeCap = input.monthlyOrdinaryWage * 0.8;
    const pay = Math.min(payBeforeCap, cap);
    details.push({ month: m, cap, payBeforeCap, pay: Math.round(pay) });
    total += pay;
  }

  // 25%는 복직 6개월 후 사후 지급되는 관행 반영
  const totalHeldBack = Math.round(total * 0.25);
  const totalDuringLeave = Math.round(total - totalHeldBack);

  return {
    details,
    totalDuringLeave,
    totalHeldBack,
    total: Math.round(total),
  };
}

// 상속세 / 증여세 (단순화 버전)
export type Relation = "spouse" | "child" | "other";

export interface InheritanceInput {
  totalAsset: number;
  relation: Relation;
  hasSpouse: boolean; // 상속의 경우, 배우자가 있는지
  isGift: boolean; // true=증여, false=상속
}

export interface InheritanceResult {
  deduction: number;
  taxBase: number;
  calculatedTax: number;
  total: number;
}

function progressiveTax(base: number): number {
  if (base <= 0) return 0;
  if (base <= 100_000_000) return base * 0.1;
  if (base <= 500_000_000) return base * 0.2 - 10_000_000;
  if (base <= 1_000_000_000) return base * 0.3 - 60_000_000;
  if (base <= 3_000_000_000) return base * 0.4 - 160_000_000;
  return base * 0.5 - 460_000_000;
}

export function calculateInheritanceOrGiftTax(
  input: InheritanceInput
): InheritanceResult {
  let deduction: number;

  if (input.isGift) {
    // 증여재산공제 (10년 합산 기준, 단순화)
    if (input.relation === "spouse") deduction = 600_000_000;
    else if (input.relation === "child") deduction = 50_000_000;
    else deduction = 10_000_000;
  } else {
    // 상속공제: 기초공제 2억 + 배우자공제(최소 5억) + 일괄공제 5억 중 유리한 것(단순화: 일괄공제 5억 + 배우자공제 5억)
    deduction = 500_000_000 + (input.hasSpouse ? 500_000_000 : 0);
  }

  const taxBase = Math.max(input.totalAsset - deduction, 0);
  const calculatedTax = Math.round(progressiveTax(taxBase));

  return { deduction, taxBase, calculatedTax, total: calculatedTax };
}
