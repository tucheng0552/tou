<template>
  <div>
    <section class="container is-widescreen l-page-section">
      <div class="columns user">
        <div class="column is-4-desktop is-12-touch user-left">
          <div class="left-edit">
            <div class="edit-head">
              <div class="head-txt">
                <h5>{{resData.userName}}</h5>
                <p>{{resData.cityStr}}·{{resData.countryStr}}</p>
              </div>
              <img :src="resData.faceUrl" alt="">
            </div>

            <p class="edit-main">{{resData.selfIntroduction}}</p>

            <div class="edit-foot">
              <ul class="foot-left">
                <li @click="toggleFollows">
                  <h6>{{resData.followsNum}}</h6>
                  <p>关注</p>
                </li>
                <li>·</li>
                <li @click="toggleFans">
                  <h6>{{resData.fansNum}}</h6>
                  <p>粉丝</p>
                </li>
              </ul>

              <div class="foot-right">
                <button type="button" class="" @click="delFollows" v-if="resData.isFollows">已关注</button>
                <button type="button" class="active" @click="subFollows" v-else>关&nbsp;注</button>
              </div>

            </div>
          </div>

          <div class="left-comments" v-if="resComments.commentCount">
            <!--  商户评论列表  -->
            <div class="comments-head">
              <h5>{{resComments.commentCount}}条评价</h5>
              <button type="button" class="all" @click="togglesComments">查看全部</button>
            </div>
            <div class="comments-info">
              <img :src="resComments.merchantComments[0].commentUser.faceUrl" alt="">
              <div class="info">
                <p>{{resComments.merchantComments[0].commentUser.userName}}</p>
                <span>{{resComments.merchantComments[0].createdAt}}</span>
              </div>
            </div>
            <p class="comments-content">{{resComments.merchantComments[0].content}}</p>
          </div>
        </div>

        <div class="column is-12-touch user-right">
          <todo-list-side :sideData="experience" @toggle-modal="toggleModal"></todo-list-side>

          <todo-list-side :sideData="merchants"></todo-list-side>

        </div>

      </div>
    </section>

    <!--  关注列表  -->
    <div :class="[showFollows ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="toggleFollows"></div>
      <div class="modal-content">
        <div class="follows-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="toggleFollows"></button>
          </div>
          <div class="modal-main">
            <h2>我的关注</h2>
            <ul class="main-items" v-if="resFollowsList">
              <li v-for="(item, idx) in resFollowsList.fansAndFollows" :key="item.id">
                <img :src="item.faceUrl" alt="">
                <div class="info">
                  <h6>{{item.userName}}</h6>
                  <p>{{item.cityStr}}·{{item.countryStr}}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!--  粉丝列表  -->
    <div :class="[showFans ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="toggleFans"></div>
      <div class="modal-content">
        <div class="fans-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="toggleFans"></button>
          </div>
          <div class="modal-main">
            <h2>我的粉丝</h2>
            <ul class="main-items" v-if="resFansList">
              <li v-for="(item, idx) in resFansList.fansAndFollows" :key="item.id">
                <img :src="item.faceUrl" alt="">
                <div class="info">
                  <p>{{item.userName}}</p>
                  <p>{{item.cityStr}}·{{item.countryStr}}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!--  评论列表  -->
    <div :class="[showComments ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="togglesComments"></div>
      <div class="modal-content">
        <div class="comments-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="togglesComments"></button>
          </div>
          <div class="modal-main">
            <h2>{{resComments.commentCount}}条评价</h2>
            <ul class="main-items">
              <li v-for="(item, idx) in resComments.merchantComments" :key="item.id">
                <div class="head" v-if="item.commentUser">
                  <img :src="item.commentUser.faceUrl" alt="">
                  <div class="info">
                    <p>{{item.commentUser.userName}}</p>
                    <span>{{item.createdAt}}</span>
                  </div>
                </div>
                <p class="main">{{item.content}}</p>
                <ul class="u-items-star">
                  <li v-for="(rate, rdx) in rateItems(item.rate)" :key="rate.id" :class="rate"></li>
                </ul>

                <div class="reply" v-if="item.reply">
                  <img :src="item.reply.replyUser.faceUrl" alt="">
                  <p><b>{{item.reply.replyUser.userName}}&nbsp;回复：</b><span>{{item.reply.comment}}</span></p>
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
  import axios from 'axios'
  import user from '~/assets/js/api/user'
  import merchant from '~/assets/js/api/merchant'
  import TodoListSide from '~/components/user/TodoListSide.vue'
  import { mapState } from 'vuex'
  import { setRateItems } from '~/assets/js/utils'

  export default {
    name: "user-id-merchant",
    validate ({ params }) {
      // 必须是number类型
      return /^\d+$/.test(params.id)
    },
    layout: 'back',
    components: {
      TodoListSide
    },
    data() {
      return {
        /**
         *  关注
         * */
        showFollows: false,
        resFollowsList: undefined,

        /**
         *  粉丝
         * */
        showFans: false,
        resFansList: undefined,

        showComments:false
      }
    },
    asyncData (context) {
      let [id, pt, userId] = [context.params.id, context.store.state.deviceType.type, context.store.state.authUser.userId];
      return axios.all([user.merchantHomepage({pt: pt}, id, userId),
        merchant.comments({pt: pt}, id)]).then(
        axios.spread( (data, comments)=>{
          if(data.data.code == 0 && comments.data.code == 0){
            return {
              resData: data.data.result,
              experience: {
                type: 4,
                title: 'Ta分享的足迹',
                items: data.data.result.experiences ? data.data.result.experiences.slice(0, 6) : [],
                btn: '查看全部足迹'
              },
              merchants: {
                type: 0,
                title:'Ta发布的房源',
                items: data.data.result.merchants ? data.data.result.merchants.slice(0, 6) : [],
                btn: '查看全部足迹'
              },
              resComments: comments.data.result
            };
          }else{
            throw data.data.msg +'/'+ comments.data.msg
          }
        } )
      ).catch(
        e =>{
          context.error({ statusCode: 400, message: e })
        }
      )
    },
    mounted() {

    },
    computed: {
      ...mapState({
        deviceType: 'deviceType',
        authUser: 'authUser',
        userInfo: 'userInfo'
      }),
    },
    methods:{
      //  评论星级
      rateItems(rate) {
        return setRateItems(rate)
      },
      /**
       *  关注
       * */
      async toggleFollows() {
        if(!this.resFollowsList){
          try {
            if(!this.authUser.userId){
              throw '请登录'
            }
            let { data } = await this.$api.user.followsList({pt: this.deviceType.type}, this.$route.params.id);
            if(data.code == 0){
              this.resFollowsList = data.result
            }else {
              throw data.msg;
            }
          }catch (e){
            this.$toast.error(e)
          }
        }

        this.showFollows = !this.showFollows
      },
      async subFollows(){ //  关注
        try {
          if(!this.authUser.userId){
            throw '请登录'
          }
          let { data } = await this.$api.user.follow({pt: this.deviceType.type}, this.authUser, this.$route.params.id);
          if(data.code == 0){
            this.getPageData();
            this.$toast.success('关注成功')
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      async delFollows(){ //  取消关注
        try {
          let { data } = await this.$api.user.unFollow({pt: this.deviceType.type}, this.authUser, this.$route.params.id);
          if(data.code == 0){
            this.getPageData();
            this.$toast.success('取消成功')
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },

      /**
       *  粉丝
       * */
      async toggleFans() {
        if(!this.resFansList){
          try {
            let { data } = await this.$api.user.fansList({pt: this.deviceType.type}, this.$route.params.id);
            if(data.code == 0){
              this.resFansList = data.result
            }else {
              throw data.msg;
            }
          }catch (e){
            this.$toast.error(e)
          }
        }

        this.showFans = !this.showFans
      },

      togglesComments(){
        this.showComments = !this.showComments
      },

      //  举报
      toggleModal(){},

      async getPageData(){  //  获取数据
        try {
          let { data } = await this.$api.user.merchantHomepage({pt:  this.deviceType.type}, this.$route.params.id, this.authUser.userId);
          if(data.code == 0){
            this.resData = data.result
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
    }

  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';

  @media screen and #{$desktop-width}{
    .user{
      padding-top: 32px;
      .user-left{
        .left-edit{
          padding: 24px 16px;
          border: 1px solid $b3;
        }

        .left-comments{
          padding: 24px 16px;
          border: 1px solid $b3;
        }
      }
      .user-right{
        padding: 0 0 0 40px;
      }
    }
    .modal-content{
      max-height: 66%;
    }
  }

  @media screen and #{$touch-width}{
    .user{
      .user-left{
        .left-edit{
          padding: 24px 0;
          border-bottom: 1px solid $b3;
        }
        .left-comments{
          padding: 24px 0;
          border-bottom: 1px solid $b3;
        }
      }
      .user-right{
        padding: 0;
      }
    }
  }

  .user{
    margin: 0;
    .user-left{
      padding: 0 8px;
      .left-edit{
        margin-bottom: 16px;
        .edit-head{
          display: flex;
          justify-content: space-between;
          .head-txt{
            padding: 10px 0 8px 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            >h5{
              @include font-style(24px)
            }
            >p{
              @include font-style(18px)
            }
          }
          >img{
            width: 72px;
            height: 72px;
            border-radius: 50%;
          }
        }
        .edit-main{
          margin: 16px 0 24px 0;
          @include font-style(16px, 26px);
          @include one-line-hidden
        }
        .edit-foot{
          display: flex;
          justify-content: space-between;
          align-items: center;
          .foot-left{
            display: flex;
            align-items: center;
            >li{
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              text-align: center;
              &:nth-of-type(2){
                padding: 0 24px;
              }
              &:not(:nth-of-type(2)){
                &:hover{
                  cursor: pointer;
                  //  background-color: $b1;
                }
              }
              >h6{
                margin-bottom: 8px;
                @include font-style(24px)
              }
              >p{
                @include font-style(14px)
              }
            }
          }
          .foot-right{
            >button{
              padding: 10px 16px;
              background-color: $b1;
              @include font-style(16px, $color: $t3);
              border-radius: 4px;
              &.active{
                background-color: $t4;
                color: $t1;
              }
            }
          }
        }

      }

      .left-comments{
        display: flex;
        flex-direction: column;
        .comments-head{
          display: flex;
          justify-content: space-between;
          >h5{
            @include font-style(18px);
          }
          .all{
            @include bg-image('~assets/image/icon/global_icon_list_arrow.png', 6px, 12px, $top:100%, $left:100%);
            @include font-style(14px, $color:$t3);
            padding: 2px 10px 2px 0;
          }

        }
        .comments-info{
          display: flex;
          padding: 16px 0;
          >img{
            width: 48px;
            height: 48px;
            border-radius: 50%;
            margin-right: 8px;
          }
          .info{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 5px 0;
            >p{
              @include font-style(16px)
            }
            >span{
              @include font-style(14px, $color:$t2)
            }

          }
        }
        .comments-content{
          @include font-style(16px, 26px)
        }
      }
    }

  }

  .follows-modal{
    @extend .l-user-list-modal
  }

  .fans-modal{
    @extend .l-user-list-modal
  }

  .comments-modal{
    .modal-main{
      padding: 16px;
      >h2{
        @include font-style(24px)
      }
      .main-items{
        >li{
          padding: 24px 0;
          &:not(:last-child){
            border-bottom: 1px solid $b3;
          }
          .head{
            display: flex;
            >img{
              width: 48px;
              height: 48px;
              border-radius: 50%;
              margin-right: 8px;
            }
            .info{
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              padding: 5px 0;
              >p{
                @include font-style(16px)
              }
              >span{
                @include font-style(14px, $color:$t2)
              }

            }
          }
          .main{
            padding: 16px 0;
            @include font-style(16px, 26px)
          }
          .reply{
            >img{
              width: 24px;
              height: 24px;
              border-radius: 50%;
            }
            >p{
              @include font-style(16px)
            }
          }
        }
      }
    }
  }
</style>
