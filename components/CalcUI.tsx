"use client";

import { ReactNode } from "react";

export function formatWon(n: number) {
  return Math.round(n).toLocaleString("ko-KR") + "원";
}

export function CalcHeader({
  icon,
  eyebrow,
  title,
  desc,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="mb-10 flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-stampSoft text-stamp">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-stamp mb-1">{eyebrow}</p>
        <h1 className="text-3xl font-bold tracking-tight text-ink">{title}</h1>
        <p className="mt-2 text-inkSoft">{desc}</p>
      </div>
    </div>
  );
}

export function MoneyInput({
  label,
  value,
  onChange,
  placeholder,
  suffix = "원",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  suffix?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2 text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={Number(value || 0).toLocaleString("ko-KR")}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
          className="w-full text-xl font-bold bg-white rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-stamp text-ink placeholder:text-inkSoft/50"
          placeholder={placeholder}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-inkSoft text-sm">
          {suffix}
        </span>
      </div>
      {hint && <p className="mt-2 text-xs text-inkSoft">{hint}</p>}
    </div>
  );
}

export function NumberInput({
  label,
  value,
  onChange,
  placeholder,
  suffix,
  hint,
  step,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  suffix?: string;
  hint?: string;
  step?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2 text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          step={step ?? "1"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-xl font-bold bg-white rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-stamp text-ink placeholder:text-inkSoft/50"
          placeholder={placeholder}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-inkSoft text-sm">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="mt-2 text-xs text-inkSoft">{hint}</p>}
    </div>
  );
}

export function SelectInput<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2 text-ink">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full text-xl font-bold bg-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-stamp text-ink"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ToggleInput({
  label,
  value,
  onChange,
  trueLabel,
  falseLabel,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  trueLabel: string;
  falseLabel: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-2 text-ink">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`rounded-xl py-3 text-sm font-semibold transition-colors ${
            value ? "bg-stamp text-white" : "bg-white text-inkSoft"
          }`}
        >
          {trueLabel}
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`rounded-xl py-3 text-sm font-semibold transition-colors ${
            !value ? "bg-stamp text-white" : "bg-white text-inkSoft"
          }`}
        >
          {falseLabel}
        </button>
      </div>
    </div>
  );
}

export function InputCard({ children }: { children: ReactNode }) {
  return <div className="bg-surface rounded-2xl p-6 space-y-6">{children}</div>;
}

export function ResultCard({
  label,
  value,
  subValue,
  children,
  animKey,
}: {
  label: string;
  value: string;
  subValue?: string;
  children?: ReactNode;
  animKey: string;
}) {
  return (
    <div key={animKey} className="fade-up bg-ink rounded-2xl overflow-hidden text-white">
      <div className="px-6 pt-6 pb-5">
        <p className="text-sm text-white/60 mb-1.5">{label}</p>
        <p className="text-4xl font-bold tracking-tight">{value}</p>
        {subValue && <p className="mt-2 text-sm text-white/60">{subValue}</p>}
      </div>
      {children && (
        <>
          <div className="mx-6 h-px bg-white/10" />
          <div className="px-6 py-5 space-y-2.5 text-sm">{children}</div>
        </>
      )}
    </div>
  );
}

export function ResultRow({
  label,
  value,
  bold,
  positive,
}: {
  label: string;
  value: number;
  bold?: boolean;
  positive?: boolean;
}) {
  const isNegative = value < 0;
  return (
    <div className={`flex items-center justify-between ${bold ? "font-bold" : ""}`}>
      <span className="text-white/60">{label}</span>
      <span className={positive ? "text-[#5EEBB0]" : isNegative ? "text-[#FF8A8A]" : "text-white"}>
        {isNegative ? "-" : ""}
        {formatWon(Math.abs(value))}
      </span>
    </div>
  );
}

export function EmptyResult({ text }: { text: string }) {
  return (
    <div className="bg-surface rounded-2xl p-8 text-center text-inkSoft text-sm">
      {text}
    </div>
  );
}

export function NoteBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-10 text-xs text-inkSoft leading-relaxed border-t border-grid pt-6">
      <p className="font-semibold text-ink mb-1">{title}</p>
      <p>{children}</p>
    </div>
  );
}
