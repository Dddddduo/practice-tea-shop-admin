import SubmitButton from '@/components/Buttons/SubmitButton';
import { Form, FormInstance, Input, Radio, Select } from 'antd';
import React from 'react';

interface FormValues {
    name: string;
    email: string;
    mobile: string;
    status: 0 | 1;
}

interface UpdateFormProps {
    formRef: FormInstance;
    onFinish: (values: FormValues) => void;
    onChange?: (changedValues: any, allValues: FormValues) => void;
}

const UpdateForm: React.FC<UpdateFormProps> = ({
    formRef,
    onFinish,
    onChange,
}) => {
    return (
        <Form form={formRef} layout="vertical" onValuesChange={onChange}>
            <Form.Item name="id" hidden>
                <Input type="hidden" />
            </Form.Item>

            <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item
                name="email"
                label="邮箱"
                rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '请输入有效的邮箱' },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="mobile"
                label="手机"
                rules={[{ required: true, message: '请输入手机号码' }]}
            >
                <Input />
            </Form.Item>

          <Form.Item
            name="member_score"
            label="积分"
            rules={[{ required: true, message: '请输入积分' }]}
          >
            <Input />
          </Form.Item>

            <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
            >
                <Radio.Group>
                    <Radio value={1}>启用</Radio>
                    <Radio value={0}>禁用</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item>
                <SubmitButton type="primary" htmlType="submit" onConfirm={onFinish} form={formRef}>
                    Submit
                </SubmitButton>
            </Form.Item>
        </Form>
    );
};

export default UpdateForm;
