import { BrowserInstanceInstruction } from './browserInstance';

export type TransportMessage = {
  controlInstance: {
    sessionId: string;
    instructions: BrowserInstanceInstruction[];
  };
  instanceManager: {
    action: 'listInstance' | 'addInstance' | 'deleteInstance';
    payload: any;
  };
  agent: {
    action: 'info';
    payload: any;
  };
};
