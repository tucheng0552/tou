<template>
  <div>
    <section class="container is-widescreen l-page-section">
      <div class="columns user">
        <div class="column is-4-desktop is-12-touch user-left">
          <ul class="left-menu">
            <li>
              <nuxt-link class="menu-item" to="/user/info" v-if="authUser.userId">
                <p>查看或编辑个人资料</p>
                <img :src="userInfo.faceUrl" alt="" class="face" v-if="userInfo.faceUrl">
              </nuxt-link>
              <a class="menu-item" v-else>
                <p>未登录</p>
              </a>
            </li>
           <!-- <li>
              <nuxt-link class="menu-item" to="">
                <p>芝麻信用</p>
                <img src="~/assets/image/icon/my_list_icon_zhima@3x.png" alt="">
              </nuxt-link>
            </li>-->
            <li>
              <nuxt-link class="menu-item" to="/user/info/transaction">
                <p>交易记录</p>
                <img src="~/assets/image/icon/my_list_icon_bill@3x.png" alt="">
              </nuxt-link>
            </li>
<!--            <li>
              <nuxt-link class="menu-item" to="/user/info/DP">
                <p>我的DP</p>
                <img src="~/assets/image/icon/my_list_icon_wallet@3x.png" alt="">
              </nuxt-link>
            </li>-->
            <li>
              <nuxt-link class="menu-item" to="/user/info/messages">
                <p>消息和通知</p>
                <img src="~/assets/image/icon/my_list_icon_notification@3x.png" alt="">
              </nuxt-link>
            </li>
        <!--    <li>
              <nuxt-link class="menu-item" to="/user/info/coupon">
                <p>优惠券</p>
                <img src="~/assets/image/icon/my_list_icon_coupon@3x.png" alt="">
              </nuxt-link>
            </li>-->
            <li>
              <nuxt-link class="menu-item" to="/user/info/favorites">
                <p>收藏夹</p>
                <img src="~/assets/image/icon/my_list_icon_favorites@3x.png" alt="">
              </nuxt-link>
            </li>
            <li>
              <nuxt-link class="menu-item" to="/user/info/invite">
                <p>邀请好友</p>
                <img src="~/assets/image/icon/my_list_icon_invite@3x.png" alt="">
              </nuxt-link>
            </li>
           <!-- <li>
              <nuxt-link class="menu-item" to="">
                <p>成为房东</p>
                <img src="~/assets/image/icon/my_list_icon_landlord@3x.png" alt="">
              </nuxt-link>
            </li>-->
            <li>
              <nuxt-link class="menu-item" to="/user/info/set">
                <p>设置</p>
                <img src="~/assets/image/icon/my_list_icon_setting@3x.png" alt="">
              </nuxt-link>
            </li>
            <li>
              <nuxt-link class="menu-item" to="/user/info/help">
                <p>帮助中心</p>
                <img src="~/assets/image/icon/my_list_icon_help@3x.png" alt="">
              </nuxt-link>
            </li>
          </ul>
        </div>

      </div>
    </section>

  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: "user",
    components: {
    },
    data() {
      return {

      }
    },

    asyncData (context) {

    },
    computed: {
      ...mapState({
        authUser: 'authUser',
        userInfo: 'userInfo',
      })
    },

    mounted(){

    },
    methods:{

    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';
  @media screen and #{$desktop-width}{
    .user{
      .user-left{
        .left-menu{

        }
      }
    }

  }

  .user{
    margin: 0;
    padding: 32px 8px;
    .user-left{
      padding: 0;
      .left-menu{
        >li{
          &:not(:first-child){
            border-top: 1px solid $b3;
          }
         .menu-item{
           display: flex;
           justify-content: space-between;
           align-items: center;
           padding: 24px 0;
           >p{
             @include font-style(18px, 30px)
           }
           .face{
             width: 72px;
             height: 72px;
             border-radius: 50%;
           }
           >img{
             width: 30px;
             height: 30px;
             border-radius: 50%;
           }
         }
        }
      }
    }
  }
</style>
