export interface Response {
  code: number
  msg: string
}

/**
 * 获取所有顾客接口返回数据类型
 */
export interface AllCustomersResponse extends Response {
  data: {
    records: Customer[]
    total: number
    size: number
    current: number
    orders: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}

/**
 * 顾客
 */
export interface Customer {
  customersId?: number
  customersName?: string
  customersPhone?: string
  customersIdCar?: string
}
