export interface BrowserInstanceController {
  eval(code: string): Promise<any>;
  browserEval(code: string): Promise<any>;
  init(): Promise<void>;
  postMessage(data: any): Promise<void>;
}

export abstract class BaseBrowserInstanceController implements BrowserInstanceController {
  constructor(protected readonly instance: any) {}

  eval(code: string): Promise<any> {
    return eval(code);
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
