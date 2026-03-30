"use client";

import type { CycloEvent, Filters, Month, EventType, Region, Fiabilite } from "@/lib/types";
import StatsBar from "./StatsBar";
import FilterBar from "./FilterBar";
import EventList from "./EventList";

interface SidebarProps {
  allEvents: CycloEvent[];
  visibleEvents: CycloEvent[];
  filters: Filters;
  toggleMonth: (m: Month) => void;
  toggleType: (t: EventType) => void;
  toggleRegion: (r: Region) => void;
  toggleFiab: (f: Fiabilite) => void;
  setAll: <T>(key: keyof Filters, values: T[]) => void;
  clearCategory: (key: keyof Filters) => void;
  resetAll: () => void;
  hoveredEventId: number | null;
  selectedEventId: number | null;
  onHoverEvent: (id: number | null) => void;
  onSelectEvent: (id: number | null) => void;
}

export default function Sidebar({
  allEvents,
  visibleEvents,
  filters,
  toggleMonth,
  toggleType,
  toggleRegion,
  toggleFiab,
  setAll,
  clearCategory,
  resetAll,
  hoveredEventId,
  selectedEventId,
  onHoverEvent,
  onSelectEvent,
}: SidebarProps) {
  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: "var(--surface)" }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h1
          className="text-xl leading-tight"
          style={{ fontFamily: "'Instrument Serif', serif", color: "var(--text)" }}
        >
          Cyclosportives{" "}
          <span style={{ color: "var(--accent)" }}>2026</span>
        </h1>
        <p className="text-[11px] mt-0.5" style={{ color: "var(--text-3)" }}>
          Mai → Août · France entière
        </p>
      </div>

      <StatsBar
        visibleCount={visibleEvents.length}
        totalCount={allEvents.length}
        events={visibleEvents}
      />

      <FilterBar
        allEvents={allEvents}
        filters={filters}
        toggleMonth={toggleMonth}
        toggleType={toggleType}
        toggleRegion={toggleRegion}
        toggleFiab={toggleFiab}
        setAll={setAll}
        clearCategory={clearCategory}
        resetAll={resetAll}
      />

      <EventList
        events={visibleEvents}
        hoveredEventId={hoveredEventId}
        selectedEventId={selectedEventId}
        onHoverEvent={onHoverEvent}
        onSelectEvent={onSelectEvent}
      />
    </div>
  );
}
