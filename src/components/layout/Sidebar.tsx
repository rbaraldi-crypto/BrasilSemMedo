import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, User, Scale, FileText, Gavel, 
  ShieldAlert, Globe, Briefcase, ShieldCheck, 
  Menu, X, Eye, Lock, ShieldX, Scan, Zap 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from '@/contexts/LanguageContext';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useUI } from '@/contexts/UIContext';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { isNightVision, setNightVision, isLocked, setLocked, setActiveModal, requestMuralhaScan } = useUI();
  const [isOpen, setIsOpen] = useState(false);

  // Função para testar a Muralha Brasileira de qualquer lugar
  const handleMuralhaTest = () => {
    // Navega para a página estratégica para garantir contexto visual
    navigate('/brasil-sem-medo');
    // Abre o modal e dispara o scan
    setActiveModal('MURALHA');
    requestMuralhaScan();
    setIsOpen(false);
  };

  const navItems = [
    { label: t('nav.dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { label: t('nav.mycases'), path: '/meus-casos', icon: Briefcase },
    { label: 'Brasil Sem Medo', path: '/brasil-sem-medo', icon: ShieldCheck },
    // Botão de Teste da Muralha no Menu Principal
    { label: 'Muralha Paulista', path: '#muralha', icon: Scan, onClick: handleMuralhaTest, isAction: true },
    { label: t('nav.profile'), path: '/perfil/SIP-2024-8921', icon: User },
    { label: t('nav.compliance'), path: '/compliance', icon: ShieldAlert },
    { label: t('nav.precedents'), path: '/precedentes', icon: Scale },
    { label: t('nav.hitl'), path: '/acao-humana', icon: Gavel },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900/95 backdrop-blur-xl text-white border-r border-white/10 shadow-2xl">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-3">
          <div className="h-9 w-9 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <FileText className="h-5 w-5 text-white" />
          </div>
          IABS-SIP
        </h1>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-2">Sistema Integrado Penal</p>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          
          if (item.isAction) {
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-black uppercase tracking-tighter transition-all duration-200 group text-cyan-400 hover:bg-cyan-400/10 border border-transparent hover:border-cyan-400/20"
              >
                <item.icon className="h-4 w-4 transition-transform group-hover:scale-110 animate-pulse" />
                {item.label}
                <Zap className="h-3 w-3 ml-auto opacity-50" />
              </button>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-slate-500 group-hover:text-white")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/10 bg-black/20 space-y-4">
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-500 uppercase font-bold tracking-wider">
                <Globe className="h-3 w-3" /> Idioma
            </div>
            <Select value={language} onValueChange={(val: any) => setLanguage(val)}>
                <SelectTrigger className="h-9 bg-slate-800 border-white/10 text-white text-xs rounded-lg">
                    <SelectValue placeholder="Idioma" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/10 text-white">
                    <SelectItem value="pt" className="text-xs">Português (BR)</SelectItem>
                    <SelectItem value="en" className="text-xs">English (US)</SelectItem>
                    <SelectItem value="es" className="text-xs">Español</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2">
                <Eye className={cn("h-3.5 w-3.5 transition-colors", isNightVision ? "text-success" : "text-slate-500")} />
                <span className="text-xs font-black uppercase tracking-widest text-slate-300">Operação táctica</span>
              </div>
              <Switch 
                checked={isNightVision} 
                onCheckedChange={setNightVision}
                className="data-[state=checked]:bg-success"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2">
                <ShieldX className={cn("h-3.5 w-3.5 transition-colors", isLocked ? "text-destructive" : "text-slate-500")} />
                <span className="text-xs font-black uppercase tracking-widest text-slate-300">Bloqueio de terminal</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-[10px] font-black uppercase bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/30 transition-all"
                onClick={() => setLocked(true)}
              >
                Simular
              </Button>
            </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
          <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            JD
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-white truncate">Juiz Dr. Silva</span>
            <span className="text-xs text-slate-500 font-medium">Vara de Execuções</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:flex w-64 h-screen fixed left-0 top-0 z-50">
        <SidebarContent />
      </div>

      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900/90 backdrop-blur-md border-b border-white/10 z-[60] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-primary rounded flex items-center justify-center">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-white tracking-tight">IABS-SIP</span>
        </div>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 border-r-white/10">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
