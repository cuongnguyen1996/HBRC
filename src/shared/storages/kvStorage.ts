export interface KVStorage {
  getItem(key: string): Promise<any>;
  setItem(key: string, val: any): Promise<void>;
  delItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

export class MemKVStorage implements KVStorage {
  private storage: Map<string, any> = new Map();

  async getItem(key: string) {
    return this.storage.get(key);
  }

  async setItem(key: string, val: any) {
    this.storage.set(key, val);
  }

  async delItem(key: string) {
    this.storage.delete(key);
  }

  async clear() {
    this.storage = new Map();
  }
}
