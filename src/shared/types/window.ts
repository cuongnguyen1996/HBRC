import { BrowserWindowConstructorOptions } from 'electron';

export type BrowserWindowOrNull = Electron.BrowserWindow | null;

export interface WindowProps extends BrowserWindowConstructorOptions {
  id: string;
  isSingleInstance?: boolean;
  keepOpen?: boolean;
}
