import { PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage } from '@umijs/max';
import { Button, Space, TablePaginationConfig, Tag, Input } from 'antd';
import React from 'react';

import DeleteButton from '@/components/Buttons/DeleteButton';
import SubmitButton from '@/components/Buttons/SubmitButton';
import BaseContainer, { ModalType } from '@/components/Container';
import { useOrder } from '@/hooks/useOrder';
import { Order } from '@/types';

const pageParams = {
  pageSize: 20,
} as TablePaginationConfig;

const OrderList: React.FC = () => {
  {/* 从Order的hooks中获取的属性和方法 */ }
  const {
    userData,
    modalOpen,
    actionRef,
    waybillValue,
    setWaybillValue,
    fetchOrderList,
    handleModalOpen,
    handleModalClose,
    handleDelete,
    UpdateOrderWaybillValue,
  } = useOrder();

  {/* 关于表格的列数据 */ }
  const columns: ProColumns<Order>[] = [
    {
      title: '编号',
      dataIndex: 'id',
      search: false,
    },
    {
      title: '订单号',
      dataIndex: 'order_no',
    },
    {
      title: '用户手机',
      dataIndex: 'phone',
      render: (text, record) => {
        return record?.address?.phone ?? ''
      }
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      render: (text, record) => {
        switch (record.status) {
          case 0:
            return "未付款";
          case 1:
            return "已付款";
          case 2:
            return "已发货";
          case 3:
            return "已签收";
          case 4:
            return "已完成";
          case 5:
            return "已取消";
          case 6:
            return "退款中";
          case 7:
            return "已退款";
          default:
            return "未知状态";
        }
      }
    },
    {
      title: '订单金额',
      dataIndex: 'pay_amount',
      search: false,
      render: (text, record) => {
        return record?.pay_amount ?? 0
      }
    },
    {
      title: '下单时间',
      dataIndex: 'created_at',
      search: false,
    },
    {
      title: '运单号',
      dataIndex: 'waybill',
      search: false,
    },
    {
      title: '取消时间',
      dataIndex: 'cancel_at',
      search: false,
    },
    {
      title: '支付完成时间',
      dataIndex: 'play_at',
      search: false,
    },
    {
      title: 'Action',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => handleModalOpen('订单详情', record)}>
            详情
          </Button>
          <Button type="link" size="small" onClick={() => handleModalOpen('运单号回填', record)}>
            回填
          </Button>
          <DeleteButton type="link" size="small" danger onConfirm={() => handleDelete(record)}>
            取消
          </DeleteButton>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={fetchOrderList}
        columns={columns}
        pagination={pageParams}
        rowSelection={{
          onChange: (index, selectedRows) => {
          },
        }}
      />
      <BaseContainer
        type={ModalType.Modal}
        title={userData.type.toUpperCase()}
        width="35%"
        open={modalOpen}
        maskClosable={false}
        onCancel={() => handleModalClose()}
      >
        {userData.type === '订单详情' ? (
          <>
            <p hidden>订单ID: {userData.formData.id}</p>
            <p>订单号: {userData.formData.order_no === '' ? '-' : userData.formData.order_no}</p>
            <p>状态：{userData.formData.status === 0 ? '待付款' : '已付款'}</p>
            <p>总金额: ¥{userData.formData.total_amount}</p>
            <p>支付ID: {userData.formData.transaction_id}</p>
            <p>运单号: {userData.formData.waybill}</p>
            <ul style={{ listStyleType: "disc" }}>
              {Array.isArray(userData.formData.orderItems) &&
                userData.formData.orderItems.length > 0 ? (
                userData.formData.orderItems.map((item: any) => (
                  <li key={item.id} style={{ fontSize: '12px' }}>
                    {item.product.name} - 数量: {item.quantity} - 单价: ¥{item.price}
                  </li>
                ))
              ) : (
                <li>没有商品列表</li>
              )}
            </ul>
          </>
        ) : userData.type === '运单号回填' ? (
          <div>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
              <label htmlFor="waybillInput">请输入运单号:</label>
              <Input id="waybillInput"
               onChange={(e) => setWaybillValue(e.target.value)}
              placeholder="输入运单号"
              />
              <SubmitButton type="primary" autoInsertSpace
              onConfirm={() => UpdateOrderWaybillValue(userData.formData.id, waybillValue)}
              >
                确定
              </SubmitButton>
            </Space>
          </div>
        ) : null}
      </BaseContainer>
    </PageContainer>
  );
};

export default OrderList;
