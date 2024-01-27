import request from '@/utils/request'
import type { AllCustomersResponse, Response, Customer } from './type'

enum API {
  CUSTOMERS = '/customers',
}

/**
 * 获取所有的顾客信息
 * @param page 第几页
 * @param pageSize 每页数量
 * @param customersName 名字
 * @returns
 */
export const reqAllCustomers = (page?: number, pageSize?: number, customersName?: string) =>
  request.get<any, AllCustomersResponse>(API.CUSTOMERS + `?customersName=${customersName || ''}&page=${page || 1}&pageSize=${pageSize || 10}`)

/**
 * 批量删除顾客
 * @param ids id数组
 * @returns
 */
export const reqDeleteCustomer = (ids: number[]) => request.delete<any, Response>(API.CUSTOMERS + `?customersIds=${ids.join(',')}`)

/**
 * 添加或更新顾客
 * @param customer 顾客信息
 * @returns
 */
export const reqAddOrUpdateCustomer = (customer: Customer) => request.put<any, Response>(API.CUSTOMERS, customer)
