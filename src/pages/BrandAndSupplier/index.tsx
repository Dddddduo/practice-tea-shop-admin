import React from 'react';
import {PlusOutlined} from '@ant-design/icons';
import {PageContainer, ProTable} from '@ant-design/pro-components';
import {Button, Space, TablePaginationConfig} from 'antd';
import {t} from '@/utils/helper';
import UpdateOrCreateForm from '../BrandAndSupplier/components/UpdateOrCreateForm';
import ManageForm from '../BrandAndSupplier/components/ManageForm';
import DeleteButton from '@/components/Buttons/DeleteButton';
import BaseContainer from '@/components/Container';
import { Category } from '@/types';
import {useBrandAndSupplier} from "@/hooks/useBrandAndSupplier";

// 表单展示的数据
const BrandAndSupplier: React.FC = () => {

  const {

    userData,
    modalOpen,
    // 品牌表单
    formRef,
    // 供应商表单
    formSupplierRef,

    actionRef,
    actionSupplierRef,

    fetchUserList,

    handleModalOpen,
    handleModalClose,
    handleManageModalOpen,
    handleManageModalClose,

    handleDelete,
    vendorModalOpen,
    manageModalOpen,
    handleUpdateOrCreate,
    handleValueChange,

    options,
    handleSupplierDelete,

    // 创建供应商
    handleSupplierCreate,

    handleRefresh,
    loading,

  } = useBrandAndSupplier();

  // 分页数据
  const pageParams = {
    pageSize: 10,
  } as TablePaginationConfig;

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      search: false,
    },
    {
      title: t('category.name', '品牌名称'),
      dataIndex: 'name',
    },
    {
      title: t('category.createdAt', '创建时间'),
      dataIndex: 'created_at',
      search: false,
    },
    {
      title: t('category.updatedAt', '最后修改时间'),
      dataIndex: 'updated_at',
      search: false,
    },

    {
      title: t('category.actions', '操作'),
      dataIndex: 'option',
      valueType: 'option',

      renderText: (dom, entity) => {

        console.log("点击按钮后传入的entity是",entity)

        return (<Space size="small">

          {/*编辑 */}
          <Button color="default"  type="link" size="small" onClick={() => handleModalOpen('edit', entity)}>
            {t('category.edit', '编辑')}
          </Button>

          {/*删除 */}
          <DeleteButton color="danger"  danger={true} type="link" size="small"
                        onConfirm={() => handleDelete(entity)}
                        type="link"
          >

            {t('category.delete', '删除')}
          </DeleteButton>

          {/*管理供应商 */}
          <Button  color="default"  type="link" size="small" onClick={() => handleManageModalOpen( entity.id)}
          >
            {t('category.edit', '管理供应商')}
          </Button>

        </Space>);
      },

    },
  ];

  return (

    <>
      <PageContainer>
        <ProTable<Category>
          actionRef={actionRef}
          rowKey="id"
          search={false}
          toolBarRender={() => [
            <Button
              type="primary"
              key="primary"
              onClick={() => handleModalOpen('create')}
            >
              <PlusOutlined/> {t('category.create', '添加品牌')}
            </Button>,
          ]}
          // 数据是从hooks里传入的
          request={fetchUserList}
          // 分页数据
          pagination={pageParams}
          columns={columns}
          rowSelection={{
            onChange: (_, selectedRows) => {
              console.log(selectedRows);
            },
          }}
        />
      </PageContainer>
      {/*提交与编辑组件*/}
      <BaseContainer
        open={vendorModalOpen}
        onCancel={handleModalClose}
        title={
          userData.type === 'create'
            ? t('category.createCategory', '添加品牌')
            : t('category.editCategory', '编辑')
        }
      >
        {/*/*父组件往子组件传*!/*/}
        <UpdateOrCreateForm
          // 绑定表单
          formRef={formRef}
          option={options}
          formType={userData.type}
          onFinish={handleUpdateOrCreate}
          onChange={handleValueChange}
        />
      </BaseContainer>

      {/*管理供应商组件*/}
      <BaseContainer
        open={manageModalOpen}
        onCancel={handleManageModalClose}
        title={
          userData.type === 'create'
            ? t('category.createCategory', '添加品牌')
            : t('category.editCategory', '编辑')
        }
      >
        {/*/*父组件往子组件传*!/*/}
        <ManageForm
          actionRef={actionSupplierRef}
          // 绑定表单
          formRef={formRef}
          // options是获取到的数据
          option={options}
          // 传给子组件
          formType={userData.type}
          onFinish={handleSupplierCreate}
          onChange={handleValueChange}
          handleSupplierDelete={handleSupplierDelete}
          // 刷新
          handleRefresh={handleRefresh}
          loading={loading}
        />
      </BaseContainer>
    </>

  );
};

export default BrandAndSupplier;
