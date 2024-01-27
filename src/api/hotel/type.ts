export interface Response {
  code?: number
  msg?: string
}
/**
 * 获取所有的酒店信息接口  返回数据类型
 */
export interface AllHotelsResponse extends Response {
  data: {
    records: Hotel[]
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: true
    hitCount: false
    countId: null
    maxLimit: null
    searchCount: true
    pages: number
  }
}
/**
 * 酒店信息
 */
export interface Hotel {
  hotelId: number
  hotelName: string
  city: string
  addressInfo: string
  hotelPhone: string
  hotelDescription: string
  hotelState: number
}

/**
 * 添加酒店信息表单
 */
export interface AddHotelForm {
  hotelId?: number
  addressInfo?: string
  city?: string
  hotelDescription?: string
  hotelName?: string
  hotelPhone?: string
  hotelState: 0 | 1
}
