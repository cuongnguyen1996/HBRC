import React from 'react';
import { Router, Route } from 'electron-router-dom';

import { MainScreen } from './screens';
import { DebugScreen } from './screens/Debug';

export function AppRoutes() {
  return (
    <Router
      main={
        <>
          <Route path="/" element={<MainScreen />} />
          <Route path="/anotherScreen" element={<MainScreen />} />
        </>
      }
      about={<Route path="/" element={<MainScreen />} />}
      debug={<Route path="/" element={<DebugScreen />} />}
    />
  );
}
