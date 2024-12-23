import React from 'react';
import {PageContainer, ProTable} from '@ant-design/pro-components';
import type {ProColumns} from '@ant-design/pro-components';
import {Space, Button, Tag} from 'antd';
import {useSmallBox} from '@/hooks/useSmallBox';
import type {SmallBox} from '@/types';
import DeleteButton from '@/components/Buttons/DeleteButton';
import BaseContainer, {ModalType} from "@/components/Container";
import UpdateForm from "@/pages/Storage/SmallBox/UpdateForm";
import {history, useLocation} from "@umijs/max";

const pageParams = {
  pageSize: 20,
};

const SmallBoxList: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const bigBoxBarcode = params.get('big_box_barcode');

  const {
    formRef,
    actionRef,
    modalOpen,
    modalTitle,
    fetchSmallBoxList,
    handleModalOpen,
    handleModalClose,
    handleUpdate,
    handleDelete,
  } = useSmallBox();

  const columns: ProColumns<SmallBox>[] = [
    {
      title: 'No',
      dataIndex: 'index',
      valueType: 'index',
      search: false
    },
    {
      title:'名称',
      dataIndex: 'sku',
      render:(dom, record)=>(
        <Space>
          {dom.sku_name}
        </Space>
      )
    },
    {
      title:'单位刻度',
      dataIndex: 'sku',
      render:(dom, record)=>(
        <Space>
          {dom.unit}
        </Space>
      )
    },
    {
      title: '小箱号',
      dataIndex: 'barcode',
    },
    {
      title: '大箱号',
      dataIndex: 'big_box_barcode',
    },
    {
      title: '小罐数量',
      dataIndex: 'can_count',
      search: false,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => {
            history.push({
              pathname: '/storage-management/can-tea-list',
              search: `?little_box_barcode=${record.barcode}`,
            });
          }}
        >
          {record.can_count}
        </Button>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      search: false,
      render: (_, record) => (
        <Tag color={record.status === 1 ? 'green' : record.status === 2 ? 'orange' : 'red'}>
          {record.status === 1 ? '在库中' : record.status === 2 ? '保管中' : '已提货'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      search: false,
    },
    {
      title: 'Actions',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => handleModalOpen('Edit', record)}>
            修改
          </Button>
          <DeleteButton type="link" size="small" danger onConfirm={() => handleDelete(record)}>
            删除
          </DeleteButton>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<SmallBox>
        headerTitle="小箱列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={fetchSmallBoxList}
        columns={columns}
        pagination={pageParams}
        form={{
          initialValues: {
            big_box_barcode: bigBoxBarcode
          }
        }}
      />
      <BaseContainer
        type={ModalType.Modal}
        title={modalTitle}
        width="35%"
        open={modalOpen}
        maskClosable={false}
        onCancel={() => handleModalClose()}
      >
        <UpdateForm
          formRef={formRef}
          onFinish={handleUpdate}
        />
      </BaseContainer>
    </PageContainer>
  );
};

export default SmallBoxList;
