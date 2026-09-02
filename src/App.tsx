import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StandaloneLayout } from '@/components/layout/StandaloneLayout';
import { FDELayout } from '@/pages/FDE/FDELayout';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from '@/components/ui/sonner';
import { TacticalTour } from '@/components/intelligence/TacticalTour';
import { TacticalSkeleton } from '@/components/ui/TacticalSkeleton';

const Dashboard = lazy(() => import('@/pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Profile = lazy(() => import('@/pages/Profile').then(m => ({ default: m.Profile })));
const Compliance = lazy(() => import('@/pages/Compliance').then(m => ({ default: m.Compliance })));
const Precedents = lazy(() => import('@/pages/Precedents').then(m => ({ default: m.Precedents })));
const HITL = lazy(() => import('@/pages/HITL').then(m => ({ default: m.HITL })));
const MyCases = lazy(() => import('@/pages/MyCases').then(m => ({ default: m.MyCases })));
const CaseReview = lazy(() => import('@/pages/CaseReview').then(m => ({ default: m.CaseReview })));
const StatsDashboard = lazy(() => import('@/pages/StatsDashboard').then(m => ({ default: m.StatsDashboard })));
const StrategicIntelligence = lazy(() => import('@/pages/StrategicIntelligence'));
const CaseDistribution = lazy(() => import('@/pages/CaseDistribution').then(m => ({ default: m.CaseDistribution })));

// FDE Pages
const FDEDashboard = lazy(() => import('@/pages/FDE/FDEDashboard').then(m => ({ default: m.FDEDashboard })));
const FDECases = lazy(() => import('@/pages/FDE/FDECases').then(m => ({ default: m.FDECases })));
const FDECase360 = lazy(() => import('@/pages/FDE/FDECase360').then(m => ({ default: m.FDECase360 })));
const FDEHitl = lazy(() => import('@/pages/FDE/FDEHitl').then(m => ({ default: m.FDEHitl })));
const FDEGeneric = lazy(() => import('@/pages/FDE/FDEGeneric').then(m => ({ default: m.FDEGeneric })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-10">
      <TacticalSkeleton lines={12} className="max-w-2xl w-full" />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="meus-casos" element={<MyCases />} />
              <Route path="meus-casos/:id" element={<CaseReview />} />
              <Route path="perfil/:id" element={<Profile />} />
              <Route path="compliance" element={<Compliance />} />
              <Route path="precedentes" element={<Precedents />} />
              <Route path="acao-humana" element={<HITL />} />
              <Route path="acao-humana/:taskId" element={<HITL />} />
              <Route path="brasil-sem-medo" element={<StrategicIntelligence />} />
              <Route path="distribuicao" element={<CaseDistribution />} />
            </Route>

            <Route element={<StandaloneLayout />}>
              <Route path="/estatisticas" element={<StatsDashboard />} />
            </Route>

            {/* FDE Routes */}
            <Route path="/fde" element={<FDELayout />}>
              <Route index element={<Navigate to="/fde/dashboard/executivo" replace />} />
              <Route path="dashboard/:type" element={<FDEDashboard />} />
              <Route path="cases" element={<FDECases />} />
              <Route path="case360" element={<FDECase360 />} />
              <Route path="hitl" element={<FDEHitl />} />
              <Route path="decision" element={<FDEHitl />} />
              <Route path="transacoes" element={<FDEGeneric />} />
              <Route path="fluxo" element={<FDEGeneric />} />
              <Route path="entidades" element={<FDEGeneric />} />
              <Route path="organizacoes" element={<FDEGeneric />} />
              <Route path="ativos" element={<FDEGeneric />} />
              <Route path="grafo" element={<FDEGeneric />} />
              <Route path="analise" element={<FDEGeneric />} />
              <Route path="scores" element={<FDEGeneric />} />
              <Route path="alertas" element={<FDEGeneric />} />
              <Route path="explicabilidade" element={<FDEGeneric />} />
              <Route path="legal" element={<FDEGeneric />} />
              <Route path="rules" element={<FDEGeneric />} />
              <Route path="rule-comparison" element={<FDEGeneric />} />
              <Route path="rule-sandbox" element={<FDEGeneric />} />
              <Route path="interagency" element={<FDEGeneric />} />
              <Route path="intel-packages" element={<FDEGeneric />} />
              <Route path="sharing" element={<FDEGeneric />} />
              <Route path="dossie" element={<FDEGeneric />} />
              <Route path="relatorios" element={<FDEGeneric />} />
              <Route path="auditoria" element={<FDEGeneric />} />
              <Route path="admin" element={<FDEGeneric />} />
              <Route path="evidencias" element={<FDEGeneric />} />
              <Route path="timeline" element={<FDEGeneric />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
      <Toaster richColors position="top-right" />
      <TacticalTour />
    </LanguageProvider>
  );
}

export default App;
