// Type definitions for the Layers module

export interface Layer {
  element: HTMLElement;
  visible: boolean;
  locked: boolean;
  index: number;
}

export interface Layers {
  init(): void;
  render(): void;
  getTypeIcon(type: string): string;
  getTypeLabel(type: string): string;
  getLayerElement(index: number): HTMLElement | null;
  setupEvents(): void;
  toggleVisibility(el: HTMLElement): void;
  toggleLock(el: HTMLElement): void;
  deleteLayer(el: HTMLElement): void;
  reorder(fromIndex: number, toIndex: number): void;
}

export const Layers: Layers;