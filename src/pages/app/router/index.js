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
  },
  {
    path: '/findcase',
    name: '用例管理',
		component: Findcase
  },
	{
	  path: '/gamesetting',
	  name: '游戏配置',
		component : Gamesetting
	},
	{
	  path: '/paramscheck',
	  name: '字段检查',
		component : Paramscheck
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
	},
]

const router = new VueRouter({
	mode:"hash",
  routes
})

export default router

