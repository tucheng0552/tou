<template>
  <div class="container l-page-section error">
    <div v-if="error.statusCode === 404">
      <h3 class="title is-3 is-spaced">页面不存在</h3>
      <p class="subtitle is-5">{{error.message}}</p>
    </div>

    <div v-if="error.statusCode === 400">
      <h3 class="title is-3 is-spaced">服务器错误请求</h3>
      <p class="subtitle is-5">{{error.message}}</p>
    </div>

    <div v-else>
      <h3 class="title is-3">应用发生错误异常</h3>
      <p class="subtitle is-5">{{error.message}}</p>
    </div>

    <nuxt-link to="/" class="button is-link">首 页</nuxt-link>
  </div>
</template>

<script>
  export default {
    name: "error",
    props: ['error'],
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';

  .error{
    padding: 24px 16px;
    .button{
      margin-top: 12px;
    }
  }

</style>
