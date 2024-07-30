import { FSDB } from 'file-system-db';
import { app } from 'electron';
import { join } from 'path';
import { PuppeteerElectron } from '@main/pie';
import { PuppeteerInstanceController, BrowserInstanceController } from './controllers';
import { Page } from 'puppeteer-core';
import { BrowserInstance } from '@shared/types';
import { Queue } from '@shared/queue';
import { IncommingTransportMessage, OutgoingTransportMessage } from '@shared/types/message';

class BrowserInstanceManager {
  private db: FSDB;
  private channelControlllerMap = new Map<string, BrowserInstanceController>();
  constructor(
    private readonly pie: PuppeteerElectron,
    private readonly messageQueues: {
      ttc: Queue;
      ctt: Queue;
    }
  ) {}

  async init() {
    const appPath = app.getAppPath();
    const dbPath = join(appPath, 'out', 'data', 'instances.json');
    this.db = new FSDB(dbPath, true);
    await this.loadInstanceWindowPages();
    this.messageQueues.ttc.onMessage(this.processTransportMessage.bind(this));
    await this.messageQueues.ttc.start();
  }

  private async processTransportMessage(data: IncommingTransportMessage) {
    console.log('processTransportMessage', data);
    if (data.controlInstance) {
      const { sessionId, instructions } = data.controlInstance;
      const controller = this.getController(sessionId);
      if (controller) {
        await controller.executeInstructions(instructions);
      }
    } else if (data.manageInstance) {
      await this.handleManageInstanceMessage(data.manageInstance);
    }
  }

  private async handleManageInstanceMessage(data: IncommingTransportMessage['manageInstance']) {
    console.log('handleManageInstanceMessage', data);
    const { action, payload } = data;
    if (action == 'updateInstance') {
      if (!payload) {
        return;
      }
      const { sessionId } = payload;
      if (!sessionId) {
        return;
      }
      const bi = await this.getInstance(sessionId);
      if (!bi) {
        console.error(`Instance not found: ${sessionId}`);
      } else {
        await this.updateInstance(sessionId, payload);
      }
    }
  }

  async getInstances() {
    return this.db.getAll().map((e) => e.value);
  }

  async getInstance(sessionId: string) {
    return this.db.get(sessionId);
  }

  async addInstance(name: string, url: string) {
    const { sessionId, page } = await this.openAddChannelWindownPage(url);
    const bi: BrowserInstance = {
      name,
      sessionId,
      url,
    };
    await this.createInstanceController(bi, page);
    this.saveInstance(bi);
    this.pushMessageToTransporter('addInstance', { instance: bi });
  }

  async removeInstance(sessionId: string) {
    this.db.delete(sessionId);
    this.pushMessageToTransporter('removeInstance', { instance: { sessionId } });
  }

  private pushMessageToTransporter(action: OutgoingTransportMessage['instanceManager']['action'], payload: any) {
    const msg: OutgoingTransportMessage = {
      instanceManager: {
        action,
        payload,
      },
    };
    this.messageQueues.ctt.push(msg);
  }

  async pushListInstanceMessage() {
    this.pushMessageToTransporter('listInstance', {
      instances: await this.getInstances(),
    });
  }

  private async openAddChannelWindownPage(url: string) {
    const { window, page, identifier } = await this.pie.newWindowPage(url, undefined, {
      show: true,
      hideOnClose: true,
    });
    return { window, page, sessionId: identifier };
  }

  async showInstanceWindow(sessionId: string) {
    const { window } = this.pie.getWindowPage(sessionId) || {};
    if (window) window.show();
  }

  private async loadInstanceWindowPage(bi: BrowserInstance) {
    if (this.channelControlllerMap.has(bi.sessionId)) {
      return;
    }
    const { page } = await this.pie.newWindowPage(bi.url, bi.sessionId, {
      show: false,
      hideOnClose: true,
    });
    await this.createInstanceController(bi, page);
    console.log('loadInstanceWindowPage', bi);
  }

  private async createInstanceController(bi: BrowserInstance, page: Page) {
    const controller = new PuppeteerInstanceController(bi, this.messageQueues, page);
    this.channelControlllerMap.set(bi.sessionId, controller);
    await controller.init();
    return controller;
  }

  private async loadInstanceWindowPages() {
    const instances = await this.getInstances();
    for (const instance of instances) {
      await this.loadInstanceWindowPage(instance);
    }
  }

  private saveInstance(bi: BrowserInstance) {
    this.db.set(bi.sessionId, bi);
  }

  async updateInstance(sessionId: string, bi: Partial<Pick<BrowserInstance, 'name' | 'initInstructions'>>) {
    const i = await this.getInstance(sessionId);
    if (!i) {
      throw new Error(`Instance not found: ${sessionId}`);
    }
    const newInstanceData = { ...i, ...bi };
    this.saveInstance(newInstanceData);
    const controller = this.getController(sessionId);
    if (controller) {
      await controller.setInstance(newInstanceData);
    }
  }

  getController(sessionId: string) {
    return this.channelControlllerMap.get(sessionId);
  }

  async callInstanceFunction(sessionId: string, method: string, ...args: any[]) {
    const controller = this.getController(sessionId);
    if (!controller) {
      throw new Error(`Controller not found for session: ${sessionId}`);
    }
    const func = controller[method].bind(controller);
    return await func(...args);
  }
}

export default BrowserInstanceManager;
