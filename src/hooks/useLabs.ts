import { delLab, updateLab,addLab } from '@/services/ant-design-pro/produceAndLab';
import {  message } from 'antd';
export const useLabs = () => {



  const handleDelLab = async (id: number) => {
    try{
      const res = await delLab(id);
      if (!res.ok) {
        message.error(res.message);
        return;
      }
      message.success('delete success.');
    }catch (error) {
      message.error((error as Error).message);
    }finally {
    }
  }
  const handleUpdateLab = async (id: number) => {
    const hide = message.loading('loading...');
    try{
      const res = await updateLab(id);
      if (!res.ok) {
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
  const handleAddLab = async () => {
    const hide = message.loading('loading...');

    try {
      const params={
        name : formRef.getFieldsValue().newLab,
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
  return {
    handleAddLab,
    handleUpdateLab,
    handleDelLab,
  };
};
