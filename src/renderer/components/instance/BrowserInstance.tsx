import React from 'react';
import { Card, Tag, Popconfirm, message } from 'antd';
import { SendOutlined, WindowsOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import QueryKeys from '@renderer/constants/queryKeys';
import useBrowserInstanceManager from '@renderer/hooks/useBrowserInstanceManager';

const DeleteBtn = ({ disabled, onConfirm }) => {
  return (
    <Popconfirm
      disabled={disabled}
      title="Delete intance"
      description="Are you sure to delete this instance?"
      onConfirm={onConfirm}
      okText="Delete"
      cancelText="Cancel"
    >
      <DeleteOutlined style={{ color: 'red' }} onClick={async () => {}} />
    </Popconfirm>
  );
};

export default function BrowserInstanceComponent({ instance }) {
  const instanceManager = useBrowserInstanceManager();

  const queryClient = useQueryClient();

  const deleteChannel = useMutation({
    mutationFn: instanceManager.deleteInstance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_INSTANCES] });
    },
    onError(error, variables, context) {
      message.error('Delete intance failed');
    },
  });

  return (
    <Card
      actions={[
        <WindowsOutlined
          key="showWindow"
          onClick={() => {
            instanceManager.showInstanceWindow(instance.sessionId);
          }}
        />,

        <DeleteBtn
          key="delete"
          disabled={deleteChannel.isPending}
          onConfirm={() => deleteChannel.mutate(instance.id)}
        />,
      ]}
    >
      <Card.Meta title={instance.name} description={instance.url} />
    </Card>
  );
}
