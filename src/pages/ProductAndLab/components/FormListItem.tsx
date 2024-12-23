import React from 'react';
import { Form, Input, Button, Space } from 'antd';
import DeleteButton from '@/components/Buttons/DeleteButton';

const FormListItem: React.FC<any> = ({ name,index,onRemove,onUpdate}) => {
// @ts-ignore
  return (
    <Space style={{ width: '100%'}}>
      <Form.Item
        style={{margin:'8px'}}
        name={[name, 'name']}
        label="标签"
        rules={[{ required: true, message: '请输入标签' }]}
      >
        <Input placeholder="请输入标签"  />
      </Form.Item>
      <Form.Item
        style={{margin:'8px'}}
        name={[name, 'id']}
      >
        <DeleteButton danger={true} onConfirm={()=>{onRemove(index);}} style={{margin:'0 5px'}} >
          删除
        </DeleteButton>
        <Button  type='primary'  htmlType="submit" onClick={()=>{onUpdate(index)}}>保存</Button>
      </Form.Item>
    </Space>
  );
};

export default FormListItem;
