import { ApplicationAPI, BrowserInstanceManagerAPI } from './app';

declare global {
  interface Window {
    browserInstanceManagerAPI: BrowserInstanceManagerAPI;
    applicationAPI: ApplicationAPI;
  }
}
export {};
