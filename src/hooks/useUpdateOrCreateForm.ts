import { useState } from 'react';
import { message } from 'antd';
import { useProductAndLab } from '@/hooks/useProductAndLab';

const useUpdateOrCreateForm = (formRef:any,handleValueChange:any,dataSource:any,fetchSupplier :any ) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const { fetchSKUList } = useProductAndLab();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]); // 用于存储选中的行
  const next = () => setCurrentStep((prev) => prev + 1);
  const prev = () => setCurrentStep((prev) => prev - 1);

  const beforeUpload = (file:any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };
  const handleFinish = async (values: any) => {
    console.log('表单数据:', values);
    //将value下的tagIds换个名字换成tag_ids
    values.tag_ids = values.tagIds;
    handleValueChange('editProduct',values);
    console.log('dataSource', dataSource)
    if(values.id){
      setSelectedRowKeys(values.skus.map((item: any) => item.id))
    }
    if (currentStep < 2) {
      next();
    } else {
      return;
    }
  };
  const handleSelectChange = (selectedKeys: number[]) => {
    setSelectedRowKeys(selectedKeys);
    const selectedRows = dataSource.initData.all_SKU.filter((item: any) => selectedKeys.includes(item.id));
    //提取每个选中行的 ID
    const selectedRowsIds = selectedRows.map((item: any) => item.id);
    handleValueChange('editProduct:sku_ids', selectedRowsIds);
    // console.log('选中的行 ID:', dataSource); // 打印选中的行 ID
  };
  return {
    next,
    prev,
    currentStep,
    selectedRowKeys,
    loading,
    imageUrl,
    setSelectedRowKeys,
    setCurrentStep,
    beforeUpload,

    fetchSKUList,
    handleSelectChange,
    handleFinish,
  };
};

export default useUpdateOrCreateForm;
