import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUI } from '@/contexts/UIContext';
import { tacticalAudio } from '@/lib/audioUtils';

export function useTacticalShortcuts() {
  const navigate = useNavigate();
  const { setActiveModal } = useUI();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Previne comportamentos padrão do browser para F-keys
      if (['F1', 'F2', 'F3', 'F4'].includes(e.key)) {
        e.preventDefault();
        tacticalAudio.playScan();
      }

      switch (e.key) {
        case 'F1':
          navigate('/brasil-sem-medo');
          setActiveModal('MURALHA');
          break;
        case 'F2':
          navigate('/brasil-sem-medo');
          setActiveModal('MAP');
          break;
        case 'F3':
          navigate('/estatisticas');
          break;
        case 'F4':
          navigate('/compliance');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, setActiveModal]);
}
