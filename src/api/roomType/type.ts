import { Response } from '../stay/type'

/**
 * 获取所有房间类型接口响应数据类型
 */
export interface AllRoomTypeResponse extends Response {
  data: RoomType[]
}

/**
 * 房间类型
 */
export interface RoomType {
  roomTypeId?: number | string
  typeName?: string
  bedNumber?: number | string
  bedSize?: string
  hotelId?: number | string
  roomPrice?: number | string
  roomSize?: string
  roomSurplus?: number | string
  roomTypeImage?: string
  windows?: number | string
  isFocus?: boolean
}

/**
 * 根据酒店id获取房间类型接口响应数据类型
 */
export interface RoomTypesByHotelIdResponse extends Response {
  data: {
    records: RoomType[]
    total: number
    size: number
    current: number
    pages: number
  }
}
