import request from '@/utils/request'
import { AllRoomsResponse, Room, RoomByIdResponse } from './type'
import type { Response } from '@/api/stay/type'
enum API {
  ALLROOMS = '/rooms/allRooms',
  ROOM = '/rooms',
  ROOMBYID = '/rooms/roomId/',
}

/**
 * 获取所有放房间接口
 * @returns
 */
export const reqAllRooms = (page: number, pageSize: number, roomNumber?: string, roomTypeId?: number) =>
  request.get<any, AllRoomsResponse>(
    API.ALLROOMS + `?page=${page}&pageSize=${pageSize}&roomNumber=${roomNumber || ''}&roomTypeId=${roomTypeId || ''}`,
  )

/**
 * 添加或修改房间接口
 * @param room 房间信息
 * @returns
 */
export const reqAddOrUpdateRoom = (room: Room) =>
  room.roomId ? request.put<any, Response>(API.ROOM, room) : request.post<any, Response>(API.ROOM, room)

/**
 * 删除房间接口
 * @param ids 房间ID集合
 * @returns
 */
export const reqDelRooms = (ids: number[]) => request.delete<any, Response>(API.ROOM + `?roomIds=${ids.join(',')}`)

/**
 * 根据ID获取房间信息接口
 * @param id 房间ID
 * @returns
 */
export const reqRoomById = (id: string) => request.get<any, RoomByIdResponse>(API.ROOMBYID + `${id}`)
