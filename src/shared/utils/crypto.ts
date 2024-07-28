import { isWeb } from './runtime';

export const b64EncodeString = (data: string): string => {
  if (isWeb()) {
    return btoa(data);
  } else {
    return Buffer.from(data).toString('base64');
  }
};

export const b64DecodeString = (data: string): string => {
  if (isWeb()) {
    return atob(data);
  } else {
    return Buffer.from(data, 'base64').toString();
  }
};
