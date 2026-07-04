/**
 * Web Worker para processamento de ruído digital fora da thread principal.
 * Melhora a performance da Muralha Brasileira.
 */
self.onmessage = (e: MessageEvent) => {
  const { width, height, intensity } = e.data;
  const size = width * height * 4;
  const buffer = new Uint8ClampedArray(size);

  for (let i = 0; i < size; i += 4) {
    const randomVal = Math.random();
    const value = (intensity > randomVal) ? Math.random() * 255 : 0;
    buffer[i] = value;     // R
    buffer[i + 1] = value; // G
    buffer[i + 2] = value; // B
    buffer[i + 3] = 35;    // A (Opacidade fixa para o efeito)
  }

  self.postMessage({ buffer }, [buffer.buffer] as any);
};
