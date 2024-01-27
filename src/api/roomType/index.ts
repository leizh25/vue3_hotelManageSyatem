import request from '@/utils/request'
import type { AllRoomTypeResponse, RoomType, RoomTypesByHotelIdResponse } from './type'
import { Response } from '../stay/type'

enum API {
  ALLROOMTYPE = '/roomType/AllRoomsType',
  ROOMTYPE = '/roomType',
  ROOMTYPESBYID = '/roomType/hotelId_',
}

/**
 * 获取所有房间类型接口
 * @returns
 */
export const reqAllRoomType = () => request.get<any, AllRoomTypeResponse>(API.ALLROOMTYPE)

/**
 * 批量删除房间类型接口
 * @param ids 类型ID集合
 * @returns
 */
export const reqDeleteType = (ids: number[]) => request.delete<any, Response>(API.ROOMTYPE + '?deleteIds=' + ids.join(','))

/**
 * 添加 或 修改 房间类型接口
 * @param data 房间类型数据
 * @returns
 */
export const reqAddOrUpdateType = (data: RoomType) =>
  data.roomTypeId ? request.put<any, Response>(API.ROOMTYPE, data) : request.post<any, Response>(API.ROOMTYPE, data)

/**
 * 根据酒店ID获取房间类型接口
 * @param hotelId 酒店ID
 * @returns
 */
export const reqRoomTypesByHotelId = (hotelId: number, page: number = 1, pageSize: number = 10, roomTypeName: string = '') =>
  request.get<any, RoomTypesByHotelIdResponse>(
    API.ROOMTYPESBYID + hotelId + '?page=' + page + '&pageSize=' + pageSize + '&roomTypeName=' + roomTypeName,
  )
