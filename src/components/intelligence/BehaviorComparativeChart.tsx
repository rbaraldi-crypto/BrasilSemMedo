import { 
  Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, ResponsiveContainer, Legend, Tooltip 
} from 'recharts';
import { BehaviorMetric } from '@/types/intelligence';

interface BehaviorComparativeChartProps {
  data: BehaviorMetric[];
}

/**
 * Medida 2: Reintegration vs. Custody Tracking
 * Comparativo visual entre comportamento juvenil e exigências do sistema adulto.
 */
export function BehaviorComparativeChart({ data }: BehaviorComparativeChartProps) {
  return (
    <div className="h-[280px] w-full bg-black/20 rounded-2xl border border-white/5 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#1e293b" strokeDasharray="3 3" />
          <PolarAngleAxis 
            dataKey="name" 
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} 
          />
          <Radar
            name="Perfil Juvenil (Ressocialização)"
            dataKey="juvenile"
            stroke="#22D3EE"
            fill="#22D3EE"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Radar
            name="Requisitos TREVA (Custódia Adulta)"
            dataKey="adult"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.4}
            strokeWidth={2}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0f172a', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            iconType="circle"
            wrapperStyle={{ 
              fontSize: '10px', 
              fontWeight: 'black', 
              textTransform: 'uppercase', 
              paddingTop: '20px',
              letterSpacing: '0.05em'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
