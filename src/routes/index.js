import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ManageOrder from '@/views/adminView/ManageOrder.vue'
import Dashboard from '@/views/adminView/Dashboard.vue'
import ManageProduct from '@/views/adminView/ManageProduct.vue'
import ManageCategory from '../views/adminView/ManageCategory.vue'
import ManageSupplier from '../views/adminView/ManageSupplier.vue'
import ManageUser from '@/views/adminView/ManageUser.vue'
import Cart from '@/views/clientView/Cart.vue'
import CategoryView from '@/views/clientView/CategoryView.vue'
import EventView from '@/views/clientView/EventView.vue'
import BestDeal from '@/views/clientView/BestDeal.vue'
import ProductDetails from '@/views/clientView/ProductDetails.vue'
import Profile from '@/views/clientView/Profile.vue'
import HomeView from '@/views/clientView/HomeView.vue'
import Order from '@/views/clientView/Order.vue'
import ManageAdmin from '@/views/adminView/ManageAdmin.vue'
import Settings from '@/views/adminView/Settings.vue'
import ProductsView from '@/views/clientView/ProductsView.vue'
import WishlistView from '@/views/clientView/WishlistView.vue'
import CouponView from '@/views/adminView/CouponView.vue'
import Checkout from '@/views/clientView/Checkout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    return { top: 0, left: 0, behavior: 'smooth' }
  },
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/manageorder',
      name: 'manageorder',
      component: ManageOrder
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/manageproduct',
      name: 'manageproduct',
      component: ManageProduct
    },
    {
      path: '/managecategories',
      name: 'managecategories',
      component: ManageCategory
    },
    {
      path: '/managesupplier',
      name: 'managesupplier',
      component: ManageSupplier
    },
    {
      path: '/manageuser',
      name: 'manageuser',
      component: ManageUser
    },
    {
      path: '/manageadmin',
      name: 'manageadmin',
      component: ManageAdmin
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart,
      props: route =>({
        Cart_data: route.params.Cart_data
      })
    },
    {
      path: '/orders',
      name: 'order',
      component: Order,
      props: route =>({
        order_data: route.params.order_data
      })
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsView
    },
    {
      path: '/category',
      name: 'category',
      component: CategoryView
    },
    {
      path: '/eventview',
      name: 'eventview',
      component: EventView
    },
    {
      path: '/managecoupons',
      name: 'manageCoupons',
      component: CouponView
    },
    {
      path: '/wishlist',
      name: 'wishlist',
      component: WishlistView
    },  
    {
      path: '/pdetails/:id?',
      name: 'pdetails',
      component: ProductDetails,
      props: true
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/new-arrivals',
      name: 'NewArrivals',
      component: EventView
    },
    {
      path: '/checkout',
      name: 'Checkout',
      component: Checkout
    }
  ]
})

export default router