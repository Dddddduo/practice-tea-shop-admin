import SubmitButton from '@/components/Buttons/SubmitButton';
import { Form, FormInstance, Input, Radio, Select } from 'antd';
import Password from 'antd/es/input/Password';
import React from 'react';
import {StringDatePicker} from "@/components/StringDatePickers";

interface FormValues {
  name: string;
  email: string;
  mobile: string;
  status: 0 | 1;
  gender: 1 | 2;
}

interface UpdateOrCreateFormProps {
  formRef: FormInstance;
  formType: string;
  onFinish: () => void;
  onChange?: (changedValues: any, allValues: FormValues) => void;
}

const UpdateOrCreateForm: React.FC<UpdateOrCreateFormProps> = ({
                                                                 formRef,
                                                                 formType,
                                                                 onFinish,
                                                                 onChange,
                                                               }) => {
  const passwordItem = (
    <>
      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: 'Please input enter user password' }]}
      >
        <Password />
      </Form.Item>

      <Form.Item
        name="password_confirmation"
        label="Password Confirmation"
        rules={[{ required: true, message: 'Please input enter user password' }]}
      >
        <Password />
      </Form.Item>
    </>
  );

  const hiddenItem = (
    <Form.Item name="id" hidden={true}>
      <Input type="hidden" />
    </Form.Item>
  );

  return (
    <Form form={formRef} layout="vertical" onValuesChange={onChange}>
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      {formType === 'create' ? passwordItem : hiddenItem}

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please input the email' },
          { type: 'email', message: 'Please enter user email' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="mobile"
        label="Mobile"
        rules={[{ required: true, message: 'Please enter user mobile' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="gender"
        label="Gender"
        rules={[{ required: true, message: 'Please select user gender' }]}
      >
        <Select
          showSearch
          placeholder="Please select"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          <Option value="1">Male</Option>
          <Option value="2">Female</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: 'Please select a status' }]}
      >
        <Radio.Group>
          <Radio value={1}>enable</Radio>
          <Radio value={0}>disable</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name="date_string"
        label="Date String"
      >
        <StringDatePicker />
      </Form.Item>


      <Form.Item>
        <SubmitButton type="primary" htmlType="submit" onConfirm={onFinish} form={formRef}>
          Submit
        </SubmitButton>
      </Form.Item>
    </Form>
  );
};

export default UpdateOrCreateForm;
