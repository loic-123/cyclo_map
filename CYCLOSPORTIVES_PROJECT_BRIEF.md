# CYCLOSPORTIVES 2026 — Carte Interactive

## Contexte

Application web interactive affichant toutes les cyclosportives entre le 8 mai et le 28 août 2026 dans 6 départements du sud-est de la France (Ardèche 07, Drôme 26, Isère 38, Rhône 69, Vaucluse 84, Alpes-de-Haute-Provence 04) sur une carte avec filtres et liste latérale.

L'utilisateur cible est un cycliste compétiteur qui veut visualiser rapidement les événements disponibles, les filtrer, et accéder aux infos clés (date, lieu, distances, dénivelé, fiabilité de la date).

---

## Stack technique

- **Framework** : Next.js 14+ (App Router)
- **Langage** : TypeScript
- **Carte** : Mapbox GL JS (token à mettre en `.env.local` sous `NEXT_PUBLIC_MAPBOX_TOKEN`) — style dark `mapbox://styles/mapbox/dark-v11`
- **Styling** : Tailwind CSS 4
- **State management** : React state + URL search params (pour partager un état filtré via URL)
- **Données** : fichier JSON statique dans `/src/data/events.json` (pas de base de données)
- **Déploiement** : Vercel
- **Package manager** : pnpm

---

## Structure du projet

```
cyclosportives-2026/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Layout racine, metadata, fonts
│   │   ├── page.tsx            # Page unique (SSR du JSON, rendu client pour la carte)
│   │   └── globals.css         # Tailwind + custom CSS variables
│   ├── components/
│   │   ├── Map.tsx             # Composant carte Mapbox (client component "use client")
│   │   ├── Sidebar.tsx         # Sidebar : filtres + event list
│   │   ├── FilterBar.tsx       # Barre de filtres (mois, type, dept, fiabilité)
│   │   ├── FilterChip.tsx      # Chip toggle individuel
│   │   ├── EventList.tsx       # Liste scrollable des événements groupés par mois
│   │   ├── EventCard.tsx       # Carte d'un événement dans la sidebar
│   │   ├── EventPopup.tsx      # Contenu du popup Mapbox au clic sur un marqueur
│   │   ├── EventDetail.tsx     # Panneau détail (overlay sur la carte au clic)
│   │   ├── StatsBar.tsx        # Compteurs (affichés, total, départements)
│   │   └── Legend.tsx           # Légende couleurs en bas à gauche de la carte
│   ├── data/
│   │   └── events.json         # Source de données (voir schéma ci-dessous)
│   ├── lib/
│   │   ├── types.ts            # Types TypeScript
│   │   ├── constants.ts        # Couleurs, labels, mappings dept/mois/type
│   │   └── filters.ts          # Logique de filtrage + sérialisation URL
│   └── hooks/
│       ├── useFilters.ts       # Hook custom pour gérer l'état des filtres + sync URL
│       └── useMapInteraction.ts # Hook pour la communication sidebar ↔ carte
├── public/
│   └── og-image.png            # Image OpenGraph pour les partages
├── .env.local                  # NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

---

## Schéma de données : `events.json`

```json
[
  {
    "id": 1,
    "name": "Course de la Résistance",
    "date": "8 mai",
    "dateISO": "2026-05-08",
    "jour": "Vendredi (férié)",
    "month": "mai",
    "lieu": "La Côte-Saint-André",
    "dept": "38",
    "type": "RC",
    "distances": [
      { "km": 105, "denivele": null },
      { "km": 66, "denivele": null },
      { "km": 36, "denivele": null }
    ],
    "distancesLabel": "105, 66, 36 km + trail/marche",
    "fiabilite": "confirmed",
    "lat": 45.3947,
    "lng": 5.2611,
    "url": null,
    "notes": "Événement multi-sport (vélo route + trail + marche)"
  }
]
```

### Types TypeScript (`lib/types.ts`)

```typescript
export type Month = "mai" | "juin" | "juillet" | "aout";
export type EventType = "CS" | "GF" | "RC" | "CLM";
export type Fiabilite = "confirmed" | "probable" | "uncertain";
export type DeptCode = "07" | "26" | "38" | "69" | "84" | "04";

export interface Distance {
  km: number;
  denivele: number | null; // en mètres D+
}

