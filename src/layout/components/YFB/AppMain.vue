<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~@/styles/variables.scss";
  .app-main {
    /*50 = navbar  */
    min-height: calc(100vh - #{$navbarHeight});// - #{$navbarVerticalHeight}
    height: calc(100vh - #{$navbarHeight});
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  .fixed-header+.app-main {
    padding-top: 50px;
  }

  // fix css style bug in open el-dialog
  .el-popup-parent--hidden {
    .fixed-header {
      padding-right: 15px;
    }
  }
</style>
