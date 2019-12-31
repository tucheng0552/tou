<template>
  <div>
    <!--  推荐城市 -->
    <todo-list-vacation :todoListData="vacation"></todo-list-vacation>

    <!--  足迹合辑  -->
    <todo-banner :todoListData="collections" @show-collections="showCollections"></todo-banner>

    <!--  toU 足迹精选  -->
    <todo-list :todoListData="experiences"></todo-list>

    <app-navigation ref="appNavigation" @update-data="updateData"></app-navigation>
  </div>
</template>

<script>
  import TodoList from '~/components/base/TodoList.vue'
  import TodoListVacation from '~/components/base/TodoListVacation.vue'
  import TodoBanner from '~/components/base/TodoBanner.vue'
  import AppNavigation from '~/components/AppNavigation.vue'

  export default {
    name: "category-index",
    components: {
      TodoListVacation,
      TodoBanner,
      TodoList,
      AppNavigation
    },
    props: {
      vacation: {
        type: Object,
        required:  true,
        default: () => {}
      },
      collections: {
        type: Object,
        required:  true,
        default: () => {}
      },
      experiences: {
        type: Object,
        required:  true,
        default: () => {}
      }
    },
    methods:{
      showCollections(){
        this.$emit('show-collections')
      },
      updateData(){
        this.$emit('update-data')
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';
</style>
