import SubmitButton from '@/components/Buttons/SubmitButton';
import {Form, FormInstance, Input} from 'antd';
import React from 'react';

interface FormValues {
  name: string;
  email: string;
  mobile: string;
  status: 0 | 1;
  gender: 1 | 2;
}

interface UpdateOrCreateFormProps {
  formRef: FormInstance;
  option: any;
  formType: string;
  onFinish: () => void;
  onChange?: (changedValues: any, allValues: FormValues) => void;
}

const UpdateOrCreateForm: React.FC<UpdateOrCreateFormProps> = ({
                                                                 formRef,
                                                                 option,
                                                                 formType,
                                                                 onFinish,
                                                                 onChange,
                                                               }) => {

  return (
    <Form form={formRef} layout="vertical" onValuesChange={onChange}>

      <Form.Item name="name" label="品牌名称：" rules={[{required: true}]}>
        <Input/>
      </Form.Item>

      <Form.Item name="id" hidden={true}>
        <Input type="hidden"/>
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
