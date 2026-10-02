import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export function CoordinatorDistribution() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-primary">Distribuição de Coordenadores</h2>
          <p className="text-muted-foreground">Gestão de alocação e distribuição de carga de trabalho.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coordenadores Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Módulo em desenvolvimento.</p>
        </CardContent>
      </Card>
    </div>
  );
}
