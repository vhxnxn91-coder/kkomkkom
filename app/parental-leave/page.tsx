"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Baby } from "lucide-react";
import { calculateParentalLeave } from "@/lib/etc";
import {
  CalcHeader,
  InputCard,
  MoneyInput,
  SelectInput,
  ResultCard,
  ResultRow,
  EmptyResult,
  NoteBox,
} from "@/components/CalcUI";

export default function ParentalLeavePage() {
  const [monthlyOrdinaryWage, setMonthlyOrdinaryWage] = useState("3000000");
  const [months, setMonths] = useState("12");

  const result = useMemo(() => {
    const wage = Number(monthlyOrdinaryWage) || 0;
    if (wage <= 0) return null;
    return calculateParentalLeave({ monthlyOrdinaryWage: wage, months: Number(months) || 1 });
  }, [monthlyOrdinaryWage, months]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <CalcHeader
        icon={<Baby size={22} strokeWidth={2.2} />}
        eyebrow="계산기"
        title="육아휴직급여 계산기"
        desc="통상임금과 휴직 기간을 입력하면 예상 육아휴직급여를 계산해요. 급여의 25%는 복직 6개월 후 지급돼요."
      />

      <div className="grid md:grid-cols-2 gap-6">
        <InputCard>
          <MoneyInput
            label="통상임금 (월)"
            value={monthlyOrdinaryWage}
            onChange={setMonthlyOrdinaryWage}
            placeholder="3,000,000"
          />
          <SelectInput
            label="육아휴직 기간"
            value={months}
            onChange={setMonths}
            options={[3, 6, 9, 12].map((n) => ({ value: String(n), label: `${n}개월` }))}
          />
        </InputCard>

        <div>
          {result ? (
            <ResultCard
              animKey={monthlyOrdinaryWage + months}
              label="총 예상 육아휴직급여"
              value={`${result.total.toLocaleString("ko-KR")}원`}
              subValue={`휴직 중 지급 ${result.totalDuringLeave.toLocaleString("ko-KR")}원 + 사후지급분 ${result.totalHeldBack.toLocaleString("ko-KR")}원`}
            >
              {result.details.map((d) => (
                <ResultRow key={d.month} label={`${d.month}개월차`} value={d.pay} />
              ))}
            </ResultCard>
          ) : (
            <EmptyResult text="통상임금을 입력하면 결과가 여기에 나타나요." />
          )}
        </div>
      </div>

      <NoteBox title="계산 기준 안내">
        통상임금의 80%(1~3개월차 상한 250만원, 4~6개월차 상한 200만원, 7개월차 이후 상한
        160만원)로 계산했습니다. 급여의 25%는 복직 후 6개월 이상 근무 시 일괄 지급되는
        사후지급분이에요. 부모 동시육아휴직 등 특례는 반영하지 않았으니 고용센터에서
        정확한 금액을 확인하세요.
      </NoteBox>

      <div className="mt-6">
        <Link href="/" className="text-sm text-stamp underline">
          ← 다른 계산기 보러가기
        </Link>
      </div>
    </main>
  );
}
