import { message } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import React from 'react';
import useApplication from '@renderer/hooks/useApplication';
import { ApplicationAPI, ApplicationInfo } from '~/@types/app';
import QueryKeys from '@renderer/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';

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
  const application = useApplication();

  const { data: applicationInfo, isFetching: isFetchingAppInfo } = useQuery<ApplicationInfo>({
    queryKey: [QueryKeys.GET_APPLICATION_INFO],
    queryFn: application.getApplicationInfo,
    enabled: !!application,
  });

  return (
    <AppContext.Provider
      value={{
        messageApi,
        messageContextHolder,
        application,
        applicationInfo,
        isLoading: isFetchingAppInfo,
      }}
    >
      {messageContextHolder}
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => React.useContext(AppContext);
