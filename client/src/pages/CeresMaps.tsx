import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { MapPin, Layers, Search, Info, Flame, TreePine, Shield, X } from "lucide-react";

// Fix Leaflet default marker icon issue with Vite
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

import {
  MapContainer, TileLayer, Marker, Popup, LayersControl, LayerGroup, Circle, useMap
} from "react-leaflet";

// Simulated fire hotspots (INPE-style data)
const HOTSPOTS = [
  { id: 1, lat: -14.12, lng: -47.68, intensity: "alta",    label: "Foco Ativo – Chapada dos Veadeiros", date: "23/06/2026 17:42" },
  { id: 2, lat: -15.78, lng: -47.92, intensity: "media",   label: "Foco Ativo – Planaltina", date: "23/06/2026 16:30" },
  { id: 3, lat: -13.44, lng: -46.32, intensity: "baixa",   label: "Área de Risco – São Domingos", date: "23/06/2026 14:15" },
  { id: 4, lat: -16.35, lng: -48.95, intensity: "alta",    label: "Foco Crítico – Luziânia", date: "23/06/2026 18:05" },
  { id: 5, lat: -14.88, lng: -49.28, intensity: "media",   label: "Foco Ativo – Uruaçu", date: "23/06/2026 15:55" },
  { id: 6, lat: -17.20, lng: -46.88, intensity: "baixa",   label: "Área de Risco – Paracatu", date: "23/06/2026 13:00" },
];

// Simulated APP areas (Área de Preservação Permanente)
const APP_AREAS = [
  { lat: -14.90, lng: -47.50, radius: 18000, color: "#0ea5e9" },
  { lat: -15.40, lng: -48.20, radius: 14000, color: "#0ea5e9" },
  { lat: -13.80, lng: -46.90, radius: 12000, color: "#0ea5e9" },
];

// Simulated Reserva Legal areas
const RL_AREAS = [
  { lat: -14.50, lng: -47.80, radius: 22000, color: "#16a34a" },
  { lat: -16.10, lng: -48.40, radius: 18000, color: "#16a34a" },
  { lat: -15.80, lng: -46.60, radius: 15000, color: "#16a34a" },
];

// Simulated Consolidated Areas
const CONSOLIDATED_AREAS = [
  { lat: -15.00, lng: -48.60, radius: 25000, color: "#f59e0b" },
  { lat: -14.20, lng: -47.10, radius: 20000, color: "#f59e0b" },
  { lat: -16.50, lng: -47.30, radius: 16000, color: "#f59e0b" },
];

// Brazilian municipalities for search
const MUNICIPIOS = [
  { name: "Brasília, DF", lat: -15.78, lng: -47.93 },
  { name: "Goiânia, GO", lat: -16.68, lng: -49.25 },
  { name: "Cuiabá, MT", lat: -15.60, lng: -56.10 },
  { name: "Campo Grande, MS", lat: -20.44, lng: -54.65 },
  { name: "Palmas, TO", lat: -10.24, lng: -48.33 },
  { name: "Belo Horizonte, MG", lat: -19.92, lng: -43.94 },
  { name: "Alto Paraíso, GO", lat: -14.13, lng: -47.51 },
  { name: "Chapada dos Veadeiros, GO", lat: -14.12, lng: -47.68 },
  { name: "Formosa, GO", lat: -15.53, lng: -47.33 },
  { name: "Paracatu, MG", lat: -17.22, lng: -46.87 },
];

function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 11, { duration: 1.5 });
  }, [lat, lng, map]);
  return null;
}

