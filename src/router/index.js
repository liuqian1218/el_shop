import Vue from 'vue'
import VueRouter from 'vue-router'

var Login = () => import('../components/login.vue')
var Home = () => import('../components/home.vue')
var Welcome = () => import('../components/main/Welcom.vue')

var UserList = () => import('../components/main/User/UserList/userLsit.vue')
var RoleList = () => import("../components/main/Role/RoleList.vue")
var AuthorList = () => import('../components/main/Role/AuthorList.vue')
var GoodsList = () => import('../components/main/Goods/GoodsList.vue')
var CateParam = () => import('../components/main/Goods/cateParam.vue')
var GoodsCate = () => import('../components/main/Goods/GoodsCate.vue')
var OrderList = () => import('../components/main/order/OrderList.vue')
var ReportForm = () => import('../components/main/report/ReportForm.vue')
Vue.use(VueRouter)

const routes = [
  {
    path:"/",
    redirect:"/login"
  },
  {
    path:"/login",
    component:Login
  },
  {
    path:"/home",
    component:Home,
    redirect:"/welcome",
    children:[
      {
        path:"/welcome",
        component:Welcome
      },
      {
        path:"/110",
        component:UserList
      },
      {
        path:'/111',
        component:RoleList
      },
      {
        path:'/112',
        component:AuthorList
      },
      {
        path:'/104',
        component:GoodsList
      },
      {
        path:'/115',
        component:CateParam
      },
      {
        path:'/121',
        component:GoodsCate
      },
      {
        path:'/107',
        component:OrderList
      },
      {
        path:'/146',
        component:ReportForm
      }
    ]
  }
 ]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//挂载导航守卫
router.beforeEach((to,from,next) => {
  if(to.path === "/login"){
    return next();
  }
  const tokenStr = window.sessionStorage.getItem("token")
  if(!tokenStr){
    return next("/login")
  }
  next();
})

export default router
