import Vue from 'vue'
import Login from './login.vue'
// import router from './router'
import '../../static/js/element.js'
import '../../static/js/setting.js'
import VueResource from 'vue-resource'
Vue.use(VueResource)
Vue.config.productionTip = false

new Vue({
  // router,
  render: h => h(Login)
}).$mount('#system-login')