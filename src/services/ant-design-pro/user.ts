import {request} from "@@/exports";
import {ResponseStructure} from "@/utils/http-handle";

// 获取数据列表
export async function getUserList(params?: { [key: string]: any }, options?: { [key: string]: any }) {
  console.log("ppp", params)
  return request<ResponseStructure>('/api/backend/v1/categories', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {}), 
  });
}

export async function createUser(params: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<ResponseStructure>('/api/backend/v1/categories', {
    method: 'POST',
    data: {
      ...params
    },
    ...(options || {}),
  });
}

export async function updateUser(id: number, params: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<ResponseStructure>(`/api/backend/v1/update-user/${id}`, {
    method: 'PUT',
    data: {
      ...params
    },
    ...(options || {}),
  });
}


export async function deleteUser(id: number, options?: { [key: string]: any }) {
  return request<ResponseStructure>(`/api/backend/v1/categories/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
