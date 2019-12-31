<template>
  <div>
    <h5 class="pay-title">付款明细</h5>
    <p class="pay-info">在该酒店/民宿住宿 {{resPrice.dayCount}}晚</p>
    <ul class="pay-items">
      <li v-if="resPrice.roomNumSalePromotion">
        <div class="item-main">
          <p>{{currencySymbol}}{{resPrice.avgPriceSalePromotion}} &times; {{resPrice.dayCount}}晚 	&times; {{resPrice.roomNumSalePromotion}}间</p>
          <p class="money">{{currencySymbol}}{{resPrice.roomAmountSalePromotion}}</p>
        </div>
        <p class="item-info">促销房型-平均每晚价格</p>
      </li>
      <li>
        <div class="item-main">
          <p v-if="roomTypeNum">{{currencySymbol}}{{resPrice.avgPrice}} &times; {{resPrice.dayCount}}晚 	&times; {{roomTypeNum}}间</p>
          <p v-else>{{currencySymbol}}{{resPrice.avgPrice}} &times; {{resPrice.dayCount}}晚</p>
          <p class="money">{{currencySymbol}}{{resPrice.roomAmount}}</p>
        </div>
        <p class="item-info">平均每晚价格</p>
      </li>
      <li v-if="resPrice.weekRentDiscountFee">
        <div class="item-main">
          <p>周租折扣 (优惠{{parseInt(resPrice.weekRentDiscount*100)}}%)</p>
          <p class="money">&nbsp;{{currencySymbol}}{{resPrice.weekRentDiscountFee}}</p>
        </div>
        <p class="item-info">入住7天及以上可享受周租折扣</p>
      </li>
      <li v-if="resPrice.depositFee">
        <div class="item-main">
          <p>押金</p>
          <p class="money">{{currencySymbol}}{{resPrice.depositFee}}</p>
        </div>
        <!--<p class="item-info">芝麻信用650以上的，免押金</p>-->
      </li>
      <li v-if="resPrice.cleaningFee">
        <div class="item-main">
          <p>清洁费</p>
          <p class="money">{{currencySymbol}}{{resPrice.cleaningFee}}</p>
        </div>
        <p class="item-info">房东收取的一次性清洁费，用于清洁房源</p>
      </li>
      <li v-if="resPrice.accidentInsuranceNumber">
        <div class="item-main">
          <p>意外险</p>
          <p class="money">{{currencySymbol}}{{resPrice.accidentInsuranceUnitFee * resPrice.accidentInsuranceNumber}}</p>
        </div>
        <p class="item-info">{{currencySymbol}}{{resPrice.accidentInsuranceUnitFee}}	&times; {{resPrice.accidentInsuranceNumber}}人</p>
      </li>
      <li v-if="resPrice.serviceAmountFee">
        <div class="item-main">
          <p>额外服务费用</p>
          <p class="money">{{currencySymbol}}{{resPrice.serviceAmountFee}}</p>
        </div>
        <p class="item-info">额外服务为附加的收费服务，由用户自行选择需要的服务。</p>
        <ul class="item-service">
          <li v-for="(item, idx) in selectPriceServices" :key="item.id">
            <p>{{item.name}}({{currencySymbol}}{{item.unitPrice}}/{{item.unit}} &times; {{item.quantity}})</p>
            <p class="money">{{currencySymbol}}{{(item.unitPrice*item.quantity).toFixed(2)}}</p>
          </li>
        </ul>
      </li>
      <li v-if="resPrice.taxFee">
        <div class="item-main">
          <p>GST (增值税)</p>
          <p class="money">{{currencySymbol}}{{resPrice.taxFee}}</p>
        </div>
        <p class="item-info">{{resData.location.country}}GST (增值税)税率：{{resPrice.taxRate}}%</p>
      </li>
      <li>
        <p>合计</p>
        <p class="money"><span>{{currencyCode}}</span>{{currencySymbol}}{{resPrice.amount}}</p>
      </li>
    </ul>

    <div class="pay-foot is-hidden-touch"> <!--  is-hidden-touch -->
      <button type="button" class="sub-btn" @click="openPay">提交订单</button>
    </div>

  </div>
</template>

<script>
  export default {
    name: "order-pay",
    props: {
      resData: {
        type: Object,
        request: true,
        default: () => {}
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
      roomTypeNum: {
        type: String,
        // request: true,
        default: () => undefined
      },
      currencyCode: {
        type: String,
        request: true,
        default: () => ''
      },
      currencySymbol: {
        type: String,
        request: true,
        default: () => ''
      }
    },
    methods: {
      openPay() {
        this.$emit('open-pay')
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';

  @media screen and #{$desktop-width}{
    .pay-title{
      @include font-style(18px);
      font-weight: bold;
    }
  }

  @media screen and #{$touch-width}{
    .pay-title{
      @include font-style(24px);
      font-weight: bold;
    }
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
      .item-service{
        >li{
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

</style>
