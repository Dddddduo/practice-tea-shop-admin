import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import {Table, Button, Space, Modal} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useBrand } from '@/hooks/useBrand';
import type { ColumnsType } from 'antd/es/table';
import type { Brand } from '@/services/ant-design-pro/brand';
import DeleteButton from '@/components/Buttons/DeleteButton';
import BaseContainer, { ModalType } from '@/components/Container';
import BrandForm from '@/components/BrandForm';
import SupplierManager from "@/components/SupplierManager";

const BrandList: React.FC = () => {

  const { brands, loading, handleCreateBrand, handleUpdateBrand, handleDeleteBrand } = useBrand();

  const [modalVisible, setModalVisible] = useState(false);

  const [currentBrand, setCurrentBrand] = useState<Partial<Brand> | undefined>(undefined);

  const [formType, setFormType] = useState<'create' | 'edit'>('create');

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [supplierVisible, setSupplierVisible] = useState(false);

  const showSupplierManager = () => {
    setSupplierVisible(true);
  };

  const hideSupplierManager = () => {
    setSupplierVisible(false);
  };

  const columns: ColumnsType<Brand> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '品牌名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: '最后修改时间',
      dataIndex: 'updated_at',
      key: 'updated_at',
    },
    {title: '操作', key: 'action', render: (_, record) => (
        <Space size="middle">
          <Button color="default"  type="link" size="small"  onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <DeleteButton color="default"  type="link" size="small" danger onConfirm={() => handleDelete(record.id)}>
            删除
          </DeleteButton>
          <Button type="link" onClick={() => handleManageSuppliers(record.id)}>
            管理供应商
          </Button>

        </Space>

      ), fixed: 'right',},
  ];

  const handleAddBrand = () => {
    setFormType('create');
    setCurrentBrand(undefined);
    setModalVisible(true);
  };

  const handleEdit = (record: Brand) => {
    setFormType('edit');
    setCurrentBrand(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    await handleDeleteBrand(id);
  };


  const handleManageSuppliers = (id: number) => {

    // 实现管理供应商的逻辑
    console.log('管理供应商', id);

    // 打开弹窗
    setIsModalVisible(true); // 打开弹窗

  };

  const handleModalClose = () => {
    setModalVisible(false);
    setCurrentBrand(undefined);
  };

  const handleFormFinish = async (values: { name: string }) => {
    let success;
    if (formType === 'create') {
      success = await handleCreateBrand(values);
    } else {
      success = await handleUpdateBrand(currentBrand!.id!, values);
    }
    if (success) {
      handleModalClose();
    }
  };

  return (
    <PageContainer>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddBrand}
        style={{ marginBottom: 16 }}
      >
        添加品牌
      </Button>
      <Table
        columns={columns}
        dataSource={brands}
        rowKey="id"
        loading={loading}
      />
      <BaseContainer
        type={ModalType.Modal}
        title={formType === 'create' ? '创建品牌' : '编辑品牌'}
        open={modalVisible}
        onCancel={handleModalClose}
      >
        <BrandForm
          initialValues={currentBrand}
          onFinish={handleFormFinish}
          formType={formType}
        />
      </BaseContainer>



      <div>
        <Button onClick={showSupplierManager}>供应商管理</Button>
        <Modal
          title=""
          visible={supplierVisible}
          onCancel={hideSupplierManager}
          footer={null} // 自定义底部按钮
        >
          {/* 这里渲染 SupplierManager 组件 */}
          <SupplierManager brandId={0} />
        </Modal>
      </div>

    </PageContainer>
  );
};

export default BrandList;
