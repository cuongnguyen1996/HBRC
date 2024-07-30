export type BrowserInstanceInstruction = {
  command: 'browserEval' | 'page';
  pageCommand?: string;
  args: any[];
};

export type BrowserInstance = {
  sessionId: string;
  name: string;
  url: string;
  initInstructions?: BrowserInstanceInstruction[];
  [key: string]: any;
};
