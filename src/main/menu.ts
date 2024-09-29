import { App, Menu } from 'electron';
import { DebugWindow } from './windows/Debug';
import { PLATFORM } from '@shared/constants/main';

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
    {
      label: 'Development',
      submenu: [
        {
          label: 'Debug',
          click: async () => {
            await DebugWindow();
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
};

export const addMenuItem = (menuItem: Electron.MenuItemConstructorOptions) => {
  const buildFromTemplate = Menu.buildFromTemplate([menuItem]);
  const currentMenu = Menu.getApplicationMenu();
  buildFromTemplate.items.forEach((item) => {
    currentMenu.append(item);
  });
  Menu.setApplicationMenu(currentMenu);
};

export const addMenuItems = (menuItems: Electron.MenuItemConstructorOptions[]) => {
  const buildFromTemplate = Menu.buildFromTemplate(menuItems);
  const currentMenu = Menu.getApplicationMenu();
  buildFromTemplate.items.forEach((item) => {
    currentMenu.append(item);
  });
  Menu.setApplicationMenu(currentMenu);
};
