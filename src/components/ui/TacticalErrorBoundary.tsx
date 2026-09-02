import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { tacticalAudio } from '@/lib/audioUtils';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  moduleName: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * TacticalErrorBoundary (R1): Garante a estabilidade da missão.
 * Se um módulo falhar, ele isola o erro e permite o reset individual.
 */
export class TacticalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('TacticalErrorBoundary', `Módulo falhou: ${this.props.moduleName}`, error, errorInfo);
    tacticalAudio.playScan(); // Alerta sonoro de falha
  }

  private handleReset = () => {
    logger.info('TacticalErrorBoundary', `Resetando módulo: ${this.props.moduleName}`);
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-slate-950 border-2 border-destructive/20 rounded-lg animate-in fade-in duration-500">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-destructive/20 blur-xl rounded-full animate-pulse" />
            <ShieldX className="h-16 w-16 text-destructive relative z-10" />
          </div>
          
          <div className="text-center space-y-2 max-w-xs">
            <h3 className="text-sm font-black text-white uppercase tracking-tighter">Módulo Corrompido</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-tight">
              Falha crítica detectada no componente: <span className="text-destructive">{this.props.moduleName}</span>
            </p>
          </div>

          <div className="mt-8 w-full space-y-3">
            <div className="p-3 bg-black/40 border border-white/5 rounded font-mono text-[10px] text-slate-400 overflow-hidden">
              <p className="truncate">ERR_SIG: {this.state.error?.message || "UNKNOWN_EXCEPTION"}</p>
              <p className="text-primary/40 mt-1 uppercase">Ação: Isolamento de Memória Ativo</p>
            </div>
            
            <Button 
              onClick={this.handleReset}
              variant="outline" 
              className="w-full border-primary/30 text-primary hover:bg-primary/10 font-black uppercase text-xs tracking-widest h-10"
            >
              <RefreshCw className="h-3 w-3 mr-2" /> Reinicializar Módulo
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
