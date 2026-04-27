"use client";
import { useMemo, useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ASSETS, type AssetKind, type Asset } from "@/lib/data/geo";
import { Search } from "lucide-react";

const KIND_META: Record<AssetKind, { label: string; color: string; size: number }> = {
  fab:              { label: "Fabs",                color: "#ff2a2a", size: 8 },
  datacenter:       { label: "Data Centers",        color: "#ff6b6b", size: 7 },
  nuclear:          { label: "Nuclear",             color: "#ffaa00", size: 8 },
  renewable:        { label: "Renewables",          color: "#4ade80", size: 6 },
  "gas-power":      { label: "Gas Power",           color: "#a3a3a3", size: 6 },
  mine:             { label: "Mines (Cu/Li/U/REE)", color: "#a16207", size: 7 },
  "gas-extraction": { label: "Gas / Oil Fields",    color: "#525252", size: 7 },
  "oil-field":      { label: "Oil Fields",          color: "#262626", size: 6 },
  "rare-gas-plant": { label: "Rare Gases (Ne/He)",  color: "#06b6d4", size: 7 },
  "submarine-cable":{ label: "Subsea Cables",       color: "#3b82f6", size: 5 },
  "litho-plant":    { label: "Litho Assembly",      color: "#ff00ff", size: 8 },
};

const KIND_ORDER: AssetKind[] = [
  "fab", "datacenter", "nuclear", "renewable", "gas-power",
  "mine", "gas-extraction", "rare-gas-plant", "litho-plant", "submarine-cable", "oil-field"
];

function FlyTo({ target }: { target: Asset | null }) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    map.flyTo([target.lat, target.lng], 6, { duration: 1.2 });
  }, [target, map]);
  return null;
}

function ThemeAwareTiles() {
  const map = useMap();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.getAttribute("data-theme") !== "light");
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  return (
    <TileLayer
      url={
        isDark
          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      }
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">Carto</a>'
    />
  );
}

export default function WorldMap() {
  const initialEnabled = useMemo(() => {
    const m = {} as Record<AssetKind, boolean>;
    for (const k of KIND_ORDER) m[k] = true;
    return m;
  }, []);
  const [enabled, setEnabled] = useState<Record<AssetKind, boolean>>(initialEnabled);
  const [search, setSearch] = useState("");
  const [flyTarget, setFlyTarget] = useState<Asset | null>(null);

  const searchMatches = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q.length < 2) return [];
    return ASSETS.filter(a =>
      a.name.toLowerCase().includes(q) ||
      (a.operator && a.operator.toLowerCase().includes(q)) ||
      (a.city && a.city.toLowerCase().includes(q)) ||
      (a.country && a.country.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [search]);

  const counts = useMemo(() => {
    const c = {} as Record<AssetKind, number>;
    for (const a of ASSETS) c[a.kind] = (c[a.kind] || 0) + 1;
    return c;
  }, []);

  return (
    <div className="relative h-[calc(100vh-3.5rem)] w-full overflow-hidden">
      <MapContainer
        center={[35, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={10}
        worldCopyJump
        scrollWheelZoom
        style={{ height: "100%", width: "100%", background: "rgb(var(--bg))" }}
      >
        <ThemeAwareTiles />
        <FlyTo target={flyTarget} />
        {ASSETS.filter(a => enabled[a.kind]).map(a => {
          const m = KIND_META[a.kind];
          return (
            <CircleMarker
              key={a.id}
              center={[a.lat, a.lng]}
              radius={m.size}
              pathOptions={{
                color: m.color,
                fillColor: m.color,
                fillOpacity: 0.65,
                weight: 1.2,
              }}
            >
              <Tooltip direction="top" offset={[0, -6]} opacity={0.95}>
                <div className="font-mono text-[10px]">
                  <div className="font-semibold">{a.name}</div>
                  <div className="opacity-70">{a.city ? `${a.city}, ${a.country}` : a.country}</div>
                </div>
              </Tooltip>
              <Popup>
                <div className="font-mono text-[11px] min-w-[210px]">
                  <div className="font-semibold mb-1">{a.name}</div>
                  <div>kind: {KIND_META[a.kind].label}</div>
                  {a.operator && (
                    <div>
                      operator:{" "}
                      {a.operatorId
                        ? <a href={`/companies/${a.operatorId}`} style={{ color: "#ff2a2a", textDecoration: "underline" }}>{a.operator}</a>
                        : a.operator}
                    </div>
                  )}
                  {a.capacity && <div>capacity: {a.capacity}</div>}
                  {a.status && <div>status: {a.status}</div>}
                  <div>{a.city}{a.city ? ", " : ""}{a.country}</div>
                  {a.note && <div className="mt-1 opacity-70">{a.note}</div>}
                  {a.operatorId && (
                    <a href={`/companies/${a.operatorId}`}
                       style={{ display: "inline-block", marginTop: 6, fontSize: 10, letterSpacing: "0.2em", color: "#ff2a2a", border: "1px solid #ff2a2a", padding: "3px 8px" }}>
                      OPEN COMPANY →
                    </a>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Layer legend / toggles */}
      <div className="absolute left-4 top-16 z-[1000] hairline bg-bg-1/95 backdrop-blur p-3 font-mono text-[11px] max-h-[80vh] overflow-y-auto w-[260px]">
        <div className="text-accent tracking-[0.3em] mb-2">// SEARCH</div>
        <div className="relative mb-3">
          <div className="hairline bg-bg-2 flex items-center gap-1.5 px-2 py-1.5">
            <Search className="h-3 w-3 text-ink-mute" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="fab / DC / mine / city…"
              className="flex-1 bg-transparent text-[11px] focus:outline-none placeholder:text-ink-mute"
            />
          </div>
          {searchMatches.length > 0 && (
            <div className="absolute left-0 right-0 mt-1 hairline bg-bg-1 max-h-64 overflow-y-auto z-50 shadow-glow-sm">
              {searchMatches.map(m => (
                <button
                  key={m.id}
                  onClick={() => { setFlyTarget(m); setSearch(""); }}
                  className="block w-full text-left px-2 py-1.5 hover:bg-bg-2 hover:text-accent transition"
                >
                  <span className="text-ink">{m.name}</span>
                  {m.city && <span className="text-ink-mute ml-2">{m.city}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="text-accent tracking-[0.3em] mb-2">// LAYERS</div>
        {KIND_ORDER.map(k => {
          const m = KIND_META[k];
          const c = counts[k] || 0;
          if (c === 0) return null;
          return (
            <label key={k} className="flex items-center gap-2 cursor-pointer hover:bg-bg-2 px-1 py-0.5 transition">
              <input
                type="checkbox"
                checked={enabled[k]}
                onChange={e => setEnabled(s => ({ ...s, [k]: e.target.checked }))}
                className="accent-accent"
              />
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: m.color }} />
              <span className="flex-1 text-ink">{m.label}</span>
              <span className="text-ink-mute">{c}</span>
            </label>
          );
        })}
        <div className="mt-3 pt-2 border-t border-line text-ink-mute">
          {ASSETS.filter(a => enabled[a.kind]).length.toLocaleString()} of {ASSETS.length.toLocaleString()} visible
        </div>
      </div>
    </div>
  );
}
