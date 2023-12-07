<template>
  <div>
    <page-head />
    <el-main>
      <router-view />
    </el-main>
  </div>
</template>

<script>
import pageHead from './header'
import { getRouter } from '@/permission'
export default {
  name: 'Center',
  components: {
    pageHead
  },
  data() {
    return {

    }
  },
  mounted() {
    // this.$store.dispatch('center/getCenterList').then((res)=>{
    //   sessionStorage.setItem('menuId', res.data[0].firstMenu.id);
    // })
  },
  beforeCreate() {

  }

}
</script>

<style scoped>
  .el-main{
    height: calc(100% - 60px);
    background: #f7f7f7;
    padding: 0 50px;
    box-sizing: border-box;
  }
</style>
