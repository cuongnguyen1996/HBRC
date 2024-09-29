import React from 'react';
import { Spin } from 'antd';

export default function FullScreenSpinner() {
  return <Spin tip={'Loading...'} fullscreen spinning={true} size="large" />;
}
