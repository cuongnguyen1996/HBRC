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
