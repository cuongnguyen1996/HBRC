import { BrowserWindow, app } from 'electron';

import { createWindow } from '@main/factories';
import { ENVIRONMENT } from '@shared/constants';
import { PRELOAD_FILE_PATH } from '@main/config';

export async function MainWindow() {
  const window = createWindow({
    id: 'main',
    title: 'Headless Browser Remote Controller',
    width: 1200,
    height: 720,
    show: true,
    center: true,
    movable: true,
    resizable: true,
    alwaysOnTop: false,
    autoHideMenuBar: true,

    webPreferences: {
      webSecurity: !ENVIRONMENT.IS_DEBUG,
      preload: PRELOAD_FILE_PATH,
    },
  });

  window.webContents.on('did-finish-load', () => {
    if (ENVIRONMENT.IS_LOCAL) {
      window.webContents.openDevTools({ mode: 'undocked' });
    }
  });

  window.on('close', () => BrowserWindow.getAllWindows().forEach((window) => window.destroy()));

  return window;
}
