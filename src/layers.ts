// TypeScript wrapper for layers.js

import * as Layers from '../public/js/layers.js';
import type { Layer, Layers as LayersType } from './types/layers.d.ts';

export const init = Layers.init as () => void;
export const render = Layers.render as () => void;
export const getTypeIcon = Layers.getTypeIcon as (type: string) => string;
export const getTypeLabel = Layers.getTypeLabel as (type: string) => string;
export const getLayerElement = (index: number): HTMLElement | null => Layers.getLayerElement(index);
export const setupEvents = Layers.setupEvents as () => void;
export const toggleVisibility = (el: HTMLElement): void => Layers.toggleVisibility(el);
export const toggleLock = (el: HTMLElement): void => Layers.toggleLock(el);
export const deleteLayer = (el: HTMLElement): void => Layers.deleteLayer(el);
export const reorder = (fromIndex: number, toIndex: number): void => Layers.reorder(fromIndex, toIndex);

export default Layers;

