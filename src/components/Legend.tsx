"use client";

import { MONTH_CONFIG } from "@/lib/constants";

export default function Legend() {
  return (
    <div
      className="absolute bottom-4 left-4 z-[1000] rounded-lg p-3 space-y-1.5 text-[11px]"
      style={{
        backgroundColor: "var(--surface)ee",
        border: "1px solid var(--border)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="text-[9px] uppercase tracking-widest font-semibold mb-1" style={{ color: "var(--text-3)" }}>
        Mois
      </div>
      {Object.entries(MONTH_CONFIG).map(([key, cfg]) => (
        <div key={key} className="flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: cfg.color }}
          />
          <span style={{ color: "var(--text-2)" }}>{cfg.label}</span>
        </div>
      ))}
    </div>
  );
}
