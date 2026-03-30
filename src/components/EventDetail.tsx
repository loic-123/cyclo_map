"use client";

import type { CycloEvent } from "@/lib/types";
import { TYPE_CONFIG, FIAB_CONFIG, DEPT_CONFIG, MONTH_CONFIG } from "@/lib/constants";

interface EventDetailProps {
  event: CycloEvent;
  onClose: () => void;
}

export default function EventDetail({ event, onClose }: EventDetailProps) {
  const typeCfg = TYPE_CONFIG[event.type];
  const fiabCfg = FIAB_CONFIG[event.fiabilite];
  const monthColor = MONTH_CONFIG[event.month].color;

  return (
    <div
      className="absolute top-4 right-4 z-[1000] w-80 rounded-xl overflow-hidden animate-slide-in"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      {/* Header band */}
      <div className="h-1" style={{ backgroundColor: monthColor }} />

      <div className="p-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 h-6 w-6 rounded-full flex items-center justify-center text-sm cursor-pointer hover:bg-white/10 transition-colors"
          style={{ color: "var(--text-3)" }}
        >
          ×
        </button>

        {/* Title + badge */}
        <div className="flex items-start gap-2 pr-6">
          <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>
            {event.name}
          </h2>
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase mt-1"
            style={{
              backgroundColor: `${typeCfg.color}25`,
              color: typeCfg.color,
            }}
          >
            {typeCfg.label}
          </span>
        </div>

        {/* Info rows */}
        <div className="mt-3 space-y-2 text-[12px]" style={{ color: "var(--text-2)" }}>
          <div>📅 {event.date} · {event.jour}</div>
          <div>📍 {event.lieu} ({DEPT_CONFIG[event.dept].label})</div>
          <div>🚴 {event.distancesLabel}</div>
          <div>{fiabCfg.emoji} {fiabCfg.description}</div>
        </div>

        {event.notes && (
          <div className="mt-3 text-[11px] italic" style={{ color: "var(--text-3)" }}>
            {event.notes}
          </div>
        )}

        {/* Fiabilité banner */}
        <div
          className="mt-3 rounded-lg px-3 py-2 text-[11px]"
          style={{
            backgroundColor: `${fiabCfg.color}30`,
            color: "var(--text-2)",
          }}
        >
          {event.fiabilite === "confirmed" && "Date confirmée — inscriptions possibles"}
          {event.fiabilite === "probable" && "Date probable — à confirmer prochainement"}
          {event.fiabilite === "uncertain" && "Date incertaine — contacter l'organisateur"}
        </div>

        {/* Link */}
        {event.url && (
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium hover:underline"
            style={{ color: "var(--accent)" }}
          >
            Site officiel →
          </a>
        )}
      </div>
    </div>
  );
}
