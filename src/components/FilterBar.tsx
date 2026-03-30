"use client";

import FilterChip from "./FilterChip";
import type { CycloEvent, Filters, Month, EventType, Region, Fiabilite } from "@/lib/types";
import { MONTH_CONFIG, TYPE_CONFIG, REGION_CONFIG, FIAB_CONFIG } from "@/lib/constants";

interface FilterBarProps {
  allEvents: CycloEvent[];
  filters: Filters;
  toggleMonth: (m: Month) => void;
  toggleType: (t: EventType) => void;
  toggleRegion: (r: Region) => void;
  toggleFiab: (f: Fiabilite) => void;
  resetAll: () => void;
}

function countBy(
  events: CycloEvent[],
  key: keyof CycloEvent,
  filters: Filters,
  filterKey: keyof Filters
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const e of events) {
    const pass =
      (filterKey === "months" || filters.months.has(e.month)) &&
      (filterKey === "types" || filters.types.has(e.type)) &&
      (filterKey === "regions" || filters.regions.has(e.region)) &&
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
  toggleRegion,
  toggleFiab,
  resetAll,
}: FilterBarProps) {
  const monthCounts = countBy(allEvents, "month", filters, "months");
  const typeCounts = countBy(allEvents, "type", filters, "types");
  const regionCounts = countBy(allEvents, "region", filters, "regions");
  const fiabCounts = countBy(allEvents, "fiabilite", filters, "fiabs");

  // Only show regions that have events
  const activeRegions = (
    Object.entries(REGION_CONFIG) as [Region, (typeof REGION_CONFIG)[keyof typeof REGION_CONFIG]][]
  ).filter(([key]) => allEvents.some((e) => e.region === key));

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

      {/* Région */}
      <div className="flex flex-wrap gap-1.5">
        {activeRegions.map(([key, cfg]) => (
          <FilterChip
            key={key}
            label={cfg.label}
            count={regionCounts[key] || 0}
            active={filters.regions.has(key)}
            accentColor={cfg.color}
            onClick={() => toggleRegion(key)}
          />
        ))}
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
