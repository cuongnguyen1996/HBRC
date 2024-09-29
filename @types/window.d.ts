import { ApplicationAPI, BrowserInstanceManagerAPI } from '@shared/types';

declare global {
  interface Window {
    browserInstanceManagerAPI: BrowserInstanceManagerAPI;
    applicationAPI: ApplicationAPI;
  }
}
export {};
