import React from 'react';
import {Drawer, Modal, ModalProps} from "antd";
import {isFunction} from "lodash";

// 定义组件属性类型，扩展自 ModalProps
interface CommContainerProps extends Omit<ModalProps, 'visible' | 'footer'> {
  children?: React.ReactNode;
  type?: ModalType.Modal | ModalType.Drawer | undefined;
  onClose?: () => void | undefined
}


export enum ModalType {
  Modal = "modal",
  Drawer = "drawer"
}


const BaseContainer: React.FC<CommContainerProps> = (props) => {
  const {children, type, ...restProps} = props;
  const closeHandle = isFunction(restProps?.onCancel) ? restProps.onCancel : (isFunction(restProps?.onClose) ? restProps.onClose : () => {})

  return (
    <>
      {
        type === ModalType.Drawer ? (
          <Drawer
            destroyOnClose={true}
            onClose={closeHandle}
            {...restProps}
          >
            {children}
          </Drawer>
        ) : (
          <Modal
            destroyOnClose={true}
            footer={null}
            onCancel={closeHandle}
            {...restProps}
          >
            {children}
          </Modal>
        )
      }
    </>

  );
};

export default BaseContainer;
