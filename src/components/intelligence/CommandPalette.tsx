import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Command, Search, ShieldAlert, Scan, Landmark, 
  Skull, Gavel, Zap, Terminal, Keyboard,
  Briefcase, User, MapPin, Loader2, ArrowRight
} from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTacticalShortcuts } from '@/hooks/useTacticalShortcuts';
import { intelligenceService } from '@/services/intelligenceService';
import { useTactical } from '@/contexts/TacticalContext';
import { useUI } from '@/contexts/UIContext';
import { cn } from '@/lib/utils';
import { tacticalAudio } from '@/lib/audioUtils';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const { setSelectedOrg } = useTactical();
  const { togglePanel } = useUI();
  
  useTacticalShortcuts();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSearch = useCallback(async (val: string) => {
    setQuery(val);
    if (val.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const searchData = await intelligenceService.globalSearch(val);
    setResults(searchData);
    setIsSearching(false);
  }, []);

  const executeAction = (item: any) => {
    tacticalAudio.playSuccess();
    setOpen(false);
    setQuery("");
    setResults([]);

    switch (item.type) {
      case 'ORGANIZATION':
        setSelectedOrg(item.data);
        navigate('/brasil-sem-medo');
        togglePanel('MAP');
        break;
      case 'CASE':
        navigate(`/meus-casos/${item.id}`);
        break;
      case 'UNIT':
        navigate('/brasil-sem-medo');
        togglePanel('MURALHA');
        break;
      default:
        item.action();
    }
  };

  const quickCommands = [
    { icon: Scan, label: "Muralha Brasileira (F1)", action: () => navigate('/brasil-sem-medo'), type: 'COMMAND' },
    { icon: Landmark, label: "Asfixia Financeira (F3)", action: () => navigate('/estatisticas'), type: 'COMMAND' },
    { icon: ShieldAlert, label: "Compliance & Ponto 11 (F4)", action: () => navigate('/compliance'), type: 'COMMAND' },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 bg-slate-950 border-white/10 shadow-2xl overflow-hidden max-w-2xl top-[20%] translate-y-0">
        <div className="flex items-center border-b border-white/10 px-4 h-14">
          <Search className="mr-3 h-5 w-5 text-slate-500" />
          <input 
            className="flex-1 bg-transparent border-none text-white focus:ring-0 placeholder:text-slate-600 text-sm"
            placeholder="Buscar CPF, Processo ou Organização..."
            autoFocus
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {isSearching ? (
            <Loader2 className="h-4 w-4 text-primary animate-spin" />
          ) : (
            <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-white/5">
              <Keyboard className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-mono text-primary uppercase">Global_Search</span>
            </div>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto p-2 custom-scrollbar">
          {query.length > 0 ? (
            <div className="space-y-1">
              <div className="px-2 py-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Resultados da Inteligência</div>
              {results.length > 0 ? (
                results.map((item) => (
                  <SearchItem key={item.id} item={item} onClick={() => executeAction(item)} />
                ))
              ) : !isSearching && (
                <div className="p-8 text-center">
                  <p className="text-xs text-slate-500 font-medium">Nenhum registro encontrado para "{query}"</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-2 py-1.5 text-[9px] font-black text-slate-500 uppercase tracking-widest">Comandos do Sistema</div>
              {quickCommands.map((cmd, i) => (
                <SearchItem key={i} item={cmd} onClick={() => executeAction(cmd)} />
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-900/50 p-3 border-t border-white/10 flex justify-between items-center">
          <span className="text-[9px] text-slate-500 font-mono uppercase tracking-tighter">IABS-SIP // Spotlight Engine v2.6</span>
          <div className="flex gap-2">
             <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/10 text-[9px] text-slate-400 font-mono">ESC para fechar</kbd>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SearchItem({ item, onClick }: { item: any, onClick: () => void }) {
  const Icon = item.type === 'ORGANIZATION' ? Skull : 
               item.type === 'CASE' ? Briefcase : 
               item.type === 'UNIT' ? MapPin : item.icon;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-primary/10 hover:text-primary transition-all group text-left"
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-primary/30">
          <Icon className="h-4 w-4 text-slate-500 group-hover:text-primary" />
        </div>
        <div className="truncate">
          <p className="text-xs font-bold text-slate-200 group-hover:text-white truncate">{item.title || item.label}</p>
          <p className="text-[10px] text-slate-500 group-hover:text-primary/70 truncate">{item.subtitle}</p>
        </div>
      </div>
      <ArrowRight className="h-3 w-3 text-slate-700 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
    </button>
  );
}
