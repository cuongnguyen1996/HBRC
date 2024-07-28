import React from 'react';
import { Card, Tag, Popconfirm, message, Modal, Form, Input, Button } from 'antd';
import { SendOutlined, WindowsOutlined, DeleteOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import QueryKeys from '@renderer/constants/queryKeys';
import useBrowserInstanceManager from '@renderer/hooks/useBrowserInstanceManager';
import { ENVIRONMENT } from '@shared/constants';

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

const IS_DEBUG = ENVIRONMENT.IS_DEBUG;

const CallFunctionModal = ({ isOpen, instance, setIsOpen }) => {
  const instanceManager = useBrowserInstanceManager();
  const callFunction = useMutation({
    mutationFn: async ({ sessionId, method, args }: { sessionId: string; method: string; args: any[] }) =>
      instanceManager.callInstanceFunction(sessionId, method, ...args),
    onError(error, variables, context) {
      console.log({ error, variables, context });
      message.error('Send message failed');
    },
  });

  return (
    <Modal
      title="Call Function"
      open={isOpen}
      cancelText="Close"
      onCancel={() => {
        setIsOpen(false);
      }}
    >
      <Form
        onFinish={(values) => {
          callFunction.mutate({ sessionId: instance.sessionId, method: values.method, args: [values.code] });
        }}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        autoComplete="off"
      >
        <Form.Item label="Method" name="method" rules={[{ required: true, message: 'Please input method!' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Code" name="code" rules={[{ required: true, message: 'Please input your code!' }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Execute
          </Button>
        </Form.Item>
      </Form>
    </Modal>
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

  const [isCFModalOpen, setCFModalOpen] = React.useState(false);

  const actions = [
    <WindowsOutlined
      key="showWindow"
      onClick={() => {
        instanceManager.showInstanceWindow(instance.sessionId);
      }}
    />,
    ,
    <DeleteBtn
      key="delete"
      disabled={deleteChannel.isPending}
      onConfirm={() => deleteChannel.mutate(instance.sessionId)}
    />,
  ];
  if (IS_DEBUG) {
    actions.push(
      <SendOutlined
        key="call"
        onClick={() => {
          setCFModalOpen(true);
        }}
      />
    );
  }

  return (
    <Card actions={actions}>
      <Card.Meta title={instance.name} description={instance.url} />
      <CallFunctionModal instance={instance} isOpen={isCFModalOpen} setIsOpen={setCFModalOpen} />
    </Card>
  );
}
