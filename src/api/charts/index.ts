import request from '@/utils/request'
import { CommentChartDataResponse } from './type'

enum API {
  COMMENTCHARTDATA = '/evaluations/top5HotelByAverageStars/',
}

/**
 * 获取评论比图表数据
 * @param page 页码
 * @returns
 */
export const reqCommentChartData = (page: number) => request.get<any, CommentChartDataResponse>(API.COMMENTCHARTDATA + page)
