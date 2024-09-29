import { App, BrowserWindow, Menu } from 'electron';
import { DebugWindow } from './windows/Debug';
import { PLATFORM } from '@shared/constants/main';
import { MenuItemId, ON_MENU_ITEM_CLICKED } from '@shared/constants';

export const initMenu = (app: App) => {
  const macMenu = [
    {
      label: app.name,
      submenu: [],
    },
  ];

  const menuTemplate = [
    // { role: 'appMenu' }
    ...(PLATFORM.IS_MAC ? macMenu : []),
    // { role: 'fileMenu' }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
};

export const initMenuForMainWindow = (app: App, mainWindow: BrowserWindow) => {
  const sendMenuClickedToRenderer = (menuItemId: string, data?: any) => {
    mainWindow.webContents.send(ON_MENU_ITEM_CLICKED, menuItemId, data);
  };

  addMenuItems(
    [
      {
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
            click: async () => {
              await DebugWindow();
            },
          },
          {
            label: 'Exit',
            click: () => app.quit(),
          },
        ],
      },
      {
        id: MenuItemId.ADD_INSTANCE,
        label: 'Manage',
        submenu: [
          {
            id: MenuItemId.ADD_INSTANCE,
            label: 'Add Instance',
            click: () => {
              sendMenuClickedToRenderer(MenuItemId.ADD_INSTANCE);
            },
          },
        ],
      },
    ],
    mainWindow
  );
};

export const addMenuItem = (menuItem: Electron.MenuItemConstructorOptions) => {
  const buildFromTemplate = Menu.buildFromTemplate([menuItem]);
  const currentMenu = Menu.getApplicationMenu();
  buildFromTemplate.items.forEach((item) => {
    currentMenu.append(item);
  });
  Menu.setApplicationMenu(currentMenu);
};

export const addMenuItems = (menuItems: Electron.MenuItemConstructorOptions[], window?: BrowserWindow) => {
  const buildFromTemplate = Menu.buildFromTemplate(menuItems);
  if (window) {
    window.setMenu(buildFromTemplate);
  } else {
    const currentMenu = Menu.getApplicationMenu();
    buildFromTemplate.items.forEach((item) => {
      currentMenu.append(item);
    });
    Menu.setApplicationMenu(currentMenu);
  }
};
