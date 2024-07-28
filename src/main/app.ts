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
import {
  Transporter,
  DummyTransporter,
  MqttTransporter,
  MqttTransporterOptions,
  HttpTransporterOptions,
  HttpTransporter,
} from './modules/transporters';
import { TransportMessage } from 'shared/types/message';

export type ApplicationOptions = {
  serverName: string;
  transporter?: {
    http?: HttpTransporterOptions;
    mqtt?: MqttTransporterOptions;
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

  async getAppInfo() {
    return {
      options: this.options,
    };
  }

  async setOptions(options: ApplicationOptions, save = true) {
    this.options = { ...this.options, ...options };
    await this.initTranporter(options.transporter);
    if (save) {
      await this.clientKvStorage.setItem('applicationOptions', this.options);
    }
  }

  async initTranporter(transporter: ApplicationOptions['transporter']) {
    if (!transporter) {
      return;
    }
    if (transporter.mqtt) {
      this.transporter = new MqttTransporter(transporter.mqtt);
      this.transporter.connect();
      this.transporter.onReceive(async (data: TransportMessage) => {
        await this.ttcMessagesQueue.push(data);
      });
    } else if (transporter.http) {
      this.transporter = new HttpTransporter(transporter.http);
      this.transporter.connect();
      this.transporter.onReceive(async (data: TransportMessage) => {
        if (data.controlInstance) {
          await this.ttcMessagesQueue.push(data);
        }
      });
    }
  }

  private async initOptions() {
    const ops = await this.clientKvStorage.getItem('applicationOptions');
    if (ops) {
      await this.setOptions(ops, false);
    }
  }

  private async initMessageQueues() {
    this.cttMessagesQueue.onMessage(async (data) => {
      if (this.transporter) {
        await this.transporter.send(data);
      }
    });
    await this.cttMessagesQueue.start();
  }

  async init() {
    await this.puppeteerElectron.beforeAppReady();
    await this.initElectronApp();
    await this.puppeteerElectron.afterAppReady();
    await this.instanceManager.init();
    await this.initOptions();
    await this.initMessageQueues();
    this._isReady = true;
    this.events.onClientReady.emit();
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
