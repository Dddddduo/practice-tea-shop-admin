import React, {useEffect, useState} from 'react';
import {Button, Form, Input, message, Space} from 'antd';
import BaseFormList from "../../../components/FormList";
import DeleteButton from "@/components/Buttons/DeleteButton";

interface EditAttrProps {
  dataSource: any,
  onAttrEditFinish ,
}

const EditAttr: React.FC<EditAttrProps>  = ({
                                              dataSource,
                                              onAttrEditFinish,
                                              }) => {

  // todo 应该把有些东西搬到hooks层里面去
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 表单提交时要用
  const baseStruct = {
  }

  useEffect(() => {

    try {
      console.log('initialData:', dataSource.initialData)

      form.setFieldsValue(dataSource.initialData);

    } catch (error) {
      console.error('设置初始数据时出错:', error);
      message.error('初始化表单数据失败');
    }

  }, [form]);

  const FormListItem: React.FC<any> = ({restField, name, remove, add, index}) => {
    return (
      <Space key={restField.key} style={{display: 'flex', marginBottom: 8}} align="baseline">

        <Form.Item
          {...restField}
          key={`formInput-${restField.key}`}

          name={[name, 'value']}

          label={'属性值' }
        >
          <Input/>
        </Form.Item>

        <DeleteButton onConfirm={() => remove(index)}>删除</DeleteButton>
        <Button onClick={() => add(baseStruct, index + 1)}>新增</Button>

      </Space>
    )
  }

  return (
    <Form form={form} onFinish={onAttrEditFinish}>

      <div>&nbsp;</div>
      <h1>编辑属性</h1>
      <div>&nbsp;</div>

      <BaseFormList
        key="list"
        listName="values"
        addButton={<Button type="dashed">新增</Button>}
        addStruct={baseStruct}
        disableRemoveLast={false}
      >
        <FormListItem key="list-litem1"/>
      </BaseFormList>
      <div>&nbsp;</div>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditAttr;
