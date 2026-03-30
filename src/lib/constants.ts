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

export const DEPT_CONFIG = {
  "07": { label: "Ardèche" },
  "26": { label: "Drôme" },
  "38": { label: "Isère" },
  "69": { label: "Rhône" },
  "84": { label: "Vaucluse" },
  "04": { label: "Alpes-HP" },
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

export const MAP_CENTER = { lat: 44.8, lng: 5.5 };
export const MAP_ZOOM = 7.5;

export const ALL_MONTHS = Object.keys(MONTH_CONFIG) as Array<
  keyof typeof MONTH_CONFIG
>;
export const ALL_TYPES = Object.keys(TYPE_CONFIG) as Array<
  keyof typeof TYPE_CONFIG
>;
export const ALL_DEPTS = Object.keys(DEPT_CONFIG) as Array<
  keyof typeof DEPT_CONFIG
>;
export const ALL_FIABS = Object.keys(FIAB_CONFIG) as Array<
  keyof typeof FIAB_CONFIG
>;
