<template>
  <div>
    <div class="transaction">
      <h2>交易记录</h2>

      <div v-if="resData.length > 0"> <!--    -->
        <ul class="transaction-list">
          <li v-for="(item, idx) in resData" :key="item.id" @click="toggleDetails(item)">
            <div class="item">
              <img :src="item.actionIcon" alt="">
              <!--<img src="~/assets/image/icon/shop_home_list_icon_pay@3x.png" alt="">-->
              <div class="item-content">
              <!--  <p v-if="item.businessType == 1">餐饮-{{item.actionTitle}}</p>
                <p v-else-if="item.businessType == 2">酒店-{{item.actionTitle}}</p>
                <p v-else-if="item.businessType == 3">旅游-{{item.actionTitle}}</p>
                <p v-else-if="item.businessType == 4">专车-{{item.actionTitle}}</p>
                <p v-else-if="item.businessType == 5">娱乐-{{item.actionTitle}}</p>-->
                <p>{{item.actionTitle}}</p>
                <p>{{item.actionDesc}}</p>
                <p>
                  <span v-if="item.actionType == 1">类型：提现</span>
                  <span v-else-if="item.actionType == 2">类型：消费</span>
                  <span v-else-if="item.actionType == 3">类型：退款</span>
                  <span v-else-if="item.actionType == 4">类型：奖励</span>
                  <span>{{item.createdAt}}</span>
                </p>
              </div>
              <p class="u-price-num price">{{item.valueIncrement}}</p>
            </div>
          </li>
        </ul>

        <div class="index-foot-btn" v-if="isMoreList">
          <button type="button" @click="pushMoreList">加载更多</button>
        </div>
      </div>

      <div class="transaction-text" v-else>
        <p>无交易记录</p>
      </div>
    </div>

    <!--  交易详情   -->
    <div :class="[showTransaction ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="toggleDetails"></div>
      <div class="modal-content">
        <div class="transaction-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="toggleDetails"></button>
          </div>
          <div class="modal-main">
            <h2>交易详情</h2>
            <div class="main-head">
              <div class="head-info" v-if="transactionItem.orderItems[0]">
                <img :src="transactionItem.orderItems[0].coverImgUrl" alt="">
                <!--<img src="~/assets/image/icon/shop_home_list_icon_pay@3x.png" alt="">-->
                <p>{{transactionItem.walletBillLog.actionTitle}}-{{transactionItem.walletBillLog.actionDesc}}</p>
              </div>
              <p class="u-price-num price">{{transactionItem.valueIncrement}}</p>
              <p class="txt">交易成功</p> <!--  {{transactionItem.payInfo.statusRemark}}  -->
            </div>

            <ul class="main-items" v-if="transactionItem.payInfo && transactionItem.zhuSuPayInfo">
              <li>
                <div class="item">
                  <p class="normal">支付方式</p>
                  <p class="small">{{transactionItem.payInfo.paymentMethod}}</p>
                </div>
              </li>
              <li>
                <div class="item">
                  <p class="normal">订单号</p>
                  <p class="small">{{transactionItem.payInfo.orderNo}}</p>
                </div>
                <div class="item">
                  <p class="normal">交易时间</p>
                  <p class="small">{{transactionItem.payInfo.createAt}}</p>
                </div>
              </li>
              <li>
                <h4>付款信息</h4>
              </li>
              <li>
                <div class="item">
                  <p class="small">{{transactionItem.walletBillLog._selfCurrencySymbol}}
                    {{transactionItem.zhuSuPayInfo.avgPrice}} x {{transactionItem.zhuSuPayInfo.dayCount}}晚</p>
                  <p class="normal">{{transactionItem.walletBillLog._selfCurrencySymbol}}
                    {{transactionItem.zhuSuPayInfo.roomAmount}}</p>
                </div>
                <div class="item">
                  <p class="small">押金</p>
                  <p class="normal">{{transactionItem.walletBillLog._selfCurrencySymbol}}
                    {{transactionItem.zhuSuPayInfo.depositFee}}</p>
                </div>
                <div class="item">
                  <p class="small">清洁费</p>
                  <p class="normal">{{transactionItem.walletBillLog._selfCurrencySymbol}}
                    {{transactionItem.zhuSuPayInfo.cleaningFee}}</p>
                </div>
                <div class="item">
                  <p class="small">额外服务费用</p>
                  <p class="normal">{{transactionItem.walletBillLog._selfCurrencySymbol}}
                    {{transactionItem.zhuSuPayInfo.serviceAmountFee}}</p>
                </div>
              </li>
              <li>
                <div class="item">
                  <p class="normal">总金额</p>
                  <p class="big">{{transactionItem.walletBillLog._selfCurrencySymbol}}{{transactionItem.walletBillLog.amount}}</p>
                </div>
                <div class="item" v-if="transactionItem.pointsAmount">
                  <p class="small">DP抵扣</p>
                  <p class="normal">-{{transactionItem.walletBillLog._selfCurrencySymbol}}{{transactionItem.pointsAmount}}</p>
                </div>
                <div class="item">
                  <p class="big">实付款</p>
                  <p class="most"><span>{{transactionItem.walletBillLog.currency}}</span>{{transactionItem.walletBillLog._selfCurrencySymbol}}{{transactionItem.walletBillLog.realAmount}}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import wallet from '~/assets/js/api/wallet'
  import { mapState } from 'vuex'
  export default {
    name: "info-transaction",
    data(){
      return {
        showTransaction: false,
        transactionItem: {
          payInfo: {},
          zhuSuPayInfo: {},
          orderItems: [],
          walletBillLog: {}
        },
        isMoreList: false,
        selfCursor: 1
      }
    },

    async asyncData (context) {
      !context.store.state.authUser.userId && context.redirect('/');

      let pt = context.store.state.deviceType.type;

      try{
        let { data } = await wallet.getBillList({pt: pt}, {
          uid: context.store.state.authUser.userId
        });
        if(data.code == 0){
          return {
            resData:data.result,
            isMoreList: (data.result.length < 10) ? false : true
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
        authUser: 'authUser',
        currencyList: 'currencyList'
      }),
    },
    methods: {
      async pushMoreList(){
        try {
          let { data } = await this.$api.wallet.getBillList({pt: this.deviceType.type}, {
            page: this.selfCursor*10,
            pageSize: 10,
            uid: this.authUser.userId});
          if(data.code == 0){
            let _selfList = data.result;
            if(_selfList.length > 0){
              this.resData.push(..._selfList);
              this.selfCursor ++;
            }
            if(_selfList.length < 10){
              this.isMoreList = false
            }
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      async toggleDetails(item){
        if(item.uid){
          try{
            let { data } = await this.$api.wallet.getBillDetail({pt: this.deviceType.type}, {
              uid: item.uid,
              billId: item.id
            });
            if(data.code == 0){
              this.transactionItem = data.result;
              this.currencyList.find( (item) => {
                if(item.currencyCode == this.transactionItem.walletBillLog.currency){
                  this.transactionItem.walletBillLog['_selfCurrencySymbol'] = item.currencySymbol;
                }
              } )
            }else {
              throw data.msg
            }
          }catch (e){
            this.$toast.error(e)
          }
        }
        this.showTransaction = !this.showTransaction
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';

  @media screen and #{$desktop-width}{
    .transaction{
      >h2{
        padding-left: 8px;
      }
      .transaction-list{
        padding: 24px 8px;
        >li{

        }
      }
    }
  }
  @media screen and #{$touch-width}{
    .transaction{
      >h2{
        text-align: center;
      }
      .transaction-list{
        padding: 8px;
        >li{

        }
      }
    }
  }

  .transaction{
    >h2{
      @include font-style(24px)
    }
    .transaction-list{
      display: flex;
      flex-direction: column;
      >li{
        &:not(:last-child){
          border-bottom: 1px solid $b3;
        }
        &:hover{
          cursor: pointer;
          background-color: $b1;
        }
        padding: 16px 0;
        .item{
          display: flex;
          justify-content: space-between;
          >img{
            width: 48px;
            height: 48px;
            border-radius: 50%;
          }
          .item-content{
            display: flex;
            flex-direction: column;
            flex: 1;
            padding: 0 8px;
            >p{
              &:nth-of-type(1){
                padding: 8px 0;
                @include font-style(16px)
              }
              &:nth-of-type(2){
                padding-bottom: 12px;
                @include font-style(14px, $color:$t2)
              }
              &:nth-of-type(3){
                display: flex;
                justify-content: space-between;
                span{
                  @include font-style(12px, $color:$t3)
                }
              }
            }

          }
          .price{
            @include font-style(20px)
          }
        }
      }
    }
    .transaction-text{
      padding: 24px 8px;
      >p{
        @include font-style(14px, $color:$t2);
      }
    }
    .index-foot-btn{
      padding: 48px 0;
      text-align: center;
      >button{
        padding: 15px 32px;
        background-color: $t4;
        border-radius: 4px;
        @include font-style(18px)
      }
    }
  }

  .transaction-modal{
    .modal-main{
      display: flex;
      flex-direction: column;
      padding: 16px;
      >h2{
        text-align: center;
        @include font-style(24px)
      }
      .main-head{
        padding: 12px 0;
        display: flex;
        flex-direction: column;
        text-align: center;
        .head-info{
          display: flex;
          align-items: center;
          margin: 0 auto;
          >img{
            width: 24px;
            height: 24px;
            border-radius: 50%;
          }
          >p{
            margin-left: 8px;
            @include font-style(16px)
          }

        }
        .price{
          padding: 16px 0 8px 0;
          @include font-style(36px)
        }
        .txt{
          @include font-style(14px, $color:$t3)
        }
      }
      .main-items{
        padding: 12px 0;
        >li{
          &:not(:last-child){
            border-bottom: 1px solid $b3;
          }
          padding: 10px 0;
          .item{
            padding: 6px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .small{
              @include font-style(14px)
            }
            .normal{
              @include font-style(16px)
            }
            .big{
              @include font-style(18px)
            }
            .most{
              @include font-style(20px);
              >span{
                @include font-style(14px)
              }
            }
          }
          >h4{
            padding-top: 32px;
            @include font-style(20px)
          }
        }
      }
    }
  }
</style>
