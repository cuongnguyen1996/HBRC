export type BrowserInstanceInstruction = {
  command: string;
  pageCommand?: string;
  args: any[];
};

export type BrowserInstance = {
  sessionId: string;
  name: string;
  url: string;
  [key: string]: any;
};
