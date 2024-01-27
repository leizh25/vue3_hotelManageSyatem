/**
 * 评价管理
 */
import request from '@/utils/request'
import { AllCommentsResponse } from './type'
import { Response } from '../stay/type'

enum API {
  COMMENT = '/evaluations',
  COMMENTBYCUSTOMERID = '/evaluations/customerId_',
  COMMENTBYHOTELID = '/evaluations/hotelId_',
}

/**
 * 获取所有评价
 * @param page 页码
 * @param pageSize 数量
 * @returns
 */
export const reqAllComments = (page: number, pageSize: number) =>
  request.get<any, AllCommentsResponse>(API.COMMENT + `?page=${page}&pageSize=${pageSize}`)

/**
 * 根据顾客ID或酒店id获取评价
 * @param customerId 用户id
 * @param page 页码
 * @param pageSize 数量
 * @returns
 */
export const reqCommentByCustomerIdOrHotelId = (type: string, id: number, page: number, pageSize: number) =>
  request.get<any, AllCommentsResponse>(API.COMMENT + '/' + type + '_' + id + `?page=${page}&pageSize=${pageSize}`)

/**
 * 根据id删除评价
 * @param id 评价id
 * @returns
 */
export const reqDeleteCommentById = (id: number[]) => request.delete<any, Response>(API.COMMENT + '?evaluationIds=' + id.join(','))

/**
 * 添加评价
 * @param comment 评价
 * @returns
 */
export const reqAddOrUpdateComment = (comment: Comment) => request.put<any, Response>(API.COMMENT, comment)
