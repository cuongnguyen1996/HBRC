import { Event } from '@shared/event';
import { TransporterStatus } from '@shared/types/transporter';
import { BrowserInstance } from '@shared/types';

export class ClientEvents {
  onClientReady: Event<void>;
  onTransporterStatusChanged: Event<TransporterStatus>;
  onInstanceUpdated: Event<{ sessionId: string; updated: Partial<BrowserInstance> }>;
  constructor() {
    this.onClientReady = new Event();
    this.onTransporterStatusChanged = new Event();
    this.onInstanceUpdated = new Event();
  }
}
