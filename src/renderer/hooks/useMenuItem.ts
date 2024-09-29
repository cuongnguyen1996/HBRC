import { useEffect } from 'react';
import useApplication from './useApplication';
import { MenuItemId } from '@shared/constants';
import { PreloadEventListener } from '@shared/event/preload';

export function useMenuItem<D extends any>(menuItemId: MenuItemId, callback: PreloadEventListener<D>) {
  const application = useApplication();
  useEffect(() => {
    const subId = application.onMenuItemClick(menuItemId, callback);
    return () => {
      if (subId) application.unsubscribeEvent(subId);
    };
  }, []);
}
