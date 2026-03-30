export type Month = "mai" | "juin" | "juillet" | "aout";
export type EventType = "CS" | "GF" | "RC" | "CLM";
export type Fiabilite = "confirmed" | "probable" | "uncertain";
export type DeptCode = "07" | "26" | "38" | "69" | "84" | "04";

export interface Distance {
  km: number;
  denivele: number | null;
}

export interface CycloEvent {
  id: number;
  name: string;
  date: string;
  dateISO: string | null;
  jour: string;
  month: Month;
  lieu: string;
  dept: DeptCode;
  type: EventType;
  distances: Distance[];
  distancesLabel: string;
  fiabilite: Fiabilite;
  lat: number;
  lng: number;
  url: string | null;
  notes: string | null;
}

export interface Filters {
  months: Set<Month>;
  types: Set<EventType>;
  depts: Set<DeptCode>;
  fiabs: Set<Fiabilite>;
}
