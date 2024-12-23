import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Table, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useCategory, Category } from '@/hooks/useCategory';
import CategoryForm from '@/components/CategoryForm';
import BaseContainer, { ModalType } from '@/components/Container';
import DeleteButton from '@/components/Buttons/DeleteButton';

const CategoryPage: React.FC = () => {
  const { categories, loading, handleCreateCategory, handleUpdateCategory } = useCategory();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category> | undefined>(undefined);
  const [formType, setFormType] = useState<'create' | 'edit'>('create');

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '上级分类',
      dataIndex: 'pid',
      key: 'pid',
      render: (pid: number) => (pid === 0 ? '顶级分类' : categories.find(c => c.id === pid)?.name || ''),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: Category) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <DeleteButton type="link" danger onConfirm={() => handleDelete(record.id)}>
            删除
          </DeleteButton>
        </Space>
      ),
      fixed: 'right',
    },
  ];

  const handleCreate = () => {
    setFormType('create');
    setCurrentCategory(undefined);
    setModalVisible(true);
  };

  const handleEdit = (category: Category) => {
    setFormType('edit');
    setCurrentCategory(category);
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    // Implement delete functionality
    console.log('Delete category with id:', id);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setCurrentCategory(undefined);
  };

  const handleFormFinish = async (values: { pid: number; name: string }) => {
    let success;
    if (formType === 'create') {
      success = await handleCreateCategory(values);
    } else {
      success = await handleUpdateCategory(currentCategory!.id!, values);
    }
    if (success) {
      handleModalClose();
    }
  };

  return (
    <PageContainer>
      <Button type="primary" onClick={handleCreate} icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
        创建分类
      </Button>
      <Table columns={columns} dataSource={categories} loading={loading} rowKey="id" />
      <BaseContainer
        type={ModalType.Modal}
        title={formType === 'create' ? '创建分类' : '编辑分类'}
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <CategoryForm
          initialValues={currentCategory}
          categories={categories}
          onFinish={handleFormFinish}
          formType={formType}
        />
      </BaseContainer>
    </PageContainer>
  );
};

export default CategoryPage;
