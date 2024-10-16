export interface Transporter {
  connect(): void;
  send(data: any): Promise<void>;
  onReceive(cb: (data: any) => Promise<void>): void;
  onConnected(cb: () => Promise<void>): void;
}

export class BaseTransporter implements Transporter {
  protected onReceiveCallback: (data: any) => Promise<void>;
  protected onConnectedCallback: () => Promise<void>;

  protected _connect(): void {
    throw new Error('Method not implemented.');
  }

  connect(): void {
    this._connect();
  }
  send(data: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
  onReceive(cb: (data: any) => Promise<void>) {
    this.onReceiveCallback = cb;
  }
  onConnected(cb: () => Promise<void>): void {
    this.onConnectedCallback = cb;
  }
}
