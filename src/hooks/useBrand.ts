import { useState, useEffect } from 'react';
import { message } from 'antd';
import { getBrandList, createBrand, updateBrand, deleteBrand, Brand } from '@/services/ant-design-pro/brand';

export const useBrand = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await getBrandList();
      if (response.ok) {
        setBrands(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleCreateBrand = async (values: { name: string }) => {
    setLoading(true);
    try {
      const response = await createBrand(values);
      if (response.ok) {
        message.success('品牌创建成功');
        await fetchBrands();
        return true;
      } else {
        message.error(response.message);
        return false;
      }
    } catch (error) {
      message.error((error as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBrand = async (id: number, values: { name: string }) => {
    setLoading(true);
    try {
      const response = await updateBrand(id, values);
      if (response.ok) {
        message.success('品牌更新成功');
        await fetchBrands();
        return true;
      } else {
        message.error(response.message);
        return false;
      }
    } catch (error) {
      message.error((error as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBrand = async (id: number) => {
    setLoading(true);
    try {
      const response = await deleteBrand(id);
      if (response.ok) {
        message.success('品牌删除成功');
        await fetchBrands();
        return true;
      } else {
        message.error(response.message);
        return false;
      }
    } catch (error) {
      message.error((error as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    brands,
    loading,
    fetchBrands,
    handleCreateBrand,
    handleUpdateBrand,
    handleDeleteBrand,
  };
};
