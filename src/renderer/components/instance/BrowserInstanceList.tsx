import React, { useEffect } from 'react';
import { Row, Col, Empty, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import QueryKeys from '@renderer/constants/queryKeys';
import useBrowserInstanceManager from '@renderer/hooks/useBrowserInstanceManager';
import BrowserInstanceComponent from './BrowserInstance';
import useApplication from '@renderer/hooks/useApplication';
import { PreloadEventKey } from '@shared/event/preload';

function renderSpin() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Spin size="large"></Spin>
    </div>
  );
}

function renderInstances(instances: any[]) {
  return (
    <Row gutter={[16, 16]}>
      {instances.map((instance) => {
        return (
          <Col key={instance.sessionId} span={10}>
            <BrowserInstanceComponent instance={instance} />
          </Col>
        );
      })}
    </Row>
  );
}

export default function BrowserInstanceList() {
  const instanceManager = useBrowserInstanceManager();
  const application = useApplication();
  const {
    data: instances,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [QueryKeys.GET_INSTANCES],
    queryFn: instanceManager.getInstances,
  });

  useEffect(() => {
    application.subscribeEvent(PreloadEventKey.INSTANCE_UPDATED, () => {
      refetch();
    });
  }, []);

  const isEmpty = !instances || !instances.length;

  return (
    <>
      {isFetching && renderSpin()}
      {!isFetching && isEmpty && <Empty />}
      {!isEmpty && renderInstances(instances)}
    </>
  );
}
