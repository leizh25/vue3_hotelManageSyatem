//路由鉴权:鉴权:项目当中路由能不能被访问的权限的设置(某一个路由什么条件下不能访问)
import router from './router'
import nprogress from 'nprogress'
nprogress.configure({ showSpinner: false })
//获取用户相关的小仓库内部token数据, 去判断用户是否登录成功
import useUserStore from './store/modules/user'
import pinia from './store'
import setting from './setting'
const userStore = useUserStore(pinia)

//全局前置守卫:  项目当中任意路由切换都会触发的钩子
router.beforeEach(async (to: any, _from: any, next: any) => {
  document.title = setting.title + '-' + to.meta.title
  //访问某一个路由之前的守卫
  //to: 将要访问那个路由
  //from: 从哪个路由而来
  //next: 路由的放行函数
  nprogress.start()
  //获取token,去判断用户是登录还是未登录
  const token = userStore.token
  //获取用户名字
  const userName = userStore.userName
  //用户登录判断
  if (token) {
    //登录成功,访问login,指向首页
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      //登录成功,访问其余6个路由(登录排除)
      //有用户信息
      if (userName) {
        next()
      } else {
        //没有用户信息,在守卫这里获取到了用户信息再放行
        try {
          await userStore.userInfo()
          next()
        } catch (error) {
          //token过期: 获取不到用户的信息了  或 用户手动修改了本地存储
          //退出登录 -> 用户相关的数据清空
          userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    //用户未登录的判断
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

//全局后置守卫
router.afterEach(() => {
  nprogress.done()
})

//第一个问题: 任意路由切换实现进度条业务  --nprogress
//第二个问题:路由鉴权(路由组件访问权限的设置)
//全部路由组件:登录|404|任意路由|首页|数据大屏|权限管理(三个子路由)|商品管理(四个子路由)

//用户未登录:可以访问login,其余的6个路由不能访问(跳转到login)
//用户登录成功:不可以访问login(跳转到首页),其余的路由可以访问
