import Vue from 'vue'
import VueRouter from 'vue-router'
import SellerPage from '@/view/SellerPage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/sellerpage',
    component: SellerPage
  }
]

const router = new VueRouter({
  routes
})

export default router
