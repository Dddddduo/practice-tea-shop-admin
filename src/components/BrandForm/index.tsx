import React from 'react';
import { Form, Input } from 'antd';
import { Brand } from '@/services/ant-design-pro/brand';
import SubmitButton from '@/components/Buttons/SubmitButton';

interface BrandFormProps {
  initialValues?: Partial<Brand>;
  onFinish: (values: { name: string }) => Promise<void>;
  formType: 'create' | 'edit';
}

const BrandForm: React.FC<BrandFormProps> = ({ initialValues, onFinish, formType }) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <Form.Item
        name="name"
        label="品牌名称"
        rules={[{ required: true, message: '请输入品牌名称' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <SubmitButton type="primary" htmlType="submit">
          {formType === 'create' ? '创建品牌' : '更新品牌'}
        </SubmitButton>
      </Form.Item>
    </Form>
  );
};

export default BrandForm;
