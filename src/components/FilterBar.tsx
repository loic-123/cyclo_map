"use client";

import { useMemo } from "react";
import FilterChip from "./FilterChip";
import FilterSection from "./FilterSection";
import type { CycloEvent, Filters, Month, EventType, Region, Fiabilite } from "@/lib/types";
import {
  MONTH_CONFIG,
  TYPE_CONFIG,
  REGION_CONFIG,
  FIAB_CONFIG,
  ALL_MONTHS,
  ALL_TYPES,
  ALL_REGIONS,
  ALL_FIABS,
} from "@/lib/constants";

interface FilterBarProps {
  allEvents: CycloEvent[];
  filters: Filters;
  toggleMonth: (m: Month) => void;
  toggleType: (t: EventType) => void;
  toggleRegion: (r: Region) => void;
  toggleFiab: (f: Fiabilite) => void;
  setAll: <T>(key: keyof Filters, values: T[]) => void;
  clearCategory: (key: keyof Filters) => void;
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
  setAll,
  clearCategory,
  resetAll,
}: FilterBarProps) {
  const monthCounts = countBy(allEvents, "month", filters, "months");
  const typeCounts = countBy(allEvents, "type", filters, "types");
  const regionCounts = countBy(allEvents, "region", filters, "regions");
  const fiabCounts = countBy(allEvents, "fiabilite", filters, "fiabs");

  // Only show regions that actually have events
  const activeRegions = useMemo(
    () =>
      (Object.entries(REGION_CONFIG) as [Region, (typeof REGION_CONFIG)[keyof typeof REGION_CONFIG]][]).filter(
        ([key]) => allEvents.some((e) => e.region === key)
      ),
    [allEvents]
  );

  const activeRegionKeys = useMemo(() => activeRegions.map(([k]) => k), [activeRegions]);

  const isDefault =
    filters.months.size === ALL_MONTHS.length &&
    filters.types.size === ALL_TYPES.length &&
    filters.regions.size >= activeRegionKeys.length &&
    filters.fiabs.size === ALL_FIABS.length;

  return (
    <div className="px-4 py-2 border-b space-y-0.5" style={{ borderColor: "var(--border)" }}>
      {/* Header */}
      <div className="flex items-center justify-between pb-1">
        <span
          className="text-[10px] uppercase tracking-widest font-semibold"
          style={{ color: "var(--text-3)" }}
        >
          Filtres
        </span>
        {!isDefault && (
          <button
            onClick={resetAll}
            className="text-[10px] uppercase tracking-wider cursor-pointer hover:underline transition-colors"
            style={{ color: "var(--accent)" }}
          >
            Tout réinitialiser
          </button>
        )}
      </div>

      {/* Mois */}
      <FilterSection
        label="Mois"
        totalActive={filters.months.size}
        totalCount={ALL_MONTHS.length}
        onSelectAll={() => setAll("months", ALL_MONTHS)}
        onDeselectAll={() => clearCategory("months")}
      >
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
      </FilterSection>

      {/* Type */}
      <FilterSection
        label="Type"
        totalActive={filters.types.size}
        totalCount={ALL_TYPES.length}
        onSelectAll={() => setAll("types", ALL_TYPES)}
        onDeselectAll={() => clearCategory("types")}
      >
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
      </FilterSection>

      {/* Région */}
      <FilterSection
        label="Région"
        totalActive={filters.regions.size}
        totalCount={activeRegionKeys.length}
        onSelectAll={() => setAll("regions", ALL_REGIONS)}
        onDeselectAll={() => clearCategory("regions")}
        defaultOpen={false}
      >
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
      </FilterSection>

      {/* Fiabilité */}
      <FilterSection
        label="Fiabilité"
        totalActive={filters.fiabs.size}
        totalCount={ALL_FIABS.length}
        onSelectAll={() => setAll("fiabs", ALL_FIABS)}
        onDeselectAll={() => clearCategory("fiabs")}
      >
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
      </FilterSection>
    </div>
  );
}
