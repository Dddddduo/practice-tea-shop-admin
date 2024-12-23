import { request } from '@umijs/max';
import { ResponseStructure } from '@/utils/http-handle';

export interface Brand {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export async function getBrandList() {
  return request<ResponseStructure>('/api/backend/v1/brands', {
    method: 'GET',
  });
}

export async function createBrand(params: { name: string }) {
  return request<ResponseStructure>('/api/backend/v1/brands', {
    method: 'POST',
    data: params,
  });
}

export async function updateBrand(id: number, params: { name: string }) {
  return request<ResponseStructure>(`/api/backend/v1/brands/${id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function deleteBrand(id: number) {
  return request<ResponseStructure>(`/api/backend/v1/brands/${id}`, {
    method: 'DELETE',
  });
}

// 获取供应商的列表
export async function getSupplierList(id: number) {
  return request<ResponseStructure>(`/api/backend/v1/suppliers-all/${id}`, {
    method: 'GET',
  });
}

// 删除供应商
export async function deleteSupplier(id: number) {
  return request<ResponseStructure>(`/api/backend/v1/suppliers/${id}`, {
    method: 'DELETE',
  });
}

// 添加供应商
export async function createSupplier(params: { name: string; brand_id: number}) {
  return request<ResponseStructure>(`/api/backend/v1/suppliers/`, {
    method: 'POST',
    data: params,
  });
}

// 修改供应商


