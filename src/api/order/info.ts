/**
 * 订单管理
 */
import request from '@/utils/request'
import { Order, OrderByOrderIdResponse, OrderResponse } from './type'
import { Response } from '../stay/type'

enum API {
  ORDER = '/order',
}

/**
 * 获取所有订单接口
 * @param page 第几页
 * @param pageSize 每页数量
 * @param orderName 订单名称
 * @returns
 */
export const reqAllOrders = (page: number, pageSize: number, orderName: string) =>
  request.get<any, OrderResponse>(API.ORDER + `?page=${page}&pageSize=${pageSize}&orderName=${orderName || ''}`)

/**
 * 删除订单接口
 * @param orderIds 订单id数组
 * @returns
 */
export const reqDeleteOrder = (orderIds: number[]) => request.delete<any, Response>(API.ORDER + `?orderIds=${orderIds.join(',')}`)

/**
 * 根据订单ID查询订单接口
 * @param id 订单id
 * @returns
 */
export const reqOrderByOrderId = (id: number) => request.get<any, OrderByOrderIdResponse>(API.ORDER + `/${id}`)

/**
 * 添加或修改订单接口
 * @param order 订单信息
 * @returns
 */
export const reqAddOrUpdateOrder = (order: Order) => {
  if (order.orderId) {
    return request.put<any, Response>(API.ORDER, order)
  } else {
    return request.post<any, Response>(API.ORDER, order)
  }
}
