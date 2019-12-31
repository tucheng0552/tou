<template>

  <!--  帮助中心  -->
  <div class="help">
    <!--<ul>
      <li></li>
    </ul>-->
    <!--<iframe src="http://p.qiao.baidu.com/cps/chat?siteId=14012863&userId=29141183" frameborder="0" style="width: 100%; min-height: 100vh"></iframe>-->
    <iframe :src="webAssetsUrl+'/toHelp.html'" style="border: none; width: 100%; min-height: 100vh"></iframe>
  </div>
</template>

<script>
  import config from '~/assets/js/config'
  export default {
    name: "info-help",
    data(){
      return {
        webAssetsUrl: undefined,
      }
    },
    mounted(){
      this.webAssetsUrl = config.WEB_ASSETS_URL;
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';

  .help{
    height: 100%;
  }
</style>
