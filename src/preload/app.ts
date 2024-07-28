import { contextBridge, ipcRenderer } from 'electron';
import { GET_APPLICATION_INFO, SET_APPLICATION_OPTIONS } from '@shared/constants/ipcs';

contextBridge.exposeInMainWorld('applicationAPI', {
  setApplicationOptions: (options: any) => ipcRenderer.invoke(SET_APPLICATION_OPTIONS, options),
  getApplicationInfo: () => ipcRenderer.invoke(GET_APPLICATION_INFO),
});
