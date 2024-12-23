import {
  deleteProduct,
  getProductList,
  updateProductInfo,
  addProduct,
  downProduct,
  tagList,
  delLab,
  updateLab,
  addLab,
  categoryList,
  brandList,
  supplierList,
  SKUList,
} from '@/services/ant-design-pro/produceAndLab';
import { useState, useRef, useEffect } from 'react';
import { Form, message } from 'antd';
import type { ActionType } from '@ant-design/pro-components';
import { handleParseStateChange } from '@/utils/helper';
import { localStorageService } from '@/utils/local-storage-service';
import { appConfig } from '@/config/app-config';
export const useProductAndLab = () => {
  const actionRef = useRef<ActionType>();
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [labsModalOpen,setLabsModalOpen] = useState<boolean>(false);
  const [formRef] = Form.useForm();
  const [dataSource, setDataSource] = useState<any>({
    initData:{
      all_SKU:[],
      all_brand:[],
      all_supplier:[],
      all_category:[],
      all_tag:[],
    },
    editProduct: {
        name: '',
        description:'',
        category_id: '',
        brand_id: '',
        supplier_id: '',
        status:'',
        tag_ids:[],
        image_url:'',
        sku_ids:[],
        content:''
    },
  });
  const loginInfo = localStorageService.getItem(appConfig.loginStorageKey);
  const { accessToken } = loginInfo;
  const  uploadProps = {
    name: 'image', // 上传的文件字段名
    action: 'http://tea-mall.zhuanzhitech.com/api/backend/v1/upload-file', // 上传地址
    headers: {
      Authorization: `Bearer ${accessToken}`, // 认证 token
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('您只能上传图片文件!');
      }
      return isImage; // 返回 false 可以阻止上传
    },
    onChange: (info) => {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
        // 这里可以处理响应，比如获取图片 URL
        const url = info.file.response.data.url; // 假设返回结构
        formRef.setFieldsValue({image_url: url})
        // 更新表单字段或状态
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  const fetchData = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const tags = await fetchLabList();
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const SKUs= await getAllSKUList();
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const brands = await fetchBrandList();
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const categories = await fetchCategoryList();
      const initData = {
        all_SKU: SKUs,
        all_brand: brands.map((item:any) => ({
          value: item.id,
          label: item.name,
        })),
        all_category: categories.map((item:any) => ({
          value: item.id,
          label: item.name,
        })),
        all_tag: tags,
      }
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      handleValueChange('initData', initData)
    } catch (error) {
      console.error("获取标签列表时出错:", error);
    }
  };
  // useEffect(() => {
  //
  //   fetchData();
  // }, []);
  /**
   * 获取商品数据列表
   * @param params
   */
  const fetchProductList = async (params: any) => {
    console.log('获得数据列表 params', params);
    const requestParams = {
      ...params,
      page: params?.current ?? 1,
      per_page: 20,
    };
    const hide = message.loading('loading...');
    try {
      const productList = await getProductList(requestParams);
      console.log(productList.data);
      const transformedData = productList.data.data.map(item => {
        const tagsIds = item.tags.map(tag => tag.id);
        return {
          ...item,
          tagIds: tagsIds // 用提取到的 tags ID 替换原有的 tags
        };
      });
      console.log('清洗后的数据:',transformedData);

      if (!productList.ok) {
        message.error(productList.message);
        return [];
      }
      productList.data.data = transformedData;
      return productList.data;
    } catch (error) {
      message.error((error as Error).message);
      return [];
    } finally {
      hide();
    }
  };
  /**
   * 打开编辑模态框
   */
  const handleEditOpenModal = async (record: { [key: string]: any }) => {
    setEditModalOpen(true);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    await fetchSupplierList(record.brand_id);
    fetchData();
    console.log(record);
    const upData = {
      ...record,
    };
    formRef.setFieldsValue(upData);
  };
  /**
   * 打开管理标签模态框
   */
  const handleLabsModalOpen =async () =>{
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
     await fetchLabList();
    setLabsModalOpen(true);
  }
  /**
   * 关闭管理标签模态框
   */
  const handleLabsModalClose = (isReload =false) =>{
    setLabsModalOpen(false);
    if(isReload){
      actionRef.current?.reload();
    }
  };

  /**
   * 关闭模态框
   * @param isReload
   */
  const handleEditModalClose = (isReload = false) => {
    setEditModalOpen(false);
    formRef.resetFields();
    if (isReload) {
      actionRef.current?.reload();
    }
  };
  /**
   * 修改dataSource
   * @param path
   * @param value
   */
  const handleValueChange = (path, value) => {
    console.log('path', path, 'value', value);
    const newData = handleParseStateChange(dataSource, path, value)
    setDataSource(newData)
  };

  /**
   * 更新和创建商品信息
   */

  const handleSubmit = async (dataSource:any) => {
    const hide = message.loading('loading...');
    try {
      let res;
      if(dataSource.editProduct.id){
        res = await updateProductInfo(dataSource.editProduct.id, dataSource.editProduct,);
      }else {
        res = await addProduct(dataSource.editProduct);
      }
      if (!res.ok) {
        message.error(res.message);
        return;
      }
      message.success('submit success.');
      formRef.resetFields(); // 清空表单
      handleEditModalClose(true);
      actionRef.current?.reload();
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      hide();
    }
  };

  const handleDelProduct = async (id: number) => {
    const hide = message.loading('loading...');
    try {
      const res = await deleteProduct(id)
      actionRef.current?.reload();
      if (!res.ok){
        message.error(res.message);
        return;
      }
      message.success('delete success.');
    }catch (error) {
      message.error((error as Error).message);
    }finally {
      hide()
    }
  }

  const handleDownProduct = async (id: number) => {
    const hide = message.loading('loading...');
    try {
      const res = await downProduct(id);
      actionRef.current?.reload();
      if (!res.ok) {
        message.error(res.message);
        return;
      }
      message.success('Taken off the shelves success.');
    }catch(error) {
      message.error((error as Error).message);
    }finally {
      hide()
    }
  }

  const fetchLabList = async () => {
    try {
      const res = await tagList();
      const labData = res.data;
      if (!res.ok) {
        message.error(res.message);
        return;
      }
      formRef.setFieldsValue({labs:labData});
      return labData;
    } catch (error) {
      message.error((error as Error).message);
    } finally {
    }
  };

  const handleDelLab = async (index: number) => {
    console.log(index, formRef.getFieldsValue());
    const id = formRef.getFieldsValue().labs[index].id;
    if(id) {
      try {
        const res = await delLab(id);
        if (!res.ok) {
          message.error(res.meimage_urlssage);
          return;
        }
        //删除成功移除formRef里的labs
        formRef.setFieldsValue({ labs: formRef.getFieldsValue().labs.filter((item: any, index1: number) => index1 !== index) });
        message.success('delete success.');
      } catch (error) {
        message.error((error as Error).message);
      }
    }else {
      formRef.setFieldsValue({ labs: formRef.getFieldsValue().labs.filter((item: any, index1: number) => index1 !== index) });
    }
  }
  const handleUpdateLab = async (index: number) => {
    const hide = message.loading('loading...');
    const id = formRef.getFieldsValue().labs[index].id;
    const name = formRef.getFieldsValue().labs[index].name;
    const params = { name };

    let res; // Use let instead of const
    try {
      if (id) {
        res = await updateLab(id, params);
      } else {
        res = await addLab(params);
      }

      if (!res.ok) {
        message.error(res.message);
        return;
      }
      fetchLabList();
      message.success('Update success.');
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      hide();
    }
  };
  const handleAddLab = async () => {
    const hide = message.loading('loading...');
    // const name = formRef.getFieldsValue().labs[index].id;
    fetchLabList();
    try {
      const params={
      name : ''
      }
      const res = await addLab(params);
      if (!res.ok) {
        message.error(res.message);
        return;
      }
      message.success('add success.');
      formRef.resetFields();
    }catch (error) {
      message.error((error as Error).message);
    }finally {
      hide();
    }
  }
  const fetchCategoryList= async ()=>{
      try {
        const params={

        }
        const res = await categoryList(params);
        if (!res.ok) {
          message.error(res.message);
          return;
        }
        return res.data;
      }catch (error) {
        message.error((error as Error).message);
      }
    }
  const fetchBrandList= async ()=>{
    try {
      const params={
      }
      const res = await brandList(params);
      if (!res.ok) {
        message.error(res.message);
        return;
      }
      return res.data;
    }catch (error) {
      message.error((error as Error).message);
    }
  }
  const fetchSKUList= async (params:any)=>{
  try{
    const requestParams = {
      ...params,
      page: params?.current ?? 1,
      per_page: 10,
    };
    const res =  await SKUList(requestParams);
    if (!res.ok) {
      message.error(res.message);
      return;
    }
    return res.data;
  }catch (error) {
    message.error((error as Error).message);
  }
  }
  const getAllSKUList= async ()=>{
    try{
      const res =  await SKUList();
      if (!res.ok) {
        message.error(res.message);
        return;
      }
      return res.data.data;
    }catch (error) {
      message.error((error as Error).message);
    }
  }
  const fetchSupplierList= async (brandId: number)=>{
    try{
      const params={
      }
      const res = await supplierList(brandId,params);
      if (!res.ok) {
        message.error(res.message);
        return;
      }
      const supplierData = res.data;
      handleValueChange('initData:all_supplier',supplierData.map((item:any) => ({
        value: item.id,
        label: item.name,
      })))
      // return res.data;
    }catch (error) {
      message.error((error as Error).message);
    }
  }


  return {
    dataSource,
    actionRef,
    editModalOpen,
    formRef,
    labsModalOpen,
    fetchSKUList,
    fetchSupplierList,
    handleUpdateLab,
    handleDelLab,
    fetchLabList,
    handleDelProduct,
    handleLabsModalOpen,
    handleLabsModalClose,
    fetchProductList,
    handleEditOpenModal,
    handleEditModalClose,
    handleSubmit,
    handleValueChange,
    handleDownProduct,
    uploadProps,
  };
};
