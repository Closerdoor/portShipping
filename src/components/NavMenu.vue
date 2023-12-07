<template>
  <div class="navMenu">
    <template v-for="navMenu in navMenus">
      <!-- 最后一级菜单 -->
      <el-menu-item
        v-if="navMenu.children.length<1 && navMenu"
        :key="navMenu.id"
        :data="navMenu"
        :index="navMenu.name"
      >
        <i :class="navMenu.icon" />
        <span slot="title">{{ navMenu.meta.title }}</span>
      </el-menu-item>

      <!-- 此菜单下还有子菜单 -->
      <el-submenu
        v-if="navMenu.children.length>0 && navMenu"
        :key="navMenu.id"
        :data="navMenu"
        :index="navMenu.name"
      >
        <template slot="title">
          <i :class="navMenu.icon" />
          <span> {{ navMenu.meta.title }}</span>
        </template>
        <!-- 递归 -->
        <NavMenu :nav-menus="navMenu.children" />
      </el-submenu>
    </template>
  </div>
</template>

<script>
export default {
  name: 'NavMenu',
  props: ['navMenus'],
  data() {
    return {}
  },
  methods: {
    getClick() {
      console.log('123')
    }
  }
}
</script>

<style>
/* 水平样式 */
.el-menu--horizontal > div > .el-submenu {
  float: left;
}
/* 一级菜单的样式 */
.el-menu--horizontal > div > .el-menu-item {
  float: left;
  height: 60px;
  line-height: 60px;
  margin: 0;
  border-bottom: 2px solid transparent;
  color: #333;
}
/* .el-menu--horizontal > .navMenu > .el-menu-item > span{
  color: #333;
} */
/* .navMenu .el-menu-item > span{
  color: #333;
}  */
/* .el-menu--horizontal > div > .el-submenu > .el-submenu__title > span{
  color: #333;
} */
/* 解决下图1 下拉三角图标 */
.el-menu--horizontal > div > .el-submenu .el-submenu__icon-arrow {
  position: static;
  vertical-align: middle;
  margin-left: 8px;
  margin-top: -3px;
}
/* 解决下图2 无下拉菜单时 不对齐问题 */
.el-menu--horizontal > div > .el-submenu .el-submenu__title {
  height: 60px;
  line-height: 60px;
  border-bottom: 2px solid transparent;
  color: #909399;
}

.el-menu-item.is-active {
  background-color: #E0ECF8 !important;
}
</style>
