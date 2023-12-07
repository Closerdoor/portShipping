<template>
  <div class="login-container">

    <div class="login-container-main">
      <div class="title_logo">
        <img alt="hx bank" class="title" src="../../assets/index/logo.png">
        <h1>港航大数据经营决策平台</h1>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="企业微信登录" name="first">企业微信登录</el-tab-pane>
        <el-tab-pane label="账号密码登录" name="second">
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
            <el-form-item prop="loginName">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                ref="loginName"
                v-model="loginForm.loginName"
                placeholder="请输入用户名"
                name="loginName"
                type="text"
                tabindex="1"
                auto-complete="on"
              />
            </el-form-item>

            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="请输入密码"
                name="password"
                tabindex="2"
                auto-complete="on"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>

            <el-button :loading="loading" type="primary" style="width:100%;height: 30px;padding: 0;border: none;border-radius: 0;background-color: #286fff;color: #fff" @click.native.prevent="handleLogin">登录</el-button>

            <div class="tips">
              <span style="margin-right:20px;">username: admin</span>
              <span> password: any</span>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位数'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        loginName: 'admin',
        password: '123456'
      },
      loginRules: {
        // loginName: [{ required: true, trigger: 'blur', validator: validateUsername }],
        loginName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      activeName: 'second'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    handleClick(tab, event) {
      console.warn(tab, event)
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$store.dispatch('center/getCenterList').then((res) => {
              sessionStorage.setItem('menuId', res.data[0].firstMenu.id)
            })
            this.$router.push({ path: '/' })
            // this.$router.push({ path: '/businessData' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
@import "~@/styles/variables";

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;
$mLeft:33px;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .login-container-main{
    .el-tabs__nav{
      float: unset;
      display: inline-block;
      margin-top: 10px;
      .el-tabs__active-bar{
        background-color: $fontDark;
      }
      .el-tabs__item{
        color: $fontGray;
        &.is-active{
          color: $fontDark;
        }
        &:hover{
          color: $fontDark;
        }
      }
    }
    .el-tabs__nav-wrap::after {
      display: none;
    }
  }
  .el-form-item__content{
    line-height: unset;
    margin-bottom: 20px;
    .el-form-item__error{
      margin-left: $mLeft;
    }
  }
  .el-input {
    display: inline-block;
    //height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0;
      -webkit-appearance: none;
      border-radius: 0;
      //padding: 12px 5px 12px 15px;
      color: $light_gray;
      //height: 47px;
      height: 30px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    //border: 1px solid rgba(255, 255, 255, 0.1);
    //background: rgba(0, 0, 0, 0.1);
    //border-radius: 5px;
    margin-left: -$mLeft;
    margin-right: -3px;
    color: #454545;
    .svg-container{
      padding: 6px 15px 6px 0 !important;
    }
    input{
      //border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      color: $fontDark;
    }
  }
}
</style>

<style lang="scss" scoped>
$bg:#F0F3F5;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background: $bg url("~@/assets/login/login_bg.png") no-repeat 0/100% 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  .login-container-main {
    text-align: center;
    .el-tabs{
      margin-top: 18px;
      width: 400px;
      height: 304px;
      background-color: #fff;
      .login-form {
        position: relative;
        width: 100%;
        max-width: 100%;
        padding: 20px 100px 0;
        margin: 0 auto;
        overflow: hidden;
      }
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }
    .title_logo{
      display: flex;
      justify-content: center;
      align-items: center;
    }
    h1{
      font-size: 22px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #333333;
    }

    .title {
      width: 38px;
      height: 30px;
      margin-right: 10px;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
