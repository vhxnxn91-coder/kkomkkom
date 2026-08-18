"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Key } from "lucide-react";
import { calculateAcquisitionTax } from "@/lib/realestate";
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

export default function AcquisitionTaxPage() {
  const [price, setPrice] = useState("600000000");
  const [numHouses, setNumHouses] = useState("1");

  const result = useMemo(() => {
    const p = Number(price) || 0;
    if (p <= 0) return null;
    return calculateAcquisitionTax(p, Number(numHouses) === 1, Number(numHouses));
  }, [price, numHouses]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <CalcHeader
        icon={<Key size={22} strokeWidth={2.2} />}
        eyebrow="계산기"
        title="취득세 계산기"
        desc="부동산을 살 때 내야 하는 취득세를 미리 계산해보세요. 보유 주택 수에 따라 세율이 달라져요."
      />

      <div className="grid md:grid-cols-2 gap-6">
        <InputCard>
          <MoneyInput label="매수가액" value={price} onChange={setPrice} placeholder="600,000,000" />
          <SelectInput
            label="취득 후 보유 주택 수"
            value={numHouses}
            onChange={setNumHouses}
            options={[
              { value: "1", label: "1주택 (일반세율)" },
              { value: "2", label: "2주택 (조정지역 중과)" },
              { value: "3", label: "3주택 이상 (중과)" },
            ]}
          />
        </InputCard>

        <div>
          {result ? (
            <ResultCard
              animKey={price + numHouses}
              label="예상 납부세액"
              value={`${result.total.toLocaleString("ko-KR")}원`}
              subValue={`적용세율 ${(result.rate * 100).toFixed(1)}%`}
            >
              <ResultRow label="취득세" value={result.tax} />
              <ResultRow label="지방교육세 등" value={result.localEduTax} />
            </ResultCard>
          ) : (
            <EmptyResult text="매수가액을 입력하면 결과가 여기에 나타나요." />
          )}
        </div>
      </div>

      <NoteBox title="계산 기준 안내">
        1주택 기준 6억 이하 1%, 6~9억 구간 선형 증가, 9억 초과 3%로 계산했습니다. 2주택
        이상은 조정대상지역 여부에 따라 8~12%까지 중과될 수 있어 대표 세율로 단순화했습니다.
        생애최초 취득 감면, 지역별 규제 여부에 따라 실제 세액은 달라지니 위택스에서 정확한
        금액을 확인하세요.
      </NoteBox>

      <div className="mt-6">
        <Link href="/" className="text-sm text-stamp underline">
          ← 다른 계산기 보러가기
        </Link>
      </div>
    </main>
  );
}