export interface CycloEvent {
  id: number;
  name: string;
  date: string;           // affichage humain : "8 mai", "6-7 juin", "~début juil."
  dateISO: string | null; // "2026-05-08" ou null si date incertaine
  jour: string;           // "Vendredi (férié)", "Samedi", "Sam-Dim"
  month: Month;
  lieu: string;
  dept: DeptCode;
  type: EventType;
  distances: Distance[];
  distancesLabel: string; // résumé texte pour l'affichage compact
  fiabilite: Fiabilite;
  lat: number;
  lng: number;
  url: string | null;     // lien vers le site officiel de l'événement
  notes: string | null;   // info complémentaire libre
}

export interface Filters {
  months: Set<Month>;
  types: Set<EventType>;
  depts: Set<DeptCode>;
  fiabs: Set<Fiabilite>;
}
```

---

## Constantes (`lib/constants.ts`)

```typescript
export const MONTH_CONFIG = {
  mai:      { label: "Mai",      color: "#059669" },
  juin:     { label: "Juin",     color: "#D97706" },
  juillet:  { label: "Juillet",  color: "#DC2626" },
  aout:     { label: "Août",     color: "#2563EB" },
} as const;

export const TYPE_CONFIG = {
  CS:  { label: "Cyclosportive", color: "#F97316" },
  GF:  { label: "Granfondo",     color: "#8B5CF6" },
  RC:  { label: "Rando Cyclo",   color: "#22C55E" },
  CLM: { label: "CLM",           color: "#3B82F6" },
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
  confirmed:  { label: "✅ Confirmé",  color: "#064E3B", description: "Date confirmée par le site officiel" },
  probable:   { label: "🟡 Probable",   color: "#713F12", description: "Date probable (2+ sources concordantes)" },
  uncertain:  { label: "🟠 Incertain",  color: "#7C2D12", description: "Date incertaine — contacter l'organisateur" },
} as const;

