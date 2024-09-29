export type ApplicationAPI = {
  setApplicationOptions: (options: any) => Promise<any>;
  getApplicationInfo: () => Promise<any>;
  onServerDisconnect: (callback: () => void) => Promise<any>;
  onMenuItemClick: (menuItemId: string, callback: (data: any) => void) => Promise<any>;
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
};
