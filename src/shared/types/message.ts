import { BrowserInstanceInstruction } from './browserInstance';

export type TransportMessage = {
  controlInstance: {
    sessionId: string;
    instructions: BrowserInstanceInstruction[];
  };
};
