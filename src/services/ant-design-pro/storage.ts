import { request } from '@umijs/max';
import { ResponseStructure } from '@/utils/http-handle';
export async function getCanTeaList(params?: { [key: string]: any }) {
  return request<ResponseStructure>('/api/backend/v1/storage-cans', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

export async function updateCanTea(id: number, params: { barcode: string; collectible_no: string }) {
  return request<ResponseStructure>(`/api/backend/v1/storage-cans/${id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function deleteCanTea(id: number) {
  return request<ResponseStructure>(`/api/backend/v1/storage-cans/${id}`, {
    method: 'DELETE',
  });
}

export async function getSmallBoxList(params?: { [key: string]: any }) {
  return request<ResponseStructure>('/api/backend/v1/storage-small-boxes', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

// src/services/storage/small-box.ts 添加以下内容

interface UpdateSmallBoxParams {
  barcode: string;
  big_box_barcode?: string; // 改为可选参数
}

export async function updateSmallBox(id: number, params: UpdateSmallBoxParams) {
  return request<ResponseStructure>(`/api/backend/v1/storage-small-boxes/${id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function deleteSmallBox(id: number) {
  return request<ResponseStructure>(`/api/backend/v1/storage-small-boxes/${id}`, {
    method: 'DELETE',
  });
}

export async function getBigBoxList(params?: { [key: string]: any }) {
  return request<ResponseStructure>('/api/backend/v1/storage-big-boxes', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}

// src/services/ant-design-pro/storage.ts 添加以下内容

interface UpdateBigBoxParams {
  barcode: string;
  shelf_number?: string;
  order_no?: string;
}

export async function updateBigBox(id: number, params: UpdateBigBoxParams) {
  return request<ResponseStructure>(`/api/backend/v1/storage-big-boxes/${id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function deleteBigBox(id: number) {
  return request<ResponseStructure>(`/api/backend/v1/storage-big-boxes/${id}`, {
    method: 'DELETE',
  });
}
