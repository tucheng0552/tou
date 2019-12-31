<template>
  <div class="banner">
    <div class="banner-head" v-if="todoListData.type == 1">
      <h3 class="head-title">足迹合辑</h3>
      <button class="all" @click="showCollections">查看全部</button>
    </div>
    <div v-swiper:mySwiper="swiperOption">
      <div class="swiper-wrapper c-banner-swiper">
        <div class="swiper-slide" v-for="(item, idx) in todoListData.items" :key="item.id">
          <a :href="item.actionOfAndroid || item.actionOfIos"  class="swiper-item" v-if="todoListData.type == 0">
            <img :src="item.imgUri">
            <div class="item-info">
              <h5>{{item.name}}</h5>
              <h6 v-if="todoListData.type == 0" class="info">
                {{item.content}}
              </h6>
              <p class="type">
                <!--<span v-if="item.advType == 1">推广</span>-->
                <span v-if="item.advType == 2">广告</span>
              </p>
            </div>
          </a>
          <nuxt-link :to="'/experiences/'+item.id+'/collections'" class="swiper-item" v-else-if="todoListData.type == 1">
            <img :src="item.thumbnailUrl">
            <div class="item-info">
              <h5>{{item.name}}</h5>
              <h6 v-if="todoListData.type == 0" class="info">
                {{item.content}}
              </h6>
              <p class="type">
                <span v-if="item.advType == 1">推广</span>
                <!--<span v-else-if="item.advType == 2">广告</span>-->
              </p>
            </div>
          </nuxt-link>
        </div>
      </div>
      <div class="swiper-pagination swiper-pagination-bullets"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "todo-banner",
    props: {
      todoListData: {
        type: Object,
        required:  true,
        default: () => {}
      }
    },
    data () {
      return {
        swiperOption: {
          // autoplay: true,//可选选项，自动滑动
          // loop: true,
          slidesPerView: 1,
          // centeredSlides: true,
          pagination: {
            el: '.swiper-pagination',
            dynamicBullets: true
          },
          on: {
            slideChange() {
              // console.log('onSlideChangeEnd', this);
            },
            tap() {
              // console.log('onTap', this);
            }
          }
        }
      }// 6214837846487548
    },
    created() {
    },
    methods: {
      showCollections(){
        this.$emit('show-collections')
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';
  .banner{
    width: 100%;
    margin: 3rem auto;
    .banner-head{
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
      padding: 0 8px;
      .head-title{
        @include font-style(24px)
      }
      .all{
        @include bg-image('~assets/image/icon/global_icon_list_arrow.png', 6px, 12px, $top:100%, $left:100%);
        @include font-style(14px, $color:$t3);
        padding: 5px 10px 5px 0;
      }
    }
  }

</style>
