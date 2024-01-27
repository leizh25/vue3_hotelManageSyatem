//创建用户相关的小仓库
import { defineStore } from 'pinia'
//引入接口
import { reqLogin, reqLogout, reqUserInfo } from '@/api/user'
//引入数据类型
import type { loginForm, loginResponseData } from '@/api/user/type'
import { UserState } from './types/type'
//引入操作本地存储的工具方法
import { GET_TOKEN, SET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
//引入路由(常量路由)
import { constantRoutes } from '@/router/routes'
//创建用户小仓库
const useUserStore = defineStore('User', {
  //小仓库存储数据的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(), //用户的唯一标识token
      menuRoutes: constantRoutes, //仓库存储生成菜单需要的数组(路由)
      userName: '',
      avatar: '',
      empId: 0,
    }
  },
  //处理异步或者逻辑的地方
  actions: {
    //用户登录的方法
    async userLogin(data: loginForm) {
      const res: loginResponseData = await reqLogin(data)
      // console.log('res: ', res);
      //登录请求成功200 ->token
      //登录请求失败201 ->登录失败错误信息
      if (res.code == 1) {
        //pinia仓库存储token
        //由于pinia或者vuex存储数据其实就是利用js对象
        this.token = res.map.JWT
        this.userName = res.data.empName
        this.avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
        this.empId = res.data.empId
        //本地存储持久化存储一份
        SET_TOKEN(res.map.JWT)
        //能保证当前async函数返回一个成功的promise
        return 'ok'
      } else {
        return Promise.reject(new Error(res.msg))
      }
    },
    //获取用户信息的方法
    async userInfo() {
      //获取用户信息存储仓库当中[用户头像,名字]
      const res = await reqUserInfo()
      //如果获取用户信息成功,存储一下用户信息
      if (res.code == 1) {
        this.userName = res.data.empName
        this.avatar = res.data.empPhoto
        return 'ok'
      } else {
        return Promise.reject('获取用户信息失败')
      }
    },
    //退出登录
    userLogout() {
      //目前没有mock接口:退出登录接口(通知服务器本地用户唯一标识失效)
      this.token = ''
      this.userName = ''
      this.avatar = ''
      REMOVE_TOKEN()
      reqLogout()
    },
  },
  //计算属性
  getters: {},
})
//对外暴露获取小仓库的方法
export default useUserStore
