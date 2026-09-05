// Type definitions for the Export module

export interface Export {
  exportImage(format: string): void;
  preview(): void;
  save(): void;
}

export const Export: Export;