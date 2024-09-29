import React from 'react';
import { Button, Tag } from 'antd';
import { ApplicationInfo } from '~/@types/app';

export default function ServerInfo({ applicationInfo }: { applicationInfo: ApplicationInfo }) {
  return (
    <>
      <Tag>Server name: {applicationInfo?.options?.serverName}</Tag>
    </>
  );
}
