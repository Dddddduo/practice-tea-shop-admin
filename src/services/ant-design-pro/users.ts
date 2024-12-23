import { request } from "@@/exports";
import { ResponseStructure } from "@/utils/http-handle";

// 获取数据列表
export async function getUsersList(params?: { [key: string]: any }, options?: { [key: string]: any }) {
    return request<ResponseStructure>('/api/backend/v1/users', {
        method: 'GET',
        params: {
            ...params
        },
        ...(options || {}),
    });
}

export async function updateUserInfo(id: number, params?: { [key: string]: any }, options?: { [key: string]: any }) {
    console.log("修改的数据", params);
    return request<ResponseStructure>(`/api/backend/v1/update-user/${id}`, {
        method: 'PUT',
        data: {
            ...params
        },
        ...(options || {})
    });
}

export async function disableUser(id: number, params?: { [key: string]: any }, options?: { [key: string]: any }) {
    console.log("禁用的用户", id);
    return request<ResponseStructure>(`/api/backend/v1/update-user-status/${id}`, {
        method: 'PUT',
        data: {
            ...params
        },
        ...(options || {})
    });
}

// 查每一个等级的会员对应的分数

