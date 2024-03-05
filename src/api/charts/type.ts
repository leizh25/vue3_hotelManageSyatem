import { Response } from '../stay/type'

/**
 * 获取评论比图表数据接口
 */
export interface CommentChartDataResponse extends Response {
  data: CommentChartData[]
}

/**
 * 获取评论比图表数据
 */
export interface CommentChartData {
  average_star_count: number
  hotel_name: string
}
