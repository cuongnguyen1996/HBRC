export type OnMessageCallback = (data: any) => Promise<void> | void;

export interface Queue {
  start(): Promise<void>;
  onMessage(cb: OnMessageCallback): void;
  pop(): Promise<any>;
  push(data: any): Promise<void>;
  clear(): Promise<void>;
}
