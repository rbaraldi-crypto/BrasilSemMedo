import { useEffect, useRef } from 'react';
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const TARGET_COORDS = { lat: -23.4306, lng: -46.4730 };

interface DispatchMapContainerProps {
  useStaticFallback: boolean;
  isOnline: boolean;
  fieldUnits: any[];
  targetTrajectory: any[] | null;
  showCameras: boolean;
  selectedUnit: any;
  onSelectUnit: (unit: any) => void;
  onMapLoaded: () => void;
}

export function DispatchMapContainer({
  useStaticFallback,
  isOnline,
  fieldUnits,
  targetTrajectory,
  showCameras,
  selectedUnit,
  onSelectUnit,
  onMapLoaded
}: DispatchMapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const unitMarkersRef = useRef<Record<string, any>>({});

  const mockCameras = useRef(Array.from({ length: 150 }).map((_, i) => ({
    id: `cam-${i}`,
    lat: TARGET_COORDS.lat + (Math.random() - 0.5) * 0.05,
    lng: TARGET_COORDS.lng + (Math.random() - 0.5) * 0.05,
    type: 'Camera'
  }))).current;

  useEffect(() => {
    if (mapRef.current && !googleMapRef.current && !useStaticFallback && isOnline) {
      const apiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ?? '';

      import('@googlemaps/js-api-loader').then(({ Loader }) => {
        const loader = new Loader({
          apiKey: apiKey || '',
          version: "weekly",
          libraries: ["maps", "marker"]
        });

        (loader as any).load().then(() => {
          const g = (window as any).google;
          if (!g || !mapRef.current) return;

          const map = new g.maps.Map(mapRef.current, {
            center: TARGET_COORDS,
            zoom: 14,
            styles: [
              { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
              { elementType: "labels.text.fill", stylers: [{ color: "#475569" }] },
              { featureType: "water", elementType: "geometry", stylers: [{ color: "#020617" }] },
              { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
            ],
            disableDefaultUI: true,
          });

          googleMapRef.current = map;

          new g.maps.Marker({
            position: TARGET_COORDS,
            map,
            zIndex: 100,
            icon: {
              path: g.maps.SymbolPath.CIRCLE,
              fillColor: "#ef4444",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
              scale: 12
            }
          });

          if (targetTrajectory && targetTrajectory.length > 0) {
            const pathCoords = targetTrajectory.map((t: any) => ({ lat: t.lat, lng: t.lng }));
            new g.maps.Polyline({
              path: pathCoords,
              geodesic: true,
              strokeColor: "#328CC1",
              strokeOpacity: 0.5,
              strokeWeight: 2,
              map: map
            });
          }

          fieldUnits.forEach((unit: any) => {
            const marker = new g.maps.Marker({
              position: { lat: unit.lat, lng: unit.lng },
              map,
              zIndex: 50,
              title: unit.callsign,
              icon: {
                path: g.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                fillColor: unit.status === 'patrolling' ? "#22c55e" : "#ef4444",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 1,
                scale: 7
              }
            });
            marker.addListener('click', () => onSelectUnit(unit));
            unitMarkersRef.current[unit.id] = marker;
          });

          onMapLoaded();
        }).catch(() => onMapLoaded());
      }).catch(() => onMapLoaded());
    }
  }, [useStaticFallback, isOnline, targetTrajectory, mockCameras, fieldUnits, onMapLoaded, onSelectUnit]);

  useEffect(() => {
    const g = (window as any).google;
    if (googleMapRef.current && fieldUnits.length > 0) {
      fieldUnits.forEach((unit: any) => {
        const marker = unitMarkersRef.current[unit.id];
        if (marker) {
          marker.setPosition({ lat: unit.lat, lng: unit.lng });
        }
      });

      if (selectedUnit && g) {
        if (polylineRef.current) polylineRef.current.setMap(null);
        polylineRef.current = new g.maps.Polyline({
          path: [{ lat: selectedUnit.lat, lng: selectedUnit.lng }, TARGET_COORDS],
          geodesic: true,
          strokeColor: "#328CC1",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          map: googleMapRef.current
        });
      }
    }
  }, [fieldUnits, selectedUnit]);

  return (
    <div className="flex-1 relative bg-slate-900 border-r border-white/5 overflow-hidden">
      {useStaticFallback ? (
        <div className="relative w-full h-full bg-slate-950">
          <img src="https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-30 grayscale" alt="Satellite Fallback" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/80" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="h-6 w-6 bg-amber-600 rounded-full border-2 border-white animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.8)]" />
            <Badge className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-amber-600 text-[10px] whitespace-nowrap uppercase font-black">Alvo Detectado</Badge>
          </div>
          {fieldUnits.map((unit: any) => (
            <div
              key={unit.id}
              className="absolute cursor-pointer transition-all duration-1000"
              style={{ top: `${((unit.lat + 23.5) * 1000) % 100}%`, left: `${((unit.lng + 46.5) * 1000) % 100}%` }}
              onClick={() => onSelectUnit(unit)}
            >
              <div className={cn("h-4 w-4 rounded-full border border-white shadow-lg", unit.status === 'patrolling' ? "bg-green-500" : "bg-red-600")} />
            </div>
          ))}
        </div>
      ) : (
        <div ref={mapRef} className="w-full h-full" />
      )}

      <div className="absolute bottom-6 right-6 p-4 bg-black/60 backdrop-blur-md border border-cyan-400/30 rounded-xl z-50">
        <div className="flex items-center gap-2 text-cyan-400 mb-2">
          <TrendingUp className="h-4 w-4 animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest">Análise Preditiva</span>
        </div>
        <p className="text-[10px] text-slate-300 font-bold uppercase">Tendência: Deslocamento Norte-Oeste</p>
        <p className="text-[10px] text-slate-500 mt-1">Baseado em 3 avistamentos (Muralha P9)</p>
      </div>
    </div>
  );
}
