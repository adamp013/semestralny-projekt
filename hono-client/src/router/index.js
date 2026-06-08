import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore.js'

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
  meta: { requiresAuth: true, requiresAdmin: true }
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

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  if (!authStore.isLoggedIn) {
    await authStore.fetchMe()
  }
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return '/sign-in'
  }
  if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') { 
    return '/'
  }
})

export default router