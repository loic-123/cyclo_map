"use client";

import type { CycloEvent, Month } from "@/lib/types";
import { MONTH_CONFIG } from "@/lib/constants";
import EventCard from "./EventCard";
import { useRef, useEffect } from "react";

interface EventListProps {
  events: CycloEvent[];
  hoveredEventId: number | null;
  selectedEventId: number | null;
  onHoverEvent: (id: number | null) => void;
  onSelectEvent: (id: number | null) => void;
}

const MONTH_ORDER: Month[] = ["mai", "juin", "juillet", "aout"];

export default function EventList({
  events,
  hoveredEventId,
  selectedEventId,
  onHoverEvent,
  onSelectEvent,
}: EventListProps) {
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Scroll to hovered card from map
  useEffect(() => {
    if (hoveredEventId !== null) {
      const el = cardRefs.current.get(hoveredEventId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [hoveredEventId]);

  const grouped = MONTH_ORDER.map((month) => ({
    month,
    config: MONTH_CONFIG[month],
    items: events.filter((e) => e.month === month),
  })).filter((g) => g.items.length > 0);

  if (events.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-center text-sm" style={{ color: "var(--text-3)" }}>
          Aucun événement ne correspond aux filtres.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {grouped.map(({ month, config, items }) => (
        <div key={month}>
          <div
            className="sticky top-0 z-10 flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm"
            style={{
              backgroundColor: "var(--surface)ee",
              color: config.color,
            }}
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            {config.label} 2026 ({items.length})
          </div>
          <div className="space-y-2 px-3 pb-3">
            {items.map((event) => (
              <div
                key={event.id}
                ref={(el) => {
                  if (el) cardRefs.current.set(event.id, el);
                }}
              >
                <EventCard
                  event={event}
                  isHovered={hoveredEventId === event.id}
                  isSelected={selectedEventId === event.id}
                  onHover={() => onHoverEvent(event.id)}
                  onLeave={() => onHoverEvent(null)}
                  onClick={() => onSelectEvent(event.id)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
