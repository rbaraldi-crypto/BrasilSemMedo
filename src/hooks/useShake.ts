import { useState, useCallback } from 'react';

/**
 * useShake: Simula feedback hático visual (U5)
 * Utilizado para enfatizar eventos críticos na interface.
 */
export function useShake() {
  const [isShaking, setIsShaking] = useState(false);

  const triggerShake = useCallback((duration = 500) => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), duration);
  }, []);

  const shakeClass = isShaking ? "animate-shake" : "";

  return { triggerShake, shakeClass };
}
