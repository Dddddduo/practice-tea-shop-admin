import React from 'react';
import { Button, Modal } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { ExclamationCircleOutlined } from '@ant-design/icons';


interface DeleteButtonProps extends ButtonProps {
  title?: string;
  desc?: string;
  okText?: string;
  cancelText?: string;
  onConfirm: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  title = 'Confirm deletion ?',
  desc = 'This action is irreversible. Are you sure you want to proceed ?',
  okText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  ...buttonProps
}) => {
  const showModal = () => {
    Modal.confirm({
      title: title,
      icon: <ExclamationCircleOutlined />,
      content: desc,
      okText: okText,
      okType: 'danger',
      cancelText: cancelText,
      onOk() {
        onConfirm();
      },
    });
  };

  return <Button {...buttonProps} onClick={showModal} />;
};

export default DeleteButton;
