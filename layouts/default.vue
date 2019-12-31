<template >
  <div class="">

    <the-head-nav></the-head-nav>

    <nuxt class="default"/>

    <!--<button type="button" @click="service">联系客服</button>-->
    <the-footer v-if="deviceType.type != 5"></the-footer> <!--  -->
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import TheHeadNav from '~/components/TheHeadNav.vue'
  import TheFooter from '~/components/TheFooter.vue'
  export default {
    data(){
      return {
        // isHouseDetail: true,
      }
    },
    components: {
      TheHeadNav,
      TheFooter
    },
    watch:{
      // '$route'(to, from) {
      //   if(to.name == 'homestay-id' || to.name == 'hotel-id'){
      //     this.isHouseDetail = false
      //   }else{
      //     this.isHouseDetail = true
      //   }
      // }
    },
    computed: {
      ...mapState({
        deviceType: 'deviceType',
      })
    },
    asyncData (context) {
      return {
      }
    },
    mounted(){
    },
    methods: {
      service(){
        window.open('http://p.qiao.baidu.com/cps/chat?siteId=14012863&userId=29141183',
          '_blank',
          `left=200,top=200,height=460,width=600`
        )
      }
    }
  }
</script>

<style>
  html {
    font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 16px;
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
    margin: 0;
  }

  .button--green {
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #3b8070;
    color: #3b8070;
    text-decoration: none;
    padding: 10px 30px;
  }

  .button--green:hover {
    color: #fff;
    background-color: #3b8070;
  }

  .button--grey {
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #35495e;
    color: #35495e;
    text-decoration: none;
    padding: 10px 30px;
    margin-left: 15px;
  }

  .button--grey:hover {
    color: #fff;
    background-color: #35495e;
  }

  .default{
    position: relative;
  //margin-top: 73px;
  }
</style>
