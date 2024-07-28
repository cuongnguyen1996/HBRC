import { contextBridge, ipcRenderer } from 'electron';
import { SET_APPLICATION_OPTIONS } from '@shared/constants/ipcs';

contextBridge.exposeInMainWorld('applicationAPI', {
  setApplicationOptions: (options: any) => ipcRenderer.invoke(SET_APPLICATION_OPTIONS, options),
});
