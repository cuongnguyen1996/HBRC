import path from 'path';
import { KVStorage } from '@shared/storages/kvStorage';
import { ClientKvStorage, ElectronKvStorage } from './modules/storages/kvStorage';
import { ClientEvents } from './modules/events';
import BrowserInstanceManager from './modules/instances/manager';
import { App as ElectronApp } from 'electron';
import { PuppeteerElectron } from './pie';

import { makeAppSetup } from './factories';
import { MainWindow } from './windows';
import { registerIPCs } from './ipcs';
import { Queue } from '@shared/queue/base';
import { FileQueue } from '@shared/queue/fileQueue';

export type ApplicationOptions = {
  controllerMqtt?: {
    url: string;
    username: string;
    password: string;
  };
};

export class Application {
  private events: ClientEvents;
  private kvStorage: KVStorage;
  private clientKvStorage: ClientKvStorage;
  private instanceManager: BrowserInstanceManager;
  private puppeteerElectron: PuppeteerElectron;
  private _isReady = false;
  private messagesQueue: Queue;
  constructor(private readonly eApp: ElectronApp, private options: ApplicationOptions) {
    this.kvStorage = new ElectronKvStorage();
    this.clientKvStorage = new ClientKvStorage(this.kvStorage);
    this.events = new ClientEvents();
    this.puppeteerElectron = new PuppeteerElectron(this.eApp);
    const queuePath = path.join(eApp.getAppPath(), 'out', 'data', 'queue');
    this.messagesQueue = new FileQueue(queuePath);
    this.instanceManager = new BrowserInstanceManager(this.puppeteerElectron, this.messagesQueue);
  }

  async setOptions(options: ApplicationOptions) {
    this.options = { ...this.options, ...options };
  }

  async init() {
    await this.puppeteerElectron.beforeAppReady();
    await this.initElectronApp();
    await this.puppeteerElectron.afterAppReady();
    await this.instanceManager.init();
    this._isReady = true;
    this.events.onClientReady.emit();
    await this.messagesQueue.start();
    this.messagesQueue.onMessage(async (data) => {
      console.log('received message', data);
    });
  }

  async initElectronApp() {
    await this.eApp.whenReady();
    registerIPCs(this);
    await makeAppSetup(MainWindow);
  }

  getInstanceManager() {
    if (!this._isReady) {
      throw new Error('Application not ready');
    }
    return this.instanceManager;
  }

  getPuppeteerElectron() {
    if (!this._isReady) {
      throw new Error('Application not ready');
    }
    return this.puppeteerElectron;
  }
}

export default Application;
