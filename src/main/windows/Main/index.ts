import { BrowserWindow, app } from 'electron';

import { createWindow } from '@main/factories';
import { ENVIRONMENT, MenuItemId, ON_MENU_ITEM_CLICKED } from '@shared/constants';
import { PRELOAD_FILE_PATH } from '@main/config';
import { addMenuItem } from '@main/menu';

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

  const sendMenuClickedToRenderer = (menuItemId: string, data?: any) => {
    window.webContents.send(ON_MENU_ITEM_CLICKED, menuItemId, data);
  };

  addMenuItem({
    id: MenuItemId.SERVER,
    label: 'Server',
    submenu: [
      {
        id: MenuItemId.DISCONNECT_SERVER,
        label: 'Disconnect',
        click: () => {
          sendMenuClickedToRenderer(MenuItemId.DISCONNECT_SERVER);
        },
      },
      {
        id: MenuItemId.DEBUG,
        label: 'Debug',
        click: () => {
          sendMenuClickedToRenderer(MenuItemId.DEBUG);
        },
      },
      {
        label: 'Exit',
        click: () => app.quit(),
      },
    ],
  });
  window.on('close', () => BrowserWindow.getAllWindows().forEach((window) => window.destroy()));

  return window;
}
