import { BrowserInstance, BrowserInstanceInstruction } from '@shared/types';
import { Queue } from '@shared/queue';
import { OutgoingTransportMessage } from 'shared/types/message';

export interface BrowserInstanceController {
  browserEval(code: string): Promise<any>;
  init(): Promise<void>;
  postMessage(data: any): Promise<void>;
  executeInstructions(instructions: BrowserInstanceInstruction[]): Promise<any>;
  executeInstruction(instruction: BrowserInstanceInstruction): Promise<any>;
}

export abstract class BaseBrowserInstanceController implements BrowserInstanceController {
  constructor(
    protected readonly instance: BrowserInstance,
    protected readonly messageQueues: {
      ttc: Queue;
      ctt: Queue;
    }
  ) {}
  executeInstructions(instructions: BrowserInstanceInstruction[]): Promise<any> {
    throw new Error('Method not implemented.');
  }
  executeInstruction(instruction: BrowserInstanceInstruction): Promise<any> {
    throw new Error('Method not implemented.');
  }

  browserEval(code: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async postMessage(data: any) {
    const msg: OutgoingTransportMessage = {
      browserInstance: {
        sessionId: this.instance.sessionId,
        url: this.instance.url,
        action: 'postMessage',
        payload: data,
      },
    };
    await this.messageQueues.ctt.push(msg);
  }

  init(): Promise<void> {
    throw new Error('Method not implemented');
  }
}
