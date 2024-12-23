import {useRef, useState} from 'react';

import {
  createAttributes,
  createSkus,
  deleteAttributes,
  deleteSku,
  editAttributes,
  editSkus,
  getAttributesList,
  getAttrs,
  getSkuManagePageListApi,
} from "@/services/ant-design-pro/sku";
import {Form, message} from "antd";
import {ActionType} from "@ant-design/pro-components";
import {produce} from "immer";

export const useSku = () => {

  // 所有的数据 这里把所有要用到的数据都放到 dataSource 这个数组里面
  const [dataSource, setDataSource] = useState<any>({

    // 管理属性模态框的状态
    manageAttrModelStatus: false,
    // 管理属性内 创建属性模态框的状态
    createAttrModelStatus: false,
    // 管理属性内 编辑属性模态框的状态
    editAttrModelStatus: false,
    // 添加Sku模态框的状态
    addSkuModelStatus: false,
    // 编辑Sku模态框的状态
    editSkuModelStatus: false,
    // 在添加Sku和编辑Sku中添加属性的模态框的状态
    addSkuAttrModelStatus: false,
    // sku管理的表
    skuManagePageList: {},
    // 属性的列表
    attrList: [],
    // 编辑属性的数据
    initialData: {},
    // sku的数据
    skuData: {},
    // sku里面属性的选项
    skuSelectAttrOptionsRef: [],
    // 属性
    cleanedValues: [],
  })

  // 编辑和创建属性的表单
  const [attrRef] = Form.useForm();

  // 编辑和创建Sku的表单
  const [skuRef] = Form.useForm();

  // 编辑和创建属性的表单的行为
  const attrActionRef = useRef<ActionType>();

  // 编辑和创建Sku的表单的行为
  const skuActionRef = useRef<ActionType>();

  // 打开管理属性的模态框

  const showManageAttrModel = async () => {
    attrActionRef.current?.reload();
    const hide = message.loading('loading...');
    try {
      const result = await getAttributesList();
      if (!result.ok) {
        message.error(result.message);
        return;
      }
      console.log("属性的列表:", result.data.data);
      // 清洗数据
      const cleanedAttrList = result.data.data.map(item => ({
        id: item.id,
        name: item.name,
        full_values: item.full_values,
        created_at: item.created_at
      }));
      console.log('清洗后的数据', cleanedAttrList)
      setDataSource({
        manageAttrModelStatus: true,
      })
      // 放入数据
      setDataSource({
        ...dataSource,
        attrList: cleanedAttrList,
        manageAttrModelStatus: true,
      })
      console.log('给出的dataSource.attrList', dataSource.attrList)
    }catch (error) {
      message.error((error as Error).message);
      return [];
    } finally {
      hide();
    }


  }

  // 关掉管理属性的模态框
  const closeManageAttrModel = () => {
    setDataSource({
      ...dataSource,
      manageAttrModelStatus: false,
    })
  }

  // 打开 管理属性内 创建属性的模态框
  const showCreateAttrModel = async () => {
    console.log("打开创建属性的模态框")
    setDataSource({
      ...dataSource,
      createAttrModelStatus: true,
    })
  }

  // 关掉 管理属性内 创建属性的模态框
  const closeCreateAttrModel = (isReload = false) => {
    setDataSource({
      ...dataSource,
      createAttrModelStatus: false,
    })
    if (isReload) {
      attrActionRef.current?.reload();
    }
  }

  // 打开 管理属性内 编辑属性的模态框
  const showEditAttrModel = async (entity) => {

    console.log("打开编辑属性的模态框")
    console.log('entity是', entity)

    // 数据清洗
    const cleanedData = {
      id: entity.id,
      name: entity.name, // 提取 name
      values: entity.values.map(item => ({
        value: item.value // 提取 value 字段
      }))
    };
    console.log('清洗后的数据', cleanedData)
    setDataSource({
      ...dataSource,
      initialData: cleanedData,
      editAttrModelStatus: true,
    })

  }

  // 关掉 管理属性内 编辑属性的模态框
  const closeEditAttrModel = (isReload = false) => {
    setDataSource({
      ...dataSource,
      editAttrModelStatus: false,
    })
    if (isReload) {
      attrActionRef.current?.reload();
    }
  }

  // 打开添加Sku的模态框
  const showAddSkuModel = async () => {
    const hide = message.loading('loading...');
    try {
      // 把所有属性给到skuSelectAttrOptionsRef里
      const attributes = await getAttrs();
      if (!attributes.ok) {
        message.error(attributes.message);
        return;
      }
      setDataSource(DataSource => ({
        ...DataSource,
        skuSelectAttrOptionsRef: attributes.data.map(attr => ({
          id: attr.id.toString(),
          name: attr.name,
          display: false,
          values: attr.values.map(value => ({
            id: value.id,
            value: value.value
          }))
        })),
        addSkuModelStatus: true,
      }));
    } catch (error) {
      message.error((error as Error).message);
      return [];
    } finally {
      hide();
    }
  }

  // 关掉添加Sku的模态框
  const closeAddSkuModel = () => {
    setDataSource({
      ...dataSource,
      addSkuModelStatus: false,
      skuSelectAttrOptionsRef: dataSource.skuSelectAttrOptionsRef.map(attr => ({
        ...attr,
        display: false // 设置 display 属性为 false
      }))
    })
  }

  // 打开编辑Sku的模态框
  const showEditSkuModel = async (entity) => {

    console.log('打开编辑Sku的模态框');
    console.log('entity:', entity);

    // 提取 attribute_id 用于给true
    const attributeIds = entity.attribute_values.map(attr => attr.attribute_id);
    console.log(attributeIds)


    const ans = entity.attribute_values
      .map(item => ({
        attribute_id: item.attribute_id,
        value: item.value
      })) // 只保留 attribute_id 和 value
      .sort((a, b) => a.attribute_id - b.attribute_id) // 按 attribute_id 排序
      .map(item => item.value); // 提取清洗后的 value

    // 输出结果
    console.log(ans); // 输出: ["500ml", "礼盒装"]
    // 把所有属性给到skuSelectAttrOptionsRef里
    const attributes = await getAttrs();
    if (!attributes.ok) {
      message.error(attributes.message);
      return;
    }
    console.log('attributes', attributes)
    setDataSource(DataSource => ({
      ...DataSource,
      skuSelectAttrOptionsRef: attributes.data.map(attr => ({
        id: attr.id.toString(),
        name: attr.name,
        display: attributeIds.includes(attr.id),
        values: attr.values.map(value => ({
          id: value.id,
          value: value.value
        })),
        attr: entity.attribute_values,
      })),
      cleanedValues: ans,
      editSkuModelStatus: true,
    }))


    skuRef.setFieldsValue({
      ...skuRef, // 如果 skuRef 之前有数据，可以保留原有数据
      id: entity.id,
      sku_code: entity.sku_code,
      sku_name: entity.sku_name,
      price: entity.price,
      stock: entity.stock,
      unit: entity.unit,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      full_str_attr: entity.full_str_attr,
      specification: entity.specification,

      attribute_values: entity.attribute_values,

    });

  };


  // 关掉编辑Sku的模态框
  const closeEditSkuModel = () => {
    setDataSource({
      ...dataSource,
      skuSelectAttrOptionsRef: dataSource.skuSelectAttrOptionsRef.map(attr => ({
        ...attr,
        display: false // 设置 display 属性为 false
      })),
      editSkuModelStatus: false,
    })
    skuRef.resetFields()
  }

  // 打开 Sku内添加属性的模态框
  const showAddSkuAttrModel = async () => {
    setDataSource({
      ...dataSource,
      addSkuAttrModelStatus: true,
    });
    console.log('属性', dataSource.skuSelectAttrOptionsRef)
  }

  // 关掉 Sku内添加属性的模态框
  const closeAddSkuAttrModel = () => {
    setDataSource({
      ...dataSource,
      addSkuAttrModelStatus: false,
    })
    console.log('关掉Sku内添加属性的模态框')
    console.log('skuSelectAttrOptionsRef属性', dataSource.skuSelectAttrOptionsRef)

  }

  // 获得属性的表单
  const fetchAttributesList = async (params: any) => {
    // attrActionRef.current?.reload();
    console.log('获得属性列表 params', params);
    const requestParams = {
      ...params,
      page: params?.current ?? 1,
      per_page: 1,
    };
    const hide = message.loading('loading...');
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

  // 获取Sku的列表
  const getSkuManagePageList = async (params) => {
    console.log('page', params)
    try {
      const result = await getSkuManagePageListApi(params);
      if (!result.ok) {
        message.error(result.message);
        return [];
      }
      console.log("Sku的列表:", result.data);
      // setDataSource(produce(draft => {
      //   draft.skuManagePageList = result.data;
      // }));
      return result.data;
    } catch (error) {
      message.error((error as Error).message);
      return [];
    } finally {
    }
  }

  // 删除Sku的数据
  const handleSkuDelete = async (record: { [key: string]: any }) => {
    console.log('删除的sku的id为:', record.id);
    if (!record?.id || record.id <= 0) {
      message.error('ID not find.');
      return;
    }
    const hide = message.loading('load...');
    const {id} = record;
    try {
      const result = await deleteSku(id);
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
      skuActionRef.current?.reload();
    }
    // 刷新表单
    dataSource.attrList.current?.reload();
  }

  // 删除属性数据
  const handleAttributesDelete = async (record: { [key: string]: any }) => {
    console.log('删除的属性的id为:', record.id);
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
      attrActionRef.current?.reload();
      hide();
    }
  }

  // 创建属性数据
  const handleAttrCreate = async () => {
    console.log("创建属性")
    const submitData = attrRef.getFieldsValue();
    // 清空表单
    attrRef.resetFields();
    console.log('创建的属性的信息', submitData);
    const hide = message.loading('loading...');
    try {
      const result = await createAttributes(submitData);
      if (!result.ok) {
        message.error(result.message);
        return;
      }
      message.success('创建属性成功');
      // 关闭创建属性的模态框
      closeCreateAttrModel();
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      // 关闭加载
      hide();
      attrActionRef.current?.reload();
    }
  };

  // 编辑属性的提交按钮
  const onAttrEditFinish = async (values) => {
    const hide = message.loading('loading...');
    try {
      // 看一下所需的所有数据
      console.log('提交的数据:', values);
      console.log('initialData的id', dataSource.initialData.id);
      console.log('initialData的name', dataSource.initialData.name);
      const params = {
        name: dataSource.initialData.name,
        values: values.values
      };
      console.log('params', params)
      // 把请求发往后端

      const result = await editAttributes(dataSource.initialData.id, params);
      if (!result.ok) {
        message.error(result.message);
        return;
      }

      message.success('提交成功');
      // 关掉模态框
      setDataSource({
        ...dataSource,
        editAttrModelStatus: false,
      })
    } catch (error) {
      console.error('提交数据时出错:', error);
      message.error('提交失败，请重试');
    } finally {
      attrActionRef.current?.reload();
      hide();
    }
  };

  // 添加Sku
  const handleSkuCreate = async () => {
    const hide = message.loading('loading...');
    const submitData = skuRef.getFieldsValue();
    console.log('添加Sku提交信息', submitData);
    // 数据清洗
    const {id, ...attributeValues} = submitData; // 去掉 id
    console.log(submitData)
    const attribute_value_ids = [];
    Object.keys(attributeValues).forEach(key => {
      if (!['sku_code', 'sku_name', 'price', 'stock', 'specification', 'unit', 'id'].includes(key)) {
        attribute_value_ids.push(parseInt(attributeValues[key], 10))
      }
    });
    const results = {
      attribute_value_ids,
      unit: attributeValues.unit,
      sku_code: attributeValues.sku_code,
      sku_name: attributeValues.sku_name,
      price: attributeValues.price,
      stock: attributeValues.stock,
      specification: attributeValues.specification,
    };
    try {
      console.log('清洗后的数据', results)
      const result = await createSkus(results);
      console.log(result)
      if (!result.ok) {
        message.error(result.message);
        return;
      }
      setDataSource({
        ...dataSource,
        addSkuModelStatus: false,
      })
      skuRef.resetFields();
      message.success('创建Sku成功');
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      hide();
      skuActionRef.current?.reload();
    }
  };

  // 编辑Sku
  const handleSkuEdit = async () => {
    const hide = message.loading('loading...');
    const submitData = skuRef.getFieldsValue();
    console.log('编辑Sku提交信息', submitData);

    const attribute_value_ids = [];

    Object.keys(submitData).forEach(key => {
      if (!['sku_code', 'sku_name', 'price', 'stock', 'specification', 'unit', 'id'].includes(key)) {
        attribute_value_ids.push(parseInt(submitData[key], 10))
      }
    });

    // 数据清洗
    const cleanedData = {
      attribute_value_ids,
      unit: submitData.unit,
      sku_code: submitData.sku_code,
      sku_name: submitData.sku_name,
      price: submitData.price,
      stock: submitData.stock,
      specification: submitData.specification,
    };

    console.log('清洗后的数据', cleanedData)

    try {
      // 向后端发请求
      const result = await editSkus(submitData.id, cleanedData);
      if (!result.ok) {
        message.error(result.message);
        return;
      }
      setDataSource({
        ...dataSource,
        editSkuModelStatus: false,
      })
      skuRef.resetFields();
      message.success('编辑Sku成功');
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      // 关闭加载 并且刷新表格
      skuActionRef.current?.reload();
      hide();
    }

  };

  // 编辑Sku 提交
  const handleAddSkuAttr = async () => {
    // 多余的方法
  };

  // 控制Sku里面添加属性
  const handlesSkuAttrFinish = (values) => {
    console.log('提交的值:', values.selectedOptions);
    dataSource.skuSelectAttrOptionsRef.forEach(option => {
      if (values.selectedOptions.includes(option.id)) {
        option.display = true;
      } else {
        option.display = false;
      }
    });
    console.log('添加Sku上的属性列表', dataSource.skuSelectAttrOptionsRef)
  };


  // 返回的数据
  return {
    // 数据源
    dataSource,
    // 操作管理属性的模态框
    showManageAttrModel,
    closeManageAttrModel,
    // 操作 管理属性内 创建属性的模态框
    showCreateAttrModel,
    closeCreateAttrModel,
    // 操作 管理属性内 编辑属性的模态框
    showEditAttrModel,
    closeEditAttrModel,
    // 删除操作
    handleSkuDelete,
    handleAttributesDelete,
    // 编辑和创建属性的表单
    attrRef,
    // 编辑和创建Sku的表单
    skuRef,
    // 编辑和创建属性的表单的状态
    attrActionRef,
    // 编辑和创建Sku的表单的行为
    skuActionRef,
    // 初始化创建属性的表单
    handleAttrCreate,
    // 获取属性表单的函数
    fetchAttributesList,
    // 获取Sku列表
    getSkuManagePageList,
    // 编辑属性的提交按钮
    onAttrEditFinish,
    // 添加Sku的模态框
    showAddSkuModel,
    closeAddSkuModel,
    // 修改Sku的模态框
    showEditSkuModel,
    closeEditSkuModel,
    // Sku的创建
    handleSkuCreate,
    // Sku的编辑
    handleSkuEdit,
    // 在添加Sku和编辑Sku中添加属性的模态框子
    showAddSkuAttrModel,
    closeAddSkuAttrModel,
    // 在添加Sku和编辑Sku中添加属性
    handleAddSkuAttr,
    // 控制Sku里面添加属性
    handlesSkuAttrFinish,
  }

}



