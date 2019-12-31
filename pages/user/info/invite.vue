<template>
  <!--  已邀请的好友  -->
  <div class="invite">
    <div class="modal-main">
      <h2>已邀请的好友</h2>
      <ul class="main-items" v-if="resData">
        <li v-for="(item, idx) in resData" :key="item.id">
          <img :src="item.faceUrl" alt="">
          <div class="info">
            <h6>{{item.userName}}</h6>
            <p>{{item.cityStr}}·{{item.countryStr}}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>

</template>

<script>
  import user from '~/assets/js/api/user'

  export default {
    name: "info-invite",
    data(){
      return {
        resData: []
      }
    },
    async asyncData (context) {
      !context.store.state.authUser.userId && context.redirect('/');

      let pt = context.store.state.deviceType.type;

      try{
        let { data } = await user.inviteList({pt: pt}, context.store.state.authUser);
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
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';

  .invite{
    .modal-main{
      padding: 0 8px;
    }
    @extend .l-user-list-modal
  }
</style>
