import type { RequestOptions } from '@@/plugin-request/request';
import httpHandle from '@/utils/http-handle';
import { AxiosResponse } from 'axios';

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: {
  responseInterceptors: ((response: any) => AxiosResponse<any, any>)[];
  requestInterceptors: ((config: RequestOptions) => RequestOptions)[];
  errorConfig: { errorThrower: (res: any) => void; errorHandler: (error: any, opts: any) => void };
} = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => httpHandle.errorThrowerHandle(res),
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => httpHandle.errorHandle(error, opts),
  },

  // 请求拦截器
  requestInterceptors: [(config: RequestOptions) => httpHandle.baseRequestInterceptor(config)],

  // 响应拦截器
  responseInterceptors: [(response) => httpHandle.baseResponseInterceptor(response)],
};
