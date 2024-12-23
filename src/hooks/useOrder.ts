import { useState, useEffect, useRef } from 'react';
import { Form, message } from 'antd';
import type { ActionType } from '@ant-design/pro-components';
import { produce } from 'immer';
import { getOrderItems, getOrderList, deleteOrder, backfillWaybill } from '@/services/ant-design-pro/order';

export const useOrder = () => {
  const actionRef = useRef<ActionType>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [waybillValue, setWaybillValue] = useState("");
  const [userData, setUserData] = useState<{ [key: string]: any }>({
    formData: {},
    type: '',
  });
  const [formRef] = Form.useForm();

  // 初始化数据
  const loadInitData = async () => {
    console.log("调用loadInitData方法");
  };

  /**
   * 加载基础数据
   */
  useEffect(() => {
    loadInitData().catch(console.log);

    return () => {
      {/* 清理操作，例如计时器等 */}
    };
  }, []);

  /**
   * 打开模态框并初始化表单数据
   * @param type
   * @param record
   */
  const handleModalOpen = (type: string, record?: { [key: string]: any }) => {
    fetchOrderItems(record?.id).then(orderItems => {
      setUserData(
        produce((draft) => {
          draft.type = type;
          console.log(record)
          console.log(orderItems)
          draft.formData = { ...draft.formData, ...record, orderItems };
        }),
      );
      console.log(userData.formData);
      setModalOpen(true);
    });
  };

  /**
   * 关闭模态框
   * @param isReload
   */
  const handleModalClose = (isReload = false) => {
    setModalOpen(false);
    if (isReload) {
      actionRef.current?.reload();
    }
  };

  const UpdateOrderWaybillValue = (id: number, waybill: string, isReload = true) => {
    UpdateOrderWaybill(id, waybill).then(res => {
      setModalOpen(false);
      if (isReload) {
        actionRef.current?.reload();
      }
    })
  };

  /**
   * 获取数据列表
   * @param params
   */
  const fetchOrderList = async (params: any) => {
    console.log('获得数据列表 params', params);

    const hide = message.loading('loading...');

    try {

      // http请求使用async和await
      const userList = await getOrderList();

      console.log('返回的数据', userList.data);

      if (!userList.ok) {
        message.error(userList.message);
        return [];
      }
      return userList.data;
    } catch (error) {
      message.error((error as Error).message);
      return [];
    } finally {
      hide();
    }

  };
  const fetchOrderItems = async (id: number) => {
    console.log('获得数据列表 params', id);

    const hide = message.loading('loading...');

    try {

      // http请求使用async和await
      const userItems = await getOrderItems(id);

      console.log('fetchOrderItems返回的数据', userItems.data);

      if (!userItems.ok) {
        message.error(userItems.message);
        return [];
      }
      return userItems.data;
    } catch (error) {
      message.error((error as Error).message);
      return [];
    } finally {
      hide();
    }

  };
  const UpdateOrderWaybill = async (id: number, waybill: string) => {
    const hide = message.loading('loading...');
    try {
      // http请求使用async和await
      const userItems = await backfillWaybill(id, { "waybill": waybill });
      console.log('返回的数据', userItems.data);
      if (!userItems.ok) {
        message.error(userItems.message);
        return [];
      }
      return userItems.data;
    } catch (error) {
      message.error((error as Error).message);
      return [];
    } finally {
      hide();
    }

  };

  /**
   * 删除记录
   * @param record
   */
  const handleDelete = async (record: { [key: string]: any }) => {

    if (!record?.id || record.id <= 0) {
      message.error('ID not find.');
      return;
    }

    const hide = message.loading('load...');
    const { id } = record;
    try {
      const result = await deleteOrder(id, { reason: "Changed my mind" });
      if (!result.ok) {
        message.error(result.message);
        return;
      }
      console.log(id);
      message.success('取消订单成功');
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      // 隐藏加载的
      hide();
    }

    // 删除 record.id
    actionRef.current?.reload();

  };

  return {
    formRef,
    userData,
    modalOpen,
    actionRef,
    waybillValue,
    setWaybillValue,
    fetchOrderList,
    handleModalOpen,
    handleModalClose,
    handleDelete,
    UpdateOrderWaybillValue,
  };
};
