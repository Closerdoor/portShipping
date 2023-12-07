<template>
  <div>
    <template>
      <div class="title" :titleName="titleName" />
    </template>
  </div>
</template>
<script>
export default {
  name: 'TitleName',
  props: ['titleName'],
  data() {
    return {
    }
  }
}
</script>
<style lang="scss">
    .title{
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        line-height: 26px;
        color: #2F3541;
        margin-top: 2px;
        margin-bottom: 15px;
  }
</style>
