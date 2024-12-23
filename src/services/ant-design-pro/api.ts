// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function getDateTimes() {
  return request('/api/dateTime', {
    method: 'GET',
  });
}

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: API.CurrentUser;
  }>('/api/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/auth/v1/admin-logout', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 登录接口 POST */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<any>('/api/auth/v1/admin-login', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

/** 刷新token POST */
export async function refreshToken(options?: { [key: string]: any }) {
  return request<any>('/api/auth/v1/refresh-token', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function dateTime(options?: { [key: string]: any }) {
  return request<any>('/api/open/v1/date-time', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function uploadToken(params) {
  return request<any>('/api/backend/v1/upload-token', {
    method: 'GET',
    params: {
      ...params
    },
  });
}

export async function getFileUrlListByIds(params) {
  return request<any>('/api/backend/v1/file-url-list-by-ids', {
    method: 'GET',
    params: {
      ...params
    }
  });
}

export async function fileUpload(file, path) {
  const formData = new FormData();
  formData.append('file', file);
  return request<any>(`/api/backend/v1/file-upload/${path}`, {
    method: 'POST',
    data: formData
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data:{
      method: 'update',
      ...(options || {}),
    }
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data:{
      method: 'post',
      ...(options || {}),
    }
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data:{
      method: 'delete',
      ...(options || {}),
    }
  });
}
