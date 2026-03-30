import type { CycloEvent, Filters } from "./types";

export function filterEvents(
  events: CycloEvent[],
  filters: Filters
): CycloEvent[] {
  return events.filter(
    (e) =>
      filters.months.has(e.month) &&
      filters.types.has(e.type) &&
      filters.regions.has(e.region) &&
      filters.fiabs.has(e.fiabilite)
  );
}

export function serializeFilters(filters: Filters): URLSearchParams {
  const params = new URLSearchParams();
  const { months, types, regions, fiabs } = filters;
  if (months.size < 4) params.set("months", [...months].join(","));
  if (types.size < 4) params.set("types", [...types].join(","));
  if (regions.size < 11) params.set("regions", [...regions].join(","));
  if (fiabs.size < 3) params.set("fiabs", [...fiabs].join(","));
  return params;
}

export function deserializeFilters(params: URLSearchParams): Partial<Filters> {
  const result: Partial<Filters> = {};
  const m = params.get("months");
  if (m) result.months = new Set(m.split(",")) as Filters["months"];
  const t = params.get("types");
  if (t) result.types = new Set(t.split(",")) as Filters["types"];
  const r = params.get("regions");
  if (r) result.regions = new Set(r.split(",")) as Filters["regions"];
  const f = params.get("fiabs");
  if (f) result.fiabs = new Set(f.split(",")) as Filters["fiabs"];
  return result;
}
