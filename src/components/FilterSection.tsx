"use client";

import { useState, useCallback } from "react";

interface FilterSectionProps {
  label: string;
  totalActive: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export default function FilterSection({
  label,
  totalActive,
  totalCount,
  onSelectAll,
  onDeselectAll,
  defaultOpen = true,
  children,
}: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const allSelected = totalActive === totalCount;

  const handleToggleAll = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (allSelected) onDeselectAll();
      else onSelectAll();
    },
    [allSelected, onSelectAll, onDeselectAll]
  );

  return (
    <div>
      <div
        className="flex items-center justify-between cursor-pointer select-none py-1"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-1.5">
          <span
            className="text-[9px] transition-transform duration-150"
            style={{
              color: "var(--text-4)",
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
              display: "inline-block",
            }}
          >
            ▶
          </span>
          <span
            className="text-[10px] uppercase tracking-widest font-semibold"
            style={{ color: "var(--text-3)" }}
          >
            {label}
          </span>
          {!allSelected && (
            <span
              className="text-[9px] rounded-full px-1.5 py-px"
              style={{ backgroundColor: "var(--accent)20", color: "var(--accent)" }}
            >
              {totalActive}/{totalCount}
            </span>
          )}
        </div>
        <button
          onClick={handleToggleAll}
          className="text-[9px] uppercase tracking-wider cursor-pointer hover:underline"
          style={{ color: "var(--text-4)" }}
        >
          {allSelected ? "Aucun" : "Tous"}
        </button>
      </div>
      {open && (
        <div className="flex flex-wrap gap-1 pt-0.5 pb-1">{children}</div>
      )}
    </div>
  );
}
