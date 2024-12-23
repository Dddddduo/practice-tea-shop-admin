import { PageContainer, ProTable, ProColumns } from '@ant-design/pro-components';
import { useAddress } from '@/hooks/useAddress';
import { Button, Space, Tag } from 'antd';
import UpdateForm from '@/pages/UsersAddressList/components/UpdateForm';
import BaseContainer from '@/components/Container';
import DeleteButton from '@/components/Buttons/DeleteButton';

interface UserAddressListProps {
    id: string;
    name: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    address: string;
    is_default:null;
}

const AddressList: React.FC = () => {
    const {
        actionRef,
        modalOpen,
        formRef,
        fetchAddressList,
        handleOpenModal,
        handleModalClose,
        handleUpdate,
        handleValueChange,
        handleDeleteAddress
    } = useAddress(); // 获取自定义 hook

    const pageParams = {
        pageSize: 20,
    };

    const columns: ProColumns<UserAddressListProps>[] = [
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
            dataIndex: 'phone',
        },
        {
            title: '省份',
            dataIndex: 'province',
        },
        {
            title: '城市',
            dataIndex: 'city',
        },
        {
            title: '区县',
            dataIndex: 'district',
        },
        {
            title: '详细地址',
            dataIndex: 'address',
        },
        {
            title: '是否默认',
            dataIndex: 'is_default',
            render: (_, record) => (
                <Tag color={record.is_default ? 'green' : 'red'}>
                    {record.is_default ? '是' : '否'}
                </Tag>
            )
        },
        {
            title: '操作',
            valueType: 'option',
            render: (text, record) => [
                <Space key="action">
                    <Button type="link" onClick={() => handleOpenModal(record)}>编辑</Button>
                    <DeleteButton onConfirm={() => handleDeleteAddress(record.id)}>删除</DeleteButton>
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
                request={fetchAddressList}
                rowSelection={{
                    onChange: (selectedRowKeys, selectedRows) => {
                        console.log(selectedRowKeys, selectedRows);
                    },
                }}
            />
            <BaseContainer
                title='编辑地址'
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

export default AddressList;
