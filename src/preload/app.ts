import { contextBridge, ipcRenderer } from 'electron';
import {
  GET_APPLICATION_INFO,
  SET_APPLICATION_OPTIONS,
  ON_MENU_ITEM_CLICKED,
  ON_SERVER_DISCONNECTED,
} from '@shared/constants/ipcs';

contextBridge.exposeInMainWorld('applicationAPI', {
  setApplicationOptions: (options: any) => ipcRenderer.invoke(SET_APPLICATION_OPTIONS, options),
  getApplicationInfo: () => ipcRenderer.invoke(GET_APPLICATION_INFO),
  onServerDisconnect: (callback: () => void) => ipcRenderer.on(ON_SERVER_DISCONNECTED, callback),
  onMenuItemClick: (expectMenuItemId: string, callback: (data: any) => void) =>
    ipcRenderer.on(ON_MENU_ITEM_CLICKED, (_, menuItemId, data: any) => {
      if (menuItemId === expectMenuItemId) {
        callback(data);
      }
    }),
});
