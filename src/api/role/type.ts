import type { Response } from '../stay/type'

/**
 *
 * 获取角色列表接口返回数据类型
 */
export interface AllRolesResponse extends Response {
  data: {
    records: Role[]
    total: number
    size: number
    current: number
    pages: number
  }
}

/**
 * 角色
 */
export interface Role {
  roleId: number
  roleDep: string
  isFocus?: boolean
}

/**
 * 根据角色id获取角色信息接口返回数据类型
 */
export interface RoleByIdResponse extends Response {
  data: Role
}
