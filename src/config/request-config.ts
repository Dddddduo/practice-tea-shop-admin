import { APP_ENV } from "@/constants";

export const requestConfig = {
  baseURL: APP_ENV === 'development' ? 'http://tea-mall-dev.zhuanzhitech.com' : 'http://tea-mall-dev.zhuanzhitech.com',
  timeout: 5000,
  retryTimes: 1,
  baseHeaders: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  isRefresh: true,
} as const;
