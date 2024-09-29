import { Event } from '@shared/event';
import { TransporterStatus } from '@shared/types/transporter';

export class ClientEvents {
  onClientReady: Event<void>;
  onTransporterStatusChanged: Event<TransporterStatus>;
  constructor() {
    this.onClientReady = new Event();
    this.onTransporterStatusChanged = new Event();
  }
}
