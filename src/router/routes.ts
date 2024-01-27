//对外暴露配置路由 (常量路由)
export const constantRoutes = [
  {
    //登录路由
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'login', //明明路由
    meta: {
      title: '登录', //菜单标题
      hidden: true, //路由标题在菜单中是否隐藏,  true:隐藏   false不隐藏
      icon: 'Promotion', //菜单文字左侧的图标, 支持element-plus全部图标
    },
  },
  {
    //登录成功以后战术数据的路由
    path: '/',
    component: () => import('@/layout/Layout.vue'),
    name: 'layout',
    redirect: '/home',
    meta: {
      title: '', //不写title和icon, 防止展示首页时在面包屑组件多出layout面包屑
      icon: '',
    },
    children: [
      {
        path: '/home',
        component: () => import('@/views/Home/Home.vue'),
        meta: {
          title: '首页',
          icon: 'HomeFilled',
        },
      },
    ],
  },
  {
    path: '/stay',
    component: () => import('@/layout/Layout.vue'),
    name: 'Stay',
    meta: {
      title: '入住管理',
      icon: 'Location',
    },
    redirect: '/stay/info',
    children: [
      {
        path: '/stay/info',
        component: () => import('@/views/Stay/Info/Info.vue'),
        name: 'StayInfo',
        meta: {
          title: '入住信息',
          icon: 'User',
        },
      },
      {
        path: '/stay/roominfo',
        component: () => import('@/views/Stay/RoomInfo/RoomInfo.vue'),
        name: 'RoomInfo',
        meta: {
          title: '房间信息',
          icon: 'House',
        },
      },
      {
        path: '/stay/roomtype',
        component: () => import('@/views/Stay/RoomType/RoomType.vue'),
        name: 'RoomType',
        meta: {
          title: '房间类型',
          icon: 'Crop',
        },
      },
    ],
  },
  {
    path: '/order',
    component: () => import('@/layout/Layout.vue'),
    name: 'Order',
    meta: {
      title: '订单管理',
      icon: 'DocumentChecked',
    },
    redirect: '/order/info',
    children: [
      {
        path: '/order/info',
        component: () => import('@/views/Order/Info/Info.vue'),
        name: 'OrderInfo',
        meta: {
          title: '订单信息',
          icon: 'Postcard',
        },
      },
      {
        path: '/order/comment',
        component: () => import('@/views/Order/Comment/Comment.vue'),
        name: 'Comment',
        meta: {
          title: '评价信息',
          icon: 'Comment',
        },
      },
    ],
  },
  {
    path: '/emp',
    component: () => import('@/layout/Layout.vue'),
    name: 'Emp',
    meta: {
      title: '员工管理',
      icon: 'Lock',
    },
    redirect: '/emp/info',
    children: [
      {
        path: '/emp/info',
        component: () => import('@/views/Emp/Info/Info.vue'),
        name: 'Info',
        meta: {
          title: '员工信息',
          icon: 'User',
        },
      },
      {
        path: '/emp/role',
        component: () => import('@/views/Emp/Role/Role.vue'),
        name: 'Role',
        meta: {
          title: '角色信息',
          icon: 'Star',
        },
      },
    ],
  },
  {
    path: '/customer',
    component: () => import('@/layout/Layout.vue'),
    name: 'customer',
    redirect: '/customer/',
    meta: {
      title: '', //不写title和icon, 防止展示首页时在面包屑组件多出layout面包屑
      icon: '',
    },
    children: [
      {
        path: '/customer/',
        component: () => import('@/views/Customer/Customer.vue'),
        meta: {
          title: '顾客管理',
          icon: 'Coin',
        },
      },
    ],
  },
  {
    path: '/hotel',
    component: () => import('@/layout/Layout.vue'),
    name: 'hotel',
    redirect: '/hotle/',
    meta: {
      title: '', //不写title和icon, 防止展示首页时在面包屑组件多出layout面包屑
      icon: '',
    },
    children: [
      {
        path: '/hotle/',
        component: () => import('@/views/Hotel/Hotel.vue'),
        meta: {
          title: '酒店管理',
          icon: 'Dish',
        },
      },
    ],
  },

  {
    //404
    path: '/404',
    component: () => import('@/views/404/404.vue'),
    name: '404',
    meta: {
      title: '404',
      hidden: true,
      icon: 'DocumentDelete',
    },
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'any',
    meta: {
      title: '任意路由',
      hidden: true,
      icon: 'DataLine',
    },
  },
]
