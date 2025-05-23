import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/',
    redirect: '/tabs/tab1'
  },
  {
    path: '/manageUser',
    component: () => import('@/views/ManageUser.vue')
  },
  {
    path: '/userDetails/:id',
    component: () => import('@/views/UserDetails.vue')
  },
  {
    path: '/manageExamination/:userId',
    component: () => import('@/views/ManageExamination.vue')
  },
  {
    path: '/examinationSummary/:userId/:examinationId',
    component: () => import('@/views/ExaminationSummary.vue')
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token') === '321martamarta321';
  if (to.path !== '/login' && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router
