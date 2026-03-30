"use client";

interface FilterChipProps {
  label: string;
  count: number;
  active: boolean;
  accentColor?: string;
  onClick: () => void;
}

export default function FilterChip({
  label,
  count,
  active,
  accentColor = "#F97316",
  onClick,
}: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] uppercase tracking-widest font-medium transition-all duration-200 cursor-pointer border"
      style={{
        backgroundColor: active ? `${accentColor}20` : "transparent",
        borderColor: active ? accentColor : "var(--border)",
        color: active ? accentColor : "var(--text-3)",
      }}
    >
      {label}
      <span
        className="text-[9px] opacity-70"
        style={{ color: active ? accentColor : "var(--text-4)" }}
      >
        ({count})
      </span>
    </button>
  );
}
