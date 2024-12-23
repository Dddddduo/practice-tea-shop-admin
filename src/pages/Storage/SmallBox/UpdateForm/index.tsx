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
        label="编号"
        rules={[{ required: true, message: '请输入编号' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="big_box_barcode"
        label="大箱编号"
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
