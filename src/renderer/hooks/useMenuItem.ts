import { useEffect } from 'react';
import useApplication from './useApplication';

export function useMenuItem<D extends any>(menuItemId: string, callback: (data: D) => void) {
  const application = useApplication();
  useEffect(() => {
    application.onMenuItemClick(menuItemId, callback);
  }, []);
}
