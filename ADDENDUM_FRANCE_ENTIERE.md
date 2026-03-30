# ADDENDUM — Données France entière

## Contexte

Le fichier `events.json` a été étendu pour couvrir **toute la France** du **1er mai au 31 août 2026**. Il contient désormais **87 cyclosportives** issues du croisement de 5 sources :

- velo-cyclosport.com (calendrier national de référence)
- Battistrada.com (calendrier européen)
- Sports'N Connect (inscriptions)
- Finishers.com (fiches événements)
- Sites officiels des événements majeurs

---

## Modifications au schéma

Le champ `region` a été ajouté au type `CycloEvent` :

```typescript
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
  // ... tous les champs existants du brief principal ...
  region: Region;  // NOUVEAU — région administrative
}
```

---

## Filtres à ajouter

Le `FilterBar` doit être étendu avec un 5e filtre **Région** :

```typescript
export const REGION_CONFIG = {
  "Auvergne-Rhône-Alpes": { label: "AuRA", color: "#EF4444" },
  "PACA":                  { label: "PACA", color: "#F59E0B" },
  "Occitanie":             { label: "Occitanie", color: "#EC4899" },
  "Nouvelle-Aquitaine":    { label: "Nlle-Aquit.", color: "#8B5CF6" },
  "Bourgogne-Franche-Comté": { label: "BFC", color: "#10B981" },
  "Grand Est":             { label: "Grand Est", color: "#3B82F6" },
  "Bretagne":              { label: "Bretagne", color: "#06B6D4" },
  "Normandie":             { label: "Normandie", color: "#84CC16" },
  "Île-de-France":         { label: "IdF", color: "#F97316" },
  "Pays de la Loire":      { label: "PdL", color: "#14B8A6" },
  "Hauts-de-France":       { label: "HdF", color: "#A855F7" },
} as const;
```

Le filtre Région se combine en AND avec les autres filtres (mois AND type AND region AND dept AND fiab), et en OR au sein de la catégorie région.

---

## Carte — Ajustements

Avec 78 événements répartis sur toute la France :

1. **Centre initial** : changer pour `{ lat: 46.5, lng: 2.5 }` et zoom `5.5` (vue France entière)
2. **Clustering** : activer `clusterRadius: 50` — indispensable car beaucoup d'événements se concentrent dans les Alpes et les Pyrénées
3. **Zoom régional** : quand l'utilisateur filtre sur une seule région, faire un `fitBounds` automatique avec padding 60px

---

## Répartition des 78 événements

| Mois | Nb événements |
|------|---------------|
| Mai | 28 |
| Juin | 28 |
| Juillet | 16 |
| Août | 15 |
| **Total** | **87** |

| Région | Nb événements |
|--------|---------------|
| Auvergne-Rhône-Alpes | 33 |
| PACA | 12 |
| Occitanie | 10 |
| Bourgogne-Franche-Comté | 10 |
| Grand Est | 8 |
| Nouvelle-Aquitaine | 7 |
| Bretagne | 2 |
| Normandie | 2 |
| Pays de la Loire | 2 |
| Île-de-France | 1 |

---

## URL Search Params — Extension

Le filtre région doit aussi être sérialisé dans l'URL :

```
?months=juin,juillet&regions=Auvergne-Rhône-Alpes,PACA&types=CS,GF
```

---

## Checklist additionnelle

- [ ] Les 87 événements s'affichent correctement sur la carte France entière
- [ ] Le clustering fonctionne (surtout Alpes / Pyrénées / Jura)
- [ ] Le filtre Région fonctionne et se combine avec les autres
- [ ] Le fitBounds s'adapte quand on filtre une seule région
- [ ] Les événements hors métropole (si ajoutés ultérieurement) sont gérés
- [ ] La performance reste fluide avec 87+ marqueurs + clustering
- [ ] Les 20 événements régionaux initiaux (07/26/38/69/84/04) sont tous présents (vérifié par script)
