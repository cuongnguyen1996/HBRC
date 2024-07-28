import { BrowserInstanceController } from './base';
import { Page } from 'puppeteer-core';
import { BrowserInstance } from '@shared/types';

export class PuppeteerInstanceController implements BrowserInstanceController {
  constructor(protected readonly page: Page, protected readonly instance: BrowserInstance) {}
}
