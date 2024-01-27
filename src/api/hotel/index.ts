import request from '@/utils/request'
import { AllHotelsResponse, Response, AddHotelForm } from './type'
enum API {
  HOTELS = '/hotels',
}
/**
 * 获取所有的酒店信息
 * @param addressInfo 信息地址
 * @param city 城市
 * @param hotelName 酒店名称
 * @param hotelPhone 联系方式
 * @param page 第几页
 * @param pageSize 每页数量
 * @returns
 */
export const reqAllHotels = (page?: number, pageSize?: number, addressInfo?: string, city?: string, hotelName?: string, hotelPhone?: string) =>
  request.get<any, AllHotelsResponse>(
    API.HOTELS +
      `?addressInfo=${addressInfo || ''}&city=${city || ''}&hotelName=${hotelName || ''}&hotelPhone=${hotelPhone || ''}&page=${page || 1}&pageSize=${
        pageSize || 10
      }`,
  )

/**
 * 添加/修改 酒店接口
 * @param data 酒店信息
 * @returns
 */
export const reqAddOrUpdateHotel = (data: AddHotelForm) =>
  data.hotelId ? request.put<any, Response>(API.HOTELS, data) : request.post<any, Response>(API.HOTELS, data)

/**
 * 删除酒店接口
 * @param ids 酒店id数据
 * @returns
 */
export const reqDeleteHotel = (ids: number[]) => request.delete<any, Response>(API.HOTELS + `?hotelIds=${ids.join(',')}`)

/**
 * 获取完整的酒店列表接口
 * @returns
 */
export const reqAllHotels2 = async () => {
  const res = await reqAllHotels(1, 10)
  if (res.code === 1) {
    return reqAllHotels(1, res.data.total)
  } else {
    throw new Error('获取酒店信息失败')
  }
}
