import { contextBridge, ipcRenderer } from 'electron';
import {
  ADD_INSTANCE,
  DELETE_INSTANCE,
  GET_INSTANCES,
  SHOW_INSTANCE_WINDOW,
  CALL_INSTANCE_FUNCTION,
} from '@shared/constants/ipcs';

contextBridge.exposeInMainWorld('browserInstanceManagerAPI', {
  getInstances: () => ipcRenderer.invoke(GET_INSTANCES),
  addInstance: (name: string, url: string) => ipcRenderer.invoke(ADD_INSTANCE, name, url),
  deleteInstance: (sessionId: string) => ipcRenderer.invoke(DELETE_INSTANCE, sessionId),
  showInstanceWindow: (sessionId: string) => ipcRenderer.invoke(SHOW_INSTANCE_WINDOW, sessionId),
  callInstanceFunction: (sessionId: string, method: string, ...args: any[]) =>
    ipcRenderer.invoke(CALL_INSTANCE_FUNCTION, sessionId, method, ...args),
});
