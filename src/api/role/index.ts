import request from '@/utils/request'
import { AllRolesResponse, Role, RoleByIdResponse } from './type'
import { Response } from '../stay/type'

enum API {
  ROLES = '/roles',
}

/**
 * 获取角色列表接口
 * @param page 第几页
 * @param pageSize 每页数量
 * @param name 姓名
 * @returns
 */
export const reqRoles = (page: number, pageSize: number, name?: string) =>
  request.get<any, AllRolesResponse>(API.ROLES + `?page=${page}&pageSize=${pageSize}&name=${name || ''}`)

/**
 * 获取所有角色列表接口
 * @returns
 */
export const reqAllRoles = async () => {
  try {
    const res: AllRolesResponse = await reqRoles(1, 10)
    if (res.code === 1) {
      return reqRoles(1, res.data?.total)
    } else {
      throw new Error('获取角色列表失败')
    }
  } catch (error) {
    return Promise.reject((error as Error).message)
  }
}

/**
 * 修改角色信息接口
 * @param data 角色数据
 * @returns
 */
export const reqUpdateRole = (data: Role) => request.put<any, Response>(API.ROLES, data)

/**
 * 根据ID获取角色信息接口
 * @param id 角色id
 * @returns
 */
export const reqRoleById = (id: number) => request.get<any, RoleByIdResponse>(API.ROLES + `/roleId=${id}`)

/**
 * 批量删除角色接口
 * @param ids 角色id
 * @returns
 */
export const reqDeleteRoles = (ids: number[]) => request.delete<any, Response>(API.ROLES + `?roleIds=${ids.join(',')}`)

/**
 * 添加角色接口
 * @param roleDep 角色信息
 * @returns
 */
export const reqAddRole = (data: { roleDep: string }) => request.post<any, Response>(API.ROLES, data)
