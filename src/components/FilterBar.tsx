"use client";

import FilterChip from "./FilterChip";
import type { CycloEvent, Filters, Month, EventType, DeptCode, Fiabilite } from "@/lib/types";
import { MONTH_CONFIG, TYPE_CONFIG, DEPT_CONFIG, FIAB_CONFIG } from "@/lib/constants";

interface FilterBarProps {
  allEvents: CycloEvent[];
  filters: Filters;
  toggleMonth: (m: Month) => void;
  toggleType: (t: EventType) => void;
  toggleDept: (d: DeptCode) => void;
  toggleFiab: (f: Fiabilite) => void;
  resetAll: () => void;
}

function countBy<T extends string>(
  events: CycloEvent[],
  key: keyof CycloEvent,
  filters: Filters,
  filterKey: keyof Filters
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const e of events) {
    // Count with cross-filtering: apply all filters EXCEPT the current category
    const pass =
      (filterKey === "months" || filters.months.has(e.month)) &&
      (filterKey === "types" || filters.types.has(e.type)) &&
      (filterKey === "depts" || filters.depts.has(e.dept)) &&
      (filterKey === "fiabs" || filters.fiabs.has(e.fiabilite));
    if (pass) {
      const v = e[key] as string;
      counts[v] = (counts[v] || 0) + 1;
    }
  }
  return counts;
}

export default function FilterBar({
  allEvents,
  filters,
  toggleMonth,
  toggleType,
  toggleDept,
  toggleFiab,
  resetAll,
}: FilterBarProps) {
  const monthCounts = countBy(allEvents, "month", filters, "months");
  const typeCounts = countBy(allEvents, "type", filters, "types");
  const deptCounts = countBy(allEvents, "dept", filters, "depts");
  const fiabCounts = countBy(allEvents, "fiabilite", filters, "fiabs");

  return (
    <div className="space-y-2.5 px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "var(--text-3)" }}>
          Filtres
        </span>
        <button
          onClick={resetAll}
          className="text-[10px] uppercase tracking-widest cursor-pointer hover:underline"
          style={{ color: "var(--accent)" }}
        >
          Réinitialiser
        </button>
      </div>

      {/* Mois */}
      <div className="flex flex-wrap gap-1.5">
        {(Object.entries(MONTH_CONFIG) as [Month, (typeof MONTH_CONFIG)[Month]][]).map(
          ([key, cfg]) => (
            <FilterChip
              key={key}
              label={cfg.label}
              count={monthCounts[key] || 0}
              active={filters.months.has(key)}
              accentColor={cfg.color}
              onClick={() => toggleMonth(key)}
            />
          )
        )}
      </div>

      {/* Type */}
      <div className="flex flex-wrap gap-1.5">
        {(Object.entries(TYPE_CONFIG) as [EventType, (typeof TYPE_CONFIG)[EventType]][]).map(
          ([key, cfg]) => (
            <FilterChip
              key={key}
              label={cfg.label}
              count={typeCounts[key] || 0}
              active={filters.types.has(key)}
              accentColor={cfg.color}
              onClick={() => toggleType(key)}
            />
          )
        )}
      </div>

      {/* Département */}
      <div className="flex flex-wrap gap-1.5">
        {(Object.entries(DEPT_CONFIG) as [DeptCode, (typeof DEPT_CONFIG)[DeptCode]][]).map(
          ([key, cfg]) => (
            <FilterChip
              key={key}
              label={cfg.label}
              count={deptCounts[key] || 0}
              active={filters.depts.has(key)}
              onClick={() => toggleDept(key)}
            />
          )
        )}
      </div>

      {/* Fiabilité */}
      <div className="flex flex-wrap gap-1.5">
        {(Object.entries(FIAB_CONFIG) as [Fiabilite, (typeof FIAB_CONFIG)[Fiabilite]][]).map(
          ([key, cfg]) => (
            <FilterChip
              key={key}
              label={`${cfg.emoji} ${cfg.label}`}
              count={fiabCounts[key] || 0}
              active={filters.fiabs.has(key)}
              accentColor={cfg.color}
              onClick={() => toggleFiab(key)}
            />
          )
        )}
      </div>
    </div>
  );
}
