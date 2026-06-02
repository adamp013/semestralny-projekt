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
  },
  {
  path: '/admin',
  component: () => import('../views/AdminDashboard.vue'),
  meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const isLoggedIn = document.cookie.includes('isLoggedIn=true')
  if(to.meta.requiresAuth && !isLoggedIn){
    return '/sign-in'
  }
})

export default router