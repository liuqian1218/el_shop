import Vue from 'vue'
import VueRouter from 'vue-router'
var Login = () => import('../components/login.vue')
var Home = () => import('../components/home.vue')

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
    component:Home
  }
 ]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
