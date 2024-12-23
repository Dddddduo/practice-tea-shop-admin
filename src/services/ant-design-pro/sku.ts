import {request} from '@umijs/max';
import {ResponseStructure} from '@/utils/http-handle';

export interface Brand {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

// 获取sku列表
export async function getSkuManagePageListApi(params: any) {
  return request<ResponseStructure>(`/api/backend/v1/skus`, {
    method: 'GET',
    params: params,
  });
}

// 创建sku
export async function createBrand(params: { name: string }) {
  return request<ResponseStructure>('/api/backend/v1/skus', {
    method: 'POST',
    data: params,
  });
}

// 删除sku
export async function deleteSku(id: number) {
  return request<ResponseStructure>(`/api/backend/v1/skus/${id}`, {
    method: 'DELETE',
  });
}

// 更新sku
export async function updateBrand(id: number, params: { name: string }) {
  return request<ResponseStructure>(`/api/backend/v1/skus/${id}`, {
    method: 'PUT',
    data: params,
  });
}

// 获取供应商的列表
export async function getSupplierList(id: number) {
  return request<ResponseStructure>(`/api/backend/v1/product-attributes/${id}`, {
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
export async function createSupplier(params: { name: string; brand_id: number }) {
  return request<ResponseStructure>(`/api/backend/v1/suppliers/`, {
    method: 'POST',
    data: params,
  });
}

// 获得属性列表
export async function getAttributesList() {
  return request<ResponseStructure>(`/api/backend/v1/product-attributes`, {
    method: 'GET',
  });
}

// 删除属性 注意是一整个属性
export async function deleteAttributes(id: number) {
  return request<ResponseStructure>(`/api/backend/v1/product-attributes/${id}`, {
    method: 'DELETE',
  });
}

// 创建属性
export async function createAttributes(params: { name: string }) {
  return request<ResponseStructure>(`/api/backend/v1/product-attributes/`, {
    method: 'POST',
    data: params,
  });
}

// 编辑属性 是去操作属性值 主要是服务于提交按钮
export async function editAttributes(id: number, params: { name: string; values: [] }) {
  return request<ResponseStructure>(`/api/backend/v1/product-attributes/${id}`, {
    method: 'PUT',
    data: params,
  });
}
// 新建Sku
export async function createSkus(params: {
  price: string;
  attribute_value_ids: [],
  sku_name: string;
  sku_code: string;
  stock: string;
  specification: number;
  unit: string;
}) {
  return request<ResponseStructure>(`/api/backend/v1/skus`, {
    method: 'POST',
    data: params,
  });
}

// 修改sku
export async function editSkus(id: number, params: {
  sku_name: string;
  sku_code: string;
  price: string;
  stock: string;
  unit: string;
  attribute_value_ids: []
}) {
  return request<ResponseStructure>(`/api/backend/v1/skus/${id}`, {
    method: 'PUT',
    data: params,
  });
}

// 查看Sku详细
export async function getSkus(id: number) {
  return request<ResponseStructure>(`/api/backend/v1/skus/${id}`, {
    method: 'GET',
  });
}

// 获得全量属性和属性值
export async function getAttrs() {
  return request<ResponseStructure>(`/api/backend/v1/product-attributes-all`, {
    method: 'GET',
  });
}
