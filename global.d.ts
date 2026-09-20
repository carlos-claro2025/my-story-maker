// Global type declarations for the editor

declare global {
  interface Window {
    State: any;
    Layers: any;
    Filters: any;
    Elements: any;
    DragDrop: any;
    Export: any;
    Instagram: any;
    MusicPlayer?: any;
    History: any;
    Resize: any;
    Project: any;
    showToast: (msg: string, duration?: number, type?: string) => void;
  }
}

export {};
