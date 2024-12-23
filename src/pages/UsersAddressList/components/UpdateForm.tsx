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
                name="phone"
                label="电话"
                rules={[{ required: true, message: '请输入电话' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="province"
                label="省份"
                rules={[{ required: true, message: '请输入省份' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="city"
                label="城市"
                rules={[{ required: true, message: '请输入城市' }]}
            >

                <Input />
            </Form.Item>

            <Form.Item
                name="district"
                label="区县"
                rules={[{ required: true, message: '请输入区县' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="address"
                label="详细地址"
                rules={[{ required: true, message: '请输入详细地址' }]}
            >
                <Input />
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
