import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function loadScript(name: string): void {
  const src = readFileSync(resolve(__dirname, '../../public/js', name), 'utf8');
  (0, eval)(src);
}

declare global {
  interface Window {
    State: any;
    History: any;
  }
}

describe('History (public/js/history.js)', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="elements"></div>';
    loadScript('state.js');
    loadScript('history.js');
    window.History.init();
  });

  it('init cria um estado base', () => {
    expect(window.History.stack.length).toBe(1);
    expect(window.History.index).toBe(0);
    expect(window.History.canUndo()).toBe(false);
    expect(window.History.canRedo()).toBe(false);
  });

  it('push adiciona entrada com label traduzida', () => {
    window.History.push('add-photo');
    const top = window.History.stack[window.History.index];
    expect(top.action).toBe('add-photo');
    expect(top.label).toBe('Foto');
    expect(window.History.canUndo()).toBe(true);
  });

  it('undo/redo movem o index', () => {
    window.History.push('filter-change');
    expect(window.History.undo()).toBe(true);
    expect(window.History.canUndo()).toBe(false);
    expect(window.History.canRedo()).toBe(true);
    expect(window.History.redo()).toBe(true);
    expect(window.History.canRedo()).toBe(false);
  });

  it('undo no início retorna false', () => {
    expect(window.History.undo()).toBe(false);
  });

  it('push após undo descarta o redo', () => {
    window.History.push('a');
    window.History.push('b');
    window.History.undo();
    window.History.push('c');
    expect(window.History.canRedo()).toBe(false);
    expect(window.History.stack.length).toBe(3); // init, a, c
  });

  it('respeita maxSize descartando o mais antigo', () => {
    window.History.maxSize = 5;
    for (let i = 0; i < 10; i++) window.History.push('move');
    expect(window.History.stack.length).toBe(5);
    expect(window.History.index).toBe(4);
  });

  it('push durante restauração não gera estado novo', () => {
    const before = window.History.stack.length;
    window.History.restoring = true;
    window.History.push('move');
    window.History.restoring = false;
    expect(window.History.stack.length).toBe(before);
  });

  it('reset zera a pilha mantendo estado base', () => {
    window.History.push('a');
    window.History.push('b');
    window.History.reset('load-project');
    expect(window.History.stack.length).toBe(1);
    expect(window.History.index).toBe(0);
    expect(window.History.stack[0].label).toBe('Projeto aberto');
  });

  it('captura o estado dos elementos do DOM', () => {
    document.getElementById('elements')!.innerHTML =
      '<div id="el-1" data-el="text" data-rotation="45">oi</div>';
    window.History.push('text-edit');
    const captured = window.History.stack[window.History.index].elements;
    expect(captured.elements.length).toBe(1);
    expect(captured.elements[0].id).toBe('el-1');
    expect(captured.elements[0].rotation).toBe('45');
  });

  it('undo restaura elementos removidos', () => {
    const container = document.getElementById('elements')!;
    container.innerHTML = '<div id="el-1" data-el="text">oi</div>';
    window.History.push('add-element');
    container.innerHTML = ''; // simula exclusão
    window.History.push('delete');
    window.History.undo();
    expect(document.querySelectorAll('#elements > [data-el]').length).toBe(1);
  });
});
