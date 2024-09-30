export type BrowserInstanceInstruction = {
  command: 'browserEval' | 'page';
  pageCommand?: string;
  args: any[];
};

export type BrowserInstanceStatus = 'Running' | 'Stopped' | 'Starting' | 'Stopping';

export type BrowserInstance = {
  sessionId: string;
  name: string;
  url: string;
  status?: BrowserInstanceStatus;
  initInstructions?: BrowserInstanceInstruction[];
  [key: string]: any;
};
