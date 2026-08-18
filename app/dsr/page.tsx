"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Landmark } from "lucide-react";
import { calculateDsr } from "@/lib/loan";
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

export default function DsrPage() {
  const [annualIncome, setAnnualIncome] = useState("50000000");
  const [newLoanPrincipal, setNewLoanPrincipal] = useState("300000000");
  const [newLoanRate, setNewLoanRate] = useState("4.5");
  const [newLoanYears, setNewLoanYears] = useState("30");
  const [existingAnnualDebtPayment, setExistingAnnualDebtPayment] = useState("0");

  const result = useMemo(() => {
    const income = Number(annualIncome) || 0;
    if (income <= 0) return null;
    return calculateDsr({
      annualIncome: income,
      newLoanPrincipal: Number(newLoanPrincipal) || 0,
      newLoanRate: Number(newLoanRate) || 0,
      newLoanYears: Number(newLoanYears) || 1,
      existingAnnualDebtPayment: Number(existingAnnualDebtPayment) || 0,
    });
  }, [annualIncome, newLoanPrincipal, newLoanRate, newLoanYears, existingAnnualDebtPayment]);

  const isOver = result ? result.dsr > 40 : false;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <CalcHeader
        icon={<Landmark size={22} strokeWidth={2.2} />}
        eyebrow="계산기"
        title="DSR 계산기"
        desc="총부채원리금상환비율(DSR)을 계산해 대출 한도를 미리 가늠해보세요. 은행권은 보통 40%를 기준으로 삼습니다."
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
            label="신규 대출 원금"
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
            label="기존 대출 연간 원리금상환액"
            value={existingAnnualDebtPayment}
            onChange={setExistingAnnualDebtPayment}
            placeholder="0"
            hint="기존에 상환 중인 대출이 있다면 연간 원리금 합계를 입력하세요."
          />
        </InputCard>

        <div>
          {result ? (
            <ResultCard
              animKey={annualIncome + newLoanPrincipal + newLoanRate + newLoanYears}
              label="예상 DSR"
              value={`${result.dsr.toFixed(1)}%`}
              subValue={
                isOver
                  ? "일반적인 은행권 기준(40%)을 초과해요"
                  : "일반적인 은행권 기준(40%) 이내예요"
              }
            >
              <ResultRow label="신규 대출 연간 원리금" value={result.newLoanAnnualPayment} />
              <ResultRow label="기존 대출 연간 원리금" value={Number(existingAnnualDebtPayment) || 0} />
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
        원리금균등상환 방식 기준으로 계산했습니다. 실제 DSR은 금융기관과 상품, 신용점수,
        기존 대출의 상환 방식(거치식 등)에 따라 달라질 수 있어요. 정확한 한도는 은행 상담을
        통해 확인하세요.
      </NoteBox>

      <div className="mt-6">
        <Link href="/" className="text-sm text-stamp underline">
          ← 다른 계산기 보러가기
        </Link>
      </div>
    </main>
  );
}
