import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入全局css
import './assets/css/global.css'
import 'element-ui/lib/theme-chalk/index.css'

import axios from 'axios'
// 设置axios的baseURL
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/'
// 将axios挂载到Vue的原型对象上,在别的组件中使用：this.$http
Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.use(ElementUI)

// 将全局的echarts对象挂载到Vue的原型对象上
// 别的组件中使用的话就直接用：this.$echarts
Vue.prototype.$echarts = window.echarts
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
