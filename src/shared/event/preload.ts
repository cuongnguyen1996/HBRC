export enum PreloadEventKey {
  APPLICATION_READY = 'APPLICATION_READY',
  SERVER_DISCONNECTED = 'SERVER_DISCONNECTED',
}

export type PreloadEventListener<D extends any> = (data?: D) => void;
