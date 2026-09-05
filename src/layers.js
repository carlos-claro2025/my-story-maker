// TypeScript wrapper for layers.js
import * as Layers from '../public/js/layers.js';
export const init = Layers.init;
export const render = Layers.render;
export const getTypeIcon = Layers.getTypeIcon;
export const getTypeLabel = Layers.getTypeLabel;
export const getLayerElement = (index) => Layers.getLayerElement(index);
export const setupEvents = Layers.setupEvents;
export const toggleVisibility = (el) => Layers.toggleVisibility(el);
export const toggleLock = (el) => Layers.toggleLock(el);
export const deleteLayer = (el) => Layers.deleteLayer(el);
export const reorder = (fromIndex, toIndex) => Layers.reorder(fromIndex, toIndex);
export default Layers;
