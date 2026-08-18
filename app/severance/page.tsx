"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import { calculateSeverance } from "@/lib/etc";
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

export default function SeverancePage() {
  const [last3MonthsWage, setLast3MonthsWage] = useState("12000000");
  const [annualBonus, setAnnualBonus] = useState("0");
  const [annualLeaveAllowance, setAnnualLeaveAllowance] = useState("0");
  const [workDays, setWorkDays] = useState("1095");

  const result = useMemo(() => {
    const wage = Number(last3MonthsWage) || 0;
    if (wage <= 0) return null;
    return calculateSeverance({
      last3MonthsWage: wage,
      annualBonus: Number(annualBonus) || 0,
      annualLeaveAllowance: Number(annualLeaveAllowance) || 0,
      workDays: Number(workDays) || 0,
    });
  }, [last3MonthsWage, annualBonus, annualLeaveAllowance, workDays]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <CalcHeader
        icon={<Briefcase size={22} strokeWidth={2.2} />}
        eyebrow="계산기"
        title="퇴직금 계산기"
        desc="최근 3개월 평균임금을 기준으로 예상 퇴직금을 계산해요. 1년 이상 근무 시 지급 대상이에요."
      />

      <div className="grid md:grid-cols-2 gap-6">
        <InputCard>
          <MoneyInput
            label="최근 3개월 총 급여"
            value={last3MonthsWage}
            onChange={setLast3MonthsWage}
            placeholder="12,000,000"
            hint="세전 기준, 최근 3개월 급여 합계를 입력하세요."
          />
          <MoneyInput
            label="연간 상여금 총액"
            value={annualBonus}
            onChange={setAnnualBonus}
            placeholder="0"
          />
          <MoneyInput
            label="연간 미사용 연차수당"
            value={annualLeaveAllowance}
            onChange={setAnnualLeaveAllowance}
            placeholder="0"
          />
          <NumberInput
            label="총 재직일수"
            value={workDays}
            onChange={setWorkDays}
            suffix="일"
            hint="입사일부터 퇴직일까지 총 일수예요. (예: 3년 근무 시 약 1,095일)"
          />
        </InputCard>

        <div>
          {result ? (
            <ResultCard
              animKey={last3MonthsWage + annualBonus + annualLeaveAllowance + workDays}
              label="예상 퇴직금"
              value={`${result.severancePay.toLocaleString("ko-KR")}원`}
            >
              <ResultRow label="1일 평균임금" value={result.dailyAverageWage} />
              <ResultRow label="재직일수" value={Number(workDays) || 0} />
            </ResultCard>
          ) : (
            <EmptyResult text="최근 3개월 급여를 입력하면 결과가 여기에 나타나요." />
          )}
        </div>
      </div>

      <NoteBox title="계산 기준 안내">
        평균임금 = (최근 3개월 급여 + 상여금·연차수당의 재직기간 비례분) ÷ 90일이며,
        퇴직금 = 평균임금 × 30일 × (재직일수 ÷ 365)로 계산했습니다. 실제 퇴직금은 취업규칙,
        통상임금 산정 방식에 따라 달라질 수 있어요.
      </NoteBox>

      <div className="mt-6">
        <Link href="/" className="text-sm text-stamp underline">
          ← 다른 계산기 보러가기
        </Link>
      </div>
    </main>
  );
}
