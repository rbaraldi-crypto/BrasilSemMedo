import { Badge } from '@/components/ui/badge';
import { Skull, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HierarchyNode as HierarchyNodeType } from '@/types/intelligence';

interface HierarchyNodeProps {
  node: HierarchyNodeType;
  isSelected: boolean;
  onClick: () => void;
  color: string;
  isSmall?: boolean;
}

export function HierarchyNode({ node, isSelected, onClick, color, isSmall = false }: HierarchyNodeProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all duration-200 flex flex-col items-center gap-2 p-4 rounded-xl border",
        isSelected ? "border-primary bg-primary/10 scale-105 shadow-lg shadow-primary/10" : "border-white/10 bg-slate-900 hover:border-white/30",
        isSmall ? "w-32" : "w-44"
      )}
    >
      <div className={cn("rounded-full p-2 bg-black/40 border border-white/5", color)}>
        {node.level === 1 ? <Skull className="h-7 w-7" /> : <Target className="h-5 w-5" />}
      </div>
      <div className="text-center overflow-hidden w-full">
        <p className="text-[10px] font-bold text-white truncate w-full">{node.name}</p>
        <p className="text-[8px] text-slate-500 font-medium uppercase tracking-wider truncate w-full">{node.role}</p>
      </div>
      {node.status === 'Foragido' && (
        <Badge className="bg-red-500 text-white text-[7px] font-bold uppercase border-none h-4 px-1.5">Procurado</Badge>
      )}
    </div>
  );
}
