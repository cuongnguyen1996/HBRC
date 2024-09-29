import { Event, EventSubscription } from '@shared/event';
import { PreloadEventListener, PreloadEventKey } from '@shared/event/preload';

export class PreloadEvents {
  private subscriptionId: number;
  private subscriptionIdMap: Map<number, EventSubscription>;

  private eventMap: Map<string, Event<any>>;

  menuItemClickedEventMap: Map<string, Event<any>>;

  constructor() {
    this.menuItemClickedEventMap = new Map();
    this.subscriptionIdMap = new Map();
    this.subscriptionId = 0;
  }

  private nextSubscriptionId() {
    return ++this.subscriptionId;
  }
  subscribeMenuItemClickEvent<D>(menuItemId: string, listener: PreloadEventListener<D>) {
    if (!this.menuItemClickedEventMap.has(menuItemId)) {
      this.menuItemClickedEventMap.set(menuItemId, new Event<D>());
    }
    const sub = this.menuItemClickedEventMap.get(menuItemId).listen(listener);
    const subId = this.nextSubscriptionId();
    this.subscriptionIdMap.set(subId, sub);
    return subId;
  }

  emitMenuItemClickEvent(menuItemId: string, data?: any) {
    const event = this.menuItemClickedEventMap.get(menuItemId);
    if (event) {
      event.emit(data);
    }
  }

  emit(eventKey: PreloadEventKey, data?: any) {
    const event = this.eventMap.get(eventKey);
    if (event) {
      event.emit(data);
    }
  }

  subscribe<D>(eventKey: PreloadEventKey, callback: PreloadEventListener<D>) {
    if (!this.eventMap.has(eventKey)) {
      this.eventMap.set(eventKey, new Event<any>());
    }
    const sub = this.eventMap.get(eventKey).listen(callback);
    const subId = this.nextSubscriptionId();
    this.subscriptionIdMap.set(subId, sub);
    return subId;
  }

  unsubscribe(subscriptionId: number) {
    const sub = this.subscriptionIdMap.get(subscriptionId);
    if (sub) {
      sub.unsubscribe();
    }
  }
}
