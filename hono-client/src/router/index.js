import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/home.vue'),
    meta: {requiresAuth: true}
  },
  {
    path: '/sign-in',
    component: () => import('../views/SignIn.vue')
  },
  {
  path: '/register',
  component: () => import('../views/Register.vue')
  },
  {
  path: '/test',
  component: () => import('../test.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const tokken = document.cookie.includes('token')
  if(to.meta.requiresAuth && !tokken){
    return '/sign-in'
  }
})

export default router