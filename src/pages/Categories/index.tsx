import React, {useRef, useState} from 'react';
import {ActionType, PageContainer} from '@ant-design/pro-components';
import {Button, Table, Space, message} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useCategory, Category } from '@/hooks/useCategory';
import CategoryForm from '@/components/CategoryForm';
import BaseContainer, { ModalType } from '@/components/Container';
import DeleteButton from '@/components/Buttons/DeleteButton';
import {deleteCategory} from "@/services/ant-design-pro/category";

const CategoryPage: React.FC = () => {

  const {



  } = useCategory();

  // 代表的是表格的列数组
  const columns = [
    {
      title: 'No.',
      dataIndex: 'id',
      tooltip: 'User ID',
      search: false,
    },
    {
      title: '分类名称',
      dataIndex: 'name',
      tooltip: 'User name',
      search: false,
    },
    {
      title: '上级分类',
      dataIndex: 'parent',
      tooltip: ' parent',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      tooltip: 'created_at',
      search: false,
    },
    {
      title: '最后修改时间',
      dataIndex: 'updated_at',
      tooltip: 'updated_at',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => handleModalOpen('Edit', record)}>
            编辑
          </Button>
          <DeleteButton type="link" size="small" danger onConfirm={() => handleDelete(record.id)}>
            删除
          </DeleteButton>
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageContainer>
        <Button type="primary" onClick={handleCreate} icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
          创建分类
        </Button>
        <Table columns={columns} dataSource={categories} loading={loading} rowKey="id" />

      </PageContainer>
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
    </>

  );
};

export default CategoryPage;
