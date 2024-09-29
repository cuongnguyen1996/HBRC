import { contextBridge, ipcRenderer } from 'electron';
import {
  GET_APPLICATION_INFO,
  SET_APPLICATION_OPTIONS,
  ON_MENU_ITEM_CLICKED,
  ON_APPLICATION_READY,
} from '@shared/constants/ipcs';
import { MenuItemId } from '@shared/constants';
import { PreloadEventKey, PreloadEventListener } from '@shared/event/preload';
import { PreloadEvents } from './events';

const preloadEvents = new PreloadEvents();

ipcRenderer.on(ON_MENU_ITEM_CLICKED, (_, menuItemId, data: any) => {
  preloadEvents.emitMenuItemClickEvent(menuItemId, data);
});

ipcRenderer.on(ON_APPLICATION_READY, () => {
  preloadEvents.emit(PreloadEventKey.APPLICATION_READY);
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
