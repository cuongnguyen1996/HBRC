import ReactDom from 'react-dom/client';
import React from 'react';

import { AppRoutes } from './routes';
import { ConfigProvider } from 'antd';
import './styles.css';
import 'antd/dist/reset.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppContextProvider from './context/app';

const queryClient = new QueryClient();

ReactDom.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider>
      <QueryClientProvider client={queryClient}>
        <AppContextProvider>
          <AppRoutes />
        </AppContextProvider>
      </QueryClientProvider>
    </ConfigProvider>
  </React.StrictMode>
);
