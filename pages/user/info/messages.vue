<template>
  <div>
    <!--  消息和通知 -->
    <div class="messages">
      <h2>消息和通知</h2>
      <div class="tabs">
        <ul class="tabs-items">
          <li v-for="(item, idx) in resTabsList" :key="item.id"
              :class="[(flagTabs == idx) ? 'is-active' : '']"
              @click="toggleCategory(idx, item.type)"><a>{{item.name}}</a></li>
        </ul>
      </div>

      <!--  评论回复  -->
      <div class="comment">
        <ul class="comments-content" v-show="flagTabs == 0">
          <li v-for="(item, idx) in resData.commentReplys" :key="item.id">
            <div class="content-info">
              <img :src="item.commentUser.faceUrl" alt="">
              <div class="info-head">
                <div class="head-left">
                  <h6>{{item.commentUser.userName}}</h6>
                  <p>{{item.createdAt}}</p>
                </div>
                <div class="head-right">
                  <i class="u-icon-list-like-sle" v-if="item.isPraise">{{item.praiseNum}}</i>
                  <i class="u-icon-list-like" v-else>{{item.praiseNum}}</i>
                </div>
              </div>
            </div>

            <div class="content-title">
              <div class="title-left">
                <h6>{{item.experienceTitle}}</h6>
                <p>{{item.experienceContent}}</p>
              </div>
              <img :src="item.experienceImgUrl" alt="">
            </div>

            <div class="content-txt">
              <p><b>评论：</b>{{item.comment}}</p>
              <!--<p><b>回复：</b><span class="light"></span></p>-->
            </div>
          </li>
        </ul>

        <!--  系统  -->
        <ul class="comments-system" v-show="flagTabs == 1">
          <li v-for="(item, idx) in resData.noticeMessagess" :key="item.id" @click="showDetails(item.actionParam)">
            <div class="system-info">
              <h5>{{item.title}}</h5>
              <p>{{item.createdAt}}</p>
            </div>
            <p class="system-txt">
              {{item.body}}
            </p>
          </li>
        </ul>

        <!--  服务  -->
        <ul class="comments-content" v-show="flagTabs == 2">
<!--
          <li v-for="(item, idx) in 2" :key="item.id">
            <div class="content-info">
              <img src="" alt="">
              <div class="info-head">
                <div class="head-left">
                  <h6>{{}}</h6>
                  <p>{{}}</p>
                </div>
                <div class="head-right">
                  <i class="u-icon-list-like-sle" v-if="true">{{}}</i>
                  <i class="u-icon-list-like" v-else>{{}}</i>
                </div>
              </div>
            </div>
            <div class="content-title">
              <div class="title-left">
                <h6>{{}}</h6>
                <div class="rate">
                  <span>{{}}</span>
                  <ul class="u-items-star">
                    <li v-for="(rate, rdx) in rateItems()" :key="rate.id" :class="rate"></li>
                  </ul>
                </div>
              </div>
              <img src="" alt="">
            </div>
            <div class="content-txt">
              <p><b>评论：</b>{{}}</p>
              &lt;!&ndash;<p><b>回复：</b><span class="light"></span></p>&ndash;&gt;
            </div>
          </li>
