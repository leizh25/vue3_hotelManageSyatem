//统一管理项目用户相关的接口

import request from '@/utils/request'
import type { UpdatePasswordForm, loginForm, loginResponseData, userResponseData } from './type'
import { Response } from '../stay/type'
//统一管理接口
enum API {
  LOGIN_URL = '/emps/login',
  USERINFO_URL = '/emps/EmpInfo',
  LOGOUT_URL = '/emps/logout',
  UPDATE_PASSWORD = '/emps/updatePassword',
}

//对外暴露请求函数
//登录的接口方法
export const reqLogin = (data: loginForm) => request.post<any, loginResponseData>(API.LOGIN_URL, data)

//获取用户信息接口方法
export const reqUserInfo = () => request.get<any, userResponseData>(API.USERINFO_URL)

/**
 * 退出登录接口
 * @returns
 */
export const reqLogout = () => request.post<any, Response>(API.LOGOUT_URL)

/**
 * 修改密码接口
 * @param data 数据
 * @returns
 */
export const reqUpdatePassword = (data: UpdatePasswordForm) => request.put<any, Response>(API.UPDATE_PASSWORD, data)
