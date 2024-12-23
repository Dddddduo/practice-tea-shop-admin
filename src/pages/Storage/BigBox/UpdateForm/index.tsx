import React from 'react';
import { Form, Input, FormInstance } from 'antd';
import SubmitButton from '@/components/Buttons/SubmitButton';

interface UpdateFormProps {
  formRef: FormInstance;
  onFinish: () => void;
}

const UpdateForm: React.FC<UpdateFormProps> = ({ formRef, onFinish }) => {
  return (
    <Form form={formRef} layout="vertical">
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>

      <Form.Item
        name="barcode"
        label="编码"
        rules={[{ required: true, message: '请输入编码' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="shelf_number"
        label="货架号"
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="order_no"
        label="订单号"
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <SubmitButton type="primary" onConfirm={onFinish}>
          提交
        </SubmitButton>
      </Form.Item>
    </Form>
  );
};

export default UpdateForm;
