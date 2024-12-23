import React from 'react';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Space, Button, Tag } from 'antd';
import { useBigBox } from '@/hooks/useBigBox';
import type { BigBox } from '@/types';
import DeleteButton from '@/components/Buttons/DeleteButton';
import BaseContainer, {ModalType} from "@/components/Container";
import UpdateForm from "@/pages/Storage/BigBox/UpdateForm";
import {history} from "@umijs/max";

const pageParams = {
  pageSize: 20,
};

const BigBoxList: React.FC = () => {
  const {
    formRef,
    actionRef,
    modalOpen,
    modalTitle,
    fetchBigBoxList,
    handleModalOpen,
    handleModalClose,
    handleUpdate,
    handleDelete,
  } = useBigBox();

  const columns: ProColumns<BigBox>[] = [
    {
      title: 'No',
      dataIndex: 'index',
      valueType: 'index',
      search: false
    },
    {
      title: '大箱号',
      dataIndex: 'barcode',
    },
    {
      title: '货架号',
      dataIndex: 'shelf_number',
    },
    {
      title: '订单号',
      dataIndex: 'order_no',
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      search: false,
      render: (_, record) => (
        <Tag color={record.status === 1 ? 'green' : 'red'}>
          {record.status === 1 ? '在库存' : '已出库'}
        </Tag>
      ),
    },
    {
      title: 'SKU名称',
      dataIndex: 'sku_name',
      search: false,
    },
    {
      title: '小箱数',
      dataIndex: 'small_box_count',
      search: false,

      render: (_, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => {
            history.push({
              pathname: '/storage-management/small-box-list',
              search: `?big_box_barcode=${record.barcode}`,
            });
          }}
        >
          {record.small_box_count}
        </Button>
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
      <ProTable<BigBox>
        headerTitle="大箱列表"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={fetchBigBoxList}
        columns={columns}
        pagination={pageParams}
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

export default BigBoxList;
