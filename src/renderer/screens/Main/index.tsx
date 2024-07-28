import React from 'react';
import { Col, Divider, Row } from 'antd';
import ConnectionStringComponent from '@renderer/components/ConnectionString';
import { BrowserInstanceList } from '@renderer/components/instance/BrowserInstanceList';
import { AddInstanceComponent } from '@renderer/components/instance/AddInstance';

export function MainScreen() {
  return (
    <>
      <Row>
        <Col span={24}>
          <ConnectionStringComponent />
        </Col>
      </Row>
      <Divider />
      <Row>
        <AddInstanceComponent />
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
