import { Outlet, Navigate } from 'umi';
import React from "react";
import {localStorageService} from "@/utils/local-storage-service";
import {appConfig} from "@/config/app-config";

const AuthWrapper: React.FC = () => {
  const userInfo = localStorageService.getItem(appConfig.loginStorageKey);
  if (userInfo && userInfo.currentUser) {
    return <Navigate to="/" />;
  }

  localStorageService.clear();
  return <Outlet />;
};

export default AuthWrapper;
