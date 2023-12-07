<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
import { getRouter } from '@/permission'
import { getToken } from '@/utils/auth'
export default {
  name: 'App',
  data() {
    return {

    }
  },
  mounted() {
    console.log('首次进入首页')
    if (getToken()) { getRouter() }
  }
}
</script>
<style lang="scss">
  #app>div{
    height: 100%;
  }
</style>
