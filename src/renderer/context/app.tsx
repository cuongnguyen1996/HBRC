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
};

const AppContext = React.createContext<AppContextType>({
  messageApi: undefined,
  messageContextHolder: null,
  application: null,
  applicationInfo: null,
  isLoading: true,
});

export default function AppContextProvider({ children }) {
  const [messageApi, messageContextHolder] = message.useMessage();
  const [isApplicationReady, setIsApplicationReady] = React.useState(false);
  const application = useApplication();

  const { data: applicationInfo, isFetching: isFetchingAppInfo } = useQuery<ApplicationInfo>({
    queryKey: [QueryKeys.GET_APPLICATION_INFO],
    queryFn: application.getApplicationInfo,
    enabled: isApplicationReady,
  });

  useEffect(() => {
    application.subscribeEvent(PreloadEventKey.APPLICATION_READY, () => {
      setIsApplicationReady(true);
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        messageApi,
        messageContextHolder,
        application,
        applicationInfo,
        isLoading: !isApplicationReady || isFetchingAppInfo,
      }}
    >
      {messageContextHolder}
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => React.useContext(AppContext);
