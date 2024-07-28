import { Event } from '@shared/event';

export class ClientEvents {
  onClientReady: Event<void>;

  constructor() {
    this.onClientReady = new Event();
  }
}
