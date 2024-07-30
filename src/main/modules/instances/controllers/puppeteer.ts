import { BaseBrowserInstanceController } from './base';
import { Page } from 'puppeteer-core';
import { BrowserInstance, BrowserInstanceInstruction } from '@shared/types';
import { Queue } from '@shared/queue';

export class PuppeteerInstanceController extends BaseBrowserInstanceController {
  constructor(
    instance: BrowserInstance,
    messageQueues: {
      ttc: Queue;
      ctt: Queue;
    },
    protected readonly page: Page
  ) {
    super(instance, messageQueues);
  }

  async setInstance(instance: BrowserInstance) {
    this.instance = instance;
    await this.restart();
  }

  private async restart() {
    await this.page.reload();
    await this.executeInitInstructions();
  }

  private async executeInitInstructions() {
    if (this.instance.initInstructions) {
      try {
        await this.executeInstructions(this.instance.initInstructions);
      } catch (e) {
        console.error('Error executing init instructions', e);
      }
    }
  }

  async init(): Promise<void> {
    await this.executeInitInstructions();
    await this.page.exposeFunction('bicPostMessage', this.postMessage.bind(this));
  }

  async executeInstructions(instructions: BrowserInstanceInstruction[]): Promise<any[]> {
    const results = [];
    for (const instruction of instructions) {
      const r = await this.executeInstruction(instruction);
      results.push(r);
    }
    return results;
  }

  async executeInstruction(instruction: BrowserInstanceInstruction): Promise<any> {
    const { command, pageCommand, args } = instruction;
    if (command == 'page' && pageCommand) {
      const func = this.page[pageCommand];
      if (!func) {
        throw new Error(`page command ${pageCommand} not found`);
      }
      return await func.bind(this.page)(...args);
    } else if (command == 'browserEval') {
      return await this[command].bind(this)(...args);
    } else {
      throw new Error(`command ${command} invalid`);
    }
  }

  browserEval(code: string): Promise<any> {
    return this.page.evaluate(code);
  }
}
