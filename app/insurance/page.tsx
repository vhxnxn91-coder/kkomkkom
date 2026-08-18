"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { calculateInsuranceFromMonthly } from "@/lib/salary";
import {
  CalcHeader,
  InputCard,
  MoneyInput,
  ResultCard,
  ResultRow,
  EmptyResult,
  NoteBox,
} from "@/components/CalcUI";

export default function InsurancePage() {
  const [monthlyGross, setMonthlyGross] = useState("3000000");

  const result = useMemo(() => {
    const g = Number(monthlyGross) || 0;
    if (g <= 0) return null;
    return calculateInsuranceFromMonthly(g);
  }, [monthlyGross]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <CalcHeader
        icon={<ShieldCheck size={22} strokeWidth={2.2} />}
        eyebrow="계산기"
        title="4대보험료 계산기"
        desc="월급여 기준으로 국민연금·건강보험·장기요양보험·고용보험료를 항목별로 계산해요."
      />

      <div className="grid md:grid-cols-2 gap-6">
        <InputCard>
          <MoneyInput
            label="월 급여 (과세 기준)"
            value={monthlyGross}
            onChange={setMonthlyGross}
            placeholder="3,000,000"
            hint="비과세 항목을 제외한 월 급여를 입력하세요."
          />
        </InputCard>

        <div>
          {result ? (
            <ResultCard
              animKey={monthlyGross}
              label="근로자 부담 4대보험료"
              value={`${result.total.toLocaleString("ko-KR")}원`}
              subValue={`회사 부담분 약 ${result.companyTotal.toLocaleString("ko-KR")}원`}
            >
              <ResultRow label="국민연금" value={result.pension} />
              <ResultRow label="건강보험" value={result.health} />
              <ResultRow label="장기요양보험" value={result.longtermCare} />
              <ResultRow label="고용보험" value={result.employment} />
              <div className="border-t border-white/10 mt-3 pt-3">
                <ResultRow label="합계" value={result.total} bold />
              </div>
            </ResultCard>
          ) : (
            <EmptyResult text="월 급여를 입력하면 결과가 여기에 나타나요." />
          )}
        </div>
      </div>

      <NoteBox title="계산 기준 안내">
        2026년 요율 기준(국민연금 4.75%, 건강보험 3.595%, 장기요양 13.14%, 고용보험 0.9%)이며
        국민연금은 기준소득월액 상·하한(40만~637만원)이 적용돼요. 회사 부담분은 고용안정·직업능력개발
        사업 등을 포함해 근사치로 표시했습니다.
      </NoteBox>

      <div className="mt-6">
        <Link href="/" className="text-sm text-stamp underline">
          ← 다른 계산기 보러가기
        </Link>
      </div>
    </main>
  );
}
