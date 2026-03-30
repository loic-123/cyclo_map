"use client";

import { memo } from "react";

interface FilterChipProps {
  label: string;
  count: number;
  active: boolean;
  accentColor?: string;
  onClick: () => void;
}

export default memo(function FilterChip({
  label,
  count,
  active,
  accentColor = "#F97316",
  onClick,
}: FilterChipProps) {
  const isEmpty = count === 0;

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-[3px] text-[10px] font-medium transition-all duration-150 cursor-pointer border leading-tight"
      style={{
        backgroundColor: active ? `${accentColor}20` : "transparent",
        borderColor: active ? accentColor : "var(--border)",
        color: active ? accentColor : "var(--text-3)",
        opacity: isEmpty && !active ? 0.4 : 1,
      }}
    >
      {label}
      <span
        className="text-[9px] tabular-nums"
        style={{ color: active ? accentColor : "var(--text-4)", opacity: 0.7 }}
      >
        {count}
      </span>
    </button>
  );
});
