// TypeScript wrapper for drag-drop.js

import * as DragDrop from '../public/js/drag-drop.js';
import type { DragDrop as DragDropType } from './types/drag-drop.d.ts';

export const init = DragDrop.init as () => void;
// Adicione outras funções exportadas pelo módulo, se houver

export default DragDrop;
