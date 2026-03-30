export type Month = "mai" | "juin" | "juillet" | "aout";
export type EventType = "CS" | "GF" | "RC" | "CLM";
export type Fiabilite = "confirmed" | "probable" | "uncertain";
export type DeptCode = string;

export type Region =
  | "Auvergne-Rhône-Alpes"
  | "PACA"
  | "Occitanie"
  | "Nouvelle-Aquitaine"
  | "Bourgogne-Franche-Comté"
  | "Grand Est"
  | "Bretagne"
  | "Normandie"
  | "Île-de-France"
  | "Pays de la Loire"
  | "Hauts-de-France";

export interface CycloEvent {
  id: number;
  name: string;
  date: string;
  dateISO: string | null;
  jour: string;
  month: Month;
  lieu: string;
  dept: DeptCode;
  region: Region;
  type: EventType;
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
  regions: Set<Region>;
  fiabs: Set<Fiabilite>;
}
