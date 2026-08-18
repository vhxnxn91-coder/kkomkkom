"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { calculateCapitalGainsTax } from "@/lib/realestate";
import {
  CalcHeader,
  InputCard,
  MoneyInput,
  NumberInput,
  ToggleInput,
  ResultCard,
  ResultRow,
  EmptyResult,
  NoteBox,
} from "@/components/CalcUI";

export default function CapitalGainsTaxPage() {
  const [salePrice, setSalePrice] = useState("900000000");
  const [purchasePrice, setPurchasePrice] = useState("600000000");
  const [necessaryExpense, setNecessaryExpense] = useState("10000000");
  const [holdingYears, setHoldingYears] = useState("5");
  const [isOneHouse, setIsOneHouse] = useState(true);
  const [isExempt, setIsExempt] = useState(false);

  const result = useMemo(() => {
    const sale = Number(salePrice) || 0;
    if (sale <= 0) return null;
    return calculateCapitalGainsTax({
      salePrice: sale,
      purchasePrice: Number(purchasePrice) || 0,
      necessaryExpense: Number(necessaryExpense) || 0,
      holdingYears: Number(holdingYears) || 0,
      isOneHouse,
      isExempt,
    });
  }, [salePrice, purchasePrice, necessaryExpense, holdingYears, isOneHouse, isExempt]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <CalcHeader
        icon={<Building2 size={22} strokeWidth={2.2} />}
        eyebrow="계산기"
        title="양도소득세 계산기"
        desc="부동산을 팔 때 예상되는 양도소득세를 계산해요. 1세대 1주택 비과세 요건(실거래가 12억 이하 등)을 충족하면 세금이 없어요."
      />

      <div className="grid md:grid-cols-2 gap-6">
        <InputCard>
          <MoneyInput label="양도가액 (매도가)" value={salePrice} onChange={setSalePrice} placeholder="900,000,000" />
          <MoneyInput label="취득가액 (매수가)" value={purchasePrice} onChange={setPurchasePrice} placeholder="600,000,000" />
          <MoneyInput
            label="필요경비"
            value={necessaryExpense}
            onChange={setNecessaryExpense}
            placeholder="10,000,000"
            hint="취득세, 중개수수료, 인테리어 비용 등 자본적 지출을 합산하세요."
          />
          <NumberInput label="보유기간" value={holdingYears} onChange={setHoldingYears} suffix="년" />
          <ToggleInput
            label="1세대 1주택 여부"
            value={isOneHouse}
            onChange={setIsOneHouse}
            trueLabel="1주택"
            falseLabel="다주택/기타"
          />
          <ToggleInput
            label="1세대 1주택 비과세 요건 충족"
            value={isExempt}
            onChange={setIsExempt}
            trueLabel="충족"
            falseLabel="미충족/해당없음"
          />
        </InputCard>

        <div>
          {result ? (
            result.isExempt ? (
              <ResultCard
                animKey={salePrice + purchasePrice + holdingYears + "exempt"}
                label="예상 양도소득세"
                value="0원"
                subValue="1세대 1주택 비과세 요건을 충족해요"
              >
                <ResultRow label="양도차익" value={result.gain} />
              </ResultCard>
            ) : (
              <ResultCard
                animKey={salePrice + purchasePrice + holdingYears + necessaryExpense}
                label="예상 납부세액"
                value={`${result.totalTax.toLocaleString("ko-KR")}원`}
              >
                <ResultRow label="양도차익" value={result.gain} />
                <ResultRow label="장기보유특별공제" value={-result.deduction} />
                <ResultRow label="과세표준" value={result.taxBase} />
                <div className="border-t border-white/10 mt-3 pt-3">
                  <ResultRow label="양도소득세" value={result.calculatedTax} />
                  <ResultRow label="지방소득세" value={result.localTax} />
                </div>
              </ResultCard>
            )
          ) : (
            <EmptyResult text="양도가액을 입력하면 결과가 여기에 나타나요." />
          )}
        </div>
      </div>

      <NoteBox title="계산 기준 안내">
        장기보유특별공제는 1세대 1주택(2년 이상 거주 가정)은 보유·거주 각 연 4%(최대 80%),
        그 외는 연 2%(최대 30%)로 단순화했습니다. 보유 1년 미만은 70%, 1~2년은 60% 단일세율이
        적용돼요. 실제 세액은 조정대상지역 여부, 다주택 중과 등에 따라 달라지니 세무 전문가와
        상담하세요.
      </NoteBox>

      <div className="mt-6">
        <Link href="/" className="text-sm text-stamp underline">
          ← 다른 계산기 보러가기
        </Link>
      </div>
    </main>
  );
}