// Centre et zoom initial de la carte (couvre les 6 départements)
export const MAP_CENTER = { lat: 44.8, lng: 5.5 };
export const MAP_ZOOM = 7.5;
```

---

## Données complètes des 20 événements

Voici les 20 événements à mettre dans `events.json`. Les coordonnées GPS sont précises au lieu de départ.

| id | name | date | dateISO | jour | month | lieu | dept | type | distancesLabel | fiabilite | lat | lng |
|----|------|------|---------|------|-------|------|------|------|----------------|-----------|-----|-----|
| 1 | Course de la Résistance | 8 mai | 2026-05-08 | Vendredi (férié) | mai | La Côte-Saint-André | 38 | RC | 105, 66, 36 km + trail/marche | confirmed | 45.3947 | 5.2611 |
| 2 | Les 3 Cols materiel-velo.com | 14 mai | 2026-05-14 | Jeudi (Ascension) | mai | La Tour-de-Salvagny | 69 | CS | 143, 93, 56 km | probable | 45.8125 | 4.7178 |
| 3 | Le Rallye de La Roanne | 14 mai | 2026-05-14 | Jeudi (Ascension) | mai | Crest | 26 | RC | 166, 132, 94, 56 km (route+VTT) | probable | 44.7289 | 5.0239 |
| 4 | Rando des Collines | 16 mai | 2026-05-16 | Samedi | mai | Beaucroissant | 38 | RC | Route + VTT | probable | 45.3378 | 5.5058 |
| 5 | Les Boucles du Verdon | 17 mai | 2026-05-17 | Dimanche | mai | Gréoux-les-Bains | 04 | CS | 152 km (2150 D+), 105 km, 80 km | confirmed | 43.7583 | 5.8831 |
| 6 | GFNY Villard-de-Lans | 24 mai | 2026-05-24 | Dimanche | mai | Villard-de-Lans | 38 | GF | 163, 70 km (Vercors) | confirmed | 45.0713 | 5.5508 |
| 7 | Colnago GF Mont Ventoux | 6-7 juin | 2026-06-07 | Sam-Dim | juin | Vaison-la-Romaine | 84 | GF | Gravel sam. Route dim: 135 (3200 D+), 106, 80 km | confirmed | 44.2414 | 5.0672 |
| 8 | L'Ardéchoise | 13 juin | 2026-06-13 | Samedi | juin | Saint-Félicien | 07 | CS | 85 à 285 km (event 9→13 juin) | confirmed | 45.0839 | 4.6297 |
| 9 | GFNY La Vaujany Alpe d'Huez | 21 juin | 2026-06-21 | Dimanche | juin | Vaujany | 38 | GF | 151, 60 km | confirmed | 45.1583 | 6.0786 |
| 10 | La Tricolore – Défi des Vals | 27 juin | 2026-06-27 | Samedi | juin | Les Abrets en Dauphiné | 38 | CS | 116 km (1843 D+), 56, 17 km | probable | 45.5392 | 5.5842 |
| 11 | La Provençale Cyclo | 27 juin | 2026-06-27 | Samedi | juin | Manosque | 04 | CS | 166 km (3100 D+), 106, 74 km | confirmed | 43.8328 | 5.7864 |
| 12 | Marmotte Granfondo Alpes | 28 juin | 2026-06-28 | Dimanche | juin | Bourg-d'Oisans | 38 | GF | 177 km / 5000 m D+ → Alpe d'Huez | confirmed | 45.0544 | 6.0328 |
| 13 | La Grenobloise Cyclosportive | ~début juil. | null | Dimanche (prob.) | juillet | Eybens | 38 | CS | 130 (3450 D+), 91, 43 km | uncertain | 45.1511 | 5.7489 |
| 14 | L'Étape du Tour de France | 19 juillet | 2026-07-19 | Dimanche | juillet | Bourg-d'Oisans | 38 | CS | 170 km / 5400 m D+ → Alpe d'Huez | confirmed | 45.0560 | 6.0290 |
| 15 | GF PraLoup | 26 juillet | 2026-07-26 | Dimanche | juillet | Pra Loup | 04 | CS | Parcours en définition | confirmed | 44.3611 | 6.6019 |
| 16 | Dona Vierna | ~août | null | Week-end (prob.) | aout | Bourg-Saint-Andéol | 07 | RC | 100, 25, 14 km | uncertain | 44.3728 | 4.6408 |
| 17 | Challenge Montagne de Lure | ~août | null | Week-end (prob.) | aout | Manosque | 04 | CLM | 48 km | uncertain | 43.8340 | 5.7880 |
| 18 | Randonnée de la Liore | 22 août | 2026-08-22 | Samedi | aout | Barbières | 26 | RC | 133, 92, 61 km (route+VTT+gravel) | probable | 44.9478 | 5.1469 |
| 19 | Climbing for Life Alpe d'Huez | 22-23 août | 2026-08-22 | Sam-Dim | aout | Huez | 38 | CS | 107, 94, 71, 51 km (caritatif) | probable | 45.0919 | 6.0647 |
| 20 | GFNY Alpes Vaujany Croix de Fer | ~23-24 août | 2026-08-23 | Dimanche (prob.) | aout | Vaujany | 38 | GF | 120, 45 km | probable | 45.1560 | 6.0806 |

---

## Composants — Spécifications détaillées

### `Map.tsx`

Composant client (`"use client"`) qui rend une carte Mapbox GL JS pleine largeur.

**Comportement :**
- Style : `mapbox://styles/mapbox/dark-v11`
- Centre initial : `[5.5, 44.8]`, zoom `7.5`
- Les événements sont rendus comme une **source GeoJSON** avec un **layer de type `circle`**
- La couleur du cercle dépend du `month` (utiliser une expression `match` Mapbox)
- Taille du cercle : `8px` par défaut, `14px` au hover
- Au **hover** sur un marqueur : afficher un popup léger avec le nom et la date
- Au **clic** sur un marqueur : ouvrir le panneau `EventDetail` et centrer la carte avec `flyTo` (zoom 11, durée 800ms)
- Les marqueurs d'événements proches (Bourg-d'Oisans / Vaujany / Huez) risquent de se chevaucher → activer le **clustering** Mapbox avec `clusterRadius: 40` et afficher le nombre d'événements dans le cluster
- Quand un événement est survolé dans la sidebar (prop `hoveredEventId`) : grossir le marqueur correspondant et afficher son nom
- La carte doit se **refit** sur les bounds des événements visibles quand les filtres changent (avec `fitBounds` et un padding de 60px)

**Props :**
```typescript
interface MapProps {
  events: CycloEvent[];
  hoveredEventId: number | null;
  selectedEventId: number | null;
  onHoverEvent: (id: number | null) => void;
  onSelectEvent: (id: number | null) => void;
}
```

### `Sidebar.tsx`

Panneau latéral à gauche (largeur fixe 420px desktop, pleine largeur mobile).

**Contenu vertical :**
1. Header avec titre + `StatsBar`
2. `FilterBar` (toujours visible, ne scrolle pas)
3. `EventList` (scrollable, prend le reste de la hauteur)

### `FilterBar.tsx`

