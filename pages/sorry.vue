<template>
  <div class="container l-page-section error">
    <h3 class="title is-3 is-spaced">sorry</h3>
    <p class="subtitle is-5">应用发生错误异常：500</p>
  </div>
</template>

<script>
  export default {
    name: "sorry",
    layout: 'error',
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
