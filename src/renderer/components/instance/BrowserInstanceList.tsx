import React from 'react';
import { Row, Col, Empty, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import QueryKeys from '@renderer/constants/queryKeys';
import useBrowserInstanceManager from '@renderer/hooks/useBrowserInstanceManager';
import BrowserInstanceComponent from './BrowserInstance';

function renderSpin() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Spin tip="Loading" size="large"></Spin>
    </div>
  );
}

function renderInstances(instances: any[]) {
  return (
    <Row gutter={[16, 16]}>
      {instances.map((instance) => {
        return (
          <Col key={instance.id} span={10}>
            <BrowserInstanceComponent instance={instance} />
          </Col>
        );
      })}
    </Row>
  );
}

export function BrowserInstanceList() {
  const instanceManager = useBrowserInstanceManager();

  const { data: instances, isFetching } = useQuery({
    queryKey: [QueryKeys.GET_INSTANCES],
    queryFn: instanceManager.getInstances,
  });

  console.log('instances', instances);

  const isEmpty = !instances || !instances.length;

  return (
    <>
      {isFetching && renderSpin()}
      {!isFetching && isEmpty && <Empty />}
      {!isEmpty && renderInstances(instances)}
    </>
  );
}
