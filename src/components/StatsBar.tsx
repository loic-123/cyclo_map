"use client";

import type { CycloEvent } from "@/lib/types";

interface StatsBarProps {
  visibleCount: number;
  totalCount: number;
  events: CycloEvent[];
}

export default function StatsBar({ visibleCount, totalCount, events }: StatsBarProps) {
  const deptCount = new Set(events.map((e) => e.dept)).size;

  return (
    <div className="flex items-center gap-4 px-4 py-2 text-[11px]" style={{ color: "var(--text-3)" }}>
      <span>
        <span className="font-bold text-[13px]" style={{ color: "var(--accent)" }}>
          {visibleCount}
        </span>{" "}
        / {totalCount} événements
      </span>
      <span>
        <span className="font-bold text-[13px]" style={{ color: "var(--text-2)" }}>
          {deptCount}
        </span>{" "}
        départements
      </span>
    </div>
  );
}
