import React from 'react';
import { Category } from '@/hooks/useCategory';
import SubmitButton from '@/components/Buttons/SubmitButton';
import {Form, Input, Select} from "antd";

interface CategoryFormProps {
  initialValues?: Partial<Category>;
  categories: Category[];
  onFinish: (values: { pid: number; name: string }) => Promise<void>;
  formType: 'create' | 'edit';
}

const CategoryForm: React.FC<CategoryFormProps> = ({ initialValues, categories, onFinish, formType }) => {
  const [form] = Form.useForm();

  const topLevelOption = { label: '顶级分类', value: 0 };
  const categoryOptions = [
    topLevelOption,
    ...categories
      .filter((category) => category.pid === 0)
      .map((category) => ({ label: category.name, value: category.id })),
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <Form.Item
        name="name"
        label="分类名称"
        rules={[{ required: true, message: '请输入分类名称' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="pid"
        label="上级分类"
        rules={[{ required: true, message: '请选择上级分类' }]}
      >
        <Select options={categoryOptions} />
      </Form.Item>
      <Form.Item>
        <SubmitButton type="primary" htmlType="submit">
          {formType === 'create' ? '创建分类' : '更新分类'}
        </SubmitButton>
      </Form.Item>
    </Form>
  );
};

export default CategoryForm;
