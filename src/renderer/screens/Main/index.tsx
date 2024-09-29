import React from 'react';
import { Col, Divider, Row } from 'antd';
import { useAppContext } from '@renderer/context/app';
import FullScreenSpinner from '@renderer/components/common/FullScreenSpinner';
import ServerInfo from '@renderer/components/ServerInfo';
import BrowserInstanceList from '@renderer/components/instance/BrowserInstanceList';

export function MainScreen() {
  const { isLoading, applicationInfo } = useAppContext();
  if (isLoading) {
    return <FullScreenSpinner />;
  }
  return (
    <>
      <Row>
        <ServerInfo applicationInfo={applicationInfo} />
      </Row>
      <Divider />
      <Row>
        <Col span={24}>
          <BrowserInstanceList />
        </Col>
      </Row>
    </>
  );
}
