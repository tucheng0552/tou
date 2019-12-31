<template>
  <div class="column is-12-touch order-details">
    <h1 v-if="resData.merchantTypeId == 2">预定民宿详情</h1>
    <h1 v-else-if="resData.merchantTypeId == 1">预定酒店详情</h1>
    <div class="details-head">
      <div class="head-info">
        <div class="info-txt">
          <h6>{{resData.name}}</h6>
          <span v-if="resData.merchantTypeId == 2">{{resData.livingRoomNum}}房{{resData.drawingRoomNum}}厅-{{resData.totalBedNum}}床{{resData.toiletNum}}卫</span>
          <span v-else-if="resData.merchantTypeId == 1">{{resData.roomTypes[roomTypeIndex].livingRoomNum}}间房-{{resData.roomTypes[roomTypeIndex].drawingRoomNum}}间客厅-{{resData.roomTypes[roomTypeIndex].toiletNum}}个卫生间</span>
          <!--  民宿  -->
          <p v-if="resData.merchantTypeId == 2">{{resData.location.street}} <b>(准确地址在付款后提供)</b></p>
          <!--  酒店  -->
          <p v-else-if="resData.merchantTypeId == 1">{{locationInfo}}</p>
        </div>
        <img :src="resData.banners[0]" alt="">
      </div>

      <div class="head-logo">
        <div class="logo-left">
          <h6>{{resData.merchantSubTypeName}}</h6>
          <p>房东：<span>{{resData.owner.username}}</span></p>
        </div>
        <img v-if="resData.owner" :src="resData.owner.faceUrl" alt="">
      </div>
    </div>

    <ul class="details-items">
      <li v-if="resData.merchantTypeId == 1" @click="changeDate">
        <div class="item-left">
          <p>房型：{{resData.roomTypes[roomTypeIndex].name}}	&times; {{roomTypeNum}}间</p>
        </div>
        <div class="item-right">
          <p class="light">更换</p>
        </div>
      </li>
      <li>
        <div class="item-left">
          <p>日期</p>
        </div>
        <div class="item-right">
          <p class="light">{{stayDate}}</p>
          <p style="margin-left: 8px">共{{resPrice.dayCount}}晚</p>
        </div>
      </li>
      <li @click="setPop">
        <div class="item-left">
          <p>入住人数</p>
        </div>
        <div class="item-right">
          <p class="light">{{pop.sum}}人</p>
        </div>
      </li>
      <li class="flex-column" @click="openInfoPop">
        <div class="item-left item-flex-row">
          <p>入住人</p>
          <p class="light">添加</p>
        </div>
        <ul class="item-right item-flex-column" v-if="listInfoPop.length > 0">
          <li class="info-pop" v-for="(item, idx) in listInfoPop" :key="item.id">
            <span>{{item.name}}</span>
            <span style="margin-left: 16px">{{item.identificationNumber}}</span>
          </li>
        </ul>
      </li>
      <li @click="openProtocol">
        <div class="item-left">
          <p>入住协议</p>
        </div>
        <div class="u-checkbox-round">
          <input class="checkbox-toggle" type="checkbox" id="protocol" value="insurance" v-model="isProtocol" disabled="disabled">
          <label for="protocol" class=""></label>
        </div>
      </li>
      <!--<li @click="toggleInsurance">
        <div class="item-left">
          <p>购买意外险</p>
          <span>{{currencySymbol}}{{resPrice.accidentInsuranceUnitFee}}/人</span>
        </div>
        <div class="u-checkbox-round">
          <input class="checkbox-toggle" type="checkbox" id="insurance" value="insurance" v-model="isInsurance" disabled="disabled">
          <label for="insurance" class=""></label>
        </div>
      </li>
      <li @click.stop="openInvoice">
        <div class="item-left">
          <p>开具发票</p>
        </div>
        <div class="u-switch">
          <input id="invoice" class="switch-toggle switch-toggle-round" type="checkbox" v-model="isInvoice" disabled="disabled">
          <label for="invoice"></label>
        </div>
      </li>-->
   <!--   <li>
        <div class="item-left">
          <p>优惠券</p>
        </div>
        <div class="item-right">选择优惠券</div>
      </li>-->
      <li class="flex-column" v-if="resPrice.depositFee">
        <div class="item-left item-flex-row">
          <p>押金</p>
          <p class="money">{{currencySymbol}}{{resPrice.depositFee}}</p>
        </div>
        <div class="item-right">
          <!--<span>芝麻信用650以上的，可免押金 <button type="button">立即授权</button></span>-->
        </div>
      </li>
      <li class="flex-column" @click="allService" v-if="resPrice.services">
        <div class="item-left item-flex-row">
          <p>额外服务</p>
          <!--<p class="light">选择</p>-->
          <p class="light">修改</p>
        </div>
        <p class="service-info">额外服务为附加的收费服务，由用户自行选择需要的服务。</p>
        <ul class="item-right item-flex-column service-items">
          <li class="" v-for="(item, idx) in selectPriceServices" :key="item.id">
            <p>{{item.name}}({{currencySymbol}}{{item.unitPrice}}/{{item.unit}} &times; {{item.quantity}})</p>
            <p class="money">{{currencySymbol}}{{(item.unitPrice*item.quantity).toFixed(2)}}</p>
          </li>
        </ul>
      </li>
      <li>
        <div class="item-left">
          <p>注意事项</p>
          <span class="red">已购买的折扣或活动商品，一律不支持退款</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import dayjs from 'dayjs'

  export default {
    name: "order-detail",
    props: {
      resData: {
        type: Object,
        request: true,
        default: () => {}
      },
      roomTypeIndex: {
        type: String,
        request: true,
        default: () => ''
      },
      roomTypeNum: {
        type: String,
        request: true,
        default: () => ''
      },
      resPrice: {
        type: Object,
        request: true,
        default: () => {}
      },
      selectPriceServices: {
        type: Array,
        request: true,
        default: () => []
      },
      locationInfo: {
        type: String,
        request: true,
        default: () => ''
      },
      pop: {
        type: Object,
        request: true,
        default: () => {}
      },
      listInfoPop: {
        type: Array,
        request: true,
        default: () => []
      },
      isInvoice: {
        type: Boolean,
        request: true,
        default: () => false
      },
      isInsurance: {
        type: Boolean,
        request: true,
        default: () => false
      },
      isProtocol: {
        type: Boolean,
        request: true,
        default: () => false
      },
      currencySymbol: {
        type: String,
        request: true,
        default: () => ''
      }
    },
    data() {
      return {
        stayDate: undefined
      }
    },
    mounted(){
      this.stayDate = `${dayjs(this.resPrice.arrivalDate).format('MM月DD日')}-${dayjs(this.resPrice.departureDate).format('MM月DD日')}`;
    },
    watch:{

    },
    methods: {
      changeDate(){
        this.$router.go(-1)
      },
      /**
       * 入住人数
       * */
      setPop(){
        this.$emit('set-pop');
      },

      /**
       * 入住协议
       * */
      openProtocol() {
        this.$emit('open-protocol');
      },
      toggleProtocol() {
        this.$emit('toggle-protocol');
      },

      /**
       * 发票
       * */
      openInvoice(){
        this.$emit('open-invoice');
      },

      /**
       * 入住人信息
       * */
      openInfoPop(){
        this.$emit('open-infoPop');
      },

      /**
       *  服务协议
       * */
      allService(){
        this.$emit('all-service');
      },

      /**
       *  意外险
       * */
      toggleInsurance(){
        this.$emit('toggle-insurance');
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';

  @media screen and #{$touch-width}{
    .order-details{
      margin-bottom: 81px;
    }
  }

  .order-details{
    padding: 8px;
    >h1{
      @include font-style(24px)
    }
    .details-head{
      .head-info{
        display: flex;
        justify-content: space-between;
        margin-top: 24px;
        .info-txt{
          max-width: 55%;
          >h6{
            @include one-line-hidden;
            @include font-style(16px)
          }
          >span{
            display: inline-block;
            margin: 8px 0;
            @include font-style(12px, $color:$t3)
          }
          >p{
            @include font-style(14px, $color:$t2);
            @include more-line-hidden;
            >b{
              color: $t1
            }
          }
        }
        >img{
          width: 120px;
          height: 96px;
          border-radius: 4px;
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
    }
    .details-items{
      display: flex;
      flex-direction: column;
      >li{
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid $b3;
        padding: 24px 0;
        &:not(:last-child) {
          &:hover{
            cursor: pointer;
            background-color: $b1;
          }
        }
        &.flex-column{
          flex-direction: column;
          align-items: start;
          .item-flex-row{
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .item-flex-column{
            display: flex;
            flex-direction: column;
            >li{
              padding-top: 12px;
            }
            .info-pop{
              >span{@include font-style(14px, $color: $t2)}
            }
          }
          .service-info{
            margin-top: 8px;
            @include font-style(14px, 22px, $color:$t2)
          }
          .service-items{
            width: 100%;
            >li{
              display: flex;
              justify-content: space-between;
              >p{
                @include font-style(14px, 16px);
                &.money{
                  @include font-style(16px);
                }
              }
            }
          }
        }
        .item-left{
          >p{
            @include font-style(18px);
            &.light{
              color: $t6;
            }
            &.money{
              @include font-style(20px);
            }
          }
          >span{
            display: inline-block;
            @include font-style(14px, $color:$t2);
            &.red{
              color: $t5;}
          }
        }
        .item-right{
          display: flex;
          >p{
            @include font-style(18px);
            &.light{
              color: $t6;
            }
          }
          >span{
            display: inline-block;
            @include font-style(14px, $color:$t2);
          }
        }
      }
    }
  }

</style>
