import Store from 'electron-store';
import { KVStorage, MemKVStorage } from '@shared/storages/kvStorage';

export class ElectronKvStorage implements KVStorage {
  private store: Store;
  constructor() {
    this.store = new Store({ name: 'eKvStorage' });
  }

  async getItem(key: string) {
    const val = this.store.get(key);
    return val;
  }

  async setItem(key: string, val: any) {
    this.store.set(key, val);
  }
  async delItem(key: string) {
    this.store.delete(key);
  }
  async clear() {
    this.store.clear();
  }
}

export class ClientKvStorage extends MemKVStorage {
  constructor(private readonly kvStorage: KVStorage) {
    super();
  }

  getKvStorage() {
    return this.kvStorage;
  }

  async getItem(key: string): Promise<any> {
    return (await super.getItem(key)) || (await this.kvStorage.getItem(key));
  }
  async setItem(key: string, val: any): Promise<void> {
    await super.setItem(key, val);
    await this.kvStorage.setItem(key, val);
  }
  async delItem(key: string): Promise<void> {
    await super.delItem(key);
    await this.kvStorage.delItem(key);
  }
  async clear(): Promise<void> {
    await super.clear();
    await this.kvStorage.clear();
  }
}
