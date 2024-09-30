import { BrowserWindow, app, shell } from 'electron';

import { createWindow } from '@main/factories';
import { ENVIRONMENT } from '@shared/constants';
import { PRELOAD_FILE_PATH } from '@main/config';
import { initMenuForMainWindow } from '@main/menu';
import Application from '@main/app';

export async function MainWindow(mainApp: Application) {
  const mainWindow = createWindow({
    id: 'main',
    title: 'Headless Browser Remote Controller',
    width: 1200,
    height: 720,
    show: true,
    center: true,
    movable: true,
    resizable: true,
    alwaysOnTop: false,
    autoHideMenuBar: false,

    webPreferences: {
      webSecurity: !ENVIRONMENT.IS_DEBUG,
      preload: PRELOAD_FILE_PATH,
    },
  });

  mainWindow.webContents.on('did-finish-load', () => {
    if (ENVIRONMENT.IS_LOCAL) {
      mainWindow.webContents.openDevTools({ mode: 'undocked' });
    }
  });

  initMenuForMainWindow(app, mainApp, mainWindow);

  mainWindow.on('close', () => BrowserWindow.getAllWindows().forEach((window) => window.destroy()));

  return mainWindow;
}
