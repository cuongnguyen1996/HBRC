import { BaseBrowserInstanceController } from './base';
import { Page } from 'puppeteer-core';
import { BrowserInstance } from '@shared/types';

export class PuppeteerInstanceController extends BaseBrowserInstanceController {
  constructor(protected readonly page: Page, protected readonly instance: BrowserInstance) {
    super(instance);
  }

  init(): Promise<void> {
    this.page.exposeFunction('bicPostMessage', this.postMessage.bind(this));
    return;
  }

  eval(code: string): Promise<any> {
    return eval(code);
  }

  browserEval(code: string): Promise<any> {
    return this.page.evaluate(code);
  }
}
