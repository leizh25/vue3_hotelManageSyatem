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
