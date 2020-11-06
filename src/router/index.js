import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/Login'
import index from '@/pages/Index'
import layout from '@/pages/Layout'
// import menu from '@/pages/Menu'
const menu = () => import('@/pages/Menu')
const role = () => import('@/pages/Role')
const user = () => import('@/pages/User')
const cate = () => import('@/pages/Cate')
const specs = () => import('@/pages/Specs')
const goods = () => import('@/pages/Goods')
import member from '@/pages/Member'
import banner from '@/pages/Banner'
const seckill = () => import('@/pages/Seck')

Vue.use(Router)
const router = new Router({
  routes: [{
      path: '/login',
      component: login
    },
    {
      path: '/',
      component: layout,
      children: [{
          path: 'index',
          component: index
        }, {
          path: 'role',
          component: role
        }, {
          path: 'user',
          component: user
        }, {
          path: 'goods',
          component: goods
        }, {
          path: 'category',
          component: cate
        },
        {
          path: 'specs',
          component: specs
        }, {
          path: 'menu',
          component: menu
        },
        {
          path: 'member',
          component: member
        }, {
          path: 'banner',
          component: banner
        }, {
          path: 'seckill',
          component: seckill
        }, {
          path: '*',
          redirect: "/index"
        }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  // 获取token 来判断是否登录
  let token = localStorage.getItem('token')
  if (token) {
    // 获取后台允许去的路径
    let menus = JSON.parse(localStorage.getItem('info')).menus_url
    let allmenus = [...menus, "/", "/index"]
    // 已登录
    if (to.path == '/login') {
      next(false)
    } else {
      // 已登录的情况并且去其他地方
      // 查看当前目的地址是否是后台允许访问的地址
      let flag = allmenus.find(item => to.path == item)
      // 是就正常跳转，不是就取消导航
      if (flag) {
        next()
      } else {
        next(false)
      }
    }
  } else {
    if (to.path == '/login') {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
