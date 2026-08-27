"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, X } from "lucide-react";
import "leaflet/dist/leaflet.css";
import type { Institution, Sector } from "@/lib/types";
import { locationLine } from "@/lib/format";

const SANTA_FE_CENTER: [number, number] = [-31.6, -60.9];

function readThemeVar(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function getSectorColors(): Record<Sector, string> {
  return {
    publico: readThemeVar("--primary", "#1e4fa3"),
    privado: readThemeVar("--accent", "#e2662e"),
  };
}

function buildPopupContent(inst: Institution, onSelect: (i: Institution) => void) {
  const wrap = document.createElement("div");
  wrap.style.cssText = "min-width:200px;max-width:240px;";

  const title = document.createElement("p");
  title.textContent = inst.name;
  title.style.cssText =
    "margin:0 0 2px;font-weight:600;font-size:14px;line-height:1.25;color:var(--foreground);";
  wrap.appendChild(title);

  const line = locationLine(inst);
  const addr = document.createElement("p");
  addr.textContent =
    (line ?? "") + (inst.geoPrecision === "localidad" ? " (zona aproximada)" : "");
  addr.style.cssText = "margin:0 0 8px;font-size:11.5px;color:var(--muted);";
  wrap.appendChild(addr);

  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = "Ver ficha completa →";
  btn.style.cssText =
    "display:inline-flex;align-items:center;gap:4px;background:var(--primary);color:#fff;border:none;border-radius:999px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;";
  btn.addEventListener("click", () => onSelect(inst));
  wrap.appendChild(btn);

  return wrap;
}

export default function CityMap({
  institutions,
  origin,
  radiusKm,
  onSelect,
  height = "420px",
  fill = false,
  onExpandRequest,
}: {
  institutions: Institution[];
  origin?: { lat: number; lon: number } | null;
  radiusKm?: number;
  onSelect: (i: Institution) => void;
  height?: string;
  fill?: boolean;
  onExpandRequest?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const originLayerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const originPointRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const originCircleRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<{ marker: any; sector: Sector }[]>([]);
  const [expanded, setExpanded] = useState(false);

  function refreshMapColors() {
    const colors = getSectorColors();
    const ring = readThemeVar("--card", "#ffffff");
    markersRef.current.forEach(({ marker, sector }) => {
      marker.setStyle({ color: ring, fillColor: colors[sector] });
    });
    const accent = readThemeVar("--accent", "#e2662e");
    const primary = readThemeVar("--primary", "#1e4fa3");
    if (originPointRef.current) originPointRef.current.setStyle({ fillColor: accent });
    if (originCircleRef.current) originCircleRef.current.setStyle({ color: primary, fillColor: primary });
  }

  const refreshMapColorsRef = useRef(refreshMapColors);
  useEffect(() => {
    refreshMapColorsRef.current = refreshMapColors;
  });

  useEffect(() => {
    let cancelled = false;
    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        scrollWheelZoom: false,
      }).setView(SANTA_FE_CENTER, 8);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const colors = getSectorColors();
      const ring = readThemeVar("--card", "#ffffff");

      const withCoords = institutions.filter((i) => i.lat != null && i.lon != null);

      withCoords.forEach((inst) => {
        const latlon: [number, number] = [inst.lat as number, inst.lon as number];

        const dot = L.circleMarker(latlon, {
          radius: 6,
          weight: 1.5,
          color: ring,
          fillColor: colors[inst.sector],
          fillOpacity: inst.geoPrecision === "localidad" ? 0.55 : 0.9,
          interactive: false,
        }).addTo(map);
        markersRef.current.push({ marker: dot, sector: inst.sector });

        const hitArea = L.circleMarker(latlon, {
          radius: 15,
          stroke: false,
          fillOpacity: 0,
        }).addTo(map);
        hitArea.bindTooltip(inst.name, { direction: "top", offset: [0, -4] });
        hitArea.bindPopup(buildPopupContent(inst, onSelect), { maxWidth: 260 });
      });

      // Con lugares repartidos por toda la provincia (no una sola ciudad,
      // como en el mapa original) el zoom fijo no sirve -- ajustamos la
      // vista a los puntos que efectivamente hay en pantalla.
      if (withCoords.length === 1) {
        map.setView([withCoords[0].lat as number, withCoords[0].lon as number], 15);
      } else if (withCoords.length > 1) {
        const bounds = L.latLngBounds(withCoords.map((i) => [i.lat as number, i.lon as number]));
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 13 });
      }

      mapRef.current = map;
      setTimeout(() => map.invalidateSize(), 80);
    });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const target = document.documentElement;
    const observer = new MutationObserver(() => refreshMapColorsRef.current());
    observer.observe(target, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    import("leaflet").then((L) => {
      const map = mapRef.current;
      if (!map) return;

      if (originLayerRef.current) {
        map.removeLayer(originLayerRef.current);
        originLayerRef.current = null;
        originPointRef.current = null;
        originCircleRef.current = null;
      }

      if (origin) {
        const accent = readThemeVar("--accent", "#e2662e");
        const primary = readThemeVar("--primary", "#1e4fa3");
        const group = L.layerGroup();
        originPointRef.current = L.circleMarker([origin.lat, origin.lon], {
          radius: 7,
          weight: 2,
          color: "#fff",
          fillColor: accent,
          fillOpacity: 1,
        }).addTo(group);
        if (radiusKm) {
          originCircleRef.current = L.circle([origin.lat, origin.lon], {
            radius: radiusKm * 1000,
            color: primary,
            weight: 1.5,
            fillColor: primary,
            fillOpacity: 0.08,
          }).addTo(group);
        }
        group.addTo(map);
        originLayerRef.current = group;

        const zoom = radiusKm && radiusKm <= 5 ? 13 : radiusKm && radiusKm <= 15 ? 11 : 9;
        map.setView([origin.lat, origin.lon], zoom);
      }
    });
  }, [origin, radiusKm]);

  useEffect(() => {
    if (expanded) {
      document.body.classList.add("modal-open");
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    if (expanded) window.addEventListener("keydown", onKey);

    const id = setTimeout(() => mapRef.current?.invalidateSize(), 80);

    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKey);
      clearTimeout(id);
    };
  }, [expanded]);

  return (
    <div
      className={
        expanded
          ? "fixed inset-0 z-[1950] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          : fill
            ? "flex min-h-0 flex-1 flex-col"
            : ""
      }
      onClick={expanded ? () => setExpanded(false) : undefined}
    >
      <div
        className={`relative overflow-hidden rounded-2xl border border-border shadow-xl ${
          !expanded && fill ? "flex min-h-0 flex-1 flex-col" : ""
        }`}
        style={
          expanded
            ? { width: "min(90vw, 85vh)", height: "min(90vw, 85vh)" }
            : fill
              ? { width: "100%" }
              : { width: "100%", height }
        }
        onClick={expanded ? (e) => e.stopPropagation() : undefined}
      >
        <div
          ref={containerRef}
          className={fill && !expanded ? "min-h-0 w-full flex-1" : "h-full w-full"}
        />
        {!expanded && (
          <span
            role="button"
            tabIndex={0}
            onClick={() => (onExpandRequest ? onExpandRequest() : setExpanded(true))}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (onExpandRequest) onExpandRequest();
                else setExpanded(true);
              }
            }}
            aria-label="Agrandar mapa"
            className="absolute right-3 top-3 z-[500] flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/95 text-foreground shadow-md backdrop-blur transition hover:border-primary hover:text-primary-dark"
          >
            <Maximize2 size={16} />
          </span>
        )}
        {expanded && (
          <span
            role="button"
            tabIndex={0}
            onClick={() => setExpanded(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setExpanded(false);
              }
            }}
            aria-label="Cerrar mapa grande"
            className="absolute right-3 top-3 z-[500] flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/95 text-foreground shadow-md backdrop-blur transition hover:border-primary hover:text-primary-dark"
          >
            <X size={16} />
          </span>
        )}
      </div>
    </div>
  );
}
