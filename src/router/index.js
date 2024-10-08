import {route} from 'quasar/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory
} from 'vue-router'
import routes from './routes'

const username = localStorage.getItem('username')

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({left: 0, top: 0}),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach(async (to, from) => {
    if (
      // make sure the user is authenticated
      !username //&&
      // ❗️ Avoid an infinite redirect
      //to.name !== 'Login'
    ) {
      // redirect the user to the login page
      return //(window.location.href = 'https://my.nostr.com/login')
    }
    if (to.path == '/') {
      return
    }
    // if (to.name == 'Login' && username) {
    //   return {name: 'Dashboard'}
    // }
  })

  return Router
})
