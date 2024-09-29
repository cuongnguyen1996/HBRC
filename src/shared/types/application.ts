import { PreloadEventKey, PreloadEventListener } from '@shared/event/preload';
import { MenuItemId } from '@shared/constants';
import { TransporterStatus } from './transporter';

export type ApplicationAPI = {
  setApplicationOptions: (options: any) => Promise<any>;
  getApplicationInfo: () => Promise<any>;
  onMenuItemClick: (menuItemId: MenuItemId, callback: PreloadEventListener<any>) => number;
  subscribeEvent: (eventKey: PreloadEventKey, callback: PreloadEventListener<any>) => number;
  unsubscribeEvent: (subscriptionId: number) => void;
};

export type BrowserInstanceManagerAPI = {
  getInstances: () => Promise<any>;
  addInstance: (name: string, url: string) => Promise<any>;
  deleteInstance: (sessionId: number) => Promise<any>;
  showInstanceWindow: (sessionId: string) => Promise<any>;
  callInstanceFunction: (sessionId: string, method: string, ...args: any[]) => Promise<any>;
};

export type ApplicationOptions = {
  serverName?: string;
};

export type ApplicationInfo = {
  options?: ApplicationOptions;
  transporterStatus: TransporterStatus;
};
