import {disableUser, getUsersList, updateUserInfo} from '@/services/ant-design-pro/users';
import {useRef, useState} from 'react';
import {Form, message} from 'antd';
import type {ActionType} from '@ant-design/pro-components';

const initFormData = {
  id: '',
  name: '',
  mobile: '',
  email: '',
  status: '',
  created_at: '',
  member_score: '',
  member_type: '',
};

export const useUsers = () => {

  const actionRef = useRef<ActionType>();

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [formRef] = Form.useForm();

  /**
   * 获取用户数据列表
   * @param params
   */
  const fetchUsersList = async (params: any) => {
    console.log('获得数据列表 params', params);
    // 拼接分页信息 传输到后端
    const requestParams = {
      ...params,
      page: params?.current ?? 1,
      per_page: 20,
    };
    const hide = message.loading('loading...');
    try {
      const userList = await getUsersList(requestParams);
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

  /**
   * 打开模态框
   * @param record
   */
  const handleOpenModal = async (record: { [key: string]: any }) => {
    setModalOpen(true);
    const upData = {
      ...record,
    };
    console.log('修改的数据', upData);
    formRef.setFieldsValue(upData);
  };

  /**
   * 关闭模态框
   * @param isReload
   */
  const handleModalClose = (isReload = false) => {
    setModalOpen(false);
    formRef.resetFields();
    if (isReload) {
      actionRef.current?.reload();
    }
  };

  /**
   * 操作编辑监听
   * @param changedValues
   * @param allValues
   */
  const handleValueChange = (changedValues: any, allValues: any) => {
    console.log(changedValues, allValues);
  };

  /**
   * 更新用户信息
   */
  const handleUpdate = async () => {
    const submitData = formRef.getFieldsValue();
    const hide = message.loading('loading...');
    console.log('修改的信息', submitData.id);
    try {
      const res = await updateUserInfo(submitData.id, submitData);
      if (!res.ok) {
        message.error(res.message);
        return;
      }
      message.success('submit success.');
      formRef.resetFields(); // 清空表单
      handleModalClose(true);
      actionRef.current?.reload();
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      hide();
    }
  };

  /**
   * 修改状态 禁用
   * @param id
   */
  const handleDisableUser = async (id: string) => {
    const hide = message.loading('loading...');
    const params = {status: 0};
    try {
      const res = await disableUser(id, params);
      if (!res.ok) {
        message.error(res.message);
        return;
      }
      message.success('user disable success.');
      actionRef.current?.reload(); // 刷新用户列表
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      hide();
    }
  };

  const handleEnableUser = async (id: string) => {
    const hide = message.loading('loading...');
    const params = {status: 1};
    try {
      const res = await disableUser(id, params);
      if (!res.ok) {
        message.error(res.message);
        return;
      }
      message.success('user enable success.');
      actionRef.current?.reload(); // 刷新用户列表
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      hide();
    }
  };

  return {
    actionRef,
    modalOpen,
    formRef,
    initFormData,
    fetchUsersList,
    handleOpenModal,
    handleEnableUser,
    handleModalClose,
    handleUpdate,
    handleValueChange,
    handleDisableUser
  };

};
