import { app } from 'electron';
import { makeAppWithSingleInstanceLock } from './factories';
import { Application } from './app';
import { initMenu } from './menu';

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  // On certificate error we disable default behaviour (stop loading the page)
  // and we then say "it is all fine - true" to the callback
  event.preventDefault();
  callback(true);
});
app.commandLine.appendSwitch('ignore-certificate-errors');

makeAppWithSingleInstanceLock(async () => {
  const hicApp = new Application(app, {});
  initMenu(app);
  await hicApp.init();
});
