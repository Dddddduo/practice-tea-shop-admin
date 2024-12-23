import { useState } from 'react';
import { message } from 'antd';
import { getSupplierList, createSupplier, updateSupplier, deleteSupplier, Supplier } from '@/services/ant-design-pro/supplier';

export const useSupplier = (brandId: number) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await getSupplierList(brandId);
      if (response.ok) {
        setSuppliers(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSupplier = async (values: { name: string }) => {
    setLoading(true);
    try {
      const response = await createSupplier({ ...values, brand_id: brandId});
      if (response.ok) {
        message.success('供应商创建成功');
        await fetchSuppliers();
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

  const handleUpdateSupplier = async (id: number, values: { name: string }) => {
    setLoading(true);
    try {
      const response = await updateSupplier(id, { ...values, brand_id: brandId });
      if (response.ok) {
        message.success('供应商更新成功');
        await fetchSuppliers();
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

  const handleDeleteSupplier = async (id: number) => {
    setLoading(true);
    try {
      const response = await deleteSupplier(id);
      if (response.ok) {
        message.success('供应商删除成功');
        await fetchSuppliers();
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
    suppliers,
    loading,
    fetchSuppliers,
    handleCreateSupplier,
    handleUpdateSupplier,
    handleDeleteSupplier,
  };
};
