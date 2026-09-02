import { motion } from 'framer-motion';
import { Battery, Signal, Navigation2, Zap } from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';

/**
 * TelemetryOverlay: HUD de telemetria para simulação de Drone/Bodycam (P9).
 * Fix #4: Interval agora usa useRef para cleanup estável e evitar memory leaks.
 */
export function TelemetryOverlay() {
  const [telemetry, setTelemetry] = useState({
    alt: 42.5,
    battery: 88,
    signal: 94,
    pitch: 0.2,
    roll: -0.1
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const updateTelemetry = useCallback(() => {
    setTelemetry(prev => ({
      alt: +(prev.alt + (Math.random() - 0.5) * 0.2).toFixed(1),
      battery: +Math.max(0, prev.battery - 0.01).toFixed(1),
      signal: Math.floor(90 + Math.random() * 10),
      pitch: +((Math.random() - 0.5) * 2).toFixed(2),
      roll: +((Math.random() - 0.5) * 2).toFixed(2)
    }));
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(updateTelemetry, 500);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [updateTelemetry]);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 p-4 font-mono text-[10px] text-cyan-400/80">
      {/* Top Left: Signal & Battery */}
      <div className="absolute top-4 left-4 flex gap-4 bg-black/20 backdrop-blur-sm p-2 border border-white/5 rounded">
        <div className="flex items-center gap-1.5">
          <Signal className="h-3 w-3" />
          <span>RF_LINK: {telemetry.signal}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Battery className={telemetry.battery < 20 ? "h-3 w-3 text-red-500 animate-pulse" : "h-3 w-3"} />
          <span>BAT: {telemetry.battery}%</span>
        </div>
      </div>

      {/* Top Right: Altitude & Heading */}
      <div className="absolute top-4 right-4 text-right bg-black/20 backdrop-blur-sm p-2 border border-white/5 rounded">
        <div className="flex items-center justify-end gap-1.5">
          <span>ALT: {telemetry.alt}m</span>
          <Navigation2 className="h-3 w-3 rotate-45" />
        </div>
        <div>HDG: 284° NW</div>
      </div>

      {/* Center: Pitch/Roll Indicators */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/5 rounded-full opacity-20" aria-hidden="true">
        <motion.div 
          animate={{ rotate: telemetry.roll, y: telemetry.pitch * 5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-full h-[1px] bg-cyan-400" />
          <div className="h-full w-[1px] bg-cyan-400" />
        </motion.div>
      </div>

      {/* Bottom Left: Ticker */}
      <div className="absolute bottom-4 left-4 space-y-1">
        <div className="flex items-center gap-2 text-primary">
          <Zap className="h-3 w-3 animate-pulse" />
          <span className="font-black uppercase tracking-widest">Gimbal_Stabilized</span>
        </div>
        <div className="opacity-50">SENS_TYPE: EO_THERMAL_V3</div>
      </div>
    </div>
  );
}
