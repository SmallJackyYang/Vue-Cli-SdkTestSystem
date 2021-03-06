import Vue from 'vue'
import Login from './login.vue'
import '../../static/js/element.js'
import VueResource from 'vue-resource'
Vue.use(VueResource)
Vue.config.productionTip = false

new Vue({
  // router,
  render: h => h(Login)
}).$mount('#system-login')