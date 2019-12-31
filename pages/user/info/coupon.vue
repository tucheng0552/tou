<template>

  <!--  优惠券 -->
  <div>
    <div class="coupon">
      <h2>优惠券</h2>

      <div v-if="resData.length > 0">
        <ul class="coupon-list">
          <li v-for="(item, idx) in resData" :key="item.id" @click="toggleDetails(item)">
            <div class="item">
              <div class="item-left">
                <h6>{{item.couponName}}</h6>
                <p class="info">{{item.intro}}</p>
                <p class="date">{{item.couponBeginTime}}</p>
              </div>
              <div class="item-right">
                <p v-if="item.couponType == 1"><b>{{item.discount}}</b>&nbsp;折</p>

                <p v-else-if="item.couponType == 2"><b>{{item.discount}}</b>&nbsp;元</p>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="coupon-text" v-else>
        <p>暂时没有优惠券</p>
      </div>
    </div>

    <!--  优惠券详情   -->
    <div :class="[showCouponDetails ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="toggleDetails"></div>
      <div class="modal-content">
        <div class="coupon-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="toggleDetails"></button>
          </div>
          <div class="modal-main">
            <h2>{{couponItem.couponName}}</h2>
            <p>{{couponItem.intro}}</p>

            <div class="info">
              <p>{{couponItem.couponBeginTime}}</p>
              <p>{{couponItem.detail}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import user from '~/assets/js/api/user'
  import { mapState } from 'vuex'

  export default {
    name: "info-coupon",
    data(){
      return {
        showCouponDetails: false,
        couponItem: {}
      }
    },

    async asyncData (context) {
      !context.store.state.authUser.userId && context.redirect('/');

      let pt = context.store.state.deviceType.type;

      try{
        let { data } = await user.getUserCouponList({pt: pt}, context.store.state.authUser);
        if(data.code == 0){
          return {
            resData:data.result
          }
        }else{
          throw data.msg
        }
      }catch (e){
        context.error({ statusCode: 400, message: e })
      }
    },
    computed: {
      ...mapState({
        deviceType: 'deviceType',
      }),
    },
    methods: {
      toggleDetails(item){
        if(item){
          this.couponItem = item
        }
        this.showCouponDetails = !this.showCouponDetails
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';

  @media screen and #{$desktop-width}{
    .coupon{
      .coupon-list{
        >li{
          width: 50%;
        }
      }
    }
  }
  @media screen and #{$touch-width}{
    .coupon{
      .coupon-list{
        >li{
          width: 100%;
        }
      }
    }
  }

  .coupon{
    >h2{
      padding-left: 8px;
      @include font-style(24px)
    }
    .coupon-list{
      display: flex;
      flex-wrap: wrap;
      padding: 8px 0;
      >li{
        padding: 8px;
        .item{
          display: flex;
          justify-content: space-between;
          padding: 16px;
          @include bg-image('~assets/image/icon/my_coupon_img_bg@3x.png', 100%, 100%);
          .item-left{
            width: 64%;
            >h6{
              @include font-style(20px)
            }
            .info{
              margin: 8px 0 20px 0;
              @include font-style(14px, 20px);
            }
            .date{
              @include font-style(12px, $color:$t2)
            }
          }
          .item-right{
            width: 26%;
            display: flex;
            justify-content: center;
            align-items: center;
            >p{
              @include font-style(14px);
              >b{
                @include font-style(24px, $color: $t5);
                //@include font-style(48px, $color: $t5);
              }
              >span{
                @include font-style(24px, $color: $t5);
              }
            }
          }
        }

      }
    }
    .coupon-text{
      padding: 24px 8px;
      >p{
        @include font-style(14px, $color:$t2);
      }
    }
  }

  .coupon-modal{
    .modal-main{
      display: flex;
      flex-direction: column;
      padding: 16px;
      >h2{
        @include font-style(24px)
      }
      >p{
        margin-top: 16px;
        @include font-style(14px, 22px, $color:$t2)
      }
      .info{
        margin-top: 24px;
        padding: 24px 0;
        border-top: 1px solid $b3;
        >p{
          margin-bottom: 24px;
          @include font-style(16px, 26px)
        }
      }
    }
  }
</style>
