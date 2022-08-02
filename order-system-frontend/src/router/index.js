import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home'),
    children: [
      // -------------------- 个人详情修改 ---------------------------
      {
        path: '/the_staff_detail',
        component: () => import('../views/StaffDetail'),
        meta:{ title: '个人信息'}
      },
      // --------------------- 管理员功能模块 ---------------------------
      {
        path: '/staff_detail',
        component: () => import('../views/admin/staff/StaffDetail'),
        meta:{ title: '员工信息'}
      },
      {
        path: '/manage_staff',
        component: () => import('../views/admin/staff/ManageStaff'),
        meta:{ title: '员工详情'}
      },
      {
        path: '/add_staff',
        component: () => import('../views/admin/staff/AddStaff'),
        meta:{ title: '添加员工'}
      },
      {
        path: '/manage_food',
        component: () => import('../views/admin/food/ManageFood'),
        meta:{ title: '菜品信息'}
      },
      {
        path: '/add_food',
        component: () => import('../views/admin/food/AddFood'),
        meta:{ title: '添加菜品'}
      },
      {
        path: '/food_detail',
        component: () => import('../views/admin/food/FoodDetail'),
        meta:{ title: '菜品详情'}
      },
      {
        path: '/manage_order',
        component: () => import('../views/admin/order/ManageOrder'),
        meta:{ title: '正在进行的订单'}
      },
      {
        path: '/finish_order',
        component: () => import('../views/admin/order/FinishOrder'),
        meta:{ title: '已完成订单'}
      },
      {
        path: '/order_detail',
        component: () => import('../views/admin/order/OrderDetail'),
        meta:{ title: '订单详情'}
      },
      {
        path: '/public_notice',
        component: () => import('../views/admin/PublicNotice'),
        meta:{ title: '发布公告'}
      },
      {
        path: '/history_manage',
        component: () => import('../views/admin/history/HistoryManage'),
        meta:{ title: '销售业绩'}
      },
      {
        path: '/data_statistic',
        component: () => import('../views/admin/history/DataStatistic'),
        meta:{ title: '数据统计'}
      },


      // --------------------- 服务员功能模块 ---------------------------
      // {
      //   path: '/waiter/waiter_notice',
      //   component: () => import('../views/waiter/waiterNotice')
      // },
      // {
      //   path: '/waiter/order',
      //   component: () => import('../views/waiter/Order')
      // },
      // {
      //   path: '/waiter/orders_to_pay',
      //   component: () => import('../views/waiter/OrdersToPay')
      // },
      // {
      //   path: '/waiter/message',
      //   component: () => import('../views/waiter/Message')
      // },
      // {
      //   path: '/waiter/kitchen_message_list',
      //   component: () => import('../views/waiter/kitchenMessageList')
      // },
      // {
      //   path: '/waiter/kitchen_message',
      //   component: () => import('../views/waiter/kitchenMessage')
      // },
      // {
      //   path: '/waiter/dish_list',
      //   component: () => import('../views/waiter/DishList')
      // },
      // {
      //   path: '/waiter/dish_detail',
      //   component: () => import('../views/waiter/DishDetail')
      // },
      // {
      //   path: '/waiter/order_detail',
      //   component: () => import('../views/waiter/OrderDetail')
      // },
      // --------------------- 后厨功能模块 --------------------------
      {
        path: '/kitchen/notice',
        component: () => import('../views/kitchen/Notice'),
        meta:{ title: '所有公告'}
      },
      {
        path: '/kitchen/order_detail1',
        component: () => import('../views/kitchen/OrderDetail1'),
        meta:{ title: '订单详情'}
      },
      {
        path: '/kitchen/order_detail2',
        component: () => import('../views/kitchen/OrderDetail2'),
        meta:{ title: '订单详情'}
      },
      {
        path: '/kitchen/finish_order',
        component: () => import('../views/kitchen/FinishOrder'),
        meta:{ title: '已出餐订单'}
      },
      {
        path: '/kitchen/not_finish_order',
        component: () => import('../views/kitchen/NotFinishOrder'),
        meta:{ title: '未出餐订单'}
      },
      {
        path: '/kitchen/message',
        component: () => import('../views/kitchen/Message'),
        meta:{ title: '通知服务员'}
      },
    ]
  },
  {
    path: '/login',
    component: () => import('../views/LoginPage2'),
    meta:{ title: '智能订餐系统登录'}
  },
  {
    path: '/404',
    component: () => import('../views/404')
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/404'
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// 登录拦截器
router.beforeEach((to, from, next) => {
  // console.log(from.path);   // 离开的路由
  if (to.path === '/404') {
    next();
    return true;
  }
  if (to.path.startsWith('/login')) {
    next();
  } else {
    let userId = localStorage.getItem('userId');
    let userRole = localStorage.getItem("userRole");

    // 登录拦截验证
    // if (userId === null) {
    //   next({
    //     path: '/login'
    //   });
    // } else {
    //   next();
    // }

    // 登录校验
    if (userId === null) {
      next({
        path: '/login'
      });
    } else if (to.path.startsWith("/kitchen") && userRole !== '3') {    // 厨师权限验证
      window.location.href = '/#/404';
      // return false;
    } else if (!to.path.startsWith("/kitchen") && to.path !== '/the_staff_detail' && userRole !== '1') {    // 管理员权限验证
      // return false;
      window.location.href = '/#/404';
    } else {
      next();
    }
  }
});

export default router
