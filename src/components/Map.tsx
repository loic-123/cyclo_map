"use client";

import { useEffect, useRef, useMemo } from "react";
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

function createCircleIcon(color: string, size: number, pulse = false): L.DivIcon {
  const shadow = pulse
    ? `box-shadow: 0 0 0 4px ${color}40, 0 0 12px ${color}60; animation: marker-pulse 1.5s ease-in-out infinite;`
    : "";
  return L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.8);${shadow};transition:all 200ms ease;"></div>`,
  });
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
  const popupRef = useRef<L.Popup | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [MAP_CENTER.lat, MAP_CENTER.lng],
      zoom: MAP_ZOOM,
      zoomControl: false,
    });

    // CartoDB Dark Matter tiles - dark style with real map features
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);

    L.control.zoom({ position: "topright" }).addTo(map);

    mapRef.current = map;
    popupRef.current = L.popup({
      closeButton: false,
      className: "cyclo-popup",
      offset: [0, -8],
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Manage markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    events.forEach((event) => {
      const color = MONTH_CONFIG[event.month].color;
      const isHovered = event.id === hoveredEventId;
      const isSelected = event.id === selectedEventId;
      const size = isHovered || isSelected ? 14 : 8;

      const marker = L.marker([event.lat, event.lng], {
        icon: createCircleIcon(color, size, isSelected),
      });

      marker.on("mouseover", () => {
        onHoverEvent(event.id);
        popupRef.current
          ?.setLatLng([event.lat, event.lng])
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
  }, [events, hoveredEventId, selectedEventId, onHoverEvent, onSelectEvent]);

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

  return <div ref={containerRef} className="h-full w-full" />;
}
