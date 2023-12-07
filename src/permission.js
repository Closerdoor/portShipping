import router, { constantRoutesSource } from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
// eslint-disable-next-line no-unused-vars
import Cookies from 'js-cookie'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/wyWeChatCode', '/visit'] // no redirect whitelist

export const handleRouterData = (data, reata) => {
  const r = reata
  console.log(r, 'rrrr')
  for (let i = 0; i < r.length; i++) {
    const j = data.findIndex(item => item.path === r[i].path)
    const m = data.filter(item => {
      // console.log(item.path, 'item.path');
      // console.log(r[i].path, 'r[i].path');
      return item.path === r[i].path ? item.name : ''
    })
    // console.log(m,'mmmmmmmmm');
    // console.log(j,'jjjjj');
    if (m.length > 0) {
      r[i]['menuId'] = m[0].meta.id
      r[i].meta.title = m[0].name
    } else {
      r[i]['menuId'] = ''
    }

    if (j === -1) {
      r.splice(i, 1)
      i--
    } else {
      r[i].hasOwnProperty('children') && r[i].children.length && handleRouterData(data[j].children, r[i].children)
    }
  }
  return r
}
export const getRouter = () => {
  store.commit('showLeftMenu', false)
  store.dispatch('user/getRouter').then(res => {
    console.log(res, '菜单数据', constantRoutesSource)
    router.options.routes = handleRouterData(res.data, JSON.parse(JSON.stringify(constantRoutesSource)))
    store.commit('showLeftMenu', true)
  })
}
export const handleKeepAlive = async to => {
  if (to.matched && to.matched.length > 2) {
    for (let i = 0; i < to.matched.length; i++) {
      const element = to.matched[i]
      if (element.components.default.name === 'layout') {
        to.matched.splice(i, 1)
        await handleKeepAlive(to)
      }
      if (typeof element.components.default === 'function') {
        await element.components.default()
        await handleKeepAlive(to)
      }
    }
  }
}

router.beforeEach(async(to, from, next) => {
  // start progress bar
  // handleKeepAlive(to).then();
  // console.log('beginbeginbegin')
  // console.log(to)
  // console.log(from)

  // console.log(url)
  // if(window.location.href)
  if (from.path === '/login' && getToken()) {
    getRouter()
  }
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)
  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // const hasGetUserInfo = store.getters.name
      const hasGetUserInfo = store.getters.loginName
      if (hasGetUserInfo) {
        if (to.meta.roles.includes(hasGetUserInfo)) next()
        else {
          next({ path: '/' })
          NProgress.done()
        }
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      const url = window.location.href
      // 云之家路由重定向时重新拼接Url
      if (url && url.endsWith('#/visit') && to.path.indexOf('/visit') !== -1) {
        // console.log('重新定向')
        const params = url.substring(url.indexOf('?'), url.lastIndexOf('#/visit'))
        // console.log(params)
        const start = url.substring(0, url.indexOf('?'))
        // console.log(start)
        window.location.replace(`${start}#/visit${params}`)
      }
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      console.log(window.location.href)
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
