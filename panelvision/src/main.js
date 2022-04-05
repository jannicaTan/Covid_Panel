import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入全局css
import './assets/css/global.css'
import 'element-ui/lib/theme-chalk/index.css'
import SocketService from './utils/socket_service'
import axios from 'axios'
// 设置axios的baseURL
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/'
// 将axios挂载到Vue的原型对象上,在别的组件中使用：this.$http
Vue.prototype.$http = axios

// 连接WebSocket并挂载到原型上
SocketService.Instance.connect()
Vue.prototype.$socket = SocketService.Instance

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
