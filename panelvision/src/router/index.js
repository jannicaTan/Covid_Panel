import Vue from 'vue'
import VueRouter from 'vue-router'
import SellerPage from '@/view/SellerPage'
import TrendLine from '@/components/TrendLine'
import HotPie from '@/components/HotPie'
import StockPie from '@/components/StockPie'
Vue.use(VueRouter)

const routes = [
  {
    path: '/sellerpage',
    component: SellerPage
  },
  {
    path: '/trendpage',
    component: TrendLine
  },
  {
    path: '/hotpage',
    component: HotPie
  },
  {
    path: '/stockpage',
    component: StockPie
  }
]

const router = new VueRouter({
  routes
})

export default router
