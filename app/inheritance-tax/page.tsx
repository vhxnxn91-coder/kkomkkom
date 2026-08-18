"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Gift } from "lucide-react";
import { calculateInheritanceOrGiftTax, Relation } from "@/lib/etc";
import {
  CalcHeader,
  InputCard,
  MoneyInput,
  SelectInput,
  ToggleInput,
  ResultCard,
  ResultRow,
  EmptyResult,
  NoteBox,
} from "@/components/CalcUI";

export default function InheritanceTaxPage() {
  const [totalAsset, setTotalAsset] = useState("500000000");
  const [isGift, setIsGift] = useState(true);
  const [relation, setRelation] = useState<Relation>("child");
  const [hasSpouse, setHasSpouse] = useState(true);

  const result = useMemo(() => {
    const asset = Number(totalAsset) || 0;
    if (asset <= 0) return null;
    return calculateInheritanceOrGiftTax({
      totalAsset: asset,
      relation,
      hasSpouse,
      isGift,
    });
  }, [totalAsset, relation, hasSpouse, isGift]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <CalcHeader
        icon={<Gift size={22} strokeWidth={2.2} />}
        eyebrow="계산기"
        title="상속세·증여세 계산기"
        desc="재산가액과 관계를 입력하면 예상 상속세 또는 증여세를 계산해요."
      />

      <div className="grid md:grid-cols-2 gap-6">
        <InputCard>
          <ToggleInput
            label="구분"
            value={isGift}
            onChange={setIsGift}
            trueLabel="증여"
            falseLabel="상속"
          />
          <MoneyInput
            label={isGift ? "증여재산가액" : "상속재산가액"}
            value={totalAsset}
            onChange={setTotalAsset}
            placeholder="500,000,000"
          />
          {isGift ? (
            <SelectInput
              label="관계"
              value={relation}
              onChange={setRelation}
              options={[
                { value: "spouse", label: "배우자" },
                { value: "child", label: "자녀 (성년)" },
                { value: "other", label: "기타 친족" },
              ]}
            />
          ) : (
            <ToggleInput
              label="배우자 생존 여부"
              value={hasSpouse}
              onChange={setHasSpouse}
              trueLabel="있음"
              falseLabel="없음"
            />
          )}
        </InputCard>

        <div>
          {result ? (
            <ResultCard
              animKey={totalAsset + relation + hasSpouse + isGift}
              label="예상 납부세액"
              value={`${result.total.toLocaleString("ko-KR")}원`}
            >
              <ResultRow label="공제액" value={-result.deduction} />
              <ResultRow label="과세표준" value={result.taxBase} />
              <div className="border-t border-white/10 mt-3 pt-3">
                <ResultRow label="산출세액" value={result.calculatedTax} bold />
              </div>
            </ResultCard>
          ) : (
            <EmptyResult text="재산가액을 입력하면 결과가 여기에 나타나요." />
          )}
        </div>
      </div>

      <NoteBox title="계산 기준 안내">
        증여재산공제는 배우자 6억, 성년자녀 5천만원(10년 합산) 등으로, 상속공제는
        일괄공제 5억 + 배우자공제 5억(단순화)으로 계산했습니다. 세대생략, 동거주택 상속공제
        등 세부 특례는 반영하지 않았으니 정확한 세액은 세무사와 상담하세요.
      </NoteBox>

      <div className="mt-6">
        <Link href="/" className="text-sm text-stamp underline">
          ← 다른 계산기 보러가기
        </Link>
      </div>
    </main>
  );
}
