"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { CycloEvent } from "@/lib/types";
import { MONTH_CONFIG, MAP_CENTER, MAP_ZOOM } from "@/lib/constants";

interface MapProps {
  events: CycloEvent[];
  hoveredEventId: number | null;
  selectedEventId: number | null;
  onHoverEvent: (id: number | null) => void;
  onSelectEvent: (id: number | null) => void;
}

function createHomeIcon(dark = true): L.DivIcon {
  const bg = dark ? "#1e293b" : "#ffffff";
  const border = dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.2)";
  return L.divIcon({
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    html: `<div style="width:28px;height:28px;border-radius:50%;background:${bg};border:2px solid ${border};display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,0.3);">🏠</div>`,
  });
}

function createCircleIcon(color: string, size: number, pulse = false, dark = true): L.DivIcon {
  const borderColor = dark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.3)";
  const shadow = pulse
    ? `box-shadow: 0 0 0 4px ${color}40, 0 0 12px ${color}60; animation: marker-pulse 1.5s ease-in-out infinite;`
    : "";
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid ${borderColor};${shadow};transition:all 200ms ease;"></div>`,
  });
}

/** Spread overlapping markers in a small circle so they don't stack */
function spreadOverlapping(events: CycloEvent[]): globalThis.Map<number, [number, number]> {
  const byCoord = new globalThis.Map<string, CycloEvent[]>();
  for (const e of events) {
    const key = `${e.lat},${e.lng}`;
    const arr = byCoord.get(key) ?? [];
    arr.push(e);
    byCoord.set(key, arr);
  }
  const result = new globalThis.Map<number, [number, number]>();
  for (const group of byCoord.values()) {
    if (group.length === 1) {
      result.set(group[0].id, [group[0].lat, group[0].lng]);
    } else {
      const offset = 0.008; // ~800m spread radius
      group.forEach((e, i) => {
        const angle = (2 * Math.PI * i) / group.length - Math.PI / 2;
        result.set(e.id, [
          e.lat + offset * Math.sin(angle),
          e.lng + offset * Math.cos(angle),
        ]);
      });
    }
  }
  return result;
}

export default function Map({
  events,
  hoveredEventId,
  selectedEventId,
  onHoverEvent,
  onSelectEvent,
}: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<globalThis.Map<number, L.Marker>>(new globalThis.Map());
  const homeMarkerRef = useRef<L.Marker | null>(null);
  const popupRef = useRef<L.Popup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const HOME = { lat: 44.1225, lng: 5.0306, label: "Beaumes-de-Venise" };
  const [isDark, setIsDark] = useState(true);

  const TILES = {
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    light: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  };

  const TILE_ATTR =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [MAP_CENTER.lat, MAP_CENTER.lng],
      zoom: MAP_ZOOM,
      zoomControl: false,
    });

    tileLayerRef.current = L.tileLayer(TILES.dark, {
      attribution: TILE_ATTR,
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "topright" }).addTo(map);

    mapRef.current = map;
    popupRef.current = L.popup({
      closeButton: false,
      className: "cyclo-popup",
      offset: [0, -8],
    });

    // Home marker - Beaumes-de-Venise
    homeMarkerRef.current = L.marker([HOME.lat, HOME.lng], {
      icon: createHomeIcon(true),
      zIndexOffset: 1000,
    })
      .bindPopup(
        `<div style="font-family:'DM Sans',sans-serif;"><strong>🏠 ${HOME.label}</strong></div>`,
        { className: "cyclo-popup" }
      )
      .addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Switch tiles when theme changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !tileLayerRef.current) return;
    tileLayerRef.current.remove();
    tileLayerRef.current = L.tileLayer(isDark ? TILES.dark : TILES.light, {
      attribution: TILE_ATTR,
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);
    // Update home marker icon
    if (homeMarkerRef.current) {
      homeMarkerRef.current.setIcon(createHomeIcon(isDark));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark]);

  // Manage markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    const positions = spreadOverlapping(events);

    events.forEach((event) => {
      const color = MONTH_CONFIG[event.month].color;
      const isHovered = event.id === hoveredEventId;
      const isSelected = event.id === selectedEventId;
      const size = isHovered || isSelected ? 18 : 12;
      const [lat, lng] = positions.get(event.id) ?? [event.lat, event.lng];

      const marker = L.marker([lat, lng], {
        icon: createCircleIcon(color, size, isSelected, isDark),
      });

      marker.on("mouseover", () => {
        onHoverEvent(event.id);
        popupRef.current
          ?.setLatLng([lat, lng])
          .setContent(
            `<div style="font-family:'DM Sans',sans-serif;"><strong style="font-size:12px;">${event.name}</strong><br/><span style="font-size:11px;opacity:0.7;">📅 ${event.date}</span></div>`
          )
          .openOn(map);
      });

      marker.on("mouseout", () => {
        onHoverEvent(null);
        map.closePopup();
      });

      marker.on("click", () => {
        onSelectEvent(event.id);
      });

      marker.addTo(map);
      markersRef.current.set(event.id, marker);
    });
  }, [events, hoveredEventId, selectedEventId, onHoverEvent, onSelectEvent, isDark]);

  // FlyTo on selection
  useEffect(() => {
    const map = mapRef.current;
    if (!map || selectedEventId === null) return;
    const event = events.find((e) => e.id === selectedEventId);
    if (event) {
      map.flyTo([event.lat, event.lng], 11, { duration: 0.8 });
    }
  }, [selectedEventId, events]);

  // FitBounds when events change (filter change)
  const eventIds = useMemo(() => events.map((e) => e.id).join(","), [events]);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || events.length === 0) return;
    // Don't fitBounds if we have a selection
    if (selectedEventId !== null) return;
    const bounds = L.latLngBounds(events.map((e) => [e.lat, e.lng]));
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 12, animate: true, duration: 0.5 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventIds]);

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      <button
        onClick={() => setIsDark((d) => !d)}
        className="absolute top-3 left-3 z-[1000] flex h-8 w-8 items-center justify-center rounded-lg text-sm cursor-pointer transition-colors"
        style={{
          backgroundColor: isDark ? "var(--surface-2)" : "#fff",
          border: `1px solid ${isDark ? "var(--border)" : "#d1d5db"}`,
          color: isDark ? "var(--text-2)" : "#374151",
        }}
        title={isDark ? "Fond clair" : "Fond sombre"}
      >
        {isDark ? "☀️" : "🌙"}
      </button>
    </div>
  );
}
