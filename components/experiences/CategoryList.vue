<template>
  <div>
    <!--  toU 足迹精选  -->
    <todo-list :todoListData="experiences"></todo-list>

    <!--  加载更多 -->
    <div class="list-foot-btn" v-if="isMoreExperiencesList">
      <button type="button" @click="getExperiencesList">加载更多</button>
    </div>
    <!--<app-navigation ref="appNavigation" @update-data="updateData"></app-navigation>-->
  </div>
</template>

<script>
  import TodoList from '~/components/base/TodoList.vue'
  import AppNavigation from '~/components/AppNavigation.vue'
  export default {
    name: "category-list",
    data(){
      return {

      }
    },
    components: {
      TodoList,
      AppNavigation
    },
    props: {
      experiences: {
        type: Object,
        required:  true,
        default: () => {}
      },
      isMoreExperiencesList: {
        type: Boolean,
        required:  true,
        default: () => true
      }
    },
    methods: {
      getExperiencesList(){
        this.$emit('get-experiences-list');
      },
      updateData(){
        this.$emit('update-data')
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';

  .list-foot-btn{
    padding: 48px 0;
    text-align: center;
    >button{
      padding: 15px 32px;
      background-color: $t4;
      border-radius: 4px;
      @include font-style(18px)
    }
  }
</style>
