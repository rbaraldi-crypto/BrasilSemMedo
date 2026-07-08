import { motion } from 'framer-motion';

/**
 * AnatomiaDigital: Overlay de wireframe para simular reconstrução facial 3D.
 */
export function AnatomiaDigital() {
  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
      <svg className="w-full h-full opacity-60" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Malha Facial Principal */}
        <motion.path
          d="M200 80 C140 80 100 140 100 200 C100 280 140 340 200 340 C260 340 300 280 300 200 C300 140 260 80 200 80 Z"
          stroke="#22D3EE"
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        {/* Linhas de Conexão Nodal */}
        <motion.path
          d="M100 200 L300 200 M200 80 L200 340 M130 140 L270 260 M130 260 L270 140"
          stroke="#22D3EE"
          strokeWidth="0.3"
          strokeDasharray="4 4"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />

        {/* Pontos de Controle (Olhos, Nariz, Boca) */}
        <motion.circle cx="160" cy="170" r="3" fill="#22D3EE" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} />
        <motion.circle cx="240" cy="170" r="3" fill="#22D3EE" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} />
        <motion.circle cx="200" cy="220" r="2" fill="#22D3EE" />
        <motion.path d="M160 270 Q200 300 240 270" stroke="#22D3EE" strokeWidth="1" />

        {/* Varredura de Profundidade */}
        <motion.rect
          x="80"
          y="80"
          width="240"
          height="2"
          fill="rgba(34, 211, 238, 0.5)"
          animate={{ y: [80, 340, 80] }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        />
      </svg>
      
      {/* Tickers de Coordenadas */}
      <div className="absolute top-4 right-4 text-[10px] font-mono text-cyan-400/60 space-y-1">
        <div>X_AXIS: {Math.random().toFixed(4)}</div>
        <div>Y_AXIS: {Math.random().toFixed(4)}</div>
        <div>Z_DEPTH: VALID</div>
      </div>
    </div>
  );
}
