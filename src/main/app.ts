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
import { Transporter, DummyTransporter, MqttTransporter, MqttTransporterOptions } from './modules/transporters';

export type ApplicationOptions = {
  transporter?: {
    protocol: 'mqtt';
    options?: MqttTransporterOptions;
  };
};

export class Application {
  private events: ClientEvents;
  private kvStorage: KVStorage;
  private clientKvStorage: ClientKvStorage;
  private instanceManager: BrowserInstanceManager;
  private puppeteerElectron: PuppeteerElectron;
  private _isReady = false;
  private ttcMessagesQueue: Queue; // TransporterToController: this queue pass message from transporter to controller
  private cttMessagesQueue: Queue; // ControllerToTransporter: this queue pass message from controller to transporter
  private transporter: Transporter;
  constructor(private readonly eApp: ElectronApp, private options: ApplicationOptions) {
    this.kvStorage = new ElectronKvStorage();
    this.clientKvStorage = new ClientKvStorage(this.kvStorage);
    this.events = new ClientEvents();
    this.puppeteerElectron = new PuppeteerElectron(this.eApp);
    this.ttcMessagesQueue = new FileQueue(path.join(eApp.getAppPath(), 'out', 'data', 'message_queues', 'ttc'));
    this.cttMessagesQueue = new FileQueue(path.join(eApp.getAppPath(), 'out', 'data', 'message_queues', 'ctt'));
    this.instanceManager = new BrowserInstanceManager(this.puppeteerElectron, {
      ttc: this.ttcMessagesQueue,
      ctt: this.cttMessagesQueue,
    });
    this.transporter = new DummyTransporter();
  }

  async setOptions(options: ApplicationOptions) {
    this.options = { ...this.options, ...options };
    await this.connectTranporter(options.transporter);
  }

  async connectTranporter(transporter: ApplicationOptions['transporter']) {
    if (!transporter) {
      return;
    }
    if (transporter.protocol === 'mqtt') {
      this.transporter = new MqttTransporter(transporter.options);
      this.transporter.connect();
      this.transporter.onReceive(async (data: any) => {
        await this.ttcMessagesQueue.push(data);
      });
    }
  }

  async init() {
    await this.puppeteerElectron.beforeAppReady();
    await this.initElectronApp();
    await this.puppeteerElectron.afterAppReady();
    await this.instanceManager.init();
    this._isReady = true;
    this.events.onClientReady.emit();
    await this.cttMessagesQueue.start();
    this.cttMessagesQueue.onMessage(async (data) => {
      if (this.transporter) {
        await this.transporter.send(data);
      }
    });
    // setInterval(() => {
    //   this.cttMessagesQueue.push({ message: new Date().toISOString() });
    // }, 3000);
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
