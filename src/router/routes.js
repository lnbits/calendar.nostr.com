const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('src/pages/LoginRegister.vue')
  },
  {
    path: '/calendar/:id',
    name: 'Calendar',
    component: () => import('src/pages/AppointmentPage.vue')
  },
  {
    path: '/',
    name: 'Index',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/pages/DashboardPage.vue'),
        name: 'Dashboard'
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
