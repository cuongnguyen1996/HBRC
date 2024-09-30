import { Event, EventSubscription } from '@shared/event';
import { PreloadEventListener, PreloadEventKey } from '@shared/event/preload';

export class PreloadEvents {
  private subscriptionId: number;
  private subscriptionIdMap: Map<number, EventSubscription>;

  private eventMap: Map<string, Event<any>>;

  menuItemClickedEventMap: Map<string, Event<any>>;
  menuItemProcessedEventMap: Map<string, Event<any>>;

  constructor() {
    this.eventMap = new Map();
    this.menuItemClickedEventMap = new Map();
    this.menuItemProcessedEventMap = new Map();
    this.subscriptionIdMap = new Map();
    this.subscriptionId = 0;
  }

  private nextSubscriptionId() {
    return ++this.subscriptionId;
  }

  subscribeMenuItemProcessedEvent<D>(menuItemId: string, listener: PreloadEventListener<D>) {
    if (!this.menuItemProcessedEventMap.has(menuItemId)) {
      this.menuItemProcessedEventMap.set(menuItemId, new Event<D>());
    }
    const sub = this.menuItemProcessedEventMap.get(menuItemId).listen(listener);
    const subId = this.nextSubscriptionId();
    this.subscriptionIdMap.set(subId, sub);
    return subId;
  }

  emitMenuItemProcessedEvent(menuItemId: string, data?: any) {
    const event = this.menuItemProcessedEventMap.get(menuItemId);
    if (event) {
      event.emit(data);
    }
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

  subscribeMulti(eventKeys: PreloadEventKey[], callback: PreloadEventListener<any>) {
    const subIds = eventKeys.map((eventKey) => this.subscribe(eventKey, callback));
    return subIds;
  }

  unsubscribe(subscriptionId: number) {
    const sub = this.subscriptionIdMap.get(subscriptionId);
    if (sub) {
      sub.unsubscribe();
    }
  }

  unsubscribeMulti(subscriptionIds: number[]) {
    subscriptionIds.forEach((subId) => {
      this.unsubscribe(subId);
    });
  }
}
