import { useRef, useState } from 'react';
import {Form, message} from 'antd';
import type { ActionType } from '@ant-design/pro-components';
import {deleteBigBox, getBigBoxList, updateBigBox} from '@/services/ant-design-pro/storage';
import type { BigBox } from '@/types';

export const useBigBox = () => {
  const actionRef = useRef<ActionType>();
  const [formRef] = Form.useForm();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');

  // 保持原有的 fetchBigBoxList 方法不变...

  /**
   * 打开模态框并初始化表单数据
   */
  const handleModalOpen = (type: string, record?: BigBox) => {
    setModalOpen(true);
    setModalTitle(`${type} Big Box`);

    if (record) {
      formRef.setFieldsValue({
        id: record.id,
        barcode: record.barcode,
        shelf_number: record.shelf_number,
        order_no: record.order_no,
      });
    }
  };

  /**
   * 关闭模态框
   */
  const handleModalClose = (reload = false) => {
    setModalOpen(false);
    formRef.resetFields();
    if (reload) {
      actionRef.current?.reload();
    }
  };

  /**
   * 更新记录
   */
  const handleUpdate = async () => {
    const values = await formRef.validateFields();
    const hide = message.loading('loading...');

    try {
      const result = await updateBigBox(values.id, {
        barcode: values.barcode,
        shelf_number: values.shelf_number,
        order_no: values.order_no,
      });

      if (!result.ok) {
        message.error(result.message);
        return;
      }

      message.success('更新成功');
      handleModalClose(true);
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      hide();
    }
  };

  /**
   * 删除记录
   */
  const handleDelete = async (record: BigBox) => {
    const hide = message.loading('loading...');

    try {
      const result = await deleteBigBox(record.id);
      if (!result.ok) {
        message.error(result.message);
        return;
      }

      message.success('删除成功');
      actionRef.current?.reload();
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      hide();
    }
  };

  /**
   * 获取数据列表
   */
  const fetchBigBoxList = async (params: any) => {
    const requestParams = {
      ...params,
      page: params?.current ?? 1,
    };

    const hide = message.loading('loading...');
    try {
      const response = await getBigBoxList(requestParams);
      if (!response.ok) {
        message.error(response.message);
        return {
          data: [],
          success: false,
          total: 0,
        };
      }

      return {
        data: response.data.data,
        success: true,
        total: response.data.total,
      };
    } catch (error) {
      message.error((error as Error).message);
      return {
        data: [],
        success: false,
        total: 0,
      };
    } finally {
      hide();
    }
  };

  return {
    formRef,
    actionRef,
    modalOpen,
    modalTitle,
    fetchBigBoxList,
    handleModalOpen,
    handleModalClose,
    handleUpdate,
    handleDelete,
  };
};
