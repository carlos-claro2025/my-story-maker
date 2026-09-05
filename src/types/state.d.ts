// Type definitions for the State module

export interface State {
  selected: HTMLElement | null;
  activeCell: number | null;
  filter: string;
  // ...
}

export const State: State;
