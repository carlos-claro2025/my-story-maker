// TypeScript wrapper for history.js

import * as History from '../public/js/history.js';
import type { History as HistoryType } from './types/history.d.ts';

export const init = History.init as () => void;
export const push = History.push as (state: any) => void;
export const pop = History.pop as () => any;
export const clear = History.clear as () => void;

export default History;
