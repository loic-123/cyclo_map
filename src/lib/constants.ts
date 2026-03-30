export const MONTH_CONFIG = {
  mai: { label: "Mai", color: "#059669" },
  juin: { label: "Juin", color: "#D97706" },
  juillet: { label: "Juillet", color: "#DC2626" },
  aout: { label: "Août", color: "#2563EB" },
} as const;

export const TYPE_CONFIG = {
  CS: { label: "Cyclosportive", color: "#F97316" },
  GF: { label: "Granfondo", color: "#8B5CF6" },
  RC: { label: "Rando Cyclo", color: "#22C55E" },
  CLM: { label: "CLM", color: "#3B82F6" },
} as const;

export const REGION_CONFIG = {
  "Auvergne-Rhône-Alpes": { label: "AuRA", color: "#EF4444" },
  PACA: { label: "PACA", color: "#F59E0B" },
  Occitanie: { label: "Occitanie", color: "#EC4899" },
  "Nouvelle-Aquitaine": { label: "Nlle-Aquit.", color: "#8B5CF6" },
  "Bourgogne-Franche-Comté": { label: "BFC", color: "#10B981" },
  "Grand Est": { label: "Grand Est", color: "#3B82F6" },
  Bretagne: { label: "Bretagne", color: "#06B6D4" },
  Normandie: { label: "Normandie", color: "#84CC16" },
  "Île-de-France": { label: "IdF", color: "#F97316" },
  "Pays de la Loire": { label: "PdL", color: "#14B8A6" },
  "Hauts-de-France": { label: "HdF", color: "#A855F7" },
} as const;

export const FIAB_CONFIG = {
  confirmed: {
    label: "Confirmé",
    emoji: "✅",
    color: "#064E3B",
    description: "Date confirmée par le site officiel",
  },
  probable: {
    label: "Probable",
    emoji: "🟡",
    color: "#713F12",
    description: "Date probable (2+ sources concordantes)",
  },
  uncertain: {
    label: "Incertain",
    emoji: "🟠",
    color: "#7C2D12",
    description: "Date incertaine — contacter l'organisateur",
  },
} as const;

export const MAP_CENTER = { lat: 46.5, lng: 2.5 };
export const MAP_ZOOM = 5.5;

export const ALL_MONTHS = Object.keys(MONTH_CONFIG) as Array<
  keyof typeof MONTH_CONFIG
>;
export const ALL_TYPES = Object.keys(TYPE_CONFIG) as Array<
  keyof typeof TYPE_CONFIG
>;
export const ALL_REGIONS = Object.keys(REGION_CONFIG) as Array<
  keyof typeof REGION_CONFIG
>;
export const ALL_FIABS = Object.keys(FIAB_CONFIG) as Array<
  keyof typeof FIAB_CONFIG
>;
