"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type {
  CycloEvent,
  Filters,
  Month,
  EventType,
  Region,
  Fiabilite,
} from "@/lib/types";
import { ALL_MONTHS, ALL_TYPES, ALL_REGIONS, ALL_FIABS } from "@/lib/constants";
import { filterEvents, serializeFilters, deserializeFilters } from "@/lib/filters";

function defaultFilters(): Filters {
  return {
    months: new Set<Month>(ALL_MONTHS),
    types: new Set<EventType>(ALL_TYPES),
    regions: new Set<Region>(ALL_REGIONS),
    fiabs: new Set<Fiabilite>(ALL_FIABS),
  };
}

export function useFilters(allEvents: CycloEvent[]) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState<Filters>(() => {
    const defaults = defaultFilters();
    const fromUrl = deserializeFilters(searchParams);
    return {
      months: fromUrl.months ?? defaults.months,
      types: fromUrl.types ?? defaults.types,
      regions: fromUrl.regions ?? defaults.regions,
      fiabs: fromUrl.fiabs ?? defaults.fiabs,
    };
  });

  useEffect(() => {
    const params = serializeFilters(filters);
    const str = params.toString();
    router.replace(str ? `?${str}` : "/", { scroll: false });
  }, [filters, router]);

  const toggle = useCallback(
    <T,>(key: keyof Filters) =>
      (value: T) => {
        setFilters((prev) => {
          const next = new Set(prev[key] as Set<T>);
          if (next.has(value)) next.delete(value);
          else next.add(value);
          return { ...prev, [key]: next };
        });
      },
    []
  );

  const toggleMonth = useMemo(() => toggle<Month>("months"), [toggle]);
  const toggleType = useMemo(() => toggle<EventType>("types"), [toggle]);
  const toggleRegion = useMemo(() => toggle<Region>("regions"), [toggle]);
  const toggleFiab = useMemo(() => toggle<Fiabilite>("fiabs"), [toggle]);

  const resetAll = useCallback(() => setFilters(defaultFilters()), []);

  const visibleEvents = useMemo(
    () => filterEvents(allEvents, filters),
    [allEvents, filters]
  );

  return {
    filters,
    toggleMonth,
    toggleType,
    toggleRegion,
    toggleFiab,
    resetAll,
    visibleEvents,
  };
}
