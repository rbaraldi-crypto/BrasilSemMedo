import { useEffect, useRef } from 'react';
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { MarkerClusterer, GridAlgorithm } from '@googlemaps/markerclusterer';

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
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const trajectoryRef = useRef<google.maps.Polyline | null>(null);
  const trendVectorRef = useRef<google.maps.Polyline | null>(null);
  const unitMarkersRef = useRef<Record<string, google.maps.Marker>>({});

  // Gera câmeras mockadas apenas uma vez
  const mockCameras = useRef(Array.from({ length: 150 }).map((_, i) => ({
    id: `cam-${i}`,
    lat: TARGET_COORDS.lat + (Math.random() - 0.5) * 0.05,
    lng: TARGET_COORDS.lng + (Math.random() - 0.5) * 0.05,
    type: 'Camera'
  }))).current;

  // Inicialização do Mapa
  useEffect(() => {
    if (mapRef.current && !googleMapRef.current && !useStaticFallback && isOnline) {
      setOptions({
        key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
        v: "weekly"
      });

      Promise.all([importLibrary('maps'), importLibrary('marker')]).then(() => {
        const map = new google.maps.Map(mapRef.current!, {
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

        // Marcador do Alvo
        new google.maps.Marker({ 
          position: TARGET_COORDS, 
          map, 
          zIndex: 100,
          icon: { 
            path: google.maps.SymbolPath.CIRCLE, 
            fillColor: "#ef4444", 
            fillOpacity: 1, 
            strokeColor: "#ffffff", 
            strokeWeight: 2, 
            scale: 12 
          } 
        });

        // Trajetória do Alvo
        if (targetTrajectory && targetTrajectory.length > 0) {
           const pathCoords = targetTrajectory.map(t => ({ lat: t.lat, lng: t.lng }));
           trajectoryRef.current = new google.maps.Polyline({
             path: pathCoords,
             geodesic: true,
             strokeColor: "#328CC1",
             strokeOpacity: 0,
             strokeWeight: 2,
             // Tracejado: o Maps JS API não suporta `strokeDasharray`; o padrão é
             // desenhar símbolos repetidos sobre uma linha transparente.
             icons: [{
               icon: {
                 path: "M 0,-1 0,1",
                 strokeColor: "#328CC1",
                 strokeOpacity: 0.5,
                 strokeWeight: 2,
                 scale: 2
               },
               offset: '0',
               repeat: '12px'
             }],
             map: map
           });

           targetTrajectory.forEach((loc, i) => {
             if (i < targetTrajectory.length - 1) {
               new google.maps.Marker({
                 position: { lat: loc.lat, lng: loc.lng },
                 map,
                 icon: {
                   path: google.maps.SymbolPath.CIRCLE,
                   fillColor: "#328CC1",
                   fillOpacity: 0.6,
                   strokeWeight: 0,
                   scale: 4
                 }
               });
             }
           });

           if (pathCoords.length > 1) {
             const last = pathCoords[pathCoords.length - 1];
             const prev = pathCoords[pathCoords.length - 2];
             const trendLat = last.lat + (last.lat - prev.lat);
             const trendLng = last.lng + (last.lng - prev.lng);

             trendVectorRef.current = new google.maps.Polyline({
               path: [last, { lat: trendLat, lng: trendLng }],
               geodesic: true,
               strokeColor: "#22D3EE",
               strokeOpacity: 0.8,
               strokeWeight: 3,
               icons: [{
                 icon: { path: google.maps.SymbolPath.FORWARD_OPEN_ARROW, scale: 3, strokeColor: "#22D3EE" },
                 offset: '100%'
               }],
               map: map
             });
           }
        }

        // Câmeras (Clusterer)
        const markers: google.maps.Marker[] = [];
        mockCameras.forEach(cam => {
          const marker = new google.maps.Marker({
            position: { lat: cam.lat, lng: cam.lng },
            icon: {
              path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z",
              fillColor: "#328CC1",
              fillOpacity: 0.4,
              strokeWeight: 0,
              scale: 0.5
            }
          });
          markers.push(marker);
        });

        clustererRef.current = new MarkerClusterer({
          map,
          markers,
          algorithm: new GridAlgorithm({}),
          renderer: {
            render: ({ count, position }) => {
              return new google.maps.Marker({
                position,
                label: { text: String(count), color: "white", fontSize: "10px", fontWeight: "bold" },
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: "#0B3C5D",
                  fillOpacity: 0.9,
                  strokeColor: "#328CC1",
                  strokeWeight: 2,
                  scale: 15 + Math.min(count / 10, 10),
                },
                zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
              });
            }
          }
        });

        // Unidades de Campo
        fieldUnits.forEach(unit => {
          const marker = new google.maps.Marker({ 
            position: { lat: unit.lat, lng: unit.lng }, 
            map, 
            zIndex: 50,
            title: unit.callsign,
            icon: { 
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, 
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
      }).catch(() => onMapLoaded()); // Falha silenciosa, usa fallback
    }
  }, [useStaticFallback, isOnline, targetTrajectory, mockCameras, fieldUnits, onMapLoaded, onSelectUnit]);

  // Atualiza posições das unidades e rota selecionada
  useEffect(() => {
    if (googleMapRef.current && fieldUnits.length > 0) {
      fieldUnits.forEach(unit => {
        const marker = unitMarkersRef.current[unit.id];
        if (marker) {
          marker.setPosition({ lat: unit.lat, lng: unit.lng });
        }
      });

      if (selectedUnit) {
        if (polylineRef.current) polylineRef.current.setMap(null);
        
        polylineRef.current = new google.maps.Polyline({
          path: [{ lat: selectedUnit.lat, lng: selectedUnit.lng }, TARGET_COORDS],
          geodesic: true,
          strokeColor: "#328CC1",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          icons: [{ 
            icon: { path: google.maps.SymbolPath.CIRCLE, scale: 4, fillColor: "#328CC1", fillOpacity: 1 }, 
            offset: "0%" 
          }],
          map: googleMapRef.current
        });

        let count = 0;
        const interval = setInterval(() => {
          count = (count + 1) % 200;
          const icons = polylineRef.current?.get('icons');
          if (icons && icons[0]) {
            icons[0].offset = (count / 2) + '%';
            polylineRef.current?.set('icons', icons);
          }
        }, 20);

        return () => clearInterval(interval);
      }
    }
  }, [fieldUnits, selectedUnit]);

  // Toggle de Câmeras
  useEffect(() => {
    if (clustererRef.current) {
      if (showCameras) {
        clustererRef.current.setMap(googleMapRef.current);
      } else {
        clustererRef.current.setMap(null);
      }
    }
  }, [showCameras]);

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
          {fieldUnits.map(unit => (
            <div key={unit.id} className="absolute cursor-pointer transition-all duration-1000" style={{ top: `${((unit.lat + 23.5) * 1000) % 100}%`, left: `${((unit.lng + 46.5) * 1000) % 100}%` }} onClick={() => onSelectUnit(unit)}>
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
