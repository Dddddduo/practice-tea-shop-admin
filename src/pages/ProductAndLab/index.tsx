import React from 'react';
import {PageContainer, ProColumns, ProTable} from '@ant-design/pro-components';
import {Button, Form, Space, Tag} from 'antd';
import BaseContainer, {ModalType} from '@/components/Container';
import DeleteButton from '@/components/Buttons/DeleteButton';
import {useProductAndLab} from '@/hooks/useProductAndLab';
import CreateOrUpdateForm from '@/pages/ProductAndLab/components/CreateOrUpdateForm';
import FormListItem from '@/pages/ProductAndLab/components/FormListItem';
import BaseFormList from '@/components/FormList';

interface ProductList {
  id: number;
  name: string;
  category: string;
  brand: string;
  supplier: string;
  tags: { id: number; name: string }[];
  skus: {
    sku_code: string;
    price: string;
    stock: number;
    sku_name: string;
    attributes: { attribute_id: number; value: string }[];
  }[];
}

const ProductAndLab: React.FC = () => {
  const {
    dataSource,
    actionRef,
    editModalOpen,
    formRef,
    labsModalOpen,
    handleUpdateLab,
    handleDelLab,
    handleLabsModalOpen,
    handleLabsModalClose,
    fetchProductList,
    handleEditOpenModal,
    handleEditModalClose,
    handleDelProduct,
    handleSubmit,
    fetchSKUList,
    handleValueChange,
    fetchSupplierList,
    uploadProps,
  } = useProductAndLab();

  const columns: ProColumns<ProductList>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      search: false,
    },
    {
      title: '商品名称',
      dataIndex: 'name',
    },
    {
      title: '分类',
      dataIndex: 'category',
      render: (dom, record) => (
        <Space>
          {dom.name}
        </Space>
      ),

    },
    {
      title: '品牌',
      dataIndex: 'brand',
      render: (dom, record) => (
        <Space>
          {dom.name}
        </Space>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      render: (_, record) => (
        <Space>
          {record.tags.map((tag) => (
            <Tag key={tag.id} color="green">{tag.name}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'SKU数量',
      dataIndex: 'skus',
      render: (_, record) => <Space>{record.skus.length}</Space>,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record) => (
        <Space>
          <Button type="link" onClick={() => {
            handleEditOpenModal(record);
          }}>编辑</Button>
          <DeleteButton type="link" danger={true} onConfirm={() => handleDelProduct(record.id)}>删除</DeleteButton>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        actionRef={actionRef}
        search={{labelWidth: 120}}
        columns={columns}
        pagination={{pageSize: 20}}
        request={fetchProductList}
        rowSelection={{
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(selectedRowKeys, selectedRows);
          },
        }}
        toolBarRender={() => [
          <Button type="primary" key="manageTags" onClick={() => handleLabsModalOpen()}>
            管理标签
          </Button>,
          <Button type="primary" key="addProduct" onClick={() => handleEditOpenModal({})}>
            添加商品
          </Button>,
        ]}
      />

      <BaseContainer
        type={ModalType.Drawer}
        title="编辑商品"
        width="50%"
        open={editModalOpen}
        maskClosable={false}
        onCancel={() => handleEditModalClose()}
      >
        <CreateOrUpdateForm
          formRef={formRef}
          handleValueChange={handleValueChange}
          dataSource={dataSource}
          fetchSupplier={fetchSupplierList}
          fetchSKU={fetchSKUList}
          handleSubmit={handleSubmit}
          update={uploadProps}
        />
      </BaseContainer>

      <BaseContainer
        type={ModalType.Modal}
        title="管理标签"
        width="35%"
        open={labsModalOpen}
        maskClosable={false}
        onCancel={() => handleLabsModalClose()}
      >
        <Form form={formRef} size='middle'>
          <BaseFormList
            listName="labs"
            addStruct={{id: '', name: ''}}
            addButton={<Button type="primary">添加标签</Button>}
          >
            <FormListItem
              onRemove={handleDelLab}
              onUpdate={handleUpdateLab}
            />
          </BaseFormList>
        </Form>
      </BaseContainer>
    </PageContainer>
  );
};

export default ProductAndLab;
