"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { CycloEvent } from "@/lib/types";
import eventsData from "@/data/events.json";
import { useFilters } from "@/hooks/useFilters";
import { useMapInteraction } from "@/hooks/useMapInteraction";
import Sidebar from "@/components/Sidebar";
import EventDetail from "@/components/EventDetail";
import Legend from "@/components/Legend";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const allEvents = eventsData as CycloEvent[];

function AppContent() {
  const {
    filters,
    toggleMonth,
    toggleType,
    toggleDept,
    toggleFiab,
    resetAll,
    visibleEvents,
  } = useFilters(allEvents);

  const {
    hoveredEventId,
    selectedEventId,
    setHoveredEventId,
    setSelectedEventId,
  } = useMapInteraction();

  const selectedEvent = visibleEvents.find((e) => e.id === selectedEventId) ?? null;

  return (
    <div className="flex h-screen w-screen flex-col md:flex-row" style={{ backgroundColor: "var(--bg)" }}>
      {/* Sidebar */}
      <div className="w-full md:w-[420px] lg:w-[420px] h-[55vh] md:h-full shrink-0 border-r" style={{ borderColor: "var(--border)" }}>
        <Sidebar
          allEvents={allEvents}
          visibleEvents={visibleEvents}
          filters={filters}
          toggleMonth={toggleMonth}
          toggleType={toggleType}
          toggleDept={toggleDept}
          toggleFiab={toggleFiab}
          resetAll={resetAll}
          hoveredEventId={hoveredEventId}
          selectedEventId={selectedEventId}
          onHoverEvent={setHoveredEventId}
          onSelectEvent={setSelectedEventId}
        />
      </div>

      {/* Map area */}
      <div className="relative flex-1 h-[45vh] md:h-full">
        <Map
          events={visibleEvents}
          hoveredEventId={hoveredEventId}
          selectedEventId={selectedEventId}
          onHoverEvent={setHoveredEventId}
          onSelectEvent={setSelectedEventId}
        />
        <Legend />
        {selectedEvent && (
          <EventDetail
            event={selectedEvent}
            onClose={() => setSelectedEventId(null)}
          />
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <AppContent />
    </Suspense>
  );
}
