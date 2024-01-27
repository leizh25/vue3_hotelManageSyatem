import { Response } from '../stay/type'

/**
 * 获取所有房间接口返回数据类型
 */
export interface AllRoomsResponse extends Response {
  data: {
    records: Room[]
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 房间数据类型
 */
export interface Room {
  roomId?: number
  roomTypeId?: number
  roomState?: string
  roomNumber?: string
  // "empName"?: string,
  typeName?: string
  roomTypeImage?: null
}

/**
 * 根据id获取房间数据类型
 **/
export interface RoomByIdResponse extends Response {
  data: Room
}
