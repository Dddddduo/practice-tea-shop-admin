import { useState, useEffect, useRef } from 'react';
import { Form, message } from 'antd';
import { createUser, updateUser, getUserList, deleteUser } from '@/services/ant-design-pro/user';
import type { ActionType } from '@ant-design/pro-components';
import { produce } from 'immer';
import {getAllCategories} from "@/services/ant-design-pro/category";
import {map} from "lodash";
import {
  createBrand, createSupplier,
  deleteBrand,
  deleteSupplier,
  getBrandList,
  getSupplierList,
  updateBrand
} from "@/services/ant-design-pro/brand";
import {useUser} from "@/hooks/useUser";

const initFormData = {
  id :'',
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

export const useBrandAndSupplier = () => {

  // 父组件的表单
  const actionRef = useRef<ActionType>();

  // 子组件的表单
  const actionSupplierRef = useRef<ActionType>();

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  //
  const [vendorModalOpen, setVendorModalOpen] = useState<boolean>(false);
  //
  const [manageModalOpen, setManageModalOpen] = useState<boolean>(false);

  // 刷新table
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchData = async ( record :{[key: string]:any}) => {
    console.log('刷新表格');
    setLoading(true);
    try {
      const response = await getSupplierList(record);
      console.log('刷新表格获取到的数据' );
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  const [userData, setUserData] = useState<{ [key: string]: any }>({
    formData: initFormData,
    type: '',
  });
  const [formRef] = Form.useForm();

  const [formSupplierRef] = Form.useForm();

  // options 供应商列表
  const [options, setOptions] = useState<Options[]>([]);

  const [recordId, setRecordId] = useState<{ [p: string]: any } | undefined>(undefined);
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

  /**
   * 加载基础数据
   */
  useEffect(() => {
    loadInitData().catch(console.log);

    console.log('看看我执行了吗');

    console.log("点击了按钮");

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
    setVendorModalOpen(true);
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
    setVendorModalOpen(false);
    formRef.resetFields()
    if (isReload) {
      actionRef.current?.reload();
    }
  };

  /**
   * 获得供应商的数据
   * 打开管理供应商的模态框
   * @param type
   * @param record
   */
  const handleManageModalOpen = async ( record?: { [key: string]: any }) => {

    console.log('管理供应商的id为', record);
    setRecordId(record);
    let newVar = await getSupplierList(record);
    console.log('供应商的数据',newVar)
    // 把数据放进去
    setOptions(newVar.data);
    setManageModalOpen(true);
    const upData = {
      brand_id:record,
    };
    formRef.setFieldsValue(upData);

  };

  /**
   * 关闭管理供应商的模态框
   * @param isReload
   */
  const handleManageModalClose = (isReload = false) => {
    setManageModalOpen(false);
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
    const hide = message.loading('loading...');
    try {
      // http请求使用async和await
      const userList = await getBrandList();
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

    console.log("1")
    const submitData = formRef.getFieldsValue();
    console.log('提交的信息',submitData);
    const hide = message.loading('loading...');
    try {
      const result =
        submitData?.id && submitData.id > 0
          ? await updateBrand(submitData.id, submitData)
          : await createBrand(submitData);
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

  // 创建供应商
  const handleSupplierCreate = async () => {

    console.log("开始创建供应商")

    const submitData = formRef.getFieldsValue();

    console.log('提交的信息',submitData);

    const hide = message.loading('loading...');

    try {

      const result = await createSupplier(submitData);

      if (!result.ok) {
        // 打印后端报错信息
        message.error(result.message);
        return;
      }

      message.success('添加供应商成功');

      // 获取一下 brand_id
      console.log("brand_id",submitData.brand_id);

      formRef.setFieldValue(
        "brand_id",submitData.brand_id
      );

      // 再次调用一次获取列表的方法
      let newVar = await getSupplierList(submitData.brand_id);

      console.log('供应商的数据',newVar)

      setOptions(newVar.data); // 更新 options 状态

      // 关闭模态框
      // handleModalClose(true);

    } catch (error) {
      message.error((error as Error).message);
    } finally {
      // 关闭加载
      hide();
    }
  };


  /**
   * 删除品牌记录
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
      const result = await deleteBrand(id);
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

  /**
   * 删除供应商记录
   * @param record
   */
  const handleSupplierDelete = async (record: { [key: string]: any }) => {

    console.log("传入的record",record)
    console.log("删除的供应商数据为id",record.id)
    console.log("供应商数据对应的品牌brand_id为",record.brand_id)

    // 获取供应商数据列表
    let newVar = await getSupplierList(record.brand_id);
    console.log('供应商的数据',newVar)

    // 更新 options 即列表的状态
    setOptions(newVar.data);

    if (!record?.id || record.id <= 0) {
      message.error('ID not find.');
      return;
    }

    const hide = message.loading('load...');
    const { id } = record;
    try {
      const result = await deleteSupplier(id);
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
    actionSupplierRef.current?.reload();

    // 再次获取供应商列表
    let newNewVar = await getSupplierList(record.brand_id);

    // 更新 options 即列表的状态
    setOptions(newNewVar.data); // 更新 options 状态

  };

  return {
    formRef,
    userData,
    modalOpen,

    actionRef,
    actionSupplierRef,

    vendorModalOpen,
    manageModalOpen,

    handleManageModalOpen,
    handleManageModalClose,

    fetchUserList,
    handleModalOpen,
    handleModalClose,
    handleUpdateOrCreate,

    // 删除
    handleDelete,
    handleSupplierDelete,

    handleValueChange,
    options,

    // 创建供应商
    handleSupplierCreate,

    // 刷新
    handleRefresh,
    loading,
  };

};
