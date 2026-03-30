"use client";

import type { CycloEvent } from "@/lib/types";
import { MONTH_CONFIG, TYPE_CONFIG, FIAB_CONFIG, DEPT_CONFIG } from "@/lib/constants";

interface EventCardProps {
  event: CycloEvent;
  isHovered: boolean;
  isSelected: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}

export default function EventCard({
  event,
  isHovered,
  isSelected,
  onHover,
  onLeave,
  onClick,
}: EventCardProps) {
  const monthColor = MONTH_CONFIG[event.month].color;
  const typeCfg = TYPE_CONFIG[event.type];
  const fiabEmoji = FIAB_CONFIG[event.fiabilite].emoji;

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
      className="relative cursor-pointer rounded-lg p-3 transition-all duration-200"
      style={{
        backgroundColor: isHovered || isSelected ? "var(--surface-3)" : "var(--surface-2)",
        borderLeft: `3px solid ${monthColor}`,
        border: isSelected
          ? "1px solid var(--accent)"
          : isHovered
            ? "1px solid var(--border-hover)"
            : "1px solid var(--border)",
        borderLeftWidth: "3px",
        borderLeftColor: monthColor,
        transform: isHovered ? "translateX(3px)" : "none",
        boxShadow: isSelected ? "0 0 12px var(--accent-glow)" : "none",
      }}
    >
      {/* Fiabilité emoji */}
      <span className="absolute top-2 right-2 text-xs">{fiabEmoji}</span>

      {/* Ligne 1: nom + badge type */}
      <div className="flex items-start gap-2 pr-6">
        <span className="text-[13px] font-bold leading-tight" style={{ color: "var(--text)" }}>
          {event.name}
        </span>
        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase"
          style={{
            backgroundColor: `${typeCfg.color}25`,
            color: typeCfg.color,
          }}
        >
          {event.type}
        </span>
      </div>

      {/* Ligne 2: date + lieu */}
      <div className="mt-1.5 text-[11px]" style={{ color: "var(--text-2)" }}>
        <span>📅 {event.date} · {event.jour}</span>
        <span className="ml-3">📍 {event.lieu} ({DEPT_CONFIG[event.dept].label})</span>
      </div>

      {/* Ligne 3: distances */}
      <div className="mt-1 text-[11px]" style={{ color: "var(--text-3)" }}>
        {event.distancesLabel}
      </div>
    </div>
  );
}
