// TypeScript wrapper for export.js

import * as Export from '../public/js/export.js';
import type { Export as ExportType } from './types/export.d.ts';

export const exportImage = Export.exportImage as (format: string) => void;
export const preview = Export.preview as () => void;
export const save = Export.save as () => void;

export default Export;