4 rangées de `FilterChip` :
1. **Mois** : Mai, Juin, Juillet, Août — chaque chip prend la couleur du mois quand actif
2. **Type** : CS, GF, RC, CLM — chaque chip prend la couleur du type quand actif
3. **Département** : 07, 26, 38, 69, 84, 04 — afficher le nom court ("Ardèche", "Isère"...)
4. **Fiabilité** : Confirmé, Probable, Incertain

Chaque chip affiche aussi le **count** d'événements correspondants entre parenthèses (recalculé dynamiquement après filtrage croisé).

**Comportement** : tous les filtres sont actifs par défaut (= tout affiché). Cliquer toggle un filtre. Les filtres se combinent en AND entre catégories (mois AND type AND dept AND fiab) et en OR au sein d'une catégorie (mai OR juin).

### `FilterChip.tsx`

```typescript
interface FilterChipProps {
  label: string;
  count: number;
  active: boolean;
  accentColor?: string;  // couleur quand actif
  onClick: () => void;
}
```

Style : `border-radius: 9999px`, fond transparent quand inactif, fond accent à 20% d'opacité + bordure accent quand actif.

### `EventList.tsx`

Liste des événements visibles (après filtrage), groupés par mois avec des sticky month headers.

Chaque section mois a :
- Un header sticky avec un point de couleur + "Mai 2026 (N)"
- Les `EventCard` des événements de ce mois

Si aucun événement visible → afficher un message "Aucun événement ne correspond aux filtres".

### `EventCard.tsx`

```typescript
interface EventCardProps {
  event: CycloEvent;
  isHovered: boolean;
  isSelected: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}
```

