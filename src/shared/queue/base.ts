export interface Queue {
  start(): Promise<void>;
  onMessage(cb: (data: any) => Promise<void>): void;
  pop(): Promise<any>;
  push(data: any): Promise<void>;
  clear(): Promise<void>;
}
