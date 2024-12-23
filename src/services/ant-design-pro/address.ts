import { request } from "@@/exports";
import { ResponseStructure } from "@/utils/http-handle";

export async function getAddressList(params?: { [key: string]: any }, options?: { [key: string]: any }) {
    return request<ResponseStructure>('/api/backend/v1/user-addresses',
        {
            method: 'GET',
            params: {
                ...params
            },
            ...(options || {}),
        }
    )
}

export async function updateAddressInfo(id: number, parmas?: { [key: string]: any }, options?: { [key: string]: any }) {
    return request<ResponseStructure>(`/api/backend/v1/user-addresses/${id}`,
        {
            method: 'PUT',
            data: {
                ...parmas
            },
            ...(options || {}),
        }
    )
}

export async function deleteAddress(id: number, params?: { [key: string]: any }, options?: { [key: string]: any }) {
    return request<ResponseStructure>(`/api/backend/v1/user-addresses/${id}`,
        {
            method: 'DELETE',
            params: {
                ...params
            },
            ...(options || {}),
        }
    )
}
