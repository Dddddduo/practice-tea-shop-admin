import React, {useState} from 'react';
import {Button, Checkbox, Form, Input, Radio, Select, Steps, Tag, Upload,} from 'antd';
import SubmitButton from '@/components/Buttons/SubmitButton';
import TextArea from 'antd/es/input/TextArea';
import WangEditor from '@/pages/Editor/index';
import useUpdateOrCreateForm from '@/hooks/useUpdateOrCreateForm';
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import {ProTable} from '@ant-design/pro-components';

const {Step} = Steps;

interface ProductFormProps {
  formRef: any;
  onFinish: (values: any) => void;
  onChange: (key: string, value: any) => void;
  dataSource: {
    initData: {
      all_SKU: [],
      all_brand: [],
      all_supplier: [],
      all_category: [],
      all_tag: [],
    },
    editProduct: {
      name: string;
      description: string;
      category_id: number;
      brand_id: number;
      supplier_id: number;
      status: number;
      image_url: string;
      content: string;
      tag_ids: number[];
      sku_ids: number[];
    };
  };
  fetchSupplier: (value: any) => void;
  fetchSKU: () => void; // 添加 fetchSKU 属性
  handleSubmit: (dataSource: any) => void; // 添加 handleSubmit 属性
  update: any; // 添加 update 属性
  handleValueChange: (key: string, value: any) => void; // 添加 handleValueChange 属性
}


const UpdateOrCreateForm: React.FC<ProductFormProps> = ({
                                                          formRef,
                                                          handleValueChange,
                                                          dataSource,
                                                          fetchSupplier,
                                                          fetchSKU,
                                                          handleSubmit,
                                                          update,
                                                        }) => {
  const {
    next,
    prev,
    currentStep,
    selectedRowKeys,
    loading,
    imageUrl,
    handleFinish,
    handleSelectChange,
    beforeUpload,
  } = useUpdateOrCreateForm(formRef, handleValueChange, dataSource, fetchSupplier);
  const [selectedCategory, setSelectedCategory] = useState<any>({});

  const columns = [
    {title: 'ID', dataIndex: 'id', valueType: 'number', search: false},
    {title: 'SKU编码', dataIndex: 'sku_code', valueType: 'text'},
    {title: 'SKU名称', dataIndex: 'sku_name', valueType: 'text'},
    {title: '价格', dataIndex: 'price', valueType: 'money', search: false},
    {title: '库存', dataIndex: 'stock', valueType: 'digit', search: false},
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <a key="link" onClick={() => handleSelectChange([record.id])}>
          选择
        </a>,
      ],
    },
  ];

  // @ts-ignore
  return (
    <>
      <Steps current={currentStep}>
        <Step title="基本信息"/>
        <Step title="SKU信息"/>
        <Step title="商品描述"/>
      </Steps>

      {currentStep === 0 && (
        <Form
          form={formRef}
          layout="vertical"
          onFinish={handleFinish}
          style={{marginTop: '16px'}}
        >

          <Form.Item name="id"></Form.Item>

          <Form.Item name="name" label="商品名称" rules={[{required: true}]}>
            <Input/>
          </Form.Item>

          <Form.Item name="description" label="商品描述" rules={[{required: true}]}>
            <TextArea/>
          </Form.Item>

          <Form.Item name="category_id" label="商品分类">
            <Select options={dataSource.initData.all_category} onChange={(value, option) => {
              setSelectedCategory(option.label)
            }}/>
          </Form.Item>

          {selectedCategory === '藏品' && (
            <Form.Item
              name="storage_price" label="保管费用(元/年)"
              rules={[{required: true}]}
            >
              <Input placeholder="请输入保管费用"/>
            </Form.Item>
          )}

          <Form.Item name="brand_id" label="品牌">
            <Select options={dataSource.initData.all_brand} onChange={fetchSupplier}/>
          </Form.Item>

          <Form.Item name="supplier_id" label="供应商">
            <Select options={dataSource.initData.all_supplier}/>
          </Form.Item>

          <Form.Item name="tagIds" label="商品标签">
            <Checkbox.Group>
              {dataSource.initData.all_tag.map((item: any) => (
                <Checkbox key={item.id} value={item.id}>
                  {item.name}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>

          <Form.Item name="status" label="商品状态">
            <Radio.Group>
              <Radio value={1}>上架</Radio>
              <Radio value={0}>下架</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="skus" style={{display: 'none'}}></Form.Item>

          <Form.Item label="上传图片" name="image_url">
            <Upload listType="picture-card" maxCount={1} beforeUpload={beforeUpload} {...update}>
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{width: '100%'}}/>
              ) : (
                <div>
                  {loading ? <LoadingOutlined/> : <PlusOutlined/>}
                  <div style={{marginTop: 8}}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Button type="primary" htmlType="submit">
            下一步
          </Button>

        </Form>
      )}

      {currentStep === 1 && (
        <>
          <div style={{width: '30%', margin: '10px',}}>
            {dataSource.initData.all_SKU
              .filter((item: any) => selectedRowKeys.includes(item.id))
              .map((item: any) => (
                <Tag color={'green'} key={item.id} closable style={{width: '80%'}}
                     onClose={() => handleSelectChange([])}>
                  {'已选择: ' + item.sku_name + ' ' + item.price + ' ' + item.stock}
                </Tag>
              ))}
          </div>
          <ProTable
            columns={columns}
            rowKey="id"
            request={fetchSKU}
            // rowSelection={{
            //   selectedRowKeys,
            //   onChange: handleSelectChange, // 更新选中行
            // }}
          />

          <Button onClick={prev}>上一步</Button>
          <Button type="primary" onClick={next}>
            下一步
          </Button>
        </>
      )}

      {currentStep === 2 && (
        <>
          <WangEditor handleValueChange={handleValueChange}/>
          <Button onClick={prev}>上一步</Button>
          <SubmitButton
            type="primary"
            htmlType="submit"
            onConfirm={() => {
              handleSubmit(dataSource);
            }}
          >
            提交
          </SubmitButton>
        </>
      )}
    </>
  );
};

export default UpdateOrCreateForm;