-->
        </ul>
      </div>

    </div>

    <!--  订单详情  -->
    <div :class="[showOrderDetails ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="closeDetails"></div>
      <div class="modal-content">
        <div class="order-details" v-show="modalDetails == 'index'">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="closeDetails"></button>
          </div>
          <div class="modal-main">
            <div class="main-title">
              <h2>订单详情</h2>
              <p v-if="resOrderDetails.orderBase._selfStatus == 0" class="red">待付款</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 1" class="red">待付款（房东确认中）</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 2" class="red">待付款（房东已确认）</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 3">待付款（房东拒决）</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 4" class="red">已付款（房东确认中）</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 5" class="light">已付款（房东已确认）</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 6" class="red">已付款（房东拒决）</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 7" class="light">等待入住</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 8">已入住</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 9" class="red">争议处理中</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 10" class="red">待评价</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 11">已评价</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 12">已完成</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 13" class="light">已退款</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 14">已取消</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 15" class="red">退款中</p>
            </div>

            <div class="content-info">
              <img :src="resOrderDetails.merchant.banners[0]">
              <div class="info">
                <h5 class="info-name">{{resOrderDetails.merchant.name}}</h5>
                <div class="info-type">
                  <p>{{resOrderDetails.merchant.merchantSubTypeName}}-{{resOrderDetails.merchant.livingRoomNum}}房{{resOrderDetails.merchant.drawingRoomNum}}厅&nbsp;{{resOrderDetails.merchant.totalBedNum}}床{{resOrderDetails.merchant.toiletNum}}卫</p>
                  <p>{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.merchant.lowestPrice}}</p>
                </div>
                <p class="info-date">{{resOrderDetails.orderBase.orderDescription}}</p>
              </div>
            </div>

            <div class="head-logo">
              <div class="logo-left">
                <h6>{{resOrderDetails.merchant.merchantSubTypeName}}</h6>
                <p>房东：<span>{{resOrderDetails.merchantUser.userName}}</span></p>
              </div>
              <img :src="resOrderDetails.merchantUser.faceUrl">
            </div>

            <div class="main-map">
              <img src="~/assets/image/icon/order_details_icon_map.png" alt="">
              <p v-if="resOrderDetails.orderBase._selfStatus > 12 || resOrderDetails.orderBase._selfStatus < 4">
                {{resOrderDetails.merchant.location.street}} <b>(准确地址在付款后提供)</b>
              </p>
              <p v-else>{{locationInfo}}</p>
            </div>

            <ul class="main-items">
              <li class="flex-column" v-if="resOrderDetails.orderBase._selfStatus == 4">
                <div class="item-left item-flex-row">
                  <p>房东确认</p>
                  <!--<p class="normal">{{resOrderDetails.orderBase.payStatusDesc}}</p>-->
                  <p class="normal">待确认</p>
                </div>
                <div class="item-right">
                  <!--<span>{{resOrderDetails.orderBase.orderStatusDesc}}</span>-->
                  <span>若房东在30分钟内未确认，订单将自动取消，已付款金额将原路退回您的支付账户。</span>
                </div>
              </li>
              <li class="">
                <div class="item-left">
                  <p>入住时间</p>
                </div>
                <div class="item-right">
                  <p class="normal">{{resOrderDetails.orderBase.orderDescription}}</p>
                </div>
              </li>
              <li class="">
                <div class="item-left">
                  <p>入住人：{{resOrderDetails.orderBase.numberOfAdults + resOrderDetails.orderBase.numberOfChildren}}位&nbsp;{{(resOrderDetails.orderBase.numberOfBabies > 0) ? resOrderDetails.orderBase.numberOfBabies+'名婴幼儿' : ''}}&nbsp;{{resOrderDetails.orderBase.needTakePet ? '宠物' : ''}}</p>
                  <span v-for="(item, idx) in resOrderDetails.orderBase._selfCheckinCustomersList" :key="item.id">{{item.name}}</span>
                </div>
              </li>
              <!--              <li>
                              <div class="item-left">
                                <p>意外险</p>
                              </div>
                              <div class="item-right">
                                <p class="normal">已购买</p>
                              </div>
                            </li>-->
              <li>
                <div class="item-left">
                  <p>预定人信息</p>
                  <span>{{resOrderDetails.orderBase.bookedName}}{{resOrderDetails.orderBase.bookedTelephone}}</span>
                </div>
              </li>
              <li>
                <div class="item-left">
                  <p>入住协议</p>
                </div>
                <div class="item-right">
                  <p class="normal">已同意</p>
                </div>
              </li>
              <!--              <li>
                              <div class="item-left">
                                <p>预定人信息</p>
                                <span>发票抬头：秦艾德</span>
                              </div>
                              <div class="item-right">
                                <p class="light">下载发票(PDF)</p>
                              </div>
                            </li>-->
              <li>
                <div class="item-left">
                  <p>注意事项</p>
                  <span>已购买的折扣或活动商品，一律不支持退款</span>
                </div>

              </li>
              <li>
                <div class="item-left">
                  <p>订单号</p>
                </div>
                <div class="item-right">
                  <p class="normal">{{resOrderDetails.orderBase.orderNo}}</p>
                </div>
              </li>
              <li class="flex-column">
                <div class="item-left item-flex-row">
                  <p>支付方式</p>
                  <p class="normal">{{resOrderDetails.orderPaymentBase.paymentMethodStr}}</p>
                </div>
                <div class="item-left item-flex-row" style="margin-top: 72px;">
                  <h6>付款信息</h6>
                  <button type="button" @click="toggleDetails('pay')">明细</button>
                </div>
              </li>
              <li class="flex-column detail">
                <div class="item-left item-flex-row" v-for="(item, idx) in resOrderDetails.orderPrice.roomNum" :key="item.id">
                  <span>{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderPrice.avgPrice}} &times; {{resOrderDetails.orderPrice.dayCount}}晚</span>
                  <p class="normal">{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderPrice.roomAmount}}</p>
                </div>
              <li class="flex-column detail">
                <div class="item-left item-flex-row"><p class="normal">总金额</p><p>{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderBase.payablePrice}}</p></div>
             <!--   <div class="item-left item-flex-row" v-if="resOrderDetails.orderPaymentBase.paymentCouponAmount">
                  <span>优惠券</span>
                  <p class="normal">-{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderPaymentBase.paymentCouponAmount}}</p>
                </div>-->
                <div class="item-left item-flex-row"><p>实付款</p><p class="money"><span>{{resOrderDetails.merchant.currency}}</span>{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderBase.actuallyPaidPrice}}</p></div>
              </li>
            </ul>

            <div class="main-btn">

            </div>
          </div>
        </div>

        <!--  付款明细  -->
        <div class="pay-details" v-show="modalDetails == 'pay'">
          <div class="modal-head">
            <button type="button" class="back-btn" @click="toggleDetails('index')"></button>
          </div>
          <div class="modal-main">
            <h2>付款明细</h2>
            <p class="pay-info">在该酒店/民宿住宿 {{resOrderDetails.orderPrice.dayCount}}晚</p>
            <ul class="pay-items">
              <li>
                <div class="item-main">
                  <p>{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderPrice.avgPrice}} &times; {{resOrderDetails.orderPrice.dayCount}}晚</p>
                  <p class="money">{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderPrice.roomAmount}}</p>
                </div>
                <p class="item-info">平均每晚价格</p>
              </li>
              <li v-if="resOrderDetails.orderPaymentBase.weekMonthRentDiscount">
                <div class="item-main">
                  <p>周租折扣 (优惠{{parseInt(resOrderDetails.orderPaymentBase.weekMonthRentDiscount*100)}}%)</p>
                  <p class="money">{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderPaymentBase.weekMonthRentDiscountAmount}}</p>
                </div>
                <p class="item-info">入住7天及以上可享受周租折扣</p>
              </li>
              <li v-if="resOrderDetails.orderBase.depositFee">
                <div class="item-main">
                  <p>押金</p>
                  <p class="money">{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderBase.depositFee}}</p>
                </div>
                <!--<p class="item-info">芝麻信用650以上的，免押金</p>-->
              </li>
              <li v-if="resOrderDetails.orderBase.cleaningFee">
                <div class="item-main">
                  <p>清洁费</p>
                  <p class="money">{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderBase.cleaningFee}}</p>
                </div>
                <p class="item-info">房东收取的一次性清洁费，用于清洁房源</p>
              </li>
              <li v-if="resOrderDetails.orderBase.accidentInsuranceFee">
                <div class="item-main">
                  <p>意外险</p>
                  <p class="money">{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderBase.accidentInsuranceFee}}</p>
                </div>
                <!--<p class="item-info">{{resOrderDetails.orderBase._selfCurrencySymbol}}20 x 2人</p>-->
              </li>
              <li v-if="resOrderDetails.orderBase.totalChargeableServiceFee">
                <div class="item-main">
                  <p>额外服务费用</p>
                  <p class="money">{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderBase.totalChargeableServiceFee}}</p>
                </div>
                <p class="item-info">额外服务为附加的收费服务，由用户自行选择需要的服务。</p>
                <ul>
                  <li class="item" v-for="(item, idx) in resOrderDetails.serviceList" :key="item.id">
                    <p>{{item.serviceName}}({{resOrderDetails.orderBase._selfCurrencySymbol}}{{item.unitPrice}}/{{item.unitName}} &times; {{item.purchasingQuantity}})</p>
                    <p class="money">{{resOrderDetails.orderBase._selfCurrencySymbol}}{{(item.unitPrice*item.purchasingQuantity).toFixed(2)}}</p>
                  </li>
                </ul>
              </li>
              <li v-if="resOrderDetails.orderBase.consummationTax">
                <div class="item-main">
                  <p>GST (增值税)</p>
                  <p class="money">{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderBase.consummationTax}}</p>
                </div>
                <p class="item-info">{{resOrderDetails.merchant.location.country}}GST (增值税)税率：{{parseInt(resOrderDetails.orderBase.consummationTaxRate*100)}}%</p>
              </li>
              <li>
                <p>合计</p>
                <p class="money"><span>{{resOrderDetails.merchant.currency}}}</span>{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderBase.actuallyPaidPrice}}</p>
              </li>
            </ul>

            <div class="pay-foot">
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
  import { setRateItems, setOrderStatus } from '~/assets/js/utils'

  export default {
    name: "info-messages",
    data() {
      return {
        flagTabs: 0,
        resTabsList: [{
          name: '评论&回复',
          type: 1
        }, {
          name: '系统通知',
          type: 3
        }, {
          name: '服务评价',
          type: 2
        }],

        /**
         *  订单详情
         * */
        showOrderDetails:false,
        modalDetails:'index',
        resOrderDetails: {  //  订单
          orderBase: {
          },
          merchant: {
            banners: [''],
            location: {}
          },
          merchantUser: {
          },
          orderPaymentBase: {},
          orderPrice: {},
          serviceList: []
        },
        locationInfo: ''
      }
    },
    async asyncData (context) {
      !context.store.state.authUser.userId && context.redirect('/');

      let pt = context.store.state.deviceType.type;

      try{
        let { data } = await user.messages({pt: pt}, context.store.state.authUser, 1);
        if(data.code == 0){
          return {
            resData: data.result
          }
        }else{
          throw data.msg;
        }
      }catch (e){
        context.error({ statusCode: 400, message: e })
      }
    },
    computed: {
      ...mapState({
        deviceType: 'deviceType',
        authUser: 'authUser',
        currencyList: 'currencyList'
      }),
    },
    methods: {
      //  评论星级
      rateItems(rate) {
        return setRateItems(rate)
      },
      async toggleCategory(id, type){
        this.flagTabs = id;
        try{
          let { data } = await this.$api.user.messages({pt: this.deviceType.type}, this.authUser, type);
          if(data.code == 0){
            this.resData = data.result;
          }else{
            throw data.msg;
          }
        }catch (e){
          this.$toast.error(e)
        }
      },

      /**
       *  订单详情
       * */
      async showDetails(orderId){
        try {
          let { data } = await this.$api.order.detail({pt: this.deviceType.type}, this.authUser, orderId);
          if(data.code == 0){
            this.resOrderDetails = data.result;
            this.resOrderDetails.orderBase['_selfStatus'] = setOrderStatus(this.resOrderDetails.orderBase);
            this.currencyList.find( (item) => {
              if(item.currencyCode == this.resOrderDetails.orderBase.currency){
                this.resOrderDetails.orderBase['_selfCurrencySymbol'] = item.currencySymbol;
              }
            } );
            this.resOrderDetails.orderBase._selfCheckinCustomersList = JSON.parse(this.resOrderDetails.orderBase.checkinCustomersJson);
            this.locationInfo = (data.result.merchant.location.houseNumber ? data.result.merchant.location.houseNumber+'' : '') +
              (data.result.merchant.location.vallage ? data.result.merchant.location.vallage+' ' : '') +
              (data.result.merchant.location.street ? data.result.merchant.location.street+' ' : '') +
              (data.result.merchant.location.area ? data.result.merchant.location.area+' ' : '') +
              (data.result.merchant.location.city ? data.result.merchant.location.city+' ' : '') +
              (data.result.merchant.location.province ? data.result.merchant.location.province+' ' : '') +
              (data.result.merchant.location.country ? data.result.merchant.location.country+' ' : '');
            this.showOrderDetails = true
          }else{
            throw data.msg;
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      closeDetails(){
        this.showOrderDetails = false;
        this.modalDetails = 'index'
      },
      toggleDetails(type) {
        this.modalDetails = type
      },
    }

  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';

  .messages{
    >h2{
      padding-left: 8px;
      @include font-style(24px)
    }
    .tabs{
      padding-top: 24px;
      margin: 0;
    }
    .comment{
      padding: 0 8px;
    }
  }
  .tabs-items{
    border-bottom-color: $b3;
    >li{
      >a{
        padding: 12px 0;
        margin: 0 12px;
        border-bottom: 2px solid $b0;
        @include font-style(14px, $color: $t3);
        &:hover{
          color: $t1;
        }
      }
      &.is-active{
        >a{
          color: $t1;
          border-bottom: 2px solid $t1;
        }
      }
    }
  }
  .comments-content{
    >li{
      padding: 16px 0;
      &:not(:last-child){
        border-bottom: 1px solid $b3;
      }
    }
    .content-info{
      display: flex;
      >img{
        margin-right: 8px;
        @extend .l-user-info-face;
      }
      .info-head{
        display: flex;
        flex: 1;
        justify-content: space-between;
        .head-left{
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 5px 0;
          >h6{
            @include font-style(16px);
          }
          >p{
            @include font-style(14px, $color:$t2);
          }
        }
        .head-right{
          display: flex;
          align-items: center;
          >i{
            padding-left: 19px;
            margin: 0 6px;
            font-style: normal;
            @include font-style(14px,24px, $color:$t3);
          }
        }
      }
    }
    .content-title{
      padding: 16px 0;
      display: flex;
      justify-content: space-between;
      .title-left{
        width: 68%;
        display: flex;
        flex-direction: column;
        >h6{
          margin-bottom: 8px;
          @include one-line-hidden;
          @include font-style(16px,22px);
        }
        >p{
          @include more-line-hidden(2);
          @include font-style(14px,20px);
        }
        .rate{
          display: flex;
          justify-content: space-between;
          align-items: center;
          >span{
            @include font-style(14px, 20px, $color:$t3)
          }
        }
      }
      >img{
        width: 89px;
        height: 72px;
        border-radius: 4px;
      }
    }
    .content-txt{
      >p{
        @include font-style(16px, 26px);

        .light{
          color: $t6;
        }
      }
    }

    .system-info{
      display: flex;
      justify-content: space-between;
      >h5{
        @include font-style(18px);
        font-weight: bold;
      }
      >p{
        @include font-style(12px, 18px, $color: $t3);
      }
    }
    .system-txt{
      padding: 16px 0;
      @include font-style(16px, 26px);
    }
  }

  .comments-system{
    >li{
      &:hover{
        cursor: pointer;
        background-color: $b1;
      }

    }
    @extend .comments-content
  }

  .order-details{
    .modal-main{
      padding: 0 16px;
      .main-title{
        display: flex;
        justify-content: space-between;
        margin: 16px 0 24px 0;
        >h2{
          @include font-style(24px)
        }
        >p{
          @include font-style(14px, 24px, $color:$t3);
          &.light{
            color: $t6;
          }
          &.red{
            color: $t5;
          }
        }
      }
      .content-info{
        display: flex;
        justify-content: space-between;
        >img{
          width: 84px;
          height: 72px;
          border-radius: 4px;
          margin-right: 8px;
        }
        .info{
          flex: 1;
          overflow: hidden;
          .info-name{
            @include font-style(16px);
            @include one-line-hidden;
          }
          .info-type{
            display: flex;
            justify-content: space-between;
            margin: 12px 0;
            @include one-line-hidden;
            >p{
              &:first-child{
                @include font-style(12px, 16px, $color:$t3)
              }
              &:last-child{
                @include font-style(16px)
              }
            }
          }
          .info-date{
            @include font-style(14px, $color:$t2)
          }
        }
      }
      .head-logo{
        display: flex;
        justify-content: space-between;
        padding: 24px 0;
        .logo-left{
          flex: 1;
          padding: 4px 0;
          >h6{
            margin-bottom: 12px;
            @include font-style(16px);
          }
          >p{
            @include font-style(12px, $color:$t2);
            span{
              color: $t6;
            }
          }
        }
        >img{
          @extend .l-user-info-face
        }
      }
      .main-map{
        display: flex;
        align-items: center;
        >img{
          width: 38px;
          height: 38px;
        }
        >p{
          margin-left: 8px;
          @include font-style(14px);
        }
      }
      .main-items{
        display: flex;
        flex-direction: column;
        margin-top: 24px;
        >li{
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid $b3;
          padding: 24px 0;
          &.flex-column{
            flex-direction: column;
            align-items: start;
            .item-flex-row{
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
          }
          &.detail{
            padding: 8px 0;
            .item-left{
              padding: 8px 0;
              >span{
                margin-top: 0;
              }
            }

          }
          .item-left{
            >h6{
              @include font-style(20px);
            }
            >p{
              @include font-style(18px);
              &.light{
                @include font-style(16px, $color:$t6);
              }
              &.normal{
                @include font-style(16px, $color:$t2);
              }
              &.money{
                @include font-style(20px);
                >span{
                  @include font-style(14px, 16px);
                }
              }
            }
            >button{
              @include font-style(16px, $color:$t6);
            }
            >span{
              margin-top: 8px;
              display: inline-block;
              @include font-style(14px, $color:$t2);
            }
          }
          .item-right{
            >p{
              @include font-style(18px);
              &.light{
                @include font-style(16px, $color:$t6);
              }
              &.normal{
                @include font-style(16px, $color:$t2);
              }
            }
            >span{
              margin-top: 8px;
              display: inline-block;
              @include font-style(14px, $color:$t2);
            }
          }
        }
      }
      .main-btn{
        display: flex;
        justify-content: flex-end;
        padding: 1rem 0;
        >button{
          margin: 0 .5rem;
          padding: 6px 12px;
          border-radius: 3px;
          border: 1px solid $b3;
          @include font-style(14px, $color:$t3);
          &.light{
            background-color: $t4;
            border-color: $t4;
            color: $t1;
          }
        }
      }
    }
  }
  .pay-details{
    .modal-main{
      padding: 16px;
      >h2{
        @include font-style(18px);
      }
      .pay-info{
        margin-top: 24px;
        @include font-style(14px, 22px, $color:$t2);
      }
      .pay-items{
        >li{
          padding: 24px 0;
          &:not(:last-child){
            display: flex;
            flex-direction: column;
            border-bottom: 1px solid $b3;
          }
          &:last-child{
            display: flex;
            justify-content: space-between;
            align-items: center;
            >P{
              display: flex;
              @include font-style(20px);
              &.money{
                @include font-style(30px);
                >span{
                  @include font-style(16px, 22px);
                }
              }
            }
          }
          .item-main{
            display: flex;
            justify-content: space-between;
            align-items: center;
            >p{
              @include font-style(16px);
              &.money{
                @include font-style(20px);
              }
            }
          }
          .item-info{
            margin-top: 8px;
            @include font-style(14px, $color:$t2);
          }
          .item{
            display: flex;
            justify-content: space-between;
            align-items: center;
            >p{
              margin-top: 12px;
              @include font-style(14px);
              &.money{
                @include font-style(16px);
              }
            }
          }
        }
      }
      .pay-foot{
        padding: 24px 0;
        .sub-btn{
          width: 100%;
          height: 48px;
          background-color: $t4;
          border-radius: 4px;
          @include font-style(16px, 48px);

        }
      }
    }

  }

</style>
