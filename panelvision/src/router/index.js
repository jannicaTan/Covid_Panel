import Vue from 'vue'
import VueRouter from 'vue-router'
import SellerPage from '@/view/SellerPage'
import TrendLine from '@/components/TrendLine'

Vue.use(VueRouter)

const routes = [
  {
    path: '/sellerpage',
    component: SellerPage
  },
  {
    path: '/trendpage',
    component: TrendLine
  }
]

const router = new VueRouter({
  routes
})

export default router
