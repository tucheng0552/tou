<template>
  <div>
    <section class="container is-widescreen l-page-section">
      <!--  足迹  -->
      <todo-list :todoListData="experiences"></todo-list>

      <app-navigation ref="appNavigation" @update-data="getExperiences"></app-navigation>

    </section>
  </div>
</template>

<script>
  import experiences from '~/assets/js/api/experiences'
  import TodoList from '~/components/base/TodoList.vue'
  import AppNavigation from '~/components/AppNavigation.vue'
  import { mapState } from 'vuex'

  export default {
    name: "search-experiences",
    components: {
      TodoList,
      AppNavigation
    },
    head(){
      return {
        title: '足迹-搜索'
      }
    },
    data() {
      return {

      }
    },
    computed: {
      ...mapState({
        deviceType: 'deviceType',
      })
    },
    watchQuery: ['keywords', 'currency'],
    async asyncData (context) {
      try{
        let keywords = context.query.keywords ? decodeURI(context.query.keywords) : '';
        let { data } = await experiences.getExperienceBySearch({pt: context.store.state.deviceType.type, cursor: 0, length: 12}, {keywords:keywords});
        if(data.code == 0){
          return {
            experiences:{
              type: 4,
              title: undefined,
              items:data.result,
              btn: undefined
            },
          }
        }else{
          throw data.msg;
        }
      }catch (e){
        context.error({ statusCode: 400, message: e })
      }
    },
    methods: {
      async getExperiences(){
        try {
          let { data } = await this.$api.experiences.getExperienceBySearch({pt: this.deviceType.type, cursor: (this.$refs.appNavigation.flagItem-1)*12, length:12});
          if(data.code == 0){
            if(data.result.length > 0){
              this.experiences.items = data.result
            }
          }else{
            throw data.msg;
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
</style>
