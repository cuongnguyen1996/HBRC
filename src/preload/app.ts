import { contextBridge, ipcRenderer } from 'electron';
import {
  GET_APPLICATION_INFO,
  SET_APPLICATION_OPTIONS,
  ON_MENU_ITEM_CLICKED,
  ON_APPLICATION_READY,
  ON_SERVER_DISCONNECTED,
  ON_TRANSPORTER_STATUS_CHANGED,
} from '@shared/constants/ipcs';
import { MenuItemId } from '@shared/constants';
import { PreloadEventKey, PreloadEventListener } from '@shared/event/preload';
import { PreloadEvents } from './events';
import { TransporterStatus } from '@shared/types/transporter';

const preloadEvents = new PreloadEvents();

ipcRenderer.on(ON_MENU_ITEM_CLICKED, (_, menuItemId, data: any) => {
  preloadEvents.emitMenuItemClickEvent(menuItemId, data);
});

ipcRenderer.on(ON_APPLICATION_READY, () => {
  preloadEvents.emit(PreloadEventKey.APPLICATION_READY);
});

ipcRenderer.on(ON_SERVER_DISCONNECTED, () => {
  preloadEvents.emit(PreloadEventKey.SERVER_DISCONNECTED);
});

ipcRenderer.on(ON_TRANSPORTER_STATUS_CHANGED, (_, status: TransporterStatus) => {
  preloadEvents.emit(PreloadEventKey.TRANSPORTER_STATUS_CHANGED, status);
});

contextBridge.exposeInMainWorld('applicationAPI', {
  setApplicationOptions: (options: any) => ipcRenderer.invoke(SET_APPLICATION_OPTIONS, options),
  getApplicationInfo: () => ipcRenderer.invoke(GET_APPLICATION_INFO),
  subscribeEvent: <D>(eventKey: PreloadEventKey, callback: PreloadEventListener<D>) => {
    return preloadEvents.subscribe(eventKey, callback);
  },
  onMenuItemClick: <D>(menuItemId: MenuItemId, callback: PreloadEventListener<D>) => {
    return preloadEvents.subscribeMenuItemClickEvent<D>(menuItemId, callback);
  },
  unsubscribeEvent: (subscriptionId: number) => {
    preloadEvents.unsubscribe(subscriptionId);
  },
});
