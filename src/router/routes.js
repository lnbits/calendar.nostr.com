const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('src/pages/LoginRegister.vue')
  },
  {
    path: '/:id',
    name: 'Calendar',
    component: () => import('src/pages/AppointmentPage.vue')
  },
  {
    path: '/',
    name: 'Index',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // {
      //   path: '',
      //   component: () => import('src/pages/DashboardPage.vue'),
      //   name: 'Dashboard'
      // },
      {
        path: '',
        component: () => import('src/pages/CalendarsPage.vue'),
        name: 'Calendars'
      },
      {
        path: '/calendars/:id',
        component: () => import('src/pages/SettingsPage.vue'),
        name: 'Settings'
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
