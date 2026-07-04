import { useEffect, useState } from 'react';

/**
 * WatermarkOverlay: Proteção de dados S2 (Anti-Leak).
 * Exibe informações do operador e rastreabilidade.
 */
export function WatermarkOverlay() {
  const [timestamp, setTimestamp] = useState(new Date().toLocaleString());

  useEffect(() => {
    const timer = setInterval(() => setTimestamp(new Date().toLocaleString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Dados simulados do operador para rastreabilidade
  const operatorData = {
    id: "JUIZ-SILVA-8921",
    unit: "VARA-EXEC-SP",
    clearance: "TOP-SECRET",
    ip: "10.42.1.154"
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-[100] overflow-hidden opacity-[0.05] select-none">
      <div className="absolute inset-0 flex flex-wrap gap-x-32 gap-y-24 p-10 justify-around items-center rotate-[-20deg] scale-125">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="text-white font-mono text-[9px] font-black whitespace-nowrap leading-tight border border-white/10 p-2">
            <div>{operatorData.id} // {operatorData.clearance}</div>
            <div>{operatorData.ip} // {timestamp}</div>
            <div className="text-primary/60">CONFIDENCIAL IABS-SIP // BRASIL SEM MEDO</div>
          </div>
        ))}
      </div>
    </div>
  );
}
