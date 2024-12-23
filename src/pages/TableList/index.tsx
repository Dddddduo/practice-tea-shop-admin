import { PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button, Space, TablePaginationConfig, Tag } from 'antd';
import React from 'react';

import DeleteButton from '@/components/Buttons/DeleteButton';
import BaseContainer, { ModalType } from '@/components/Container';
import { useUser } from '@/hooks/useUser';
import UpdateOrCreateForm from '@/pages/TableList/components/UpdateOrCreateForm';
import { User } from '@/types';
import { t } from '@/utils/helper';

const pageParams = {
  pageSize: 20,
} as TablePaginationConfig;

const TableList: React.FC = () => {
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
  } = useUser();

  const columns: ProColumns<User>[] = [
    {
      title: 'No.',
      dataIndex: 'id',
      tooltip: 'User ID',
      search: false,
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      search: false,
      renderText: (dom, entity) => {
        return 1 === parseInt(entity.gender.toString()) ? 'Male' : 'Female';
      },
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      search: false,
      render: (dom, entity) => {
        return 1 === entity.status ? (
          <Tag color="green">enable</Tag>
        ) : (
          <Tag color="red">disable</Tag>
        );
      },
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      search: false,
      renderText: (dom, entity) => {
        return entity.created_at;
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
          <Button type="link" size="small" onClick={() => handleModalOpen('Edit', record)}>
            Edit
          </Button>
          <DeleteButton type="link" size="small" danger onConfirm={() => handleDelete(record)}>
            Delete
          </DeleteButton>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable
        headerTitle={t('pages.searchTable.title', 'Enquiry form')}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={() => handleModalOpen('create')}>
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={fetchUserList}
        columns={columns}
        pagination={pageParams}
        rowSelection={{
          onChange: (index, selectedRows) => {
            console.log(index, selectedRows);

            // setSelectedRows(selectedRows);
          },
        }}
      />
      <BaseContainer
        type={ModalType.Modal}
        title={userData.type.toUpperCase() + ' USER'}
        // style={{top: 30}}
        width="35%"
        open={modalOpen}
        maskClosable={false}
        onCancel={() => handleModalClose()}
        // afterOpenChange={() => console.log('hello')}
        // afterClose={() => console.log('closed')}
      >
        <UpdateOrCreateForm
          formRef={formRef}
          formType={userData.type}
          onFinish={handleUpdateOrCreate}
          onChange={handleValueChange}
        />
      </BaseContainer>
    </PageContainer>
  );
};

export default TableList;
