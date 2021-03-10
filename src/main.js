import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import router from "@/router"
import store from '@/store'
import axios from 'axios'

Vue.use(Antd)
Vue.config.productionTip = false
Vue.prototype.$axios = axios

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
