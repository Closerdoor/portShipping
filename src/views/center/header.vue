<template>
  <div class="header_page">
    <el-header>
      <div class="top_logo">
        <img class="logo" src="../../assets/index/logo.png" alt="">
        <h1>港航大数据经营决策平台</h1>
      </div>
      <!-- 插件 -->
      <el-menu
        text-color="#333"
        active-text-color="#409EFF"
        :default-active="activeIndex"
        router
        mode="horizontal"
        @select="handleSelect"
      >
        <NavMenu :nav-menus="menuData" />
      </el-menu>
      <div class="login_out">
        <img src="../../assets/index/phone.png" alt="">
        <span>你好，{{ this.username }}</span>
        <el-button type="text" @click="logout">退出</el-button>
      </div>
    </el-header>
  </div>
</template>

<script>
import NavMenu from '../../components/NavMenu.vue'
// import { getRouter } from '@/permission'
export default {
  name: 'PageHead',
  components: {
    NavMenu: NavMenu
  },
  data() {
    return {
      activeIndex: 'aa',
      username: this.$store.state.user.name,
      menuData: [
        {
          id: 0,
          name: 'aa',
          meta: {
            title: '经营决策'
          },
          children: []
        },
        {
          id: 7,
          name: 'bi',
          meta: {
            title: 'BI设置'
          },
          children: []
        },
        {
          // 数据源管理
          id: 8,
          name: 'dataOrigin',
          meta: {
            title: '数据源管理'
          },
          children: [
            {
              id: 9,
              name: 'businessData',
              value: '/dataOrigin/businessData',
              meta: {
                title: '经营数据查询'
              },
              children: []
            },
            {
              id: 12,
              name: 'acquireData',
              value: '/dataOrigin/acquireData',
              meta: {
                title: '数据获取'
              },
              children: []
            }
          ]
        },
        {
          // 基础数据
          id: 10,
          name: 'basicsData',
          meta: {
            title: '基础数据'
          },
          children: [
            {
              id: 11,
              name: 'businessPlate',
              value: '/basicsData/businessPlate',
              meta: {
                title: '业务板块管理'
              },
              children: []
            },
            {
              id: 13,
              name: 'wharfManagement',
              value: '/basicsData/wharfManagement',
              meta: {
                title: '码头港口管理'
              },
              children: []
            },
            {
              id: 14,
              name: 'airLine',
              value: '/basicsData/airLine',
              meta: {
                title: '航线管理'
              },
              children: []
            },
            {
              id: 21,
              name: 'shipIndex',
              value: '/ships/shipIndex',
              meta: {
                title: '船舶管理'
              },
              children: []
            }
          ]
        },
        {
          // 指标管理
          id: 6,
          name: 'indicator',
          alias: '指标管理',
          meta: {
            title: '指标管理'
          },
          children: []
        },
        {
          // 系统设置
          id: 1,
          name: 'system',
          meta: {
            title: '系统设置'
          },
          children: [
            {
              id: 3,
              name: 'account',
              value: '/system/account',
              meta: {
                title: '用户管理'
              },
              children: []
            },
            {
              id: 4,
              name: 'role',
              meta: {
                title: '角色管理'
              },
              children: []
            },
            {
              id: 2,
              name: 'system',
              meta: {
                title: '权限管理'
              },
              children: []
            },
            {
              id: 15,
              name: 'organization',
              meta: {
                title: '组织架构管理'
              },
              children: []
            },
            {
              id: 5,
              name: 'dictionary',
              meta: {
                title: '系统字典'
              },
              children: []
            }
          ]
        }
      ]
    }
  },
  mounted() {
    const start = window.location.href.lastIndexOf('/')
    const path = window.location.href.slice(start + 1)
    this.activeIndex = path
    // this.menuData = this.$router.options.routes
    console.log(this.$router.options.routes, '-----头部路由')
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log('ooooooooooooo')
      if (keyPath.toString() === 'bi') {
        // window.location.href='http://192.168.2.195:5500/#/account/oauth_bps?bpsToken=Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJicHMiLCJhdWQiOiIxQTg4Q0RDOC00RUNDLTRGNjktODg5Ri1DMjZDREMxRTEyNUMiLCJhY2NvdW50SWQiOiIxQTg4Q0RDOC00RUNDLTRGNjktODg5Ri1DMjZDREMxRTEyNUMiLCJpc3MiOiJraW5nZGVlIiwibmFtZSI6Iui2hee6p-euoeeQhuWRmCIsImV4cCI6MTYzMDY0OTAwN30.kAMr2_-SkrXsrWXU_K8iRrAWoKwdt9pMx1N6x8cK4KM'
        // 测试环境
        window.location.href = 'http://itlead.gdkun.com:9991/#/account/oauth?bpsToken=Bearer ' + window.sessionStorage.getItem('Authorization')
        // 正式环境
        // window.location.href = 'https://bi.hangyun.com.cn/bi-web/#/account/oauth?bpsToken=Bearer ' + window.sessionStorage.getItem('Authorization')
      } else {
        this.$store.dispatch('user/getRouter').then(res => {
          // console.log('--↓dasssssssssssssssssssta↓--')
          // console.log(key)
          // console.log(res)
          const item = res.data[0].children
          item.forEach(ele => {
            if (('/' + key) === ele.path || key === ele.path) {
              sessionStorage.setItem('menuId', ele.meta.id)
              // console.log('获取页面menuId::' + ele.meta.id)
              // store.commit('menuId', ele.meta.id);
            }
          })
        })
      }
    },
    async logout() {
      await this.$store.dispatch('user/logout').then((res) => {
        console.log(res, 'res')
      })
      this.$router.push(`/login`)
      sessionStorage.removeItem('menuId')
    }
  }
}
</script>

<style lang="scss" scoped>
.header_page {
  > .el-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px !important;
    background-color: #fff;
    line-height: 60px;
    min-width: 1400px;
    // width: 100%;
    box-shadow: 0px 1px 4px rgba(217, 217, 217, 0.5);
    .top_logo{
      height: 100%;
      display: flex;
      align-items: center;
      > .logo {
        height: 30px;
        margin-left: 20px;
      }
    }
    img {
      width: 38px;
      height: 27px;
    }
    h1 {
      font-size: 22px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 29px;
      color: #333333;
      margin-left: 20px;
    }

    .login_out {
      height: 100%;
      display: flex;
      align-items: center;
      margin-right: 20px;
      img{
        width: 40px;
        height: 40px;
        margin-right: 10px;
      }
      span {
        color: #333;
        font-size: 14px;
      }
      .el-button {
        margin-left: 34px;
        color: #333;
        font-size: 14px;
      }
    }
  }
}
</style>
