import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSupplier } from '@/hooks/useSupplier';
import type { ColumnsType } from 'antd/es/table';
import type { Supplier } from '@/services/ant-design-pro/supplier';
import DeleteButton from '@/components/Buttons/DeleteButton';
import SubmitButton from '@/components/Buttons/SubmitButton';

interface SupplierManagerProps {
  brandId: number;
}

const SupplierManager: React.FC<SupplierManagerProps> = ({ brandId }) => {
  const { suppliers, loading, fetchSuppliers, handleCreateSupplier, handleUpdateSupplier, handleDeleteSupplier } = useSupplier(brandId);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<number | ''>('');

  useEffect(() => {
    fetchSuppliers();
  }, [brandId]);

  const isEditing = (record: Supplier) => record.id === editingKey;

  const edit = (record: Partial<Supplier>) => {
    form.setFieldsValue({ name: '', ...record });
    setEditingKey(record.id!);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (id: number) => {
    try {
      const row = await form.validateFields();
      const success = await handleUpdateSupplier(id, row);
      if (success) {
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns: ColumnsType<Supplier> = [
    {
      title: '供应商名称',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Form.Item
            name="name"
            style={{ margin: 0 }}
            rules={[{ required: true, message: '请输入供应商名称' }]}
          >
            <Input />
          </Form.Item>
        ) : (
          record.name
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <SubmitButton type="link" onConfirm={() => save(record.id)}>
              保存
            </SubmitButton>
            <Button type="link" onClick={cancel}>
              取消
            </Button>
          </Space>
        ) : (
          <Space>
            <Button type="link" disabled={editingKey !== ''} onClick={() => edit(record)}>
              编辑
            </Button>
            <DeleteButton type="link" danger onConfirm={() => handleDeleteSupplier(record.id)}>
              删除
            </DeleteButton>
          </Space>
        );
      },
    },
  ];

  const handleAdd = () => {
    form.validateFields().then(async (values) => {
      const success = await handleCreateSupplier(values);
      if (success) {
        form.resetFields();
      }
    });
  };

  return (
    <Form form={form}>
      <Space style={{ marginBottom: 16 }}>
        <Form.Item
          name="name"
          rules={[{ required: true, message: '请输入供应商名称' }]}
          style={{ marginBottom: 0 }}
        >
          <Input placeholder="输入供应商名称" />
        </Form.Item>
        <SubmitButton type="primary" icon={<PlusOutlined />} onConfirm={handleAdd}>
          添加供应商
        </SubmitButton>
      </Space>
      <Table
        columns={columns}
        dataSource={suppliers}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
    </Form>
  );
};

export default SupplierManager;
