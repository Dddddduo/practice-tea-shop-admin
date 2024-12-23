import { useState, useRef } from 'react';
import {Form, message} from 'antd';
import type { ActionType } from '@ant-design/pro-components';
import type { SmallBox } from '@/types';
import {deleteSmallBox, getSmallBoxList, updateSmallBox} from "@/services/ant-design-pro/storage";

export const useSmallBox = () => {
  const actionRef = useRef<ActionType>();
  const [formRef] = Form.useForm();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');

  /**
   * 打开模态框并初始化表单数据
   */
  const handleModalOpen = (type: string, record?: SmallBox) => {
    setModalOpen(true);
    setModalTitle(`${type} Small Box`);

    if (record) {
      formRef.setFieldsValue({
        id: record.id,
        barcode: record.barcode,
        big_box_barcode: record.big_box_barcode,
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
      const result = await updateSmallBox(values.id, {
        barcode: values.barcode,
        big_box_barcode: values.big_box_barcode,
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
  const handleDelete = async (record: SmallBox) => {
    const hide = message.loading('loading...');

    try {
      const result = await deleteSmallBox(record.id);
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
  const fetchSmallBoxList = async (params: any) => {
    const requestParams = {
      ...params,
      page: params?.current ?? 1,
    };

    const hide = message.loading('loading...');
    try {
      const response = await getSmallBoxList(requestParams);
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
    fetchSmallBoxList,
    handleModalOpen,
    handleModalClose,
    handleUpdate,
    handleDelete,
  };
};
