import { FSDB } from 'file-system-db';
import { app } from 'electron';
import { join } from 'path';
import { PuppeteerElectron } from '@main/pie';
import { PuppeteerInstanceController, BrowserInstanceController } from './controllers';
import { Page } from 'puppeteer-core';
import { BrowserInstance } from '@shared/types';

class BrowserInstanceManager {
  private db: FSDB;
  private channelControlllerMap = new Map<string, BrowserInstanceController>();
  constructor(private readonly pie: PuppeteerElectron) {}

  async init() {
    const appPath = app.getAppPath();
    const dbPath = join(appPath, 'out', 'data', 'instances.json');
    this.db = new FSDB(dbPath, true);
    this.loadInstanceWindowPages();
  }

  async getInstances() {
    return this.db.getAll().map((e) => e.value);
  }

  async getInstance(sessionId: string) {
    return this.db.get(sessionId);
  }

  async addInstance(name: string, url: string) {
    const { sessionId, window, page } = await this.openAddChannelWindownPage(url);
    const bi: BrowserInstance = {
      name,
      sessionId,
      url,
    };
    this.saveInstance(bi);
  }

  async deleteInstance(sessionId: string) {
    this.db.delete(sessionId);
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
    const controller = this.createInstanceController(bi, page);
    this.channelControlllerMap.set(bi.sessionId, controller);
    console.log('loadInstanceWindowPage', bi);
  }

  private createInstanceController(bi: BrowserInstance, page: Page) {
    const controller = new PuppeteerInstanceController(page, bi);
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

  getController(sessionId: string) {
    return this.channelControlllerMap.get(sessionId);
  }
}

export default BrowserInstanceManager;
