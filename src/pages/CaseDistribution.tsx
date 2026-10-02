import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';

export function CaseDistribution() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Briefcase className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-primary">Distribuição de Casos</h2>
          <p className="text-muted-foreground">Distribuição automática e manual de processos judiciais.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Fila de Distribuição</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Módulo em desenvolvimento.</p>
        </CardContent>
      </Card>
    </div>
  );
}