const hotspotIcon = (intensity: string) =>
  L.divIcon({
    className: "",
    html: `<div style="
      width:${intensity === "alta" ? 22 : intensity === "media" ? 18 : 14}px;
      height:${intensity === "alta" ? 22 : intensity === "media" ? 18 : 14}px;
      background:${intensity === "alta" ? "#ef4444" : intensity === "media" ? "#f97316" : "#facc15"};
      border-radius:50%;
      border:2px solid white;
      box-shadow:0 0 ${intensity === "alta" ? 12 : 8}px ${intensity === "alta" ? "#ef444480" : "#f9731680"};
      animation: pulse 2s infinite;
    "></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });

const sensorIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:14px;height:14px;
    background:#16a34a;border-radius:3px;
    border:2px solid white;box-shadow:0 2px 6px #0005;
  "></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export default function CeresMaps() {
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number } | null>(null);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<typeof MUNICIPIOS>([]);
  const [selectedHotspot, setSelectedHotspot] = useState<typeof HOTSPOTS[0] | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleSearch = (q: string) => {
    setSearch(q);
    if (q.length < 2) { setSuggestions([]); return; }
    setSuggestions(MUNICIPIOS.filter(m => m.name.toLowerCase().includes(q.toLowerCase())));
  };

  const flyToMunicipio = (m: typeof MUNICIPIOS[0]) => {
    setFlyTo({ lat: m.lat, lng: m.lng });
    setSearch(m.name);
    setSuggestions([]);
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground flex items-center gap-3">
            <MapPin className="w-8 h-8 text-primary" />
            CERES Maps
          </h1>
          <p className="text-muted-foreground mt-1">
            Mapa interativo do Cerrado — APP, Reserva Legal, focos de calor e sensores ambientais.
          </p>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/50 bg-card hover:bg-secondary transition-colors text-sm font-medium"
          data-testid="button-map-info"
        >
          <Info className="w-4 h-4 text-primary" />
          Legenda
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Focos Ativos", value: HOTSPOTS.filter(h => h.intensity === "alta").length, color: "text-rose-600", bg: "bg-rose-50 border-rose-100" },
          { label: "Áreas APP",    value: APP_AREAS.length, color: "text-blue-600",  bg: "bg-blue-50 border-blue-100" },
          { label: "Reserva Legal",value: RL_AREAS.length,  color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
          { label: "Áreas Consol.", value: CONSOLIDATED_AREAS.length, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-3 ${s.bg}`}>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Pesquisar município..."
          data-testid="input-map-search"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border/50 bg-card text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
        />
        {suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-border/50 rounded-xl shadow-lg overflow-hidden z-50">
            {suggestions.map(m => (
              <button
                key={m.name}
                onClick={() => flyToMunicipio(m)}
                className="w-full text-left px-4 py-2.5 hover:bg-secondary text-sm transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 inline mr-2 text-primary" />
                {m.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      {showInfo && (
        <div className="mb-4 bg-card border border-border/50 rounded-2xl p-4 flex flex-wrap gap-4 items-center text-sm">
          <button onClick={() => setShowInfo(false)} className="ml-auto text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
          {[
            { color: "#ef4444", label: "Foco Crítico (INPE)" },
            { color: "#f97316", label: "Foco Médio" },
            { color: "#facc15", label: "Foco Baixo" },
            { color: "#0ea5e9", label: "APP (rio/mata)" },
            { color: "#16a34a", label: "Reserva Legal" },
            { color: "#f59e0b", label: "Área Consolidada" },
            { color: "#16a34a", label: "Sensor CERES AI" },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-2">
              <div style={{ background: l.color }} className="w-3.5 h-3.5 rounded-full border border-white shadow-sm" />
              <span className="text-muted-foreground">{l.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border border-border/50 shadow-lg" style={{ height: 520 }}>
        <MapContainer
          center={[-14.8, -47.9]}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
          zoomControl={true}
        >
          {flyTo && <FlyTo lat={flyTo.lat} lng={flyTo.lng} />}

          <LayersControl position="topright">
            {/* Base map */}
            <LayersControl.BaseLayer checked name="Mapa Padrão">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Satélite (ESRI)">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri"
              />
            </LayersControl.BaseLayer>

            {/* APP Layer */}
            <LayersControl.Overlay checked name="🔵 APP – Áreas de Preservação Permanente">
              <LayerGroup>
                {APP_AREAS.map((a, i) => (
                  <Circle key={i} center={[a.lat, a.lng]} radius={a.radius}
                    pathOptions={{ color: a.color, fillColor: a.color, fillOpacity: 0.15, weight: 2 }}>
                    <Popup>
                      <strong>APP – Área de Preservação Permanente</strong><br />
                      <small>Proteção obrigatória conforme art. 3º, II do Código Florestal</small>
                    </Popup>
                  </Circle>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>

            {/* Reserva Legal Layer */}
            <LayersControl.Overlay checked name="🟢 Reserva Legal">
              <LayerGroup>
                {RL_AREAS.map((a, i) => (
                  <Circle key={i} center={[a.lat, a.lng]} radius={a.radius}
                    pathOptions={{ color: a.color, fillColor: a.color, fillOpacity: 0.15, weight: 2 }}>
                    <Popup>
                      <strong>Reserva Legal</strong><br />
                      <small>Mínimo 20% da propriedade no Cerrado (Código Florestal, art. 12)</small>
                    </Popup>
                  </Circle>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>

            {/* Consolidated Areas Layer */}
            <LayersControl.Overlay name="🟡 Áreas Consolidadas">
              <LayerGroup>
                {CONSOLIDATED_AREAS.map((a, i) => (
                  <Circle key={i} center={[a.lat, a.lng]} radius={a.radius}
                    pathOptions={{ color: a.color, fillColor: a.color, fillOpacity: 0.12, weight: 2, dashArray: "6" }}>
                    <Popup>
                      <strong>Área Rural Consolidada</strong><br />
                      <small>Ocupação anterior a 22/07/2008 (Lei nº 12.651/2012, art. 3º, IV)</small>
                    </Popup>
                  </Circle>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>

            {/* Fire Hotspots Layer */}
            <LayersControl.Overlay checked name="🔥 Focos de Calor (INPE)">
              <LayerGroup>
                {HOTSPOTS.map(h => (
                  <Marker key={h.id} position={[h.lat, h.lng]} icon={hotspotIcon(h.intensity)}
                    eventHandlers={{ click: () => setSelectedHotspot(h) }}>
                    <Popup>
                      <div style={{ minWidth: 180 }}>
                        <strong>🔥 {h.label}</strong><br />
                        <span style={{ color: h.intensity === "alta" ? "#ef4444" : h.intensity === "media" ? "#f97316" : "#ca8a04" }}>
                          Intensidade: {h.intensity.charAt(0).toUpperCase() + h.intensity.slice(1)}
                        </span><br />
                        <small>📅 {h.date}</small><br />
                        <small style={{ color: "#6b7280" }}>Fonte: INPE (simulado)</small>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>

            {/* Sensor Stations Layer */}
            <LayersControl.Overlay checked name="📡 Estações CERES AI">
              <LayerGroup>
                {[
                  { lat: -14.14, lng: -47.51, name: "Estação Alfa", status: "Operacional" },
                  { lat: -13.95, lng: -47.20, name: "Estação Beta", status: "Operacional" },
                  { lat: -14.88, lng: -49.28, name: "Estação Gama", status: "Manutenção" },
                ].map((s, i) => (
                  <Marker key={i} position={[s.lat, s.lng]} icon={sensorIcon}>
                    <Popup>
                      <strong>📡 {s.name}</strong><br />
                      Status: <span style={{ color: s.status === "Operacional" ? "#16a34a" : "#f59e0b" }}>{s.status}</span><br />
                      <small>CERES AI · Cerrado Brasileiro</small>
                    </Popup>
                  </Marker>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
      </div>

      {/* Selected Hotspot Info */}
      {selectedHotspot && (
        <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Flame className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-rose-900">{selectedHotspot.label}</h3>
              <p className="text-sm text-rose-700 mt-1">
                Intensidade: <strong>{selectedHotspot.intensity}</strong> · Detectado em: {selectedHotspot.date}
              </p>
              <p className="text-xs text-rose-600 mt-1">Fonte: INPE · Dados simulados para demonstração</p>
            </div>
          </div>
          <button onClick={() => setSelectedHotspot(null)} className="text-rose-400 hover:text-rose-600 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <p className="text-xs text-muted-foreground/60 mt-3 text-center">
        Dados simulados para demonstração · Integração real com INPE, MapBiomas e SICAR em desenvolvimento
      </p>
    </Layout>
  );
}
