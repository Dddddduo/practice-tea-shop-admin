import SubmitButton from '@/components/Buttons/SubmitButton';
import {Form, FormInstance, Input, Space, Table} from 'antd';
import React from 'react';
import {PageContainer} from "@ant-design/pro-components";
import DeleteButton from "@/components/Buttons/DeleteButton";

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
  record: any;
  formType: string;
  onFinish: () => void;
  handleSupplierDelete: () => void;
  actionRef: any;
  onChange?: (changedValues: any, allValues: FormValues) => void;
  handleSupplierCreate: () => void;
  handleRefresh: () => void;
  loading: any;
}


const ManagerForm: React.FC<UpdateOrCreateFormProps> = ({
                                                          formRef,
                                                          option,
                                                          formType,
                                                          onFinish,
                                                          handleSupplierDelete,
                                                          handleSupplierCreate,
                                                          onChange,
                                                          actionRef,
                                                          loading,
                                                          handleRefresh,
                                                        }) => {
  const columns = [

    {
      title: '供应商名称',
      dataIndex: 'name',
      search: false,
    },

    // {
    //   title: 'id',
    //   dataIndex: 'id',
    //   search: false,
    // },
    //
    // {
    //   title: 'brand_id',
    //   dataIndex: 'brand_id',
    //   search: false,
    // },

    {
      title: ('category.actions', '操作'),
      dataIndex: 'option',
      valueType: 'option',
      render: (dom, entity) => {
        console.log("获取到的当前entity", entity)
        return (<Space size="small">
          {/*删除 */}
          <DeleteButton color="danger" variant="outlined" type="link" size="small"
                        onConfirm={() => handleSupplierDelete(entity)}
                        type="link"
          >
            {('category.delete', '删除')}
          </DeleteButton>
        </Space>);
      },
    }
  ]

  return (
    <>
      <PageContainer>
        <Table dataSource={option} columns={columns} loading={loading}/>
      </PageContainer>

      <Form form={formRef} layout="vertical" onValuesChange={onChange}>

        <Form.Item name="name" label="新供应商名称：" rules={[{required: true}]}>
          <Input/>
        </Form.Item>

        <Form.Item name="id" hidden={true}>
          <Input/>
        </Form.Item>

        <Form.Item name="brand_id" hidden={true}>
          <Input/>
        </Form.Item>

        <Form.Item>
          <SubmitButton type="primary" htmlType="submit" onConfirm={onFinish} form={formRef}>
            添加供应商
          </SubmitButton>
        </Form.Item>

      </Form>

    </>

  );

};

export default ManagerForm;
