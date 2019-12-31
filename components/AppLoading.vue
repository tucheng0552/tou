<template lang="html">
  <div class="loading-page" v-if="loading">
    <img src="~/assets/image/icon/loading.gif" alt="">
  </div>
</template>

<script>
  export default {
    name:'app-loading',
    data: () => ({
      loading: false
    }),
    methods: {
      start () {
        this.loading = true
      },
      finish () {
        this.loading = false
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';

  .loading-page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255,255,255, .8);
    text-align: center;
    font-size: 30px;
    font-family: sans-serif;
    z-index: 9999;
    >p{
      color: $t4;
    }
    >img{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%)
    }
  }
</style>
