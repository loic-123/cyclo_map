import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cyclosportives 2026 — Carte interactive Mai→Août",
  description:
    "Toutes les cyclosportives en Ardèche, Drôme, Isère, Rhône, Vaucluse et Alpes-de-Haute-Provence entre mai et août 2026. Carte interactive avec filtres.",
  openGraph: {
    title: "Cyclosportives 2026 — Carte interactive",
    description:
      "20 événements cyclistes sur 6 départements du sud-est de la France",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
