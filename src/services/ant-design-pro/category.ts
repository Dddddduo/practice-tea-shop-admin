import { request } from '@@/exports';
import { Category, CategoryCreate, CategoryUpdate } from '@/types/model';

// 已完成
export async function getCategoryList(params?: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<API.ApiResponse>('/api/backend/v1/categories', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getAllCategories(options?: { [key: string]: any }) {
  return request<API.ApiResponse>('/api/backend/v1/categories-all?type=all', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getCategory(id: number, options?: { [key: string]: any }) {
  return request<API.ApiResponse>(`/api/backend/v1/category/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function createCategory(params: CategoryCreate, options?: { [key: string]: any }) {
  return request<API.Response<Category>>('/api/backend/v1/categories', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
}

// 虽然API文档中没有提供更新和删除的接口，但我们仍然可以定义这些函数以备将来使用
export async function updateCategory(id: number, params: CategoryUpdate, options?: { [key: string]: any }) {
  return request<API.Response<Category>>(`/api/backend/v1/categories/${id}`, {
    method: 'PUT',
    data: params,
    ...(options || {}),
  });
}

export async function deleteCategory(id: number, options?: { [key: string]: any }) {
  return request<API.Response<null>>(`/api/backend/v1/categories/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
