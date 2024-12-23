import React from 'react';
import {PageContainer, ProTable} from '@ant-design/pro-components';
import type {ProColumns} from '@ant-design/pro-components';
import {Button, Space, Tag} from 'antd';
import {useCanTea} from '@/hooks/useCanTea';
import type {CanTea} from '@/types';
import DeleteButton from "@/components/Buttons/DeleteButton";
import BaseContainer, {ModalType} from "@/components/Container";
import UpdateForm from "@/pages/Storage/CanTea/UpdateForm";
import {useLocation} from '@umijs/max';
import * as sea from 'node:sea';

const pageParams = {
  pageSize: 20,
};

const CanTeaList: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const littleBoxBarcode = params.get('little_box_barcode');

  const {
    formRef,
    actionRef,
    modalOpen,
    modalTitle,
    fetchCanTeaList,
    handleModalOpen,
    handleModalClose,
    handleUpdate,
    handleDelete,
  } = useCanTea();

  const columns: ProColumns<CanTea>[] = [
    {
      title: 'No',
      dataIndex: 'index',
      valueType: 'index',
      search: false
    },
    {
      title:'名称',
      dataIndex: 'sku',
      render: (dom, record) => (
        <Space>
          {dom.sku_name}
        </Space>
      )
    },
    {
      title: '单位刻度',
      dataIndex: 'sku',
      search: false,
      render: (dom, record) => (
        <Space>
          {dom.unit}
        </Space>
      ),
    },
    {
      title: '罐号',
      dataIndex: 'barcode',
    },
    {
      title: '小箱号',
      dataIndex: 'little_box_barcode',
      search: {
        transform: (value) => ({ little_box_barcode: value })
      }
    },
    {
      title: '大箱号',
      dataIndex: 'big_box_barcode',
      search: false,
    },
    {
      title: '收藏码',
      dataIndex: 'collectible_no',
    },
    {
      title: '状态',
      dataIndex: 'status',
      search: false,
      render: (_, record) => (
        <Tag color={record.status === 1 ? 'green' : record.status === 2 ? 'orange' : 'red'}>
          {record.status === 1 ? '在库中' : record.status === 2? '保管中' : '已提货'}
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
      <ProTable<CanTea>
        headerTitle="Can Tea List"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        form={{
          initialValues: {
            little_box_barcode: littleBoxBarcode
          }
        }}
        request={fetchCanTeaList}
        columns={columns}
        pagination={pageParams}
        rowSelection={{
          onChange: (_, selectedRows) => {
            // setSelectedRows(selectedRows);
          },
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

export default CanTeaList;
