export interface BrowserInstanceController {
  browserEval(code: string): Promise<any>;
  init(): Promise<void>;
  postMessage(data: any): Promise<void>;
  executeInstructions(instructions: any): Promise<any>;
  executeInstruction(instruction: any): Promise<any>;
}

export abstract class BaseBrowserInstanceController implements BrowserInstanceController {
  constructor(protected readonly instance: any) {}
  executeInstructions(instructions: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  executeInstruction(instruction: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  browserEval(code: string): Promise<any> {
    throw new Error('Method not implemented.');
  }

  postMessage(data: any): Promise<void> {
    const payload = {
      sessionId: this.instance.sessionId,
      url: this.instance.url,
      data,
    };
    console.log('postMessage', payload);
    return;
  }

  init(): Promise<void> {
    throw new Error('Method not implemented');
  }
}
