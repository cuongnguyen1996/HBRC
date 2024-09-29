import { message } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import React, { useEffect } from 'react';
import useApplication from '@renderer/hooks/useApplication';
import { ApplicationAPI, ApplicationInfo } from '@shared/types';
import QueryKeys from '@renderer/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';
import { PreloadEventKey } from '@shared/event/preload';

type AppContextType = {
  messageApi: MessageInstance;
  messageContextHolder: React.ReactElement;
  application: ApplicationAPI;
  applicationInfo: ApplicationInfo;
  isLoading: boolean;
  isOnboarded: boolean;
};

const AppContext = React.createContext<AppContextType>({
  messageApi: undefined,
  messageContextHolder: null,
  application: null,
  applicationInfo: null,
  isLoading: true,
  isOnboarded: false,
});

export default function AppContextProvider({ children }) {
  const [messageApi, messageContextHolder] = message.useMessage();
  const [isApplicationReady, setIsApplicationReady] = React.useState(true);
  const application = useApplication();

  const {
    data: applicationInfo,
    isFetching: isFetchingAppInfo,
    refetch,
  } = useQuery<ApplicationInfo>({
    queryKey: [QueryKeys.GET_APPLICATION_INFO],
    queryFn: application.getApplicationInfo,
    enabled: isApplicationReady,
  });
  const [isOnboarded, setIsOnboarded] = React.useState(false);

  useEffect(() => {
    const apReadySubId = application.subscribeEvent(PreloadEventKey.APPLICATION_READY, () => {
      setIsApplicationReady(true);
    });
    const serverDisSubId = application.subscribeEvent(PreloadEventKey.SERVER_DISCONNECTED, () => {
      refetch();
    });
    const transporterStatusSubId = application.subscribeEvent(PreloadEventKey.TRANSPORTER_STATUS_CHANGED, () => {
      refetch();
    });
    return () => {
      application.unsubscribeEvent(apReadySubId);
      application.unsubscribeEvent(serverDisSubId);
      application.unsubscribeEvent(transporterStatusSubId);
    };
  }, []);

  useEffect(() => {
    if (applicationInfo) {
      setIsOnboarded(!!applicationInfo.options?.serverName);
    }
  }, [applicationInfo]);

  return (
    <AppContext.Provider
      value={{
        messageApi,
        messageContextHolder,
        application,
        applicationInfo,
        isLoading: !isApplicationReady || isFetchingAppInfo,
        isOnboarded: isOnboarded,
      }}
    >
      {messageContextHolder}
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => React.useContext(AppContext);
