import { Response } from '../stay/type'

/**
 * 获取所有评论接口返回数据类型
 */
export interface AllCommentsResponse extends Response {
  data: {
    records: Comment[]
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 评论
 */
export interface Comment {
  evaluationId?: number
  content?: string
  stars?: string | number
  hotelId?: number
  customersId?: number
  hotelName?: string
  customerName?: string
  createTime?: string | Date
  updateTime?: string | Date
}

/**
 * 获取订单接口返回数据类型
 */
export interface OrderResponse extends Response {
  data: {
    records: Order[]
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 订单
 */
export interface Order {
  orderId?: number
  orderName?: string
  orderPhone?: string
  roomTypeId?: number
  hotelId?: number
  checkInDate?: string
  checkOutDate?: string
  orderState?: string | number
  orderPrice?: number
  createTime?: string
  updateTime?: string
  roomTypeName?: string
  hotelName?: string
  dateRange?: string[]
}

/**
 * 根据订单号获取订单接口返回数据类型
 */
export interface OrderByOrderIdResponse extends Response {
  data: Order
}
