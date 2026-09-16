import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Carrega os scripts do editor estático (window.*) no contexto jsdom
function loadScript(name: string): void {
  const src = readFileSync(resolve(__dirname, '../../public/js', name), 'utf8');
  // eval indireto → escopo global, onde `window` existe
  (0, eval)(src);
}

declare global {
  interface Window {
    State: any;
  }
}

describe('State (public/js/state.js)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    loadScript('state.js');
  });

  it('tem valores padrão corretos', () => {
    const S = window.State;
    expect(S.filter).toBe('none');
    expect(S.brightness).toBe(100);
    expect(S.contrast).toBe(100);
    expect(S.saturation).toBe(100);
    expect(S.ratio).toBe('9:16');
    expect(S.selected).toBeNull();
    expect(S.feedImages.size).toBe(0);
  });

  describe('getFilterString', () => {
    it('retorna "none" sem ajustes', () => {
      expect(window.State.getFilterString()).toBe('none');
    });

    it('aplica preset grayscale', () => {
      window.State._preset = 'grayscale';
      expect(window.State.getFilterString()).toContain('grayscale(100%)');
    });

    it('aplica preset sepia', () => {
      window.State._preset = 'sepia';
      const s = window.State.getFilterString();
      expect(s).toContain('sepia(80%)');
      expect(s).toContain('saturate(150%)');
    });

    it('combina brightness e exposure em um único brightness()', () => {
      window.State.brightness = 120;
      window.State.exposure = 100;
      const s = window.State.getFilterString();
      expect((s.match(/brightness/g) || []).length).toBe(1);
      expect(s).toContain('brightness(120%)');
    });

    it('limita luminância a 400%', () => {
      window.State.brightness = 10000;
      expect(window.State.getFilterString()).toContain('brightness(400%)');
    });

    it('limita luminância mínima a 0%', () => {
      window.State.brightness = 0;
      expect(window.State.getFilterString()).toContain('brightness(0%)');
    });

    it('temperatura quente adiciona sepia', () => {
      window.State.temperature = 150;
      expect(window.State.getFilterString()).toContain('sepia(23%)');
    });

    it('temperatura fria adiciona hue-rotate', () => {
      window.State.temperature = 50;
      expect(window.State.getFilterString()).toContain('hue-rotate');
    });
  });

  describe('feedImages', () => {
    it('adiciona e renderiza imagens no grid', () => {
      document.body.innerHTML = '<div id="feedGrid"></div>';
      window.State.addFeedImage('http://x/a.jpg', 'a.jpg');
      window.State.addFeedImage('http://x/b.jpg', 'b.jpg');
      const grid = document.getElementById('feedGrid')!;
      expect(grid.children.length).toBe(2);
      expect(window.State.feedImages.size).toBe(2);
    });

    it('remove imagem do grid', () => {
      document.body.innerHTML = '<div id="feedGrid"></div>';
      window.State.addFeedImage('http://x/a.jpg', 'a.jpg');
      window.State.removeFeedImage('http://x/a.jpg');
      expect(window.State.feedImages.size).toBe(0);
      expect(document.getElementById('feedGrid')!.children.length).toBe(0);
    });

    it('não quebra sem o elemento #feedGrid', () => {
      expect(() => window.State.addFeedImage('http://x/a.jpg', 'a.jpg')).not.toThrow();
      expect(window.State.feedImages.size).toBe(1);
    });

    it('nome de arquivo não vira HTML (anti-XSS)', () => {
      document.body.innerHTML = '<div id="feedGrid"></div>';
      const evil = '<img src=x onerror=alert(1)>';
      window.State.addFeedImage('http://x/evil.jpg', evil);
      const grid = document.getElementById('feedGrid')!;
      // o nome deve aparecer como alt text, não como tag img injetada
      const imgs = Array.from(grid.querySelectorAll('img'));
      expect(imgs.some((i) => i.alt === evil)).toBe(true);
      expect(imgs.length).toBe(1);
    });
  });
});
