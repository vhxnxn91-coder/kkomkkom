"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Home as HomeIcon } from "lucide-react";
import { calculateDti } from "@/lib/loan";
import {
  CalcHeader,
  InputCard,
  MoneyInput,
  NumberInput,
  ResultCard,
  ResultRow,
  EmptyResult,
  NoteBox,
  formatWon,
} from "@/components/CalcUI";

export default function DtiPage() {
  const [annualIncome, setAnnualIncome] = useState("50000000");
  const [newLoanPrincipal, setNewLoanPrincipal] = useState("300000000");
  const [newLoanRate, setNewLoanRate] = useState("4.5");
  const [newLoanYears, setNewLoanYears] = useState("30");
  const [existingInterest, setExistingInterest] = useState("0");

  const result = useMemo(() => {
    const income = Number(annualIncome) || 0;
    if (income <= 0) return null;
    return calculateDti({
      annualIncome: income,
      newLoanPrincipal: Number(newLoanPrincipal) || 0,
      newLoanRate: Number(newLoanRate) || 0,
      newLoanYears: Number(newLoanYears) || 1,
      existingHousingLoanAnnualInterest: Number(existingInterest) || 0,
    });
  }, [annualIncome, newLoanPrincipal, newLoanRate, newLoanYears, existingInterest]);

  const isOver = result ? result.dti > 60 : false;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <CalcHeader
        icon={<HomeIcon size={22} strokeWidth={2.2} />}
        eyebrow="계산기"
        title="DTI 계산기"
        desc="총부채상환비율(DTI)로 주택담보대출 가능액을 가늠해보세요. 규제지역은 보통 50~60%가 기준이 돼요."
      />

      <div className="grid md:grid-cols-2 gap-6">
        <InputCard>
          <MoneyInput
            label="연소득"
            value={annualIncome}
            onChange={setAnnualIncome}
            placeholder="50,000,000"
          />
          <MoneyInput
            label="신규 주택담보대출 원금"
            value={newLoanPrincipal}
            onChange={setNewLoanPrincipal}
            placeholder="300,000,000"
          />
          <div className="grid grid-cols-2 gap-4">
            <NumberInput
              label="대출 금리"
              value={newLoanRate}
              onChange={setNewLoanRate}
              suffix="%"
              step="0.1"
            />
            <NumberInput
              label="대출 기간"
              value={newLoanYears}
              onChange={setNewLoanYears}
              suffix="년"
            />
          </div>
          <MoneyInput
            label="기존 주택담보대출 연간 이자"
            value={existingInterest}
            onChange={setExistingInterest}
            placeholder="0"
            hint="DTI는 기존 주택담보대출의 이자만 반영해요 (원금 제외)."
          />
        </InputCard>

        <div>
          {result ? (
            <ResultCard
              animKey={annualIncome + newLoanPrincipal + newLoanRate + newLoanYears}
              label="예상 DTI"
              value={`${result.dti.toFixed(1)}%`}
              subValue={
                isOver
                  ? "규제지역 기준(60%)을 초과할 수 있어요"
                  : "규제지역 기준(60%) 이내예요"
              }
            >
              <ResultRow label="신규 대출 연간 원리금" value={result.newLoanAnnualPayment} />
              <ResultRow label="기존 대출 연간 이자" value={Number(existingInterest) || 0} />
              <div className="border-t border-white/10 mt-3 pt-3">
                <ResultRow label="총 연간 상환액" value={result.totalAnnualPayment} bold />
              </div>
            </ResultCard>
          ) : (
            <EmptyResult text="연소득을 입력하면 결과가 여기에 나타나요." />
          )}
        </div>
      </div>

      <NoteBox title="계산 기준 안내">
        DTI는 신규 주담대의 원리금과 기존 주담대의 이자만 반영하는 방식으로 단순화했습니다.
        지역·상품별 규제 기준(50~70%)이 다르니 실제 한도는 은행 상담을 통해 확인하세요.
      </NoteBox>

      <div className="mt-6">
        <Link href="/" className="text-sm text-stamp underline">
          ← 다른 계산기 보러가기
        </Link>
      </div>
    </main>
  );
}
