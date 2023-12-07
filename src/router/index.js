import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/visit',
    component: () => import('@/views/visit'),
    hidden: true
  },

  {
    path: '/aa',
    name: 'aa',
    component: () => import('@/views/aa.vue')
  },
  {
    path: '/bi',
    //  path: "http://192.168.2.195:5500/#/account/oauth_bps?bpsToken=Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJicHMiLCJhdWQiOiIxQTg4Q0RDOC00RUNDLTRGNjktODg5Ri1DMjZDREMxRTEyNUMiLCJhY2NvdW50SWQiOiIxQTg4Q0RDOC00RUNDLTRGNjktODg5Ri1DMjZDREMxRTEyNUMiLCJpc3MiOiJraW5nZGVlIiwibmFtZSI6Iui2hee6p-euoeeQhuWRmCIsImV4cCI6MTYzMDY0OTAwN30.kAMr2_-SkrXsrWXU_K8iRrAWoKwdt9pMx1N6x8cK4KM",
    name: 'bi'
    //  component: () => import("@/views/bb.vue")
  },
  {
    path: '/',
    name: '经营数据查询',
    redirect: '/businessData'
  },

  {
    path: '/',
    redirect: '/center/page',
    component: () => import('@/views/center/page'),
    hidden: true,
    children: [
      {
        path: 'system',
        name: 'System',
        component: () => import('@/views/system/system'),
        meta: { title: '权限管理' }
      },
      {
        path: 'organization',
        name: 'organization',
        component: () => import('@/views/system/organization'),
        meta: { title: '组织架构管理' }
      },
      {
        path: 'account',
        name: 'Account',
        component: () => import('@/views/system/account'),
        meta: { title: '用户管理' }
      },
      {
        path: 'accountEdit',
        name: 'AccountEdit',
        component: () => import('@/views/system/accountEdit'),
        meta: { title: '用户编辑' }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/system/role'),
        meta: { title: '角色管理' }
      },
      {
        path: 'roleEdit',
        name: 'RoleEdit',
        component: () => import('@/views/system/roleEdit'),
        meta: { title: '用户编辑' }
      },
      {
        path: 'dictionary',
        name: 'dictionary',
        component: () => import('@/views/system/dictionary'),
        meta: { title: '系统字典' }
      },
      {
        path: 'indicator',
        name: 'indicator',
        component: () => import('@/views/indicator/indicator'),
        meta: { title: '指标管理' }
      },
      {
        path: 'businessData',
        name: 'businessData',
        component: () => import('@/views/dataOrigin/businessData'),
        meta: { title: '经营数据查询' }
      },
      {
        path: 'acquireData',
        name: 'acquireData',
        component: () => import('@/views/dataOrigin/acquireData'),
        meta: { title: '数据获取' }
      },
      {
        path: 'businessPlate',
        name: 'businessPlate',
        component: () => import('@/views/basicsData/businessPlate'),
        meta: { title: '业务板块管理' }
      },
      {
        path: 'wharfManagement',
        name: 'wharfManagement',
        component: () => import('@/views/basicsData/wharfManagement'),
        meta: { title: '码头港口管理' }
      },
      {
        path: 'airLine',
        name: 'airLine',
        component: () => import('@/views/basicsData/airLine'),
        meta: { title: '航线管理' }
      },
      {
        path: 'shipIndex',
        name: 'shipIndex',
        component: () => import('@/views/ships/shipIndex'),
        meta: { title: '船舶管理' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export const constantRoutesSource = [].concat(constantRoutes)

// let base = process.env.NODE_ENV==='development'?'http://192.168.1.136:8080':'http://itlead.vicp.net:9924';
const base = process.env.VUE_APP_FORMENGIN_PAGE_URL

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
