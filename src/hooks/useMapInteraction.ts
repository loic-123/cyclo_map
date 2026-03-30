"use client";

import { useState, useCallback } from "react";

export function useMapInteraction() {
  const [hoveredEventId, setHoveredEventId] = useState<number | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const handleHover = useCallback((id: number | null) => {
    setHoveredEventId(id);
  }, []);

  const handleSelect = useCallback((id: number | null) => {
    setSelectedEventId(id);
  }, []);

  return {
    hoveredEventId,
    selectedEventId,
    setHoveredEventId: handleHover,
    setSelectedEventId: handleSelect,
  };
}
