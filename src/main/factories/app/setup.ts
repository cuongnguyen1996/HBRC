import { app, BrowserWindow } from 'electron';

import { PLATFORM, ENVIRONMENT } from '@shared/constants/main';
import { makeAppId } from '@shared/utils';

export async function makeAppSetup(createWindow: () => Promise<BrowserWindow>) {
  let window = await createWindow();

  app.on('activate', async () =>
    !BrowserWindow.getAllWindows().length
      ? (window = await createWindow())
      : BrowserWindow.getAllWindows()
          ?.reverse()
          .forEach((window) => window.restore())
  );

  app.on('window-all-closed', () => !PLATFORM.IS_MAC && app.quit());

  return window;
}

PLATFORM.IS_LINUX && app.disableHardwareAcceleration();

PLATFORM.IS_WINDOWS && app.setAppUserModelId(ENVIRONMENT.IS_DEV ? process.execPath : makeAppId());

app.commandLine.appendSwitch('force-color-profile', 'srgb');
