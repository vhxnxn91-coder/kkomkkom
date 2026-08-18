import Link from "next/link";
import {
  Wallet,
  Landmark,
  Home as HomeIcon,
  Briefcase,
  Building2,
  Key,
  ShieldCheck,
  Baby,
  Receipt,
  Gift,
  LucideIcon,
} from "lucide-react";

const calculators: {
  title: string;
  desc: string;
  href: string;
  ready: boolean;
  category: string;
  icon: LucideIcon;
}[] = [
  {
    title: "연봉 실수령액 계산기",
    desc: "세전 연봉을 입력하면 4대보험·소득세를 뗀 실수령액을 계산합니다.",
    href: "/salary",
    ready: true,
    category: "직장인",
    icon: Wallet,
  },
  {
    title: "DSR 계산기",
    desc: "총부채원리금상환비율을 계산해 대출 한도를 가늠해보세요.",
    href: "/dsr",
    ready: true,
    category: "부동산",
    icon: Landmark,
  },
  {
    title: "DTI 계산기",
    desc: "총부채상환비율 기준 대출 가능액을 계산합니다.",
    href: "/dti",
    ready: true,
    category: "부동산",
    icon: HomeIcon,
  },
  {
    title: "퇴직금 계산기",
    desc: "평균임금 기준으로 예상 퇴직금을 계산합니다.",
    href: "/severance",
    ready: true,
    category: "직장인",
    icon: Briefcase,
  },
  {
    title: "양도소득세 계산기",
    desc: "부동산 매도 시 예상 양도소득세를 계산합니다.",
    href: "/capital-gains-tax",
    ready: true,
    category: "부동산",
    icon: Building2,
  },
  {
    title: "취득세 계산기",
    desc: "부동산 매수 시 취득세를 미리 계산해보세요.",
    href: "/acquisition-tax",
    ready: true,
    category: "부동산",
    icon: Key,
  },
  {
    title: "4대보험료 계산기",
    desc: "국민연금·건강보험·고용보험료를 항목별로 계산합니다.",
    href: "/insurance",
    ready: true,
    category: "직장인",
    icon: ShieldCheck,
  },
  {
    title: "육아휴직급여 계산기",
    desc: "육아휴직급여 지급액과 사후지급분을 계산합니다.",
    href: "/parental-leave",
    ready: true,
    category: "직장인",
    icon: Baby,
  },
  {
    title: "종합소득세 계산기",
    desc: "사업·프리랜서 소득 기준 종합소득세를 계산합니다.",
    href: "/comprehensive-tax",
    ready: true,
    category: "세금",
    icon: Receipt,
  },
  {
    title: "상속세·증여세 계산기",
    desc: "상속·증여 재산가액 기준 예상 세액을 계산합니다.",
    href: "/inheritance-tax",
    ready: true,
    category: "세금",
    icon: Gift,
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <section className="mb-14">
        <p className="text-sm font-semibold text-stamp mb-3">
          서민금융의 길라잡이
        </p>
        <h1 className="text-[2.5rem] font-bold tracking-tight leading-[1.25] text-ink">
          숫자 하나까지,
          <br />꼼꼼하게 계산해요
        </h1>
        <p className="mt-4 text-inkSoft text-lg max-w-xl">
          연봉, 대출, 세금, 퇴직금까지. 매번 헷갈리는 계산을 정확한 최신 요율로
          대신 계산해드려요.
        </p>
      </section>

      <section className="grid sm:grid-cols-2 gap-3">
        {calculators.map((c) => (
          <CalcCard key={c.href} {...c} />
        ))}
      </section>
    </main>
  );
}

function CalcCard({
  title,
  desc,
  href,
  ready,
  category,
  icon: Icon,
}: {
  title: string;
  desc: string;
  href: string;
  ready: boolean;
  category: string;
  icon: LucideIcon;
}) {
  const content = (
    <div
      className={`h-full rounded-2xl p-5 transition-all ${
        ready
          ? "bg-surface hover:shadow-cardHover hover:-translate-y-0.5"
          : "bg-surface/60"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-stamp">
          <Icon size={18} strokeWidth={2.2} />
        </div>
        {!ready && (
          <span className="text-[11px] font-medium text-inkSoft bg-white rounded-full px-2 py-0.5">
            준비중
          </span>
        )}
        {ready && (
          <span className="text-[11px] font-medium text-stamp bg-stampSoft rounded-full px-2 py-0.5">
            이용 가능
          </span>
        )}
      </div>
      <h2 className="font-bold text-[17px] text-ink">{title}</h2>
      <p className="mt-1.5 text-sm text-inkSoft leading-relaxed">{desc}</p>
    </div>
  );

  if (!ready) {
    return <div className="opacity-60 cursor-not-allowed">{content}</div>;
  }

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}
