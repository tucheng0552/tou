<template>
  <!--  相关足迹  -->
  <div class="c-base-todoList experience-list">
    <h6 class="list-title">相关足迹</h6>
    <div class="columns is-mobile todoList-items">
      <div class="column is-12-desktop is-6-touch item" v-for="(item, idx) in experienceList" :key="item.id">
        <nuxt-link :to="'/experiences/'+item.id" class="card item-card is-shadowless">
          <div class="card-image card-banner">
            <figure class="image is-4by3">
              <img :src="item.imageUri" alt="Placeholder image">
            </figure>

            <div class="banner-type">{{item.categoryName}}</div>
          </div>
          <div class="card-content card-info">
            <div class="content info">
              <p class="info-city"><b>{{item.relatedCity}}</b>&nbsp;&nbsp;{{item.title}}</p>
              <div class="info-face">
                <img :src="item.faceUrl" alt="">
                <i class="u-icon-list-like">{{item.totalPraiseNum}}</i>
                <i class="u-icon-list-comments">{{item.totalCommentNum}}</i>
              </div>
            </div>
          </div>

        </nuxt-link>
      </div>
    </div>

  </div>

</template>

<script>
  export default {
    name: "todo-list-side",
    props: {
      experienceList: {
        type: Array,
        required:  true,
        default: () => []
      }
    },
    data() {
      return {

      }
    },
    watch: {

    },
    computed:{

    },
    created(){

    },
    methods: {

    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';
  @media screen and #{$touch-width}{
    .experience-list{
      .list-title{
        padding-top: 24px;
      }
    }
  }

  .experience-list{
    .list-title{
      padding-left: 8px;
      @include font-style(18px);
      font-weight: bold;
    }
  }
</style>
