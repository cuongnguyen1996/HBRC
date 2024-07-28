import { mkdirSync } from 'fs';

import { Queue as BaseFileQueue } from 'file-queue';
import { Queue } from './base';
import { sleep } from '@shared/utils/time';

type MessageCallback = (data: any) => Promise<void>;

export class FileQueue implements Queue {
  private baseQueue?: BaseFileQueue;
  private messageCallback?: MessageCallback;
  constructor(private path: string) {
    mkdirSync(path, { recursive: true });
  }

  onMessage(cb: MessageCallback) {
    this.messageCallback = cb;
  }

  async clear(): Promise<void> {
    if (!this.baseQueue) {
      throw new Error('Queue not started');
    }
    this.baseQueue.clear();
  }

  async start(): Promise<void> {
    if (this.baseQueue) return;
    this.baseQueue = await new Promise((resolve, reject) => {
      const q = new BaseFileQueue(this.path, (...args: any) => {
        resolve(q);
      });
    });

    setTimeout(async () => {
      while (true) {
        const { data, err, commit, rollback } = await this.tpop();
        if (!data || err) {
          await sleep(500);
        } else {
          try {
            if (this.messageCallback) {
              await this.messageCallback(data);
            }
            await commit();
          } catch (e) {
            await rollback();
          }
        }
      }
    });
  }

  async tpop(): Promise<{ err?: any; data?: any; commit: any; rollback: any }> {
    return new Promise((resolve, reject) => {
      if (!this.baseQueue) {
        reject(new Error('Queue not started'));
      }
      this.baseQueue.tpop((err: any, data: any, commit: any, rollback: any) => {
        const commitFn = async () => {
          await new Promise((commitResolve, commitReject) => {
            commit((err: any) => {
              if (!err) {
                commitResolve(null);
              } else {
                commitReject(err);
              }
            });
          });
        };
        const rollbackFn = async () => {
          await new Promise((rollbackResolve, rollbackReject) => {
            rollback((err: any) => {
              if (!err) {
                rollbackResolve(null);
              } else {
                rollbackReject(err);
              }
            });
          });
        };
        if (err) {
          reject({
            err,
            commit: commitFn,
            rollback: rollbackFn,
          });
        } else {
          resolve({ data, commit: commitFn, rollback: rollbackFn });
        }
      });
    });
  }

  async pop(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.baseQueue) {
        reject(new Error('Queue not started'));
      }
      this.baseQueue.pop((err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async push(data: any) {
    if (!this.baseQueue) {
      throw new Error('Queue not started');
    }
    await new Promise((resolve, reject) => {
      this.baseQueue.push(data, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}
