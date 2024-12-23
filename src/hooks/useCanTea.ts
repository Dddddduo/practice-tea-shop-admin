import { useState, useRef } from 'react';
import {Form, message} from 'antd';
import type { ActionType } from '@ant-design/pro-components';
import type { CanTea } from '@/types';
import {deleteCanTea, getCanTeaList, updateCanTea} from "@/services/ant-design-pro/storage";

export const useCanTea = () => {
  const actionRef = useRef<ActionType>();
  const [formRef] = Form.useForm();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');

  /**
   * 打开模态框并初始化表单数据
   */
  const handleModalOpen = (type: string, record?: CanTea) => {
    setModalOpen(true);
    setModalTitle(`${type} Can Tea`);

    if (record) {
      formRef.setFieldsValue({
        id: record.id,
        barcode: record.barcode,
        collectible_no: record.collectible_no,
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
      const result = await updateCanTea(values.id, {
        barcode: values.barcode,
        collectible_no: values.collectible_no,
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
  const handleDelete = async (record: CanTea) => {
    const hide = message.loading('loading...');

    try {
      const result = await deleteCanTea(record.id);
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
   * @param params
   */
  const fetchCanTeaList = async (params: any) => {
    const requestParams = {
      ...params,
      page: params?.current ?? 1,
    };

    const hide = message.loading('loading...');
    try {
      const response = await getCanTeaList(requestParams);
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
    fetchCanTeaList,
    handleModalOpen,
    handleModalClose,
    handleUpdate,
    handleDelete,
  };
};
