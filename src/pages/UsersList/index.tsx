import {PageContainer, ProColumns, ProTable} from '@ant-design/pro-components';
import {useUsers} from '@/hooks/useUsers';
import {Button, Space, Tag} from 'antd';
import UpdateForm from '@/pages/UsersList/components/UpdateForm';
import BaseContainer from '@/components/Container';

interface User {
  id: string;
  name: string;
  mobile: string;
  email: string;
  status: number;
  created_at: string;
  member_score: string;
  member_type: string;
}

const UserList: React.FC = () => {
  const {
    actionRef,
    modalOpen,
    formRef,
    fetchUsersList,
    handleOpenModal,
    handleModalClose,
    handleUpdate,
    handleValueChange,
    handleDisableUser,
    handleEnableUser
  } = useUsers(); // 获取自定义 hook

  const pageParams = {
    pageSize: 20,
  };

  const columns: ProColumns<User>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      search: false,
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (dom, entity) => {
        return entity.status === 1 ? (
          <Tag color="green">启用</Tag>
        ) : (
          <Tag color="red">禁用</Tag>
        );
      },
      search: false,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'date',
      sorter: true,
      search: false,
    },
    {
      title: '用户积分',
      dataIndex: 'member_score',
      sorter: true,
      search: false,
    },
    {
      title: '所属会员',
      dataIndex: 'member_type',
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record) => [
        <Space key="action">
          <Button type="link" onClick={() => handleOpenModal(record)}>编辑</Button>
          {
            record.status === 0 ? (
              <Button type="link" onClick={() => handleEnableUser(record.id)}>启用</Button>
            ) : (
              <Button type="link" danger onClick={() => handleDisableUser(record.id)}>禁用</Button>
            )
          }
        </Space>
      ]
    }
  ];
  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        actionRef={actionRef}
        search={{
          labelWidth: 120,
        }}
        columns={columns}
        pagination={pageParams}
        request={fetchUsersList}
        rowSelection={{
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(selectedRowKeys, selectedRows);
            // 这里可以处理选中的行
          },
        }}
      />
      <BaseContainer
        title='编辑用户'
        width="35%"
        open={modalOpen}
        maskClosable={false}
        onCancel={() => handleModalClose()}
      >
        <UpdateForm
          formRef={formRef}
          onFinish={handleUpdate}
          onChange={handleValueChange}
        />
      </BaseContainer>
    </PageContainer>
  );
};

export default UserList;
