<template>
  <div>
    <section class="container is-widescreen l-page-section">
      <!--  民宿  -->
      <todo-list :todoListData="homeStays"></todo-list>
      <!--  酒店  -->
      <todo-list :todoListData="hotels"></todo-list>
      <!--  足迹  -->
      <todo-list :todoListData="experiences"></todo-list>
    </section>
  </div>
</template>

<script>
  import homepage from '~/assets/js/api/homepage'
  import TodoList from '~/components/base/TodoList.vue'
  export default {
    name: "search",
    components: {
      TodoList,
    },
    head(){
      return {
        title:'搜索'
      }
    },
    data() {
      return {

      }
    },
    watchQuery: ['keywords', 'currency'],
    async asyncData (context) {
      let [pt, keywords, currency, currencyCode, currencySymbol] = [context.store.state.deviceType.type,
        decodeURI(context.query.keywords) ? decodeURI(context.query.keywords) : '',
        context.query.currency ? context.query.currency : 0,
        context.query.currency ? context.store.state.currencyList[context.query.currency].currencyCode : 'CNY',
        context.query.currency ? context.store.state.currencyList[context.query.currency].currencySymbol : '¥'];
      try{
        let { data } = await homepage.search({pt: pt, currency: currencyCode}, {keywords:keywords});
        if(data.code == 0){
          return {
            homeStays:{
              type: 2,
              title:`${keywords} 民宿精选`,
              items: data.result.homestays.slice(0, 4),
              btn: '查看全部民宿',
              currency: currency,
              currencySymbol: currencySymbol,
            },
            hotels:{
              type: 1,
              title:`${keywords} 酒店精选`,
              items:data.result.hotels.slice(0, 4),
              btn: '查看全部酒店',
              currency: currency,
              currencySymbol: currencySymbol,
            },
            experiences:{
              type: 4,
              title:`${keywords} 足迹精选`,
              items:data.result.experiences.slice(0, 4),
              btn: '查看全部足迹'
            },
          }
        }else{
          throw data.msg
        }
      }catch (e){
        context.error({ statusCode: 400, message: e })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';
</style>
