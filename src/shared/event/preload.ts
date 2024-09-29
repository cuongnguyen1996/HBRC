export enum PreloadEventKey {
  APPLICATION_READY = 'APPLICATION_READY',
  SERVER_DISCONNECTED = 'SERVER_DISCONNECTED',
  TRANSPORTER_STATUS_CHANGED = 'TRANSPORTER_STATUS_CHANGED',
}

export type PreloadEventListener<D extends any> = (data?: D) => void;
