import { createRouter, createWebHistory } from 'vue-router'
import TheDashboard from '../views/TheDashboard.vue'
import AgentPortal from '../views/AgentPort.vue'
// import store from '@/store'
const routes = [
  {
    path: '/shop',
    name: 'AgentPortal',
    component: AgentPortal,
    meta: {
      authRequired: true,
    },
    children: [
      {
        path: '/',
        name: 'TheDashboard',
        component: TheDashboard
      },
      {
        path: '/myshop',
        name: "MyShop",
        component: () => import('../views/TheMyShop.vue')
      },

      {
        path: '/orders',
        name: 'TheOrder',
        component: () => import('../views/TheOrder.vue')
      },
      {
        path: '/reports',
        name: 'TheReport',
        component: () => import(/* webpackChunkName: "setting" */ '../views/TheReport.vue')
      },

      {
        path: '/setting',
        name: 'TheSetting',
        component: () => import(/* webpackChunkName: "setting" */ '../views/TheSetting.vue')
      },
      {
        path: '/product-detail/:id',
        name: 'ProductDetail',
        component: () => import(/* webpackChunkName: "product-detail" */ '../views/ProductDetail.vue')
      },
      {
        path: '/customer',
        name: 'TheCustomer',
        component: () => import(/* webpackChunkName: "the-customer" */ '../views/TheCustomer.vue')
      },
      {
        path: '/add-new-order',
        name: 'AddNewOrder',
        component: () => import(/* webpackChunkName: "add-new-order" */ '../views/AddNewOrder.vue')
      },
      {
        path: '/order-detail/:id',
        name: 'OrderDetail',
        component: () => import(/* webpackChunkName: "order detail" */ '../views/OrderDetail.vue')
      },
      {
        path: '/product-acceptance',
        name: 'QueueProduct',
        component: () => import(/* webpackChunkName: "queue product" */ '../views/QueueProduct.vue')
      },
      
    ],


},


  {
    path: "/:notFound(.*)*", redirect: "/"
  },
  {
    path: '/login',
      name: 'TheLogin',
        component: () => import(/* webpackChunkName: "login" */ '../views/TheLogin.vue'),
          // beforeEnter: (to, from, next) => {
          //   if (localStorage.getItem('tokenR'))
          //     return next('/')
          //   else {
          //     next()
          //   }
          // },
  
    },
  {
    path: '/reset-password/:token',
      props: true,
        name: 'ResetPassword',
          component: () => import(/* webpackChunkName: "login" */ '../views/ResetPassword.vue'), 
    },
    // {
  //   path: '/verify',
  //   name: 'VerificationCode',
  //   component: () => import(/* webpackChunkName: "login" */ '../views/VerificationCode.vue'), 
  // }
];


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",

})


router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authRequired) && !localStorage.getItem('tokenR')) {
    return next({ name: 'TheLogin' })
  }
  else
    next()
})
export default router
