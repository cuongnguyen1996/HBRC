import React from 'react';
import { useAppContext } from '@renderer/context/app';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import QueryKeys from '@renderer/constants/queryKeys';
import { Button, Input, Tag } from 'antd';
import useApplication from '@renderer/hooks/useApplication';
import { b64DecodeString } from '@shared/utils/crypto';

export default function ConnectionStringComponent() {
  const [connectionString, setConnectionString] = React.useState('');

  const { messageApi } = useAppContext();

  const app = useApplication();

  const queryClient = useQueryClient();

  const setApplicationOptions = useMutation({
    mutationFn: app.setApplicationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_INSTANCES] });
    },
  });

  const handleConnectionString = async () => {
    try {
      const appOptions = JSON.parse(b64DecodeString(connectionString));
      await setApplicationOptions.mutateAsync(appOptions);
    } catch (e) {
      messageApi.error('Invalid connection string');
    }
  };

  return (
    <>
      <Tag color="blue">Input your connection string</Tag>
      <Input
        value={connectionString}
        onChange={(e) => {
          setConnectionString(e.target.value);
        }}
      />
      <div className="flex justify-end">
        <Button type="primary" disabled={!connectionString} onClick={handleConnectionString}>
          Submit
        </Button>
      </div>
    </>
  );
}
