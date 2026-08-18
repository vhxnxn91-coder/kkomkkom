"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Receipt } from "lucide-react";
import { progressiveTax } from "@/lib/salary";
import {
  CalcHeader,
  InputCard,
  MoneyInput,
  NumberInput,
  ResultCard,
  ResultRow,
  EmptyResult,
  NoteBox,
} from "@/components/CalcUI";

export default function ComprehensiveTaxPage() {
  const [revenue, setRevenue] = useState("60000000");
  const [expenseRate, setExpenseRate] = useState("60");
  const [dependents, setDependents] = useState("1");

  const result = useMemo(() => {
    const rev = Number(revenue) || 0;
    if (rev <= 0) return null;
    const rate = Math.min(Math.max(Number(expenseRate) || 0, 0), 100) / 100;
    const necessaryExpense = Math.round(rev * rate);
    const incomeAmount = Math.max(rev - necessaryExpense, 0);
    const personalDeduction = 1_500_000 * (Number(dependents) || 1);
    const taxBase = Math.max(incomeAmount - personalDeduction, 0);
    const calculatedTax = Math.round(progressiveTax(taxBase));
    const localTax = Math.round(calculatedTax * 0.1);
    const totalTax = calculatedTax + localTax;
    return { necessaryExpense, incomeAmount, taxBase, calculatedTax, localTax, totalTax };
  }, [revenue, expenseRate, dependents]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <CalcHeader
        icon={<Receipt size={22} strokeWidth={2.2} />}
        eyebrow="계산기"
        title="종합소득세 계산기"
        desc="사업소득·프리랜서 수입 기준으로 예상 종합소득세를 계산해요."
      />

      <div className="grid md:grid-cols-2 gap-6">
        <InputCard>
          <MoneyInput
            label="연간 총수입금액"
            value={revenue}
            onChange={setRevenue}
            placeholder="60,000,000"
          />
          <NumberInput
            label="필요경비율"
            value={expenseRate}
            onChange={setExpenseRate}
            suffix="%"
            hint="업종별 단순경비율은 국세청 홈택스에서 확인할 수 있어요. 기본값 60%로 설정했어요."
          />
          <NumberInput
            label="부양가족 수 (본인 포함)"
            value={dependents}
            onChange={setDependents}
            suffix="명"
          />
        </InputCard>

        <div>
          {result ? (
            <ResultCard
              animKey={revenue + expenseRate + dependents}
              label="예상 납부세액"
              value={`${result.totalTax.toLocaleString("ko-KR")}원`}
            >
              <ResultRow label="필요경비" value={result.necessaryExpense} />
              <ResultRow label="소득금액" value={result.incomeAmount} />
              <ResultRow label="과세표준" value={result.taxBase} />
              <div className="border-t border-white/10 mt-3 pt-3">
                <ResultRow label="종합소득세" value={result.calculatedTax} />
                <ResultRow label="지방소득세" value={result.localTax} />
              </div>
            </ResultCard>
          ) : (
            <EmptyResult text="연간 수입을 입력하면 결과가 여기에 나타나요." />
          )}
        </div>
      </div>

      <NoteBox title="계산 기준 안내">
        단순경비율 방식(수입 - 필요경비 - 인적공제)으로 단순화했습니다. 세액공제·감면,
        기장 방식(복식부기 등)에 따라 실제 세액은 크게 달라질 수 있어요. 정확한 신고는
        국세청 홈택스나 세무사를 통해 진행하세요.
      </NoteBox>

      <div className="mt-6">
        <Link href="/" className="text-sm text-stamp underline">
          ← 다른 계산기 보러가기
        </Link>
      </div>
    </main>
  );
}
