export interface Transporter {
  connect(): void;
  send(data: any): Promise<void>;
  onReceive(cb: (data: any) => Promise<void>): void;
}

export class BaseTransporter implements Transporter {
  protected onReceiveCallback: (data: any) => Promise<void>;
  connect(): void {
    throw new Error('Method not implemented.');
  }
  send(data: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
  onReceive(cb: (data: any) => Promise<void>) {
    this.onReceiveCallback = cb;
  }
}
