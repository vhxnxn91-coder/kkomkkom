// 취득세 (2026년 기준, 유상취득 · 단순화 버전)
export function calculateAcquisitionTax(
  price: number,
  isFirstHome: boolean,
  numHouses: number // 취득 후 보유 주택 수
): { rate: number; tax: number; localEduTax: number; total: number } {
  let rate: number;

  if (numHouses <= 1) {
    // 1주택: 6억 이하 1%, 6~9억 구간 선형 보간, 9억 초과 3%
    if (price <= 600_000_000) rate = 0.01;
    else if (price <= 900_000_000) {
      rate = 0.01 + ((price - 600_000_000) / 300_000_000) * 0.02;
    } else rate = 0.03;
  } else if (numHouses === 2) {
    rate = 0.08;
  } else {
    rate = 0.12;
  }

  const tax = Math.round(price * rate);
  const localEduTax = Math.round(tax * 0.1); // 지방교육세 근사치
  return { rate, tax, localEduTax, total: tax + localEduTax };
}

// 장기보유특별공제율 (1세대 1주택 비과세 제외, 일반 부동산 기준 단순화)
function longTermDeductionRate(years: number, isOneHouse: boolean): number {
  if (years < 3) return 0;
  if (isOneHouse) {
    // 1세대1주택 (2년 이상 거주 가정) - 보유+거주 각 4%씩, 최대 80%
    const capped = Math.min(years, 10);
    return Math.min(capped * 0.04 * 2, 0.8);
  }
  // 일반: 연 2%, 최대 30%
  const capped = Math.min(years, 15);
  return Math.min(capped * 0.02, 0.3);
}

export interface CapitalGainsInput {
  salePrice: number;
  purchasePrice: number;
  necessaryExpense: number;
  holdingYears: number;
  isOneHouse: boolean; // 1세대 1주택 여부 (비과세 요건 충족 가정과 별개로 공제율 계산용)
  isExempt: boolean; // 1세대1주택 비과세 요건(12억 이하 등) 충족 여부
}

export interface CapitalGainsResult {
  gain: number;
  deduction: number;
  taxBase: number;
  calculatedTax: number;
  localTax: number;
  totalTax: number;
  isExempt: boolean;
}

export function calculateCapitalGainsTax(
  input: CapitalGainsInput
): CapitalGainsResult {
  const gain = Math.max(
    input.salePrice - input.purchasePrice - input.necessaryExpense,
    0
  );

  if (input.isExempt) {
    return {
      gain,
      deduction: 0,
      taxBase: 0,
      calculatedTax: 0,
      localTax: 0,
      totalTax: 0,
      isExempt: true,
    };
  }

  const deductionRate = longTermDeductionRate(
    input.holdingYears,
    input.isOneHouse
  );
  const deduction = Math.round(gain * deductionRate);
  const basicDeduction = 2_500_000; // 연 250만원 기본공제
  const taxBase = Math.max(gain - deduction - basicDeduction, 0);

  let calculatedTax: number;
  if (input.holdingYears < 1) {
    calculatedTax = taxBase * 0.7; // 1년 미만 보유 - 단일세율 70%
  } else if (input.holdingYears < 2) {
    calculatedTax = taxBase * 0.6; // 1~2년 - 60%
  } else {
    // 2년 이상 - 기본세율(종합소득세 누진세율과 동일 구조)
    if (taxBase <= 14_000_000) calculatedTax = taxBase * 0.06;
    else if (taxBase <= 50_000_000) calculatedTax = taxBase * 0.15 - 1_260_000;
    else if (taxBase <= 88_000_000) calculatedTax = taxBase * 0.24 - 5_760_000;
    else if (taxBase <= 150_000_000)
      calculatedTax = taxBase * 0.35 - 15_440_000;
    else if (taxBase <= 300_000_000)
      calculatedTax = taxBase * 0.38 - 19_940_000;
    else if (taxBase <= 500_000_000)
      calculatedTax = taxBase * 0.4 - 25_940_000;
    else if (taxBase <= 1_000_000_000)
      calculatedTax = taxBase * 0.42 - 35_940_000;
    else calculatedTax = taxBase * 0.45 - 65_940_000;
  }
  calculatedTax = Math.max(Math.round(calculatedTax), 0);

  const localTax = Math.round(calculatedTax * 0.1);
  const totalTax = calculatedTax + localTax;

  return {
    gain,
    deduction,
    taxBase,
    calculatedTax,
    localTax,
    totalTax,
    isExempt: false,
  };
}
