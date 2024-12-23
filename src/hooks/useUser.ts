import { useState, useEffect, useRef } from 'react';
import { Form, message } from 'antd';
import { getUserList, deleteUser } from '@/services/ant-design-pro/user';
import type { ActionType } from '@ant-design/pro-components';
import { produce } from 'immer';
import { createCategory, getAllCategories, updateCategory } from "@/services/ant-design-pro/category";
import { map } from "lodash";

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

export const useUser = () => {

  const actionRef = useRef<ActionType>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<{ [key: string]: any }>({
    formData: initFormData,
    type: '',
  });
  const [formRef] = Form.useForm();

  const [options, setOptions] = useState<Options[]>([]);


  // 初始化数据
  const loadInitData = async () => {
  };

  // 拿Options里面的数据
  const getOptions = async (record: {[key: string]:any}) => {

    console.log("调用getOptions方法");

    // console.log(    await getAllCategories() );

    setOptions([]);

    let newVar = await getAllCategories();

    const out = map(newVar.data, ({ id, name }) => ({
      value: id,
      label: name
    }))

    out.unshift({ value: 0, label: '顶级分类' });
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
   * 创建或修改数据
   * 进行判断 是创建还是修改
   */
  const handleUpdateOrCreate = async () => {
    // console.log("1")
    const submitData = formRef.getFieldsValue();
    // console.log(submitData);
    const hide = message.loading('loading...');
    try {
      console.log('传入的数据', submitData)

      if ( submitData.pid === undefined) {
        submitData.pid = 0;
      }

      const result =
        submitData?.id && submitData.id > 0
          // 传入的数据有id
          ? await updateCategory(submitData.id, submitData)
          // 传入的数据没有id
          : await createCategory(submitData);

      if (!result.ok) {
        // 从后端拿到的数据
        message.error(result.message);
        return;
      }

      setOptions([]);
      let newVar = await getAllCategories();
      const out = map(newVar.data, ({ id, name }) => ({
        value: id,
        label: name
      }))
      out.unshift({ value: 0, label: '顶级分类' });
      console.log(out)
      setOptions(out);

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
