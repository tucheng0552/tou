<template>
  <div>
    <ul>
      <li v-for="(item, idx) in merchantList" :key="idx">
        <h1>{{item}}</h1>
        <button type="button" @click="submit(item)">立即预定</button>
      </li>
    </ul>
    <div>
      <canvas ref="weChatPayCode"></canvas>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import QRCode from 'qrcode';
  export default {
    name: "test",

    data(){
      return {
        merchantList: undefined,
        resData: []
      }
    },
    computed: {
      ...mapState({
        authUser: 'authUser',
        deviceType: 'deviceType'
      }),
    },
    async mounted(){
      try {
        if(this.$route.query.channelCode){
          let { data } = await this.$api.merchant.merchantListOfChannel({pt: this.deviceType.type}, this.$route.query.channelCode);
          if(data.code == 0){
            this.merchantList = data.result.list
          }else {
            throw data.msg
          }
        }else{
          throw '缺少参数channelCode'
        }
      }catch (e){
        this.$toast.error(e)
      }
    },
    methods: {
      async submit(item){
        try {
          if(this.$route.query.channelCode || this.$route.query.amount){
            this.$nuxt.$loading.start();
            let { data } = await this.$api.order.submitChannelPayOrder({pt: this.deviceType.type}, this.authUser, {
              channelCode: this.$route.query.channelCode,
              storefrontId: item.storefrontId,
              payTools: 96,
              amount: this.$route.query.amount
            });
            this.$nuxt.$loading.finish();
            if(data.responseHeader.status == 0){
              this.resData = data.response.info;
              this.getWeChatPayCode(this.resData.qyfCode);
            }else {
              throw data.responseHeader.msg
            }
          }else{
            throw '缺少参数'
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      async getWeChatPayCode(url){
        try {
          await QRCode.toCanvas(this.$refs.weChatPayCode, url);
        } catch (e) {
          this.$toast.error(e)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';
</style>
