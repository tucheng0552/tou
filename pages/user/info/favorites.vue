<template>
  <!--  收藏夹 -->
  <div class="favorites">
    <h2>收藏夹</h2>
    <div class="tabs">
      <ul class="tabs-items">
        <li v-for="(item, idx) in resTabsList" :key="item.id"
            :class="[(flagTabs == idx) ? 'is-active' : '']"
            @click="toggleCategory(idx, item.type)"><a>{{item.name}}</a></li>
      </ul>
    </div>

    <div class="">
      <todo-list-side :sideData="sideData"></todo-list-side>
    </div>
  </div>

</template>

<script>
  import TodoListSide from '~/components/user/TodoListSide.vue'
  import user from '~/assets/js/api/user'
  import { mapState } from 'vuex'

  export default {
    name: "info-favorites",
    components: {
      TodoListSide
    },
    data() {
      return {
        flagTabs: 0,
        resTabsList: [{
          name: '民宿',
          type: 1
        }, {
          name: '酒店',
          type: 2
        }, {
          name: '足迹',
          type: 3
        }]
      }
    },
    async asyncData (context) {
      !context.store.state.authUser.userId && context.redirect('/');

      let pt = context.store.state.deviceType.type;

      try{
        let { data } = await user.favorites({pt: pt}, context.store.state.authUser, 1);
        if(data.code == 0){
          return {
            sideData:{
              type: 0,
              title: undefined,
              items: data.result.homeStays,
              btn: undefined
            }
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
        authUser: 'authUser'
      }),
    },
    methods: {
      async toggleCategory(id, type){
        this.flagTabs = id;
        try{
          let { data } = await this.$api.user.favorites({pt: this.deviceType.type}, this.authUser, type);
          if(data.code == 0){
            if(type == 1){
              this.sideData.items = data.result.homeStays;
            }else if(type == 2){
              this.sideData.items = data.result.hotels;
            }else if(type == 3){
              this.sideData.items = data.result.experiences;
            }
            this.sideData.type = (type == 3) ? 4 : 0
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';

  .favorites{
    >h2{
      padding-left: 8px;
      @include font-style(24px)
    }
    .tabs{
      padding-top: 24px;
      margin: 0;
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
</style>
