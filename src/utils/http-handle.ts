import { appConfig } from '@/config/app-config';
import { requestConfig } from '@/config/request-config';
import { refreshToken } from '@/services/ant-design-pro/api';
import { logoutHandle } from '@/utils/auth';
import { localStorageService } from '@/utils/local-storage-service';
import type { RequestOptions } from '@@/plugin-request/request';
import { message } from 'antd';
import { AxiosResponse } from 'axios';
import { jwtDecode } from 'jwt-decode';

// 与后端约定的响应数据格式
export interface ResponseStructure extends API.ApiResponse {
  flatMap(arg0: (product: any) => any): unknown;
  ok: boolean;
  msg: string;
}

let refreshTokenPromise: Promise<any> | null = null;

const httpHandle = {
  async baseRequestInterceptor(config: RequestOptions): Promise<RequestOptions> {
    if (!config.headers) {
      config.headers = {};
    }

    const url = config?.url;
    const currentTime = new Date().getTime();
    const loginInfo = localStorageService.getItem(appConfig.loginStorageKey);
    if (loginInfo === null || !loginInfo.accessToken) {
      return { ...config, url };
    }

    const { accessToken, tokenType } = loginInfo;
    config.headers['Authorization'] = `${tokenType} ${accessToken}`;
    const decodedToken = jwtDecode(accessToken);

    // console.log("diff", (currentTime - (decodedToken.exp * 1000)) / 1000)
    if (
      requestConfig.isRefresh &&
      decodedToken &&
      decodedToken.exp &&
      decodedToken.exp * 1000 <= currentTime
    ) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshToken();
        try {
          const response = await refreshTokenPromise;
          if (response.ok) {
            const { token: newAccessToken, type: newTokenType } = response.data;
            loginInfo.accessToken = newAccessToken;
            config.headers['Authorization'] = `${newTokenType} ${newAccessToken}`;
            localStorageService.sync(appConfig.loginStorageKey, loginInfo);
          } else {
            console.log('ok', response.message);
            this.throwAuthError();
          }
        } catch (error) {
          console.log('error', error);
          this.throwAuthError();
        } finally {
          refreshTokenPromise = null;
        }
      }
    }
    // console.log("re4")
    return { ...config, url };
  },
  baseResponseInterceptor(response: AxiosResponse): AxiosResponse {
    const responseData = response.data as ResponseStructure;
    responseData.ok = false;
    responseData.message = responseData?.msg ?? '';

    if (responseData?.msg) {
      delete (responseData as { msg?: string }).msg;
    }

    if (responseData.code !== 0) {
      responseData.data = {};
      if (responseData.code === 1403) {
        this.throwAuthError();
      }
    } else {
      responseData.ok = true;
    }

    return {
      ...response,
      data: responseData,
    };
  },
  errorThrowerHandle(res: any) {
    const { code } = res as unknown as ResponseStructure;
    if (code && code > 0 && 1403 === res.data.code) {
      logoutHandle();
      return;
    }
  },
  errorHandle(error: any, opts: any) {
    if (opts?.skipErrorHandler) throw error;
    if (error.name === 'AxiosError') {
      if (error?.response && 422 === error.response.status) {
        message.error(error.response.message).then((r) => console.log('errorHandler:r:', r));
        logoutHandle();
        return;
      }
    }

    if (error.name === 'AuthError') {
      logoutHandle();
      return;
    }

    if (error.name === 'HttpError') {
      const errorInfo: ResponseStructure | undefined = error.info;
      if (errorInfo) {
        const { msg } = errorInfo;
        message.error(`HttpError:${msg}`).then((r) => console.log(r));
      }
    } else if (error.response) {
      message.error('Response Error.').then((r) => console.log(r));
    } else if (error.request) {
      message.error('None response! Please retry.').then((r) => console.log(r));
    } else {
      message.error('Request error, please retry.').then((r) => console.log(r));
    }
  },
  throwAuthError(status = 422) {
    const error = new Error('Validation failed') as any;
    error.name = 'AuthError';
    error.response = {
      status,
      message: 'Unprocessable Entity',
    };

    throw error;
  },
};

export default httpHandle;
