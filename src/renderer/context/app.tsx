import { message } from 'antd';
import { MessageInstance } from 'antd/es/message/interface';
import React from 'react';

const AppContext = React.createContext<{ messageApi: MessageInstance; messageContextHolder: React.ReactElement }>({
  messageApi: undefined,
  messageContextHolder: null,
});

export default function AppContextProvider({ children }) {
  const [messageApi, messageContextHolder] = message.useMessage();

  return (
    <AppContext.Provider
      value={{
        messageApi,
        messageContextHolder,
      }}
    >
      {messageContextHolder}
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => React.useContext(AppContext);
