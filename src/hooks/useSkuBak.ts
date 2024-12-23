import {useEffect, useRef, useState} from 'react';
import {Form, message} from 'antd';
import type {ActionType} from '@ant-design/pro-components';
import {produce} from 'immer';
import {
  createAttributes,
  createBrand,
  createSupplier,
  deleteAttributes,
  deleteSku,
  deleteSupplier,
  getAttributesList,
  getBrandList,
  getSupplierList,
  updateBrand,
} from "@/services/ant-design-pro/sku";
import {Attribute} from "@svgr/babel-plugin-add-jsx-attribute";
import {Value} from "classnames";
import {handleParseStateChange} from "@/utils/helper";

const initFormData = {
  id: '',
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

export const useSku = () => {

  // 父组件的表单
  const actionRef = useRef<ActionType>();

  // 子组件的表单
  const actionSupplierRef = useRef<ActionType>();

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [attrRef] = Form.useForm();

  const [dataSource,setDataSource] = useState<any>({
    attr:[{id:1,value:"123"}],
  });

  // 打开管理属性模态框
  const [vendorModalOpen, setVendorModalOpen] = useState<boolean>(false);

  // 打开创建属性值的模态框
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [updateAtteModalOpen, setUpdateAtteModalOpen] = useState<boolean>(false);
  const [updateAtteModalClose, setUpdateAtteModalClose] = useState<boolean>(false);

  // 打开编辑属性值的模态框
  // const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  // const [updateEditAtteModalOpen, setEditUpdateAtteModalOpen] = useState<boolean>(false);
  // const [updateEditAtteModalClose, setEditUpdateAtteModalClose] = useState<boolean>(false);

  // 打开编辑属性值的模态框
  const [manageModalOpen, setManageModalOpen] = useState<boolean>(false);

  // 刷新table
  const [loading, setLoading] = useState(false);

  // Attr 属性列表 主要是用来操作属性的(创建 删除)
  const [Attr, setAttr] = useState<{ [key: string]: any }[]>();

  // 一个方法 一个属性
  const [createAttrModalOpen, setCreateAttrModalOpen] = useState<boolean>(false);

  // 属性值列表 主要是用来在编辑属性值组件中渲染表格的
  const [AttrValue, setAttrValue] = useState<Options[]>([]);

  // 打开创建属性的模态框
  const setAttrModelState = (isOpen: boolean) => {

    setCreateAttrModalOpen(isOpen);

    // 清空单子里面的内容
    attr.resetFields();

  }

  // 关掉创建属性的模态框
  const setAttrModelClose = () => {
    setCreateAttrModalOpen(false);
  }

  // 返回属性值
  // 一个方法 一个属性
  const [editAttrModalOpen, setEditAttrModalOpen] = useState<boolean>(false);

  // 判断编辑属性的模态框 同时挂载属性值数据
  const setEditAttrModelState = async (record?: { [key: string]: any }) => {

    // 打开模态框
    setEditAttrModalOpen(true);

    // // 获取到的属性id
    // console.log('获取到当前的属性id是', record.id);
    //
    // // id value
    // console.log('获取到当前的属性values是', record.values);
    //
    // // 把values清洗出来
    // const cleanedValues = record.values.map(({ id, value }) => ({ id, value }));
    //
    // // setAttr(cleanedValues)
    //

    //
    console.log('属性列表1' ,dataSource);

    setDataSource({
      // ...dataSource,
      attr: [{id:2,name:"aaa"}]
    })
    //
    console.log('属性列表2' ,dataSource);

  }

  // 关掉编辑属性的模态框
  const setEditAttrModelClose = () => {
    setEditAttrModalOpen(false);
  }


  // 创建属性数据
  const handleAttrCreate = async () => {

    console.log("创建属性")
    const submitData = attrRef.getFieldsValue();

    // 清空表单
    attrRef.resetFields();

    console.log('提交的属性信息', submitData);
    const hide = message.loading('loading...');

    try {

      // 发起请求
      const result = await createAttributes(submitData);

      if (!result.ok) {
        // 从后端拿到的数据
        message.error(result.message);
        return;
      }

      message.success('创建属性成功');


      // 关闭创建属性的模态框
      setAttrModelClose();

    } catch (error) {
      message.error((error as Error).message);
    } finally {

      actionRef.current?.reload();

      actionSupplierRef.current?.reload();

      // 关闭加载
      hide();
    }
  };


  const fetchData = async (record: { [key: string]: any }) => {
    console.log('刷新表格');
    setLoading(true);
    try {
      const response = await getSupplierList(record);
      console.log('刷新表格获取到的数据');
      // setData(response.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  const [userData, setUserData] = useState<{ [key: string]: any }>({
    formData: initFormData,
    type: '',
  });


  // 父组件的表单
  const [formRef] = Form.useForm();

  // 属性值的表单
  const [valueRef] = Form.useForm();

  const [formSupplierRef] = Form.useForm();

  // options 供应商列表
  const [options, setOptions] = useState<Options[]>([]);

  const [recordId, setRecordId] = useState<{ [p: string]: any } | undefined>(undefined);
  // 初始化数据
  const getOptions = async (record: { [key: string]: any }) => {

    console.log("调用getOptions方法");

    console.log('获取的record是', record);

  }


  /**
   * 打开管理属性的模态框并初始化表单数据
   * @param type
   * @param record
   */
  const handleModalOpen = (type: string, record?: { [key: string]: any }) => {
    setVendorModalOpen(true);

    if (type === 'create') {
      // formRef.setFieldsValue(userData.formData);
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
  const handleModalClose = (isReloacreateModalOpend = false) => {
    setVendorModalOpen(false);

    formRef.resetFields()
  };

  /**
   * 打开管理属性的模态框并初始化表单数据
   * @param type
   * @param record
   */
  // const handleModalOpen = (type: string, record?: { [key: string]: any }) => {
  //   setVendorModalOpen(true);
  //   setUserData(
  //     produce((draft) => {
  //       draft.type = type;
  //     }),
  //   );
  //   if (type === 'create') {
  //     formRef.setFieldsValue(userData.formData);
  //     return;
  //   }
  //
  //   //
  //   const upData = {
  //     ...record,
  //     date_string: '2024-05-01 21:22:12',
  //   };
  //   formRef.setFieldsValue(upData);
  // };
  //
  // /**
  //  * 关闭模态框
  //  * @param isReload
  //  */
  // const handleModalClose = (isReloacreateModalOpend = false) => {
  //   setVendorModalOpen(false);
  //
  //   formRef.resetFields()
  // };


  // 获得管理供应商的数据
  /**
   * 打开模态框并初始化表单数据
   * @param type
   * @param record
   */
  const handleManageModalOpen = async (type: string, record?: { [key: string]: any }) => {

    console.log("type", type)

    // todo 管理供应商 传给子组件
    console.log('管理供应商的id为', record);
    setRecordId(record);

    let newVar = await getSupplierList(record);

    console.log('供应商的数据', newVar)

    // const cleanedOptions = cleanData(newVar.data); // 清洗数据
    //
    // console.log('清洗后的数据为',cleanedOptions);
    //
    // // 清洗数据的函数
    // const cleanData = (data) => {
    //   return data.map(item => ({
    //     // name: item.name.replace(/\\u([\d\w]{4})/gi, (match, grp) => {
    //     //   return String.fromCharCode(parseInt(grp, 16)); // 解码 Unicode
    //     // })
    //     name: item.name
    //   }));
    // };

    setOptions(newVar.data); // 更新 options 状态

    setManageModalOpen(true);

    const upData = {
      brand_id: record,
    };

    formRef.setFieldsValue(upData);

  };

  /**
   * 关闭模态框
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
  // const handleValueChange = (changedValues: any, allValues: any) => {
  //   // userData, setUserData
  //   console.log(changedValues, allValues);
  // };

  const handleValueChange: any = (path: string, value: any) => {

    console.log("handleValueChange!!!")

    const newData = handleParseStateChange(dataSource, path, value)

    setDataSource(newData);

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

    // http请求使用async和await
    const userList = await getBrandList();

    console.log('返回的sku数据', userList.data);

    try {

      // http请求使用async和await
      const userList = await getBrandList(requestParams);

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

    console.log("1")

    const submitData = formRef.getFieldsValue();

    console.log('提交的信息', submitData);

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

    console.log('提交的信息', submitData);

    const hide = message.loading('loading...');

    try {

      const result = await createSupplier(submitData);
      if (!result.ok) {
        // 从后端拿到的数据
        message.error(result.message);
        return;
      }

      message.success('添加供应商成功');

      // 获取一下 brand_id
      console.log("brand_id", submitData.brand_id);

      formRef.setFieldValue(
        "brand_id", submitData.brand_id
      );


      //
      let newVar = await getSupplierList(submitData.brand_id);

      console.log('供应商的数据', newVar)

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

    console.log("删除的数据id", record.id)

    const hide = message.loading('load...');

    if (!record?.id || record.id <= 0) {
      message.error('ID not find.');
      return;
    }

    try {
      const result = await deleteSku(record.id);
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

  /**
   * 删除供应商记录
   * @param record
   */
  const handleSupplierDelete = async (record: { [key: string]: any }) => {

    console.log("展示属性值")
    console.log("传入的record", record)
    console.log("删除的属性id为", record.id)

    // 获取供应商数据列表
    let newVar = await getSupplierList(record.brand_id);
    console.log('供应商的数据', newVar)

    // 更新 options 即列表的状态
    setOptions(newVar.data);

    if (!record?.id || record.id <= 0) {
      message.error('ID not find.');
      return;
    }

    const hide = message.loading('load...');
    const {id} = record;
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

  /**
   * 获取属性列表
   * @param params
   */
  const fetchAttributesList = async (params: any) => {

    console.log('获得属性列表 params', params);
    const requestParams = {
      ...params,
      page: params?.current ?? 1,
      per_page: 1,
    };

    const hide = message.loading('loading...');

    // 异常处理
    try {
      const userList = await getAttributesList(requestParams);
      console.log('返回的属性列表的数据', userList.data);
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
   * 删除属性
   * @param record
   */
  const handleAttributesDelete = async (record: { [key: string]: any }) => {

    console.log("展示属性值")
    console.log("传入的record", record)
    console.log("删除的属性id为", record.id)

    // 获取供应商数据列表
    let newVar = await getSupplierList(record.brand_id);
    console.log('供应商的数据', newVar)

    // 更新 options 即列表的状态
    setOptions(newVar.data);

    if (!record?.id || record.id <= 0) {
      message.error('ID not find.');
      return;
    }

    const hide = message.loading('load...');
    const {id} = record;
    try {
      const result = await deleteAttributes(id);
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

  // 获取属性值 根据的是属性id 填充属性值表单
  const getAttrValueList = () => {


  }


  return {
    formRef,
    userData,
    modalOpen,

    actionRef,
    actionSupplierRef,

    // 管理属性的模态框
    vendorModalOpen,

    // 编辑属性的模态框
    manageModalOpen,

    // 创建属性的模态框
    createModalOpen,

    // 管理属性的模态框
    handleManageModalOpen,
    handleManageModalClose,

    fetchUserList,


    handleModalOpen,
    handleModalClose,


    handleUpdateOrCreate,

    // 删除
    handleDelete,
    handleSupplierDelete,
    // 删除属性
    handleAttributesDelete,

    handleValueChange,
    options,

    // 创建供应商
    handleSupplierCreate,

    // 刷新
    handleRefresh,
    loading,


    // 创建属性的模态框
    createAttrModalOpen,
    setAttrModelState,
    setAttrModelClose,

    // 编辑属性的模态框
    editAttrModalOpen,
    setEditAttrModelState,
    setEditAttrModelClose,


    // 获取属性列表
    fetchAttributesList,

    // 属性表单 主要用来创建属性
    attrRef,

    // 创建属性
    handleAttrCreate,

    // 属性值列表
    Attr,

    // 属性值表单 主要用来编辑属性值
    AttrValue,

    // 获得属性值列表
    getAttrValueList,

    //
    dataSource,
  };

};
