import {PlusOutlined} from '@ant-design/icons';
import type {ProColumns} from '@ant-design/pro-components';
import {PageContainer, ProTable} from '@ant-design/pro-components';
import {FormattedMessage} from '@umijs/max';
import {Button, Space, TablePaginationConfig} from 'antd';
import React from 'react';

import DeleteButton from '@/components/Buttons/DeleteButton';
import BaseContainer, {ModalType} from '@/components/Container';
import {useUser} from '@/hooks/useUser';
import UpdateOrCreateForm from '@/pages/Categories-new/components/UpdateOrCreateForm';
import {User} from '@/types';
import {t} from '@/utils/helper';

const CategoriesNew: React.FC = () => {

  const pageParams = {
    pageSize: 20,
  } as TablePaginationConfig;

  // 从hooks传入的数据
  const {
    formRef,
    userData,
    modalOpen,
    actionRef,
    fetchUserList,
    handleModalOpen,
    handleModalClose,
    handleUpdateOrCreate,
    handleDelete,
    handleValueChange,
    options,
  } = useUser();

  // 定义表格的列
  const columns: ProColumns<User>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      search: false,
    },
    {
      title: '分类名称',
      dataIndex: 'name',
    },
    {
      title: '上级分类',
      dataIndex: 'parent',
      search: false,
      renderText: (dom, entity) => {
        console.log("entity", entity)
        return entity?.parent?.name ?? '顶级分类';
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      search: false,
      renderText: (dom, entity) => {
        return entity.created_at;
      },
    },
    {
      title: '最后修改时间',
      dataIndex: 'updated_at',
      search: false,
      renderText: (dom, entity) => {
        return entity.updated_at;
      },
    },
    {
      title: 'Action',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button color="default" type="link" size="small" onClick={() => handleModalOpen('Edit', record)}>
            编辑
          </Button>
          <DeleteButton color="danger" danger={true} type="link" size="small" danger
                        onConfirm={() => handleDelete(record)}>
            删除
          </DeleteButton>
        </Space>
      ),
    },
  ];

  return (
    <>
      <BaseContainer
        type={ModalType.Drawer}
        style={{top: 30}}
        width="35%"
        open={modalOpen}
        maskClosable={true}
        title={
          userData.type === 'create'
            ? t('category.createCategory', '添加分类')
            : t('category.editCategory', '编辑')}

        onCancel={() => handleModalClose()}
        // afterOpenChange={() => console.log('hello')}
        // afterClose={() => console.log('closed')}
      >
        {/*父组件往子组件传*/}
        <UpdateOrCreateForm
          // 绑定表单
          formRef={formRef}
          option={options}
          formType={userData.type}
          onFinish={handleUpdateOrCreate}
          onChange={handleValueChange}
        />
      </BaseContainer>


      <PageContainer>
        {/*ProTable 表格组件*/}
        <ProTable
          headerTitle={t('pages.searchTable.title', 'Enquiry form')}
          actionRef={actionRef}
          // 唯一标识
          rowKey="id"
          search={{
            labelWidth: 80,
          }}
          toolBarRender={() => [
            <Button type="primary" key="primary" onClick={() => handleModalOpen('create')}>
              <PlusOutlined/> <FormattedMessage id="pages.searchTable.new" defaultMessage="New"/>
            </Button>,
          ]}
          request={fetchUserList}
          // 展示在页面上的数据
          columns={columns}
          // 分页数据
          pagination={pageParams}
          rowSelection={{
            onChange: (index, selectedRows) => {
              console.log(index, selectedRows);
              // setSelectedRows(selectedRows);
            },
          }}
        />
      </PageContainer>

    </>

  );
};

export default CategoriesNew;
