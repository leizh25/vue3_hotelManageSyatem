import request from '@/utils/request'
import type { AllEmpsResponse, Emp } from './type'
import { Response } from '../stay/type'

enum API {
  EMP = '/emps',
}

/**
 * 获取所有员工信息接口   查找员工接口
 * @returns
 */
export const reqAllEmps = (page: number, pageSize: number, empName?: string) =>
  request.get<any, AllEmpsResponse>(API.EMP + `?page=${page}&pageSize=${pageSize}&empName=${empName}`)

/**
 * 批量删除员工接口
 * @param id 员工id
 * @returns
 */
export const reqDelRmps = (ids: number[]) => request.delete<any, Response>(API.EMP + `?empIds=${ids.join(',')}`)

/**
 * 添加 或 修改员工信息接口
 * @param data 员工信息
 * @returns
 */
export const reqAddOrUpdateEmp = (data: Emp) => (data.empId ? request.put<any, Response>(API.EMP, data) : request.post<any, Response>(API.EMP, data))
