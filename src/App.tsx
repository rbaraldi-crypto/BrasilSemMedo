import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Dashboard } from '@/pages/Dashboard';
import { Profile } from '@/pages/Profile';
import { Compliance } from '@/pages/Compliance';
import { Precedents } from '@/pages/Precedents';
import { HITL } from '@/pages/HITL';
import { MyCases } from '@/pages/MyCases';
import { CaseReview } from '@/pages/CaseReview';
import { StatsDashboard } from '@/pages/StatsDashboard';
import StrategicIntelligence from '@/pages/StrategicIntelligence';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from '@/components/ui/sonner';
import { TacticalTour } from '@/components/intelligence/TacticalTour';

function App() {
  return (
    <LanguageProvider>
      <Router>
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
          </Route>
          <Route path="/estatisticas" element={<StatsDashboard />} />
        </Routes>
      </Router>
      <Toaster richColors position="top-right" />
      <TacticalTour /> {/* Briefing Tático (U3) */}
    </LanguageProvider>
  );
}

export default App;
