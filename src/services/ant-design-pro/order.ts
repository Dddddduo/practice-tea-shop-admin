import {request} from "@@/exports";
import {ResponseStructure} from "@/utils/http-handle";

{/* 订单列表接口 */}
export async function getOrderList() {
  return request<ResponseStructure>('/api/backend/v1/orders', {
    method: 'GET',
  });
}
{/* 订单详情接口 */}
export async function getOrderItems(id: number) {
  return request<ResponseStructure>(`/api/backend/v1/orders/${id}/items`, {
    method: 'GET',
  });
}
{/* 回显订单号接口 */}
export async function backfillWaybill(id: number, params: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<ResponseStructure>(`/api/backend/v1/orders/${id}/back-fill`, {
    method: 'PUT',
    data: {
      ...params
    },
    ...(options || {}),
  });
}


export async function deleteOrder(id: number, params: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<ResponseStructure>(`/api/backend/v1/orders/${id}/cancel`, {
    method: 'PUT',
    data: {
      ...params
    },
    ...(options || {}),
  });
}
