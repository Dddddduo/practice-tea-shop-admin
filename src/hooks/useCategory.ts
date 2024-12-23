import { useState, useEffect, useRef } from 'react';
import { Form, message } from 'antd';
import { createUser, updateUser, getUserList, deleteUser } from '@/services/ant-design-pro/user';
import type { ActionType } from '@ant-design/pro-components';
import { produce } from 'immer';
import {getAllCategories} from "@/services/ant-design-pro/category";
import {map} from "lodash";

const initFormData = {
  name: '',
  email: '',
  password: '123456',
  password_confirmation: '123456',
  mobile: '',
  gender: '',
  status: 1,
};

export interface Options {
  value: number;
  lable: string;
}

export const useCategory = () => {

  const actionRef = useRef<ActionType>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<{ [key: string]: any }>({
    formData: initFormData,
    type: '',
  });
  const [formRef] = Form.useForm();

  const [options, setOptions] = useState<Options[]>([
    // { value: 'jack', label: 'Jack' },
    // { value: 'lucy', label: 'Lucy' },
    // { value: 'Yiminghe', label: 'yiminghe' },
    // { value: 'disabled', label: 'Disabled', disabled: true },
  ]);


  // 初始化数据
  const loadInitData = async () => {
    // 前端
    // todo 1. http api 获取数据
    // todo 2. 清洗数据，格式化为页面需要的数据格式
    // todo 3. 渲染页面
    // todo 4. 用户onChange操作
    // todo 5. 提交数据
    // todo 6. 收集数据，并格式化数据为http api需要的格式
    // todo 7. 发起提交
    // 后端
    // todo 1. 数据校验合法性
    // todo 2. 数据清洗格式化
    // todo 3. 调用Service
    // todo 4. 调用数据库获取或者写入数据
    // todo 5. 响应前端
  };

  const getOptions = async () => {

    console.log("调用getOptions方法");

    // console.log(    await getAllCategories() );

    let newVar = await getAllCategories();

    const out=map(newVar.data, ({ id, name }) => ({
      value: id,
      label: name
    }))

    console.log(out)

    setOptions(out);

  }

  /**
   * 加载基础数据
   */
  useEffect(() => {
    loadInitData().catch(console.log);

    getOptions();

    return () => {
      console.log('logout');
    };
  }, []);

  /**
   * 打开模态框并初始化表单数据
   * @param type
   * @param record
   */
  const handleModalOpen = (type: string, record?: { [key: string]: any }) => {
    setModalOpen(true);
    setUserData(
      produce((draft) => {
        draft.type = type;
      }),
    );
    if (type === 'create') {
      formRef.setFieldsValue(userData.formData);
      return;
    }

    //
    const upData = {
      ...record,
      date_string: '2024-05-01 21:22:12',
    };
    formRef.setFieldsValue(upData);


  };

  /**
   * 关闭模态框
   * @param isReload
   */
  const handleModalClose = (isReload = false) => {
    setModalOpen(false);

    formRef.resetFields()

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
    // userData, setUserData
    console.log(changedValues, allValues);
  };

  /**
   * 获取数据列表
   * @param params
   */
  const fetchUserList = async (params: any) => {
    console.log('获得数据列表 params', params);
    const requestParams = {
      ...params,
      page: params?.current ?? 1,
      per_page: 1,
    };

    const hide = message.loading('loading...');

    try {

      // http请求使用async和await
      const userList = await getUserList(requestParams);

      console.log( '返回的数据',userList.data);

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
   * 创建或修改数据
   * 进行判断 是创建还是修改
   */
  const handleUpdateOrCreate = async () => {
    // console.log("1")
    const submitData = formRef.getFieldsValue();
    // console.log(submitData);
    const hide = message.loading('loading...');
    try {
      const result =
        submitData?.id && submitData.id > 0
          ? await updateUser(submitData.id, submitData)
          : await createUser(submitData);
      if (!result.ok) {
        // 从后端拿到的数据
        message.error(result.message);
        return;
      }

      message.success('Submit successfully.');
      formRef.setFieldsValue({});
      handleModalClose(true);
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      // 关闭加载
      hide();
    }
  };

  /**
   * 删除记录
   * @param record
   */
  const handleDelete = async (record: { [key: string]: any }) => {

    console.log("删除的数据id",record.id)

    if (!record?.id || record.id <= 0) {
      message.error('ID not find.');
      return;
    }

    const hide = message.loading('load...');
    const { id } = record;
    try {
      const result = await deleteUser(id);
      if (!result.ok) {
        message.error(result.message);
        return;
      }

      message.success('成功删除');
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
    fetchUserList,
    handleModalOpen,
    handleModalClose,
    handleUpdateOrCreate,
    handleDelete,
    handleValueChange,
    options,
  };

};