**Style :**
- Fond sombre (#15181F), bordure fine
- Bordure gauche de 3px colorée selon le mois
- Au hover : translateX(3px), bordure orange, fond légèrement plus clair
- Quand sélectionné : bordure orange, glow subtil
- Contenu :
  - Ligne 1 : **nom** (bold) + badge type (pill colorée, à droite)
  - Ligne 2 : 📅 date · jour &nbsp; 📍 lieu (dept)
  - Ligne 3 : distances en gris clair
  - Emoji fiabilité en coin supérieur droit

### `EventDetail.tsx`

Panneau overlay positionné en haut à droite de la carte (position absolute).

Affiché seulement quand `selectedEventId !== null`. Bouton × pour fermer.

Contenu :
- Nom de l'événement (titre gros)
- Badge type (pill colorée)
- 4 lignes d'info : date, lieu, distances, fiabilité
- Bandeau en bas avec message contextuel selon la fiabilité
- Si `url` disponible : bouton "Site officiel →" qui ouvre dans un nouvel onglet

### `Legend.tsx`

Petit panneau en bas à gauche de la carte avec les 4 couleurs de mois.

### `StatsBar.tsx`

3 mini compteurs : événements affichés / total / départements.

---

## Hook `useFilters.ts`

```typescript
function useFilters(): {
  filters: Filters;
  toggleMonth: (m: Month) => void;
  toggleType: (t: EventType) => void;
  toggleDept: (d: DeptCode) => void;
  toggleFiab: (f: Fiabilite) => void;
  resetAll: () => void;
  visibleEvents: CycloEvent[];  // events filtrés
}
```

**Sync URL** : les filtres actifs sont encodés dans les query params pour que l'utilisateur puisse partager un lien filtré. Exemple : `?months=mai,juin&types=CS,GF&depts=38`. Si un param est absent → tous les filtres de cette catégorie sont actifs (état par défaut). Utiliser `useSearchParams` de Next.js.

---

## Hook `useMapInteraction.ts`

Gère la communication bidirectionnelle entre la sidebar et la carte :

```typescript
function useMapInteraction(): {
  hoveredEventId: number | null;
  selectedEventId: number | null;
  setHoveredEventId: (id: number | null) => void;
  setSelectedEventId: (id: number | null) => void;
}
```

Quand `hoveredEventId` change :
- La carte grossit le marqueur correspondant
- La sidebar scroll vers la carte correspondante et la highlight

Quand `selectedEventId` change :
- La carte fait un `flyTo` vers le marqueur
- Le `EventDetail` s'affiche

---

## Design system

### Palette (CSS variables dans `globals.css`)

```css
:root {
  --bg: #0B0D10;
  --surface: #111318;
  --surface-2: #15181F;
  --surface-3: #1A1F2B;
  --border: #1F2937;
  --border-hover: #2D3748;
  --text: #E5E7EB;
  --text-2: #9CA3AF;
  --text-3: #6B7280;
  --text-4: #4B5563;
  --accent: #F97316;
  --accent-glow: rgba(249, 115, 22, 0.12);
  --radius: 10px;
  --radius-sm: 6px;
  --radius-pill: 9999px;
}
```

### Typographie

- Font principale : `"DM Sans"` (Google Fonts, weight 300/400/500/700)
- Font titres/logo : `"Instrument Serif"` (Google Fonts, italic disponible)
- Taille de base : 14px
- Noms d'événements : 13-14px, font-weight 700
- Méta-données : 11-12px, couleur text-3
- Labels filtres : 10px, uppercase, letter-spacing 0.1em

### Responsive

- **Desktop (>900px)** : sidebar 420px à gauche + carte prend le reste
- **Tablette (600-900px)** : sidebar 340px
- **Mobile (<600px)** : layout en colonne. Carte en haut (45vh), sidebar en bas (scrollable). Les filtres deviennent un drawer/bottom sheet accessible via un bouton flottant "Filtres" pour économiser l'espace vertical.

---

## Interactions et animations

1. **Chips de filtre** : transition 200ms sur background, border-color, color
2. **Event cards** : transition 200ms sur transform, border-color, box-shadow
3. **Marqueurs carte** :
   - Taille par défaut → hover : transition CSS de 8px à 14px
   - Marqueur sélectionné : animation pulse (scale 1 → 1.15 → 1, durée 1.5s, infinite)
   - Glow radial autour du marqueur actif (cercle semi-transparent animé)
4. **EventDetail** : apparition avec animation slide-in depuis la droite (200ms ease-out)
5. **flyTo** : durée 800ms avec easing par défaut de Mapbox
6. **fitBounds** au changement de filtres : padding 60px, durée 500ms
7. **Scroll-to-card** dans la sidebar quand un marqueur est survolé sur la carte : `scrollIntoView({ behavior: 'smooth', block: 'nearest' })`

---

## SEO et Metadata

```typescript
// app/layout.tsx
export const metadata = {
  title: "Cyclosportives 2026 — Carte interactive Mai→Août",
  description: "Toutes les cyclosportives en Ardèche, Drôme, Isère, Rhône, Vaucluse et Alpes-de-Haute-Provence entre mai et août 2026. Carte interactive avec filtres.",
  openGraph: {
    title: "Cyclosportives 2026 — Carte interactive",
    description: "20 événements cyclistes sur 6 départements du sud-est de la France",
    images: ["/og-image.png"],
  },
};
```

---

## Commandes de setup

```bash
pnpm create next-app@latest cyclosportives-2026 --typescript --tailwind --app --src-dir
cd cyclosportives-2026
pnpm add mapbox-gl
pnpm add -D @types/mapbox-gl
```

Créer `.env.local` :
```
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1Ijoi...
```

---

## Déploiement Vercel

```bash
pnpm install -g vercel
vercel
```

S'assurer que la variable d'environnement `NEXT_PUBLIC_MAPBOX_TOKEN` est configurée dans les settings Vercel du projet.

---

## Checklist de validation

- [ ] La carte s'affiche correctement avec le fond dark Mapbox
- [ ] Les 20 marqueurs sont positionnés aux bonnes coordonnées
- [ ] Les couleurs des marqueurs correspondent aux mois
- [ ] Le clustering fonctionne pour les événements proches (Bourg-d'Oisans / Vaujany / Huez)
- [ ] Les 4 filtres fonctionnent et se combinent correctement (AND entre catégories, OR dans une catégorie)
- [ ] Les compteurs dans StatsBar se mettent à jour en temps réel
- [ ] Le hover sidebar → carte fonctionne (marqueur grossit)
- [ ] Le hover carte → sidebar fonctionne (card highlighted + scroll)
- [ ] Le clic carte → flyTo + EventDetail fonctionne
- [ ] Le clic sidebar → flyTo + EventDetail fonctionne
- [ ] Les filtres sont persistés dans l'URL (partage possible)
- [ ] Le fitBounds se recalcule quand les filtres changent
- [ ] L'EventDetail affiche toutes les infos + bouton site officiel si url disponible
- [ ] Le responsive fonctionne sur mobile (layout colonne)
- [ ] Les animations sont fluides (pas de jank)
- [ ] Le build `pnpm build` passe sans erreur
- [ ] Le déploiement Vercel fonctionne
