import { createWindow } from '@main/factories';
import { ENVIRONMENT } from '@shared/constants';
import { PRELOAD_FILE_PATH } from '@main/config';
import { shell } from 'electron';

export async function AboutUsWindow() {
  const window = createWindow({
    id: 'aboutUs',
    isSingleInstance: true,
    keepOpen: false,
    title: 'About us',
    width: 600,
    height: 360,
    show: true,
    center: true,
    movable: true,
    resizable: false,
    alwaysOnTop: false,
    autoHideMenuBar: true,

    webPreferences: {
      webSecurity: !ENVIRONMENT.IS_DEBUG,
      preload: PRELOAD_FILE_PATH,
    },
  });

  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  return window;
}
