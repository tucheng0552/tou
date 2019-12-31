<template>
  <div>
    <div class="DP">
      <h2>我的 DP</h2>
      <div class="DP-bg">
        <div class="DP-info" @click="toggleExplain">
          <div class="info">
            <p>可用DP</p>
            <p>说明</p>
          </div>
          <p class="u-price-num price">{{resData.virtualPoints}}</p>
        </div>

        <ul class="DP-items">
          <li @click="toggleDetails">
            <div class="left">
              <img src="~/assets/image/icon/my_dp_list_icon_bill@3x.png" alt="">
              <p>DP 收支记录</p>
            </div>
            <p class="right">查看</p>
          </li>
          <li @click="toggleDPStore">
            <div class="left">
              <img src="~/assets/image/icon/my_dp_list_icon_ticket@3x.png" alt="">
              <p>DP 兑换卡券</p>
            </div>
            <p class="right">兑换</p>
          </li>
          <li @click="pathHavein">
            <div class="left">
              <img src="~/assets/image/icon/my_dp_list_icon_havein@3x.png" alt="">
              <p>Havein 中心</p>
            </div>
            <p class="right">进入</p>
          </li>
        </ul>
      </div>

    </div>

    <!--  DP 收支记录   -->
    <div :class="[showDPModal ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="toggleDetails"></div>
      <div class="modal-content">
        <div class="DP-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="toggleDetails"></button>
          </div>
          <div class="modal-main">
            <h2>DP 收支记录</h2>
            <ul class="main-items" v-if="DPRecords">
              <li v-for="(item, idx) in DPRecords" :key="item.id">
                <div class="item-top">
                  <p>{{item.actionRemark}}</p>
                  <p class="u-price-num">{{item.amount}}</p>
                </div>
                <div class="item-bottom">
                  <p>{{item.createAt}}</p>
                  <p>剩余: {{item.newPoints}}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!--  DP 说明  -->
    <div :class="[showRule ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="toggleExplain"></div>
      <div class="modal-content" style="display: flex">
        <div class="activity-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="toggleExplain"></button>
          </div>
          <div class="modal-main">
            <iframe :src="dpAssetsUrl+'/DP-explain.html'" style="border: none; width: 100%; height: 100%"></iframe>
          </div>
        </div>
      </div>
    </div>

    <!--  DP 卡券商城  -->
    <div :class="[showDPStore ? 'is-active' : '', 'modal']" > <!--  v-if="resDPStore" -->
      <div class="modal-background" @click="toggleDPStore"></div>
      <div class="modal-content">
        <div v-show="modalDPStore == 'index'" class="DPStore-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="toggleDPStore"></button>
          </div>
          <div class="modal-main">
            <h2>DP 卡券商城</h2>
            <ul class="main-items">
              <li v-for="(item, idx) in resDPStore" :key="item.id">
                <div class="item">
                  <div class="item-left">
                    <h6>{{item.title}}</h6>
                    <p class="info">数量：{{item.stock}}张</p>  <!--  数量：{{item.count}}张  -->
                    <p class="date">有效期：{{item.createdAt}}</p>
                  </div>
                  <div class="item-right">
                    <p><b>{{item.point}}</b>&nbsp;{{item.symbol}}</p>
                    <button type="button" class="btn" @click="setModalDPStore('active', item)">兑换</button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div v-show="modalDPStore == 'active'" class="DPActive-modal">
          <div class="modal-head">
            <button type="button" class="back-btn" @click="setModalDPStore('index')"></button>
          </div>
          <div class="modal-main">
            <h2>兑换电子卡券</h2>
            <ul class="main-items">
              <li>
                <div class="item">
                  <div class="item-left">
                    <h6>{{selectDPItem.title}}</h6>
                    <p class="info">数量：{{selectDPItem.stock}}张</p>  <!--    -->
                    <p class="date">有效期：{{selectDPItem.createdAt}}</p>
                  </div>
                  <div class="item-right">
                    <p><b>{{selectDPItem.point}}</b>&nbsp;{{selectDPItem.symbol}}</p>
                  </div>
                </div>
              </li>
            </ul>

            <div class="active-card">
              <div class="card-select">
                <p>使用张数</p>
                <div class="btn">
                  <button class="dis-min" type="button" @click="minActiveNum"></button>
                  <p id="numCard">{{selectDPItem._selfNum}}</p>
                  <button class="nor-add" type="button" @click="addActiveNum"></button>
                </div>
              </div>
              <p class="info">温馨提示：</p>
              <p class="info">该电子卡券只能兑换到绑定了Havein账号的消费商账户中激活使用，不可转移、转送或者转卖；还未绑定消费商账号的用户，在提交订单后会提示去绑定。</p>
            </div>

            <div class="modal-foot">
              <p class="price"><span class="currency">合计</span><span class="lowest">{{1050}}</span>&nbsp;DP</p>
              <button type="button" @click="setModalDPStore('submit')">立即兑换</button>
            </div>
          </div>
        </div>

        <div v-show="modalDPStore == 'submit'" class="DPSubmit-modal">
          <div class="modal-head">
            <button type="button" class="back-btn" @click="setModalDPStore('active')"></button>
          </div>
          <div class="modal-main">
            <h2>输入交易密码</h2>
            <div class="verify-input">
              <!-- 实际显示 -->
              <ul class="input-list">
                <li v-for="(item, idx) in payPwdArr" :key="item.id">{{item}}</li>
              </ul>
              <!-- 用户输入 -->
              <div class="input">
                <input type="tel" maxlength="6" @input="setPayPwd" v-model="payPwd">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import wallet from '~/assets/js/api/wallet'
  import { mapState } from 'vuex'
  import { aesDecrypt } from "~/assets/js/utils";
  import config from '~/assets/js/config'

  export default {
    name: "info-DP",
    data(){
      return {
        dpAssetsUrl: undefined,

        showDPModal: false,
        DPRecords: undefined,
        showRule: false,

        /**
         *  DP 卡券商城
         * */
        showDPStore: false,
        modalDPStore: 'index',
        resDPStore: undefined,
        selectDPItem: {
          _selfNum: 1,
        },

        payPwd: '',
        payPwdArr: ['', '', '', '', '', '']
      }
    },
    async asyncData (context) {
      !context.store.state.authUser.userId && context.redirect('/');

      let pt = context.store.state.deviceType.type;

      try{
        let { data } = await wallet.getAssetSummaryInfo({pt: pt}, context.store.state.authUser.userId);
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
        authUser: 'authUser',
      }),
    },
    mounted(){
      this.dpAssetsUrl = config.DP_ASSETS_URL;
    },
    methods: {
      async toggleDetails(){
        if(!this.DPRecords){
          try {
            let { data } = await this.$api.wallet.getVirtualPointList({pt: this.deviceType.type}, this.authUser.userId);
            if(data.code == 0){
              this.DPRecords = data.result
            }else {
              throw data.msg
            }
          }catch (e){
            this.$toast.error(e)
          }
        }
        this.showDPModal = !this.showDPModal
      },

      toggleExplain(){
        this.showRule = !this.showRule
      },

      pathHavein(){
        /*window.localStorage.setItem('USER_AUTH', JSON.stringify({
          Username: undefined,
          Password: undefined,
          session: undefined
        }));
        window.open('')*/
      },


      /**
       *  DP 卡券商城
       * */
      async toggleDPStore(){
        if(!this.resDPStore){
          try {
             let { data } = await this.$api.wallet.getGiftCardList({pt: this.deviceType.type}, this.authUser);
             if(data.code == 0){
               this.resDPStore = data.result
             }else {
               throw data.msg
             }
          }catch (e){
            this.$toast.error(e)
          }
        }
        this.showDPStore = !this.showDPStore
      },

      setModalDPStore(type, item){
        this.modalDPStore = type;
        item && (this.selectDPItem = {
          _selfNum: 1,
          ...item
        })
      },

      minActiveNum(){
        this.selectDPItem._selfNum > 0 && this.selectDPItem._selfNum--
      },
      addActiveNum(){
        (this.selectDPItem._selfNum < this.selectDPItem.limit) && this.selectDPItem._selfNum++
      },

      //  输入交易密码
      async setPayPwd(){
        let _selfArr = this.payPwd.split('');
        for (let index of this.payPwdArr.keys()) {
          if(_selfArr[index]){
            this.payPwdArr[index] = _selfArr[index]
          }else{
            this.payPwdArr[index] = ''
          }
        }
        if(_selfArr.length > 5){
          this.payPwdArr = _selfArr;
          try{
              // let { data } = await this.$api.wallet.buyGiftCard({pt: this.deviceType.type}, { uid: , stackId:  , num:    })
          }catch (e){
            this.$toast.error(e)
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';

  @media screen and #{$desktop-width}{
    .DP{
      >h2{
        margin-bottom: 24px;
      }
      .DP-bg{
        padding: 160px 48px 0 48px;
        background-image: url('~assets/image/icon/business_statistics_img_bg_head@3x.png');
        background-repeat: no-repeat;
        background-size: 100% 50%;
      }
    }
    .DPStore-modal{
      .modal-main{
        .main-items{
          >li{width: 50%;}
        }
      }
    }
  }
  @media screen and #{$touch-width}{
    .DP{
      background-image: url('~assets/image/icon/business_statistics_img_bg_head@3x.png');
      background-repeat: no-repeat;
      background-size: 100% 50%;
      .DP-bg{
        padding-top: 88px;

      }
    }

    .DPStore-modal{
      .modal-main{
        .main-items{
          >li{width: 100%;}
        }
      }
    }

    .DPActive-modal{
      .modal-main{
        //height: calc(100vh - 42px);
        .modal-foot{
          position: fixed;
          left: 0;
          bottom: 0;
          width: 100vw;
        }
      }
    }
  }

  .DPCardItem{
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
        margin: 8px 0 40px 0;
        @include font-style(14px, 20px);
      }
      .date{
        @include font-style(12px, $color:$t2)
      }
    }
    .item-right{
      width: 26%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      >p{
        >b{
          @include font-style(36px, $color: $t5);
          //@include font-style(48px, $color: $t5);
        }
        >span{
          @include font-style(14px);
        }
      }
      .btn{
        margin-top: 12px;
        width: 72px;
        height: 24px;
        @include font-style(12px);
        background-color: $t4;
        border-radius: 12px;
      }
    }
  }

  .DP{
    padding: 0 8px;
    >h2{
      @include font-style(24px)
    }

  }
  .DP-bg{

  }
  .DP-info{
    background-color: $b0;
    &:hover{
      cursor: pointer;
      background-color: $b1;
    }
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 16px 0 rgba(73,66,30,0.16);
    border-radius: 8px;
    padding: 32px 16px;
    margin: 16px auto;
    .info{
      display: flex;
      justify-content: space-between;
      >p{
        &:first-child{
          @include font-style(18px)
        }
        &:last-child{
          @include bg-image('~assets/image/icon/global_icon_list_arrow.png', 6px, 12px, $top:100%, $left:100%);
          @include font-style(14px, $color:$t3);
          padding: 2px 10px 2px 0;
        }
      }
    }
    .price{
      margin-top: 16px;
      @include font-style(30px, $color: $t5)
    }
  }
  .DP-items{
    >li{
      &:hover{
        cursor: pointer;
        background-color: $b1;
      }
      &:not(:last-child){
        border-bottom: 1px solid $b3;
      }
      padding: 24px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left{
        display: flex;
        align-items: center;
        >img{
          width: 24px;
          height: 24px;
        }
        >p{
          padding-left: 8px;
          @include font-style(18px)
        }
      }
      .right{
        @include bg-image('~assets/image/icon/global_icon_list_arrow.png', 6px, 12px, $top:100%, $left:100%);
        @include font-style(14px, $color:$t2);
        padding: 2px 14px 2px 0;
      }
    }
  }

  .DP-modal{
    .modal-main{
      display: flex;
      flex-direction: column;
      padding: 0 16px;
      >h2{
        text-align: center;
        @include font-style(24px)
      }
    }
    .main-items{
      >li{
        &:not(:last-child){
          border-bottom: 1px solid $b3;
        }
        display: flex;
        flex-direction: column;
        padding: 16px 0;
        .item-top{
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          >p{
            &:first-child{
              @include font-style(16px)
            }
            &:last-child{
              @include font-style(20px)
            }
          }
        }
        .item-bottom{
          display: flex;
          justify-content: space-between;
          align-items: center;
          >p{
            &:first-child{
              @include font-style(12px)
            }
            &:last-child{
              @include font-style(12px, $color: $t3)
            }
          }
        }
      }
    }
  }

  .activity-modal{
    flex: 1;
    overflow-y: hidden;
    .modal-main{
      height: calc(100% - 42px);
    }
  }

  .DPStore-modal{
    .modal-main{
      display: flex;
      flex-direction: column;
      padding: 0 8px;
      >h2{
        padding-left: 8px;
        @include font-style(24px)
      }
      .main-items{
        display: flex;
        flex-wrap: wrap;
        padding: 24px 0;
        >li{
          padding: 8px;
          .item{
            @extend .DPCardItem
          }

        }
      }
    }
  }

  .DPActive-modal{
    .modal-main{
      display: flex;
      flex-direction: column;
      >h2{
        padding-left: 16px;
        @include font-style(24px)
      }
      .main-items{
        display: flex;
        flex-wrap: wrap;
        padding: 24px 0;
        >li{
          width: 100%;
          padding: 8px 16px;
          .item{
            @extend .DPCardItem
          }
        }
      }
      .active-card{
        padding: 0 16px;
        margin-bottom: 48px;
        .card-select{
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0 0 24px 0;
          padding: 24px 0;
          border-top: 1px solid $b3;
          border-bottom: 1px solid $b3;
          >p{
            @include font-style(18px)
          }
          .btn{
            display: flex;
            align-items: center;
            #numCard{
              padding: 0 12px;
              @include font-style(20px)
            }
            >button{
              width: 24px;
              height: 24px;
            }
            .dis-min{
              @include bg-image('~assets/image/icon/global_icon_minus_dis.png', 24px, 24px);
            }
            .nor-min{
              @include bg-image('~assets/image/icon/global_icon_minus_nor.png', 24px, 24px);
            }
            .nor-add{
              @include bg-image('~assets/image/icon/global_icon_add_nor.png', 24px, 24px);
            }

          }
        }
        .info{
          @include font-style(14px, 20px, $color: $t3)
        }
      }

      .modal-foot{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-top: 1px solid $b3;
        background-color: $b0;
        .price{
          @include font-style(20px, 24px);
          .currency{
            @include font-style(14px, 24px, $color: $t3)
          }
          .lowest{
            @include font-style(24px, $color: $t5)
          }
        }
        >button{
          padding: 1rem 40px;
          @include font-style(16px);
          background-color: $t4;
          border-radius: 4px;
        }
      }
    }
  }

  .DPSubmit-modal{
    .modal-main{
      display: flex;
      flex-direction: column;
      padding: 0 16px;
      >h2{
        margin-bottom: 80px;
        @include font-style(24px)
      }
      .verify-input{
        align-self: center;
        position: relative;
        .input{  //  输入表单
          position: absolute;
          top: 0;
          width: 100%;
          opacity: 0;
          input{
            width: 200%;
            height: 44px;
            margin-left: -100%;
            text-indent: -999em;
            color: transparent;
            background-color: transparent;
          }
        }
        .input-list{ //  展示表单
          display: flex;
          width: 100%;
          >li{
            width: 40px;
            height: 46px;
            text-align: center;
            @include font-style(24px, 46px);
            font-weight: bold;
            border-top: 1px solid $t6;
            border-bottom: 1px solid $t6;
            &:first-child{
              border-left: 1px solid $t6;
              border-bottom-left-radius: 4px;
              border-top-left-radius: 4px;
            }
            &:last-child{
              border-right: 1px solid $t6;
              border-bottom-right-radius: 4px;
              border-top-right-radius: 4px;
            }
            &:not(:last-child){
              border-right: 1px solid $b3;
            }
          }
        }
      }
    }
  }
</style>
