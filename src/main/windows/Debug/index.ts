import { createWindow } from '@main/factories';
import { ENVIRONMENT } from '@shared/constants';
import { PRELOAD_FILE_PATH } from '@main/config';

export async function DebugWindow() {
  const window = createWindow({
    id: 'debug',
    title: 'Headless Browser Remote Controller Debugger',
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

  window.webContents.on('did-finish-load', () => {
    if (ENVIRONMENT.IS_LOCAL) {
      window.webContents.openDevTools({ mode: 'undocked' });
    }
  });

  return window;
}
