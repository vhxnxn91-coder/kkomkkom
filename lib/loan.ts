// 원리금균등상환 방식의 연간 원리금 계산
export function annualLoanPayment(
  principal: number,
  annualRatePercent: number,
  years: number
): number {
  if (principal <= 0 || years <= 0) return 0;
  const r = annualRatePercent / 100 / 12;
  const n = years * 12;
  if (r === 0) return (principal / n) * 12;
  const monthlyPayment =
    (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return monthlyPayment * 12;
}

export interface DsrInput {
  annualIncome: number;
  newLoanPrincipal: number;
  newLoanRate: number;
  newLoanYears: number;
  existingAnnualDebtPayment: number; // 기존 대출 연간 원리금 상환액
}

export interface DsrResult {
  newLoanAnnualPayment: number;
  totalAnnualPayment: number;
  dsr: number;
}

export function calculateDsr(input: DsrInput): DsrResult {
  const newLoanAnnualPayment = annualLoanPayment(
    input.newLoanPrincipal,
    input.newLoanRate,
    input.newLoanYears
  );
  const totalAnnualPayment =
    newLoanAnnualPayment + input.existingAnnualDebtPayment;
  const dsr =
    input.annualIncome > 0
      ? (totalAnnualPayment / input.annualIncome) * 100
      : 0;
  return { newLoanAnnualPayment, totalAnnualPayment, dsr };
}

export interface DtiInput {
  annualIncome: number;
  newLoanPrincipal: number;
  newLoanRate: number;
  newLoanYears: number;
  existingHousingLoanAnnualInterest: number; // 기존 주택담보대출 연간 이자만
}

export interface DtiResult {
  newLoanAnnualPayment: number;
  totalAnnualPayment: number;
  dti: number;
}

export function calculateDti(input: DtiInput): DtiResult {
  const newLoanAnnualPayment = annualLoanPayment(
    input.newLoanPrincipal,
    input.newLoanRate,
    input.newLoanYears
  );
  const totalAnnualPayment =
    newLoanAnnualPayment + input.existingHousingLoanAnnualInterest;
  const dti =
    input.annualIncome > 0
      ? (totalAnnualPayment / input.annualIncome) * 100
      : 0;
  return { newLoanAnnualPayment, totalAnnualPayment, dti };
}
