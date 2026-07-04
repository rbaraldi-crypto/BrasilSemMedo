import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ShieldAlert, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HardenedModeToggleProps {
  checked: boolean;
  onCheckedChange: (val: boolean) => void;
  disabled?: boolean;
}

/**
 * Medida 6 & 11: Modo Endurecido
 * Desativa progressão para crimes hediondos e narcoterrorismo.
 */
export function HardenedModeToggle({ checked, onCheckedChange, disabled }: HardenedModeToggleProps) {
  return (
    <div className={cn(
      "p-4 rounded-2xl border-2 transition-all duration-500 flex items-center justify-between gap-4",
      checked ? "bg-red-950/20 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.2)]" : "bg-slate-900 border-white/10"
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
          checked ? "bg-red-600 text-white animate-pulse" : "bg-white/5 text-slate-500"
        )}>
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <Label className="text-xs font-black uppercase text-white tracking-tighter">Modo Endurecido (Ponto 11)</Label>
          <p className="text-[9px] text-slate-500 font-medium leading-tight">Bloqueio total de progressão para crimes hediondos.</p>
        </div>
      </div>
      <Switch 
        checked={checked} 
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="data-[state=checked]:bg-red-600"
      />
    </div>
  );
}
