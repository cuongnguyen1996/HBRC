import { ipcMain } from 'electron';
import {
  GET_INSTANCES,
  ADD_INSTANCE,
  DELETE_INSTANCE,
  SHOW_INSTANCE_WINDOW,
  SET_APPLICATION_OPTIONS,
  CALL_INSTANCE_FUNCTION,
  GET_APPLICATION_INFO,
} from '@shared/constants/ipcs';
import { Application } from '../app';

export const registerIPCs = (app: Application) => {
  // InstanceManager
  ipcMain.handle(GET_INSTANCES, async () => {
    return await app.getInstanceManager().getInstances();
  });

  ipcMain.handle(ADD_INSTANCE, async (...args) => {
    const [_, name, url] = args;
    return await app.getInstanceManager().addInstance(name, url);
  });
  ipcMain.handle(DELETE_INSTANCE, async (...args) => {
    const [_, sessionId] = args;
    return await app.getInstanceManager().deleteInstance(sessionId);
  });
  ipcMain.handle(SHOW_INSTANCE_WINDOW, async (...args) => {
    const [_, sessionId] = args;
    return await app.getInstanceManager().showInstanceWindow(sessionId);
  });
  ipcMain.handle(CALL_INSTANCE_FUNCTION, async (...args) => {
    const [_, sessionId, method, ...fArgs] = args;
    return await app.getInstanceManager().callInstanceFunction(sessionId, method, ...fArgs);
  });

  // Application
  ipcMain.handle(SET_APPLICATION_OPTIONS, async (...args) => {
    const [_, options] = args;
    await app.setOptions(options);
  });

  ipcMain.handle(GET_APPLICATION_INFO, async (...args) => {
    return await app.getAppInfo();
  });
};
