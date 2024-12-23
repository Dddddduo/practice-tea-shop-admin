import {localStorageService} from "@/utils/local-storage-service";
import {history} from "@umijs/max";
import {appConfig} from "@/config/app-config";

const loginPath = appConfig.loginPath;
const homePath = appConfig.homePath;

// 在登录成功后处理重定向
const handleRedirect = (redirectUrl: string) => {
  // 移除可能重复的 '/admin' 路径
  const cleanRedirectUrl = redirectUrl.replace(/^\/admin/, '');
  console.log(cleanRedirectUrl);
  history.replace(cleanRedirectUrl);
};

export const logoutHandle = (saveRedirect = false) => {
  let path;
  localStorageService.clear();
  const {location} = history;
  if (saveRedirect) {
    history.replace(loginPath);
    return;
  }

  if (location.pathname !== loginPath) {
    path = location.pathname
    history.replace(`${loginPath}?redirect=${path}`);
  }

  return;
}



export const loginHandle = (data) => {
  const urlParams = new URL(window.location.href).searchParams;
  let path = urlParams.get('redirect') || homePath;
  localStorageService.setItem(appConfig.loginStorageKey, data);
  // history.replace(path);
  handleRedirect(path);
  return;
}

export const loginAndToHome = () => {

}
