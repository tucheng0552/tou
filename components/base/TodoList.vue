<template>
  <!--  民宿  / 酒店  -->
  <div class="c-base-todoList" v-if="(todoListData.type == 2) || todoListData.type == 1">
    <h3 class="todoList-title">{{todoListData.title}}</h3>
    <div class="columns is-mobile todoList-items">
      <div class="column is-3-desktop is-6-touch item" v-for="(item, idx) in todoListData.items" :key="item.id">
        <nuxt-link :to="(item.merchantTypeId == 2) ? '/homestay/'+item.id+'?currency='+todoListData.currency :
        (item.merchantTypeId == 1) ? '/hotel/'+item.id+'?currency='+todoListData.currency : ''"
                   class="card item-card is-shadowless">
          <div class="card-image card-banner">
            <figure class="image is-4by3">
              <img :src="item.banners[0]" alt="Placeholder image">
            </figure>

          </div>
          <div class="card-content card-info">
            <div class="content info">
              <div class="info-type">
                <span v-if="item.merchantTypeId == 2">{{item.merchantSubTypeName}}-{{item.livingRoomNum}}房{{item.drawingRoomNum}}厅&nbsp;{{item.totalBedNum}}床{{item.toiletNum}}卫</span>
                <span v-else-if="item.merchantTypeId == 1">{{item.merchantSubTypeName}}-{{item.totalRoomTypeNum}}间房</span>
                <span v-if="item.operationType > 1">PLUS</span>
              </div>
              <h5 class="info-title">{{item.name}}{{item.placardText && '-'}}{{item.placardText}}</h5>
              <p class="info-price">
                <i>{{todoListData.currencySymbol}}</i><span class="u-price-num price-num">{{item.lowestPrice}}</span>&nbsp;起&nbsp;
                <span v-if="item.virtualPointsRate" class="price-hot">{{parseInt(item.virtualPointsRate*100)}}%</span>
                <span v-if="item.activityType == 1" class="price-hot">促销</span>
                <span v-else-if="item.activityType == 2" class="price-hot">热销</span>
              </p>
              <div class="info-evaluate">
                <ul class="u-items-star">
                  <li v-for="(rate, rdx) in rateItems(item.rateAmount.totalAverageRate)" :key="rate.id" :class="rate"></li>
                </ul>
                <span class="evaluate-num">{{item.totalCommentNum}}条评价</span>
              </div>
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>

    <a class="button is-info is-outlined btn-all"
       @click="getHomesAll(todoListData.type, todoListData.currency)"
       v-if="todoListData.type == 2">{{todoListData.btn}}</a>

    <a class="button is-info is-outlined btn-all"
       @click="getHotelAll(todoListData.type, todoListData.currency)"
       v-else-if="todoListData.type == 1">{{todoListData.btn}}</a>

  </div>

  <!--  足迹精选  -->
  <div class="c-base-todoList" v-else-if="todoListData.type == 4">
    <h3 class="todoList-title" v-if="todoListData.title">{{todoListData.title}}</h3>
    <div class="columns is-mobile todoList-items">
      <div class="column is-3-desktop is-6-touch item" v-for="(item, idx) in todoListData.items" :key="item.id">
        <nuxt-link :to="'/experiences/'+item.id" class="card item-card is-shadowless">
          <div class="card-image card-banner">
            <figure class="image is-4by3">
              <img :src="item.imageUri" alt="Placeholder image">
            </figure>

            <!--  足迹精选  -->
            <div class="banner-type">{{item.categoryName}}</div>
          </div>
          <div class="card-content card-info">
            <div class="content info">
              <p class="info-city"><b>{{item.relatedCity}}</b>&nbsp;&nbsp;{{item.title}}</p>
              <div class="info-face">
                <img  v-if="item.faceUrl" :src="item.faceUrl" alt="">
                <i class="u-icon-list-like">{{item.totalPraiseNum}}</i>
                <i class="u-icon-list-comments">{{item.totalCommentNum}}</i>
              </div>
            </div>
          </div>

        </nuxt-link>
      </div>
    </div>

    <a v-if="todoListData.btn"
       class="button is-info is-outlined btn-all"
       @click="getExperiencesAll">{{todoListData.btn}}</a>
  </div>

  <!--  推荐  -->
  <div class="c-base-todoList" v-else-if="todoListData.type == 3">
    <h3 class="todoList-title">{{todoListData.title}}</h3>
    <div class="columns is-desktop todoList-items">
      <div class="column is-4-desktop is-12-touch item recommend" v-for="(item, idx) in todoListData.items" :key="item.id">
        <nuxt-link :to="(item.merchantTypeId == 2) ? '/homestay/'+item.id+'?currency='+todoListData.currency :
        (item.merchantTypeId == 1) ? '/hotel/'+item.id+'?currency='+todoListData.currency : ''"
                   class="card item-card is-shadowless">
          <div class="card-image card-banner">
            <figure class="image is-4by3">
              <img :src="item.banners[0]" alt="Placeholder image">
            </figure>
            <div class="banner-type" v-if="item.operationType > 1">PLUS</div>
          </div>
          <div class="card-content card-info">
            <div class="content info">
              <div class="info-recommend">
                <p class="info-price">
                  <i>{{todoListData.currencySymbol}}</i><span class="u-price-num price-num">{{item.lowestPrice}}</span>&nbsp;起&nbsp;
                  <span v-if="item.activityType == 1" class="price-hot">促销</span>
                  <span v-else-if="item.activityType == 2" class="price-hot">热销</span>
                </p>
                <div class="info-evaluate">
                  <ul class="u-items-star">
                    <li v-for="(rate, rdx) in rateItems(item.rateAmount.totalAverageRate)" :key="rate.id" :class="rate"></li>
                  </ul>
                  <span class="evaluate-num">{{item.totalCommentNum}}条评价</span>
                </div>
              </div>

              <div class="info-name">
                <div class="info-type">
                  <p>{{item.name}}</p>
                  <span class="type-sub">{{item.merchantSubTypeName}}</span>
                </div>
                <img v-if="item.owner" :src="item.owner.faceUrl" alt="">
              </div>
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>

</template>

<script>
  import { setRateItems } from '~/assets/js/utils'
  export default {
    name: "todo-list",
    props: {
      todoListData: {
        type: Object,
        required:  true,
        default: () => {}
      }
    },
    asyncData(context){

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
    mounted(){
    },
    methods: {
      //  评论星级
      rateItems(rate){
        return setRateItems(rate)
      },
      getHomesAll(type, currency){
        let keywords = this.$route.query.keywords;
        this.$router.push({path:'/search/house', query:{keywords:keywords, type:type, currency: currency}});
      },
      getHotelAll(type ,currency){
        let keywords = this.$route.query.keywords;
        this.$router.push({path:'/search/house', query:{keywords:keywords, type:type, currency: currency}});
      },
      getExperiencesAll(){
        let keywords = this.$route.query.keywords;
        this.$router.push({path:'/search/experiences', query:{keywords:keywords}});
      }
    }
  }
</script>

<style scoped lang="scss">


</style>
