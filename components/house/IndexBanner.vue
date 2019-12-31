<template>
  <div class="banner">
    <div v-swiper:mySwiper="swiperOption">
      <div class="swiper-wrapper my-swiper">
        <div class="swiper-slide" v-for="(item, idx) in banners" :key="item.id">
          <figure class="image is-3by2">
            <img :src="item">
          </figure>
        </div>
      </div>
      <div class="swiper-pagination swiper-pagination-bullets"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "index-banner",
    props: {
      banners: {
        type: Array,
        request: true,
        default: () => []
      }
    },
    data() {
      return{
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
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';

  @media screen and #{$desktop-width}{
    .banner{
      padding: 0 1rem;
    }
  }
  .my-swiper{
    .swiper-slide{
      max-height: 388px;
      .image{
        >img{
          max-height: 388px;
        }
      }
    }
  }
</style>
