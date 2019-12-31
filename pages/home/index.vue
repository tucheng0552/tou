<template>
  <div class="">
    <section class="container is-widescreen l-page-section">
      <!--  民宿  -->
      <todo-list :todoListData="homeStays"></todo-list>
      <!--  酒店  -->
      <todo-list :todoListData="hotels"></todo-list>
      <!--  广告-->
      <todo-banner :todoListData="banner"></todo-banner>
      <!--  度假地 -->
      <todo-list-vacation :todoListData="vacation"></todo-list-vacation>
      <!--  足迹  -->
      <todo-list :todoListData="experiences"></todo-list>
      <!--  推荐  -->
      <todo-list :todoListData="recommend"></todo-list>
      <!--  分页器 -->
      <app-navigation ref="appNavigation" @update-data="getRecommend"></app-navigation>
    </section>
  </div>
</template>

<script>
  import axios from 'axios'
  import homepage from '~/assets/js/api/homepage'
  import TodoBanner from '~/components/base/TodoBanner.vue'
  import TodoList from '~/components/base/TodoList.vue'
  import TodoListVacation from '~/components/base/TodoListVacation.vue'
  import AppNavigation from '~/components/AppNavigation.vue'
  import { mapState } from 'vuex'

  export default {
    name: 'home',
    components: {
      TodoBanner,
      TodoList,
      TodoListVacation,
      AppNavigation
    },
    head(){
      return {
        title: 'toU 短租-多多点评旗下住宿品牌'
      }
    },
    data() {
      return {}
    },
    created(){

    },
    watchQuery: ['currency'],
    asyncData (context) {
      let [pt, currency, currencyCode, currencySymbol] = [context.store.state.deviceType.type,
        context.query.currency ? context.query.currency : 0,
        context.query.currency ? context.store.state.currencyList[context.query.currency].currencyCode : 'CNY',
        context.query.currency ? context.store.state.currencyList[context.query.currency].currencySymbol : '¥'];
      return axios.all([homepage.data({pt: pt, currency: currencyCode}),
        homepage.getRecommendMerchants({pt: pt, cursor:0, length:3, currency: currencyCode})]).then(
        axios.spread( (data, recommend)=>{
          if(data.data.code == 0 && recommend.data.code == 0){
            return {
              homeStays:{
                type: 2,
                title:'toU 民宿精选',
                items: data.data.result.homeStays.slice(0, 4),
                btn: '查看全部民宿',
                currency: currency,
                currencySymbol: currencySymbol,
              },
              hotels:{
                type: 1,
                title:'toU 酒店精选',
                items:data.data.result.hotels.slice(0, 4),
                btn: '查看全部酒店',
                currency: currency,
                currencySymbol: currencySymbol
              },
              //  广告
              banner: {
                type: 0,  //  0：首页 / 1：足迹首页
                items: data.data.result.systemAdvertisements
              },
              vacation:{
                type: 0,  //  0：首页 / 1：足迹首页
                title: 'toU 度假地点精选',
                items:data.data.result.handpickedVacationSpots,
              },
              experiences:{
                type: 4,
                title:'toU 足迹精选',
                items:data.data.result.experiences.slice(0, 4),
                btn: '查看全部足迹'
              },
              recommend:{
                type: 3,
                title: 'toU 推荐',
                items:recommend.data.result,
                currency: currency,
                currencySymbol: currencySymbol
              }
            };
          }else{
            throw data.data.msg +'/'+ recommend.data.msg;
          }
        } )
      ).catch(
        e =>{
          context.error({ statusCode: 400, message: e })
        }
      )
    },
    created(){
    },
    computed: {
      ...mapState({
        deviceType: 'deviceType'
      }),
    },
    methods: {
      //  截取指定个数的数组
      MaxTodoList(arr, length){
        if(arr.length > length){
          arr.splice(length)
        }
        return arr
      },
      async getRecommend(){
        try {
          let { data } = await this.$api.homepage.getRecommendMerchants({pt: this.deviceType.type, cursor: (this.$refs.appNavigation.flagItem-1)*3, length:3, currency: this.currencyCode});
          if(data.code == 0){
            if(data.result.length > 0){
              this.recommend.items = data.result
            }
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

<style>

</style>
