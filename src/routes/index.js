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
import ProductDetails from '@/views/clientView/ProductDetails.vue'
import Profile from '@/views/clientView/Profile.vue'
import HomeView from '@/views/clientView/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
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
      path: '/product/category',
      name: 'categorymanagement',
      component: ManageCategory 
    },
    {
      path: '/product/supplier',
      name: 'suppliermanagement',
      component: ManageSupplier 
    },
    {
      path: '/manageuser',
      name: 'manageuser',
      component: ManageUser
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart,
      prop: route =>({
        Cart_data: route.params.Cart_data
      })
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
      path:'/pdetails',
      name:'pdetails',
      component: ProductDetails
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/home',
      name: 'home',
      component:HomeView
    }
  ]
})

export default router