import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const Upcase = () =>import("../views/upcase.vue")
const Findcase = () =>import("../views/findcase.vue")
const Gamesetting = () =>import("../views/gamesetting.vue")
const Paramscheck = () =>import("../views/paramscheck.vue")
const Redis = () =>import("../views/redis.vue")
const Userdetail = () =>import("../views/userdetail.vue")

const routes = [
  {
    path: '/upcase',
    name: '上传用例',
		component: Upcase
    // component: resolve => require(['../views/upcase.vue'],resolve)
  },
  {
    path: '/findcase',
    name: '用例管理',
		component: Findcase
    // component: resolve => require(['../views/findcase.vue'],resolve)
  },
	{
	  path: '/gamesetting',
	  name: '游戏配置',
		component : Gamesetting
	  // component: resolve => require(['../views/gamesetting.vue'],resolve)
	},
	{
	  path: '/paramscheck',
	  name: '字段检查',
		component : Paramscheck
	  // component: resolve => require(['../views/paramscheck.vue'],resolve)
	},
	{
	  path: '/redis',
	  name: 'redis操作',
		component : Redis
	  // component: resolve => require(['../views/redis.vue'],resolve)
	},
	{
	  path: '/userdetail',
	  name: '用户中心',
		component : Userdetail
	  // component: resolve => require(['../views/userdetail.vue'],resolve)
	},
]

const router = new VueRouter({
	mode:"hash",
  routes
})

export default router

