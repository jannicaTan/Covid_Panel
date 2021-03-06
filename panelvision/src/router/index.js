import Vue from 'vue'
import VueRouter from 'vue-router'
// import SellerPage from '@/view/SellerPage'
// import TrendLine from '@/components/TrendLine'
// import HotPie from '@/components/HotPie'
// import StockPie from '@/components/StockPie'
// import RankLine from '@/components/RankLine'
// import MapChina from '@/components/MapChina'
import ViewPage from '@/view/ViewPage'
Vue.use(VueRouter)

const routes = [
  {
    path: '',
    component: ViewPage
  }
  // {
  //   path: '/sellerpage',
  //   component: SellerPage
  // }
  // {
  //   path: '/trendpage',
  //   component: TrendLine
  // },
  // {
  //   path: '/hotpage',
  //   component: HotPie
  // }
  // {
  //   path: '/stockpage',
  //   component: StockPie
  // },
  // {
  //   path: '/rankpage',
  //   component: RankLine
  // },
  // {
  //   path: '/mappage',
  //   component: MapChina
  // }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})
export default router
