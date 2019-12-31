<template>
  <todo-list-side :sideData="experience" @delete-column="deleteColumn"></todo-list-side>
</template>

<script>
  import TodoListSide from '~/components/user/TodoListSide.vue'
  import experiences from '~/assets/js/api/experiences'
  import { mapState } from 'vuex'

  export default {
    name: "info-index",
    components: {
      TodoListSide
    },
    props: {

    },
    async asyncData (context) {
      let [id, pt] = [context.store.state.authUser.userId, context.store.state.deviceType.type];
      try{
        let { data } = await experiences.getByUserId({pt: pt, cursor: 0, length: 4}, id);
        if(data.code == 0){
          return {
            experience: {
              type: 4,
              title: '足迹分享',
              items: data.result,
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
    computed:{
      ...mapState({
        authUser: 'authUser',
        deviceType: 'deviceType'
      }),
    },
    methods:{
      async deleteColumn(id){
        try {
          let { data } = await this.$api.experiences.delete({pt:this.deviceType.type}, this.authUser, id);
          if(data.code == 0){

            let { data: resData } = await this.$api.experiences.experiences.getByUserId({pt: this.deviceType.type, cursor: 0, length: 4}, this.authUser.userId);
            if(resData.code == 0){
              this.experience.items = resData.result;
            }else{
              throw resData.msg;
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
