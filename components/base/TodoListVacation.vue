<template>
  <div class="c-base-todoList">
    <h3 class="todoList-title">{{todoListData.title}}</h3>
    <div class="columns is-mobile todoList-items">
      <div v-swiper:mySwiper="swiperOption">
        <div class="swiper-wrapper c-vacation-swiper">
          <div class="swiper-slide column is-2-desktop is-4-touch" v-for="(item, idx) in todoListData.items" :key="item.id">
            <a class="slide-item" @click="pathSearch(item)">
              <figure class="image is-2by3">
                <img :src="item.imageUrl" alt="">
              </figure>
              <p v-if="todoListData.type == 0">{{item.name}}·{{item.cityName}}</p>
              <p v-else-if="todoListData.type == 1">{{item.cityName}}·{{item.countryName}}</p>
            </a>
          </div>
        </div>
        <!--<div class="swiper-pagination swiper-pagination-bullets"></div>-->
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "todo-list-vacation",
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
          slidesPerView: 'auto',
          // centeredSlides: true,
          pagination: {
            // el: '.swiper-pagination',
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
    },
    created(){
    },
    methods: {
      pathSearch(item){
        if(this.$route.path == '/home'){
          let keywords = encodeURI(item.name);
          this.$router.push({path:'/search', query:{keywords:keywords, currency: this.$route.query.currency}});
        }
        if(this.$route.path == '/experiences'){
          let keywords = encodeURI(item.cityName);
          this.$router.push({path:'/search/experiences', query:{keywords:keywords}});
        }
      }
    }
  }
</script>


<style scoped lang="scss">

</style>
