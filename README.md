# 꼼꼼 (kkomkkom)

생활 금융 계산기 모음 사이트. 첫 계산기: 연봉 실수령액 계산기.

## 로컬 실행

```bash
npm install
npm run dev
```

## 배포 (Vercel)

1. 이 폴더 전체를 GitHub 저장소로 올립니다. (폴더 안의 파일들을 저장소 루트에 바로 push 하는 것을 추천 — 중첩 폴더 문제 방지)
2. Vercel에서 New Project → 해당 저장소 선택 → Framework Preset이 Next.js로 자동 인식됩니다.
3. Root Directory는 저장소 구조에 맞게 확인 후 Deploy.

## 구조

- `app/page.tsx` — 홈, 계산기 목록
- `app/salary/page.tsx` — 연봉 실수령액 계산기
- `lib/salary.ts` — 계산 로직 (2026년 4대보험 요율 기준)

새 계산기를 추가하려면 `app/[계산기이름]/page.tsx`를 만들고, `app/page.tsx`의 `calculators` 배열에 항목을 추가한 뒤 `ready: true`로 바꾸면 됩니다.
