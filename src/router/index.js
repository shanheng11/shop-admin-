import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/Login'
import index from '@/pages/Index'
import layout from '@/pages/Layout'
// import menu from '@/pages/Menu'
const menu = ()=>import('@/pages/Menu')
const role = ()=>import('@/pages/Role')
const user = ()=>import('@/pages/User')
const cate = ()=>import('@/pages/Cate')
const specs = ()=>import('@/pages/Specs')
const goods = ()=>import('@/pages/Goods')

Vue.use(Router)
const router =  new Router({
  routes: [
    {
      path:'/login',
      component:login
    },
    {
      path: '/',
      component: layout,
      children:[{
        path:'index',
        component:index
      },{
        path:'role',
        component:role
      },{
        path:'user',
        component:user
      },{
        path:'goods',
        component:goods
      },{
        path:'category',
        component:cate
      },
      {
        path:'specs',
        component:specs
      },{
        path:'menu',
        component:menu
      },{
        path:'*',
        redirect:"/index"
      }]
    }
  ]
})
router.beforeEach((to,from,next)=>{
  let token = localStorage.getItem('token')
  if(token){
    if(to.path=='/login'){
      next(false)
    }else{
      next()
    }
  }else{
    if(to.path=='/login'){
      next()
    }else{
      next('/login')
    }
  }
})

export default router