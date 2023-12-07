<template>
  <div v-loading.fullscreen.lock="showLoading" class="bg_container">
    <div class="loading_box">
      <!-- <LoadingBox ref="LoadingBox" /> -->
    </div>
    <div v-if="!showLoading" class="fail_container">
      <div class="page_box">
        <h1>:)</h1>
        <h2>
          登录遇到问题，需要重新尝试。<br>
          {{
            errMessage
              ? `ERROR：${errMessage}。`
              : "您携带的一个或多个账号信息校验失败，请与您相信可帮助您解决该问题的人联系。"
          }}
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      showLoading: true,
      params: {}
    }
  },
  computed: {},
  mounted() {
    console.log(this.$route.query)
    this.resetStorage()
    this.params = {
      ticket: this.$route.query.ticket,
      appid: this.$route.query.appid,
      client_id: this.$route.query.client_id,
      expire_time: this.$route.query.expire_time
    }
    this.test()
  },
  methods: {
    resetStorage() {
      sessionStorage.removeItem('Info')
      sessionStorage.removeItem('menuId')
      sessionStorage.removeItem('Authorization')
    },
    test() {
      if (
        // yunhome账号登录验证
        this.params.ticket &&
        this.params.appid &&
        this.params.client_id &&
        this.params.expire_time
      ) {
        this.$store.dispatch('user/jumpLogin', this.params).then(() => {
          console.log('token获取成功')
          this.$store.dispatch('center/getCenterList').then((res) => {
            sessionStorage.setItem('menuId', res.data[0].firstMenu.id)
          })
          this.$router.push({ path: '/' })
        }).catch((err) => {
          this.showLoading = false
          this.errMessage = err.message
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bg_container {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .fail_box {
    text-align: center;
    font-size: 20px;
    justify-content: center;
    align-items: center;
    img {
      width: 44px;
      height: 44px;
      margin-right: 10px;
    }
  }
}
.fail_container {
  width: 100%;
  height: 100%;
  background: #0078d7;
  color: #fefeff;
  position: relative;
  .page_box {
    width: 70%;
    /* margin: 0 auto; */
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -40%);
    h1 {
      font-size: 6.5em;
    }
    h2 {
      font-size: 1.5em;
      font-weight: 300;
    }
  }
}
</style>
