import request from '@/utils/request'
import { CheckInResponse, Response } from './type'

enum API {
  CHECKIN = '/checkIn',
  ROOMSINFO = '/rooms/roomTypeId',
  ROOMSTYPE = '/roomType/hotelId_',
}
// ================================= 入住管理 =======================================
/**
 * 获取所有的入住信息  接口
 * @param page 第几页
 * @param pageSize 每页数量
 * @param checkInName 查询人名
 * @returns
 */
export const reqGetCheckin = (page: number = 1, pageSize: number = 10, checkInName?: string) =>
  request.get<any, CheckInResponse>(API.CHECKIN + `?page=${page}&pageSize=${pageSize}&checkInName=${checkInName || ''}`)

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

// ============================================ 房间信息 ===========================================

/**
 * 根据酒店id分页查询酒店所有房间类型
 * @param hotelId 酒店id
 * @param page 第几页
 * @param pageSize 每页条数
 * @param roomTypeName 房间类型名称
 * @returns
 */
// export const reqAllRoomsType = (hotelId: number, page: number, pageSize: number, roomTypeName?: string) => request.get<any, AllRoomsResponse>(API.ROOMSTYPE + hotelId + '?roomTypeName=' + roomTypeName + '&page=' + page + '&pageSize=' + pageSize)

/**
 * 根据酒店id分页查询酒店所有房间类型
 * @param roomTypeId 房间类型id
 * @returns
 */
// export const reqALlRoomsInfo = (roomTypeId: number) => request.get<any, AllRoomTypeResponse>(API.ROOMSINFO + `?roomTypeId=${roomTypeId}`)
