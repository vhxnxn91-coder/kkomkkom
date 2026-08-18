"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Wallet } from "lucide-react";
import { calculateSalary } from "@/lib/salary";
import {
  CalcHeader,
  InputCard,
  MoneyInput,
  SelectInput,
  ResultCard,
  ResultRow,
  EmptyResult,
  NoteBox,
  formatWon,
} from "@/components/CalcUI";

export default function SalaryPage() {
  const [annualSalary, setAnnualSalary] = useState("40000000");
  const [dependents, setDependents] = useState("1");
  const [nonTaxable, setNonTaxable] = useState("200000");

  const result = useMemo(() => {
    const salary = Number(annualSalary) || 0;
    const dep = Number(dependents) || 1;
    const nt = Number(nonTaxable) || 0;
    if (salary <= 0) return null;
    return calculateSalary({ annualSalary: salary, dependents: dep, nonTaxable: nt });
  }, [annualSalary, dependents, nonTaxable]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <CalcHeader
        icon={<Wallet size={22} strokeWidth={2.2} />}
        eyebrow="계산기"
        title="연봉 실수령액 계산기"
        desc="2026년 최신 4대보험 요율 기준. 세전 연봉을 입력하면 매달 통장에 찍히는 실수령액을 꼼꼼하게 계산해드려요."
      />

      <div className="grid md:grid-cols-2 gap-6">
        <InputCard>
          <MoneyInput
            label="세전 연봉"
            value={annualSalary}
            onChange={setAnnualSalary}
            placeholder="40,000,000"
          />
          <SelectInput
            label="부양가족 수 (본인 포함)"
            value={dependents}
            onChange={setDependents}
            options={[1, 2, 3, 4, 5, 6].map((n) => ({ value: String(n), label: `${n}명` }))}
          />
          <MoneyInput
            label="비과세액 (월, 식대 등)"
            value={nonTaxable}
            onChange={setNonTaxable}
            placeholder="200,000"
            hint="식대(월 최대 20만원) 등 비과세 항목이 있다면 입력하세요."
          />
        </InputCard>

        <div>
          {result ? (
            <ResultCard
              animKey={annualSalary + dependents + nonTaxable}
              label="월 실수령액"
              value={formatWon(result.monthlyNet)}
              subValue={`연 실수령액 ${formatWon(result.annualNet)}`}
            >
              <ResultRow label="세전 월급여" value={result.monthlyGross} />
              <div className="pt-1 pb-0.5 text-xs text-white/50">공제 내역</div>
              <ResultRow label="국민연금" value={-result.pension} />
              <ResultRow label="건강보험" value={-result.health} />
              <ResultRow label="장기요양보험" value={-result.longtermCare} />
              <ResultRow label="고용보험" value={-result.employment} />
              <ResultRow label="소득세" value={-result.incomeTax} />
              <ResultRow label="지방소득세" value={-result.localIncomeTax} />
              <div className="border-t border-white/10 mt-3 pt-3">
                <ResultRow
                  label="공제 합계"
                  value={-(result.totalInsurance + result.totalTax)}
                  bold
                />
              </div>
            </ResultCard>
          ) : (
            <EmptyResult text="연봉을 입력하면 결과가 여기에 나타나요." />
          )}
        </div>
      </div>

      <NoteBox title="계산 기준 안내">
        국민연금 4.75%, 건강보험 3.595%, 장기요양보험(건강보험료의 13.14%), 고용보험 0.9%
        (2026년 기준)을 적용했습니다. 소득세는 근로소득공제, 인적공제, 사회보험료공제,
        근로소득세액공제를 반영한 추정치로, 실제 원천징수세액표와 소폭 차이가 있을 수
        있습니다. 정확한 금액은 국민연금공단·국세청 등 공식 채널에서 확인하세요.
      </NoteBox>

      <div className="mt-6">
        <Link href="/" className="text-sm text-stamp underline">
          ← 다른 계산기 보러가기
        </Link>
      </div>
    </main>
  );
}
