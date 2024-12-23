import { request } from '@umijs/max';
import { ResponseStructure } from '@/utils/http-handle';

export interface Supplier {
  id: number;
  name: string;
  brand_id: number;
}

export async function getSupplierList(brandId: number) {
  return request<ResponseStructure>('/api/backend/v1/suppliers/all', {
    method: 'GET',
    params: { brand_id: brandId },
  });
}

export async function createSupplier(params: { name: string; brand_id: number }) {
  return request<ResponseStructure>('/api/backend/v1/suppliers', {
    method: 'POST',
    data: params,
  });
}

export async function updateSupplier(id: number, params: { name: string; brand_id: number }) {
  return request<ResponseStructure>(`/api/backend/v1/suppliers/${id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function deleteSupplier(id: number) {
  return request<ResponseStructure>(`/api/backend/v1/suppliers/${id}`, {
    method: 'DELETE',
  });
}
