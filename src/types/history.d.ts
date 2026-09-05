// Type definitions for the History module

export interface History {
  init(): void;
  push(state: any): void;
  pop(): any;
  clear(): void;
}

export const History: History;