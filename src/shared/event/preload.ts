export enum PreloadEventKey {
  APPLICATION_READY = 'APPLICATION_READY',
}

export type PreloadEventListener<D extends any> = (data?: D) => void;
