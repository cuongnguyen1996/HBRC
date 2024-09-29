import { contextBridge, ipcRenderer } from 'electron';
import {
  GET_APPLICATION_INFO,
  SET_APPLICATION_OPTIONS,
  ON_MENU_ITEM_CLICKED,
  ON_SERVER_DISCONNECTED,
} from '@shared/constants/ipcs';
import { MenuItemClickCallback } from '@shared/types';

const menuItemClickCallbacks: Record<string, MenuItemClickCallback[]> = {};

ipcRenderer.on(ON_MENU_ITEM_CLICKED, (_, menuItemId, data: any) => {
  const callbacks = menuItemClickCallbacks[menuItemId];
  if (!callbacks) {
    return;
  }
  callbacks.forEach((callback) => callback(data));
});

contextBridge.exposeInMainWorld('applicationAPI', {
  setApplicationOptions: (options: any) => ipcRenderer.invoke(SET_APPLICATION_OPTIONS, options),
  getApplicationInfo: () => ipcRenderer.invoke(GET_APPLICATION_INFO),
  onServerDisconnect: (callback: () => void) => ipcRenderer.on(ON_SERVER_DISCONNECTED, callback),
  onMenuItemClick: (expectMenuItemId: string, callback: (data: any) => void) => {
    if (!menuItemClickCallbacks[expectMenuItemId]) {
      menuItemClickCallbacks[expectMenuItemId] = [];
    }
    menuItemClickCallbacks[expectMenuItemId].push(callback);
  },
  removeMenuItemClickCallback: (expectMenuItemId: string, callback: MenuItemClickCallback) => {
    const callbacks = menuItemClickCallbacks[expectMenuItemId];
    if (!callbacks) {
      return;
    }
    const index = callbacks.indexOf(callback);
    if (index === -1) {
      return;
    }
    callbacks.splice(index, 1);
  },
});
