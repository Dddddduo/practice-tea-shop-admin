import { request } from '@@/exports';
import { ResponseStructure } from '@/utils/http-handle';

export async function getProductList(params?: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<ResponseStructure>('/api/backend/v1/products', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {}),
  });
}

export async function addProduct(params?: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<ResponseStructure>('/api/backend/v1/products', {
    method: 'POST',
    data: {
      ...params
    },
    ...(options || {}),
  })
}

export async function updateProductInfo(id:number, params?: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<ResponseStructure>(`/api/backend/v1/products/${id}`, {
    method: 'PUT',
    data: {
      ...params
    },
    ...(options || {}),
  })
}

export async function deleteProduct(id: number, params?: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<ResponseStructure>(`/api/backend/v1/products/${id}`, {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {}),
  })
}

export async function downProduct(id: number, params?: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<ResponseStructure>(`/api/backend/v1/products/products-listing`, {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {}),
  })
}

export async function tagList(params?: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<ResponseStructure>('/api/backend/v1/tags-all', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {}),
  })
}

export async function addLab(params?: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<ResponseStructure>(`/api/backend/v1/tags`, {
    method: 'POST',
    data: params,
    ...(options || {}),
  })
}
export async function delLab(id :number,params?: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<ResponseStructure>(`/api/backend/v1/tags/${id}`, {
    method: 'DELETE',
    params: {
      ...params
    },
    ...(options || {}),
  })
}

export async function updateLab(id :number,params?: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<ResponseStructure>(`/api/backend/v1/tags/${id}`, {
    method: 'PUT',
    data: {
      ...params
    },
    ...(options || {}),
  })
}

// 获取分类列表
export async function categoryList(params?: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<ResponseStructure>('/api/backend/v1/categories-all', {
    method: 'GET',
    params: {
      type: 'all',
       ...params
    },
    ...(options || {}),
  });
}

// 获取品牌列表
export async function brandList(params?: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<ResponseStructure>('/api/backend/v1/brands-all', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {}),
  });
}

// 获取供应商列表，根据品牌ID
export async function supplierList(brandId: number, params?: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<ResponseStructure>(`/api/backend/v1/suppliers-all/${brandId}`, {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {}),
  });
}

export async function SKUList(params?: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<ResponseStructure>('/api/backend/v1/skus', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {}),
  });
}


export async function uploadImage(file: any,params?: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<ResponseStructure>('/api/backend/v1/upload-file', {
    method: 'POST',
    data: {
      file:file,
      ...params
    },
    ...(options || {}),
  });
}
