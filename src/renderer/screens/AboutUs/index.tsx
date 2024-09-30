import React, { useEffect } from 'react';
import { Row, Col } from 'antd';
import { GITHUB_REPOSITORY_URL } from '@shared/constants';
import useApplication from '@renderer/hooks/useApplication';

const rowStyle = { marginBottom: 5 };

export function AboutUsScreen() {
  const application = useApplication();
  const [version, setVersion] = React.useState<string | null>(null);
  useEffect(() => {
    application.getApplicationInfo().then((info) => {
      setVersion(info.version);
    });
  }, []);
  return (
    <Col span={24} style={{ textAlign: 'center' }}>
      <Row justify={'center'} style={rowStyle}>
        <h1 style={{ fontSize: 50 }}>HBRC</h1>
      </Row>
      <Row justify={'center'} style={{ ...rowStyle, marginTop: -20 }}>
        <span>Version: {version}</span>
      </Row>
      <Row justify={'center'} style={{ ...rowStyle, marginTop: 30 }}>
        <a target="_blank" href={GITHUB_REPOSITORY_URL}>
          {GITHUB_REPOSITORY_URL}
        </a>
      </Row>
    </Col>
  );
}
