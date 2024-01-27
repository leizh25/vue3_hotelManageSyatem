import type { Response } from '@/api/stay/type'

/**
 * 获取所有员工接口返回数据类型
 */
export interface AllEmpsResponse extends Response {
  data: {
    records: Emp[]
    total: number
    size: number
    current: number
    orders: []
    pages: number
  }
}

/**
 * 员工数据类型
 */
export interface Emp {
  empId?: number
  roleId?: number
  empSex?: string
  empPhone?: string
  password?: string
  positions?: string
  empAddress?: string
  empName?: string
  empPhoto?: string
  cnName?: string
  roleDep?: string
}
