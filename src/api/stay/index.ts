import request from '@/utils/request'
import { CheckInResponse, Response } from './type'

enum API {
  CHECKIN = '/checkIn',
  ROOMSINFO = '/rooms/roomTypeId',
  ROOMSTYPE = '/roomType/hotelId_',
}
/**
 * 获取所有的入住信息  接口
 * @param page 第几页
 * @param pageSize 每页数量
 * @param checkInName 查询人名
 * @returns
 */
export const reqGetCheckin = (page: number = 1, pageSize: number = 10, checkInName?: string, hotelEmpId?: number | string) =>
  request.get<any, CheckInResponse>(API.CHECKIN + `?page=${page}&pageSize=${pageSize}&hotelId=${hotelEmpId}&checkInName=${checkInName || ''}`)

/**
 * 删除入住信息  接口
 * @param ids 入住id
 * @returns
 */
export const reqDeleteCheckin = (ids: number[]) => request.delete<any, Response>(API.CHECKIN + `?checkInIds=${ids.join(',')}`)

/**
 * 添加入住信息  接口
 * @param data 入住信息
 * @returns
 */
export const reqAddCheckin = (data: any) => request.post<any, Response>(API.CHECKIN, data)
