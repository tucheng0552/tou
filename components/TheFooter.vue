<template>
  <footer class="footer">

    <div class="footer-lang">
      <div class="lang">
        <div class="select">
          <select v-model="currency" @change="changeCurrency">
            <option :value="idx" v-for="(item, idx) in currencyList" :key="item.id">{{item.currencyName}}</option>
          </select>
        </div>
        <p>Copyright © 2017-2018 toU All rights reserved.<a href="">粤ICP备19043126号</a></p>
      </div>
    </div>
  </footer>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: "the-footer",
    props: {
    },
    computed: {
      ...mapState({
        currencyList: 'currencyList'
      })
    },
    asyncData(context){

    },
    data() {
      return {
        currency: this.$route.query.currency ? this.$route.query.currency : 0
      }
    },
    created(){

    },
    methods: {
      formatQuery(obj){
        let result = obj;
        for(let v in result) {
          if(v == 'currency'){
            delete result['currency']
          }
        }
        return result
      },
      changeCurrency(){
        let query = this.formatQuery(this.$route.query);
        this.$router.push({path:this.$route.path, query:{
            currency: this.currency,
            ...query
          }})
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';

  @media screen and #{$desktop-width}{
    .footer{
      .footer-info{
        padding: 16px 8px 48px 8px;
        .info-main{

        }
      }
      .footer-lang{
        .lang{
          padding: 20px 8px;
        }
      }
    }

  }

  @media screen and #{$touch-width}{
    .footer{
      .footer-info{
        padding: 16px 16px 48px 16px;
        .info-main{
          flex-direction: column;
          align-items: flex-start;
          .main-list{
            margin: 48px 0;
          }
        }
      }
      .footer-lang{
        .lang{
          flex-direction: column;
          padding: 20px 16px;
          .select{
            margin-bottom: 8px;
          }
        }
      }
    }
  }

  .footer{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    .footer-info{
      display: flex;
      flex-direction: column;
      max-width: 1152px;
      width: 100%;

      >h1{
        padding: 32px 0;
        @include font-style(30px)
      }
      .info-main{
        display: flex;
        justify-content: space-between;
        .text{
          max-width: 368px;
          @include font-style(18px, 25px, $color:$t2)
        }
        .main-list{
          >li{
            @include font-style(18px);
            >span{
              color: $t2;
              &.light{
                color: $t6;
              }
            }
            &:not(:last-child){
              margin-bottom: 18px;
            }
          }
        }
        .code{
          display: flex;
          flex-direction: column;
          align-items: center;
          >h6{
            @include font-style(18px)
          }

        }
      }
    }
    .footer-lang{
      width: 100%;
      border-top: 1px solid $b3;
      text-align: center;
      .lang{
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1152px;
        margin: 0 auto;
        >p{
          @include font-style(14px, $color: $t2)
        }
      }

    }
  }
</style>
