import React, { useEffect } from 'react';
import BrowserInstanceList from './BrowserInstanceList';
import { Modal } from 'antd';
import useApplication from '@renderer/hooks/useApplication';
import { MenuItemId } from '@shared/constants';
import { AddInstanceComponent } from './AddInstance';

export default function BrowserInstanceManagerComponent() {
  const application = useApplication();
  const [isOpenAddInstanceModal, setIsOpenAddInstanceModal] = React.useState(false);

  useEffect(() => {
    application.onMenuItemClick(MenuItemId.ADD_INSTANCE, () => {
      setIsOpenAddInstanceModal(true);
    });
  }, []);

  return (
    <>
      <BrowserInstanceList />
      <Modal
        title="Add Instance"
        open={isOpenAddInstanceModal}
        onCancel={() => {
          setIsOpenAddInstanceModal(false);
        }}
        footer={null}
      >
        <AddInstanceComponent />
      </Modal>
    </>
  );
}
