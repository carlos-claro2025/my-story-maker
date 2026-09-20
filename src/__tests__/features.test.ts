import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function loadScript(name: string): void {
  const src = readFileSync(resolve(__dirname, '../../public/js', name), 'utf8');
  (0, eval)(src);
}

declare global {
  interface Window {
    Theme: any;
    Templates: any;
    Export: any;
    State: any;
  }
}

describe('Theme (public/js/theme.js)', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    localStorage.clear();
    document.head.innerHTML = '<meta name="theme-color" content="#0e0e0e">';
    document.body.innerHTML = '';
    loadScript('theme.js');
  });

  it('usa o tema escuro como padrão quando nada está salvo', () => {
    expect(window.Theme.resolve()).toBe('dark');
  });

  it('respeita a preferência salva em localStorage', () => {
    localStorage.setItem('storyMaker_theme', 'light');
    expect(window.Theme.resolve()).toBe('light');
  });

  it('ignora valores inválidos no localStorage', () => {
    localStorage.setItem('storyMaker_theme', 'neon');
    expect(window.Theme.resolve()).toBe('dark');
  });

  it('apply define data-theme no <html>', () => {
    window.Theme.apply('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('apply com persist salva a escolha em localStorage', () => {
    window.Theme.apply('light', true);
    expect(localStorage.getItem('storyMaker_theme')).toBe('light');
  });

  it('apply sem persist não altera a preferência salva', () => {
    localStorage.setItem('storyMaker_theme', 'dark');
    window.Theme.apply('light');
    expect(localStorage.getItem('storyMaker_theme')).toBe('dark');
  });

  it('apply normaliza modos desconhecidos para escuro', () => {
    window.Theme.apply('neon');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('apply atualiza o meta theme-color', () => {
    window.Theme.apply('light');
    const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    expect(meta.content).toBe('#f5f6f8');
  });

  it('apply dispara o evento themechange', () => {
    const handler = vi.fn();
    document.addEventListener('themechange', handler);
    window.Theme.apply('light');
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('toggle alterna entre claro e escuro', () => {
    window.Theme.apply('dark');
    window.Theme.toggle();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    window.Theme.toggle();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('sync reflete o estado no botão #themeToggle', () => {
    document.body.innerHTML =
      '<button id="themeToggle" aria-pressed="false"></button>';
    window.Theme.apply('light');
    const btn = document.getElementById('themeToggle')!;
    expect(btn.getAttribute('aria-pressed')).toBe('true');
    expect(btn.getAttribute('aria-label')).toBeTruthy();
  });
});

describe('Export (public/js/export.js)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    loadScript('export.js');
  });

  it('começa em 2x', () => {
    expect(window.Export.scale).toBe(2);
  });

  it('setScale aceita 1..4 e devolve o valor aplicado', () => {
    expect(window.Export.setScale(3)).toBe(3);
    expect(window.Export.scale).toBe(3);
  });

  it('setScale ignora valores fora da faixa', () => {
    window.Export.setScale(2);
    expect(window.Export.setScale(0)).toBe(2);
    expect(window.Export.setScale(99)).toBe(2);
    expect(window.Export.setScale('abc')).toBe(2);
  });
});

describe('Templates.suggestFor (public/js/templates.js)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    loadScript('templates.js');
  });

  it('sem fotos não sugere nada', () => {
    expect(window.Templates.suggestFor(0)).toBeNull();
  });

  it('1 foto sugere tela inteira', () => {
    expect(window.Templates.suggestFor(1).template).toBe('empty');
  });

  it('2 a 4 fotos sugerem mosaico', () => {
    expect(window.Templates.suggestFor(2).template).toBe('mosaic');
    expect(window.Templates.suggestFor(4).template).toBe('mosaic');
  });

  it('5 ou mais fotos sugerem grade 3x3', () => {
    expect(window.Templates.suggestFor(5).template).toBe('grid3');
    expect(window.Templates.suggestFor(12).template).toBe('grid3');
  });

  it('refreshSuggestion mostra o aviso quando o template atual difere', () => {
    document.body.innerHTML =
      '<div id="templateSuggestion" style="display:none;">' +
      '<span id="templateSuggestionText"></span></div>';
    window.State = { feedImages: new Map([['a', 'a'], ['b', 'b']]) };
    window.Templates.current = 'empty';
    const result = window.Templates.refreshSuggestion();
    expect(result.template).toBe('mosaic');
    const box = document.getElementById('templateSuggestion')!;
    expect(box.style.display).toBe('flex');
    expect(document.getElementById('templateSuggestionText')!.textContent).toContain('mosaico');
  });

  it('refreshSuggestion esconde o aviso quando o template já é o sugerido', () => {
    document.body.innerHTML = '<div id="templateSuggestion" style="display:flex;"></div>';
    window.State = { feedImages: new Map([['a', 'a'], ['b', 'b']]) };
    window.Templates.current = 'mosaic';
    expect(window.Templates.refreshSuggestion()).toBeNull();
    expect(document.getElementById('templateSuggestion')!.style.display).toBe('none');
  });
});
