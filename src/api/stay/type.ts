export interface Response {
  code?: number
  msg?: string
}

/**
 * 获取所有的入住信息接口  返回数据类型
 */
export interface CheckInResponse extends Response {
  data: {
    records: CheckInRecord[]
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: true
    pages: number
  }
}

/**
 * 入住信息
 */
export interface CheckInRecord {
  checkInId: number
  checkInNumber: number
  orderId: number
  roomNumber: number
  checkInName: number
}

/**
 * 获取所有的房间信息接口  返回数据类型
 */
// export interface AllRoomTypeResponse extends Response {
//     data: {
//         records: Room[],
//         total: number,
//         size: number,
//         current: number,
//         orders: [],
//         optimizeCountSql: true,
//         hitCount: false,
//         countId: null,
//         maxLimit: null,
//         searchCount: true,
//         pages: number
//     }
// }
/**
 * 房间信息
 */
// export interface RoomType {
//     roomTypeId: number,
//     typeName: string,
//     roomPrice: number,
//     bedSize: string,
//     roomSize: string,
//     roomTypeImage: null,
//     bedNumber: number,
//     windows: number,
//     roomSurplus: number,
//     hotelId: number,
//     hotelName: string
// }

/**
 * 获取所有的房间类型信息接口  返回数据类型
 */
// export interface AllRoomsResponse extends Response {
//     data: {
//         records: RoomType[],
//         total: number,
//         size: number,
//         current: number,
//         orders: [],
//         optimizeCountSql: true,
//         hitCount: false,
//         countId: null,
//         maxLimit: null,
//         searchCount: true,
//         pages: number
//     }
// }
/**
 * 房间类型信息
 */
// export interface Room {
//     roomId: number,
//     roomTypeId: number,
//     roomState: string,
//     roomNumber: string,
//     empId: number,
//     typeName: string,
//     empName: string,
//     roomTypeImage: null
// }
