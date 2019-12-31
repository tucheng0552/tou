<template>
  <div>
    <header class="head">
      <nav class="head-nav">
        <button class="nav-btn" @click="back"></button>
      </nav>
    </header>

    <nuxt class="back"/>

  </div>
</template>

<script>
  export default {
    name: "back",
    methods:{
      back(){
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';

  @media screen and #{$desktop-width}{
    .head{
      height: 72px;
      border-bottom: 1px solid $b3;
    }
    .back{
      margin-top: 73px;
    }
  }
  @media screen and #{$touch-width}{
    .head{
      height: 44px;
    }
    .back{
      margin-top: 45px;
    }
  }

  .head{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    background-color: $b0;
    .head-nav{
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      max-width: 1152px;
      padding: 0 16px;
      margin: 0 auto;
      .nav-btn{
        width: 24px;
        height: 24px;
        cursor: pointer;
        @include bg-image('~assets/image/icon/nav_icon_back_nor.png', 24px, 24px)
      }
    }
  }

  .back{
    position: relative;
  }
</style>
