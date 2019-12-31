<template>

  <div class="user-side">
    <!--  分享足迹  -->
    <div class="c-base-todoList experience-list" v-if="sideData.type == 4">
      <div class="list-title" v-if="sideData.title">
        <h6>{{sideData.title}}</h6>
        <div v-if="titleBtn == 'self' && sideData.items.length > 0">
          <button type="button" @click="toggleColumnEdit" v-show="!columnEdit">管理</button>
          <button type="button" class="light" @click="toggleColumnEdit" v-show="columnEdit">完成</button>
        </div>
        <button type="button" @click="toggleModal"
                v-else-if="titleBtn == 'others' && sideData.items.length > 0">举报Ta</button>
      </div>
      <div class="columns is-mobile todoList-items" v-if="sideData.items.length > 0">
        <div class="column is-6 item" v-for="(item, idx) in sideData.items" :key="item.id">
          <nuxt-link :to="'/experiences/'+item.id" class="card item-card is-shadowless">
            <div class="card-image card-banner">
              <figure class="image is-4by3">
                <img :src="item.imageUri" alt="Placeholder image">
              </figure>
              <button type="button" class="delete is-small" @click.prevent="deleteColumn(item.id)" v-show="columnEdit"></button>
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

      <div class="list-text" v-else>
        <p>探索世界，与众多toU旅行者分享走过的足迹，结识更多热爱旅行的朋友</p>
      </div>
    </div>

    <!--  发布的房源  -->
    <div class="c-base-todoList experience-list" v-else>
      <div class="list-title" v-if="sideData.title">
        <h6>{{sideData.title}}</h6>
      </div>
      <div class="columns is-mobile todoList-items" v-if="sideData.items.length > 0">
        <div class="column is-6 item" v-for="(item, idx) in sideData.items" :key="item.id">
          <nuxt-link :to="(item.merchantTypeId == 2) ? '/homestay/'+item.id : (item.merchantTypeId == 1) ? '/hotel/'+item.id : ''"
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

                <h5 class="info-title">{{item.name}}-{{item.placardText}}</h5>
                <p class="info-price">
                  <i>{{currencySymbol}}</i><span class="u-price-num price-num">{{item.lowestPrice}}</span>&nbsp;起&nbsp;
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

      <div class="list-text" v-else>
        <p>无房源信息</p>
      </div>
    </div>
  </div>

</template>

<script>
  import { setRateItems } from '~/assets/js/utils'
  import { mapState } from 'vuex'

  export default {
    name: "todo-list-side",
    props: {
      sideData: {
        type: Object,
        required:  true,
        default: () => {}
      }
    },
    data() {
      return {
        titleBtn: '',
        columnEdit: false
      }
    },
    watch: {

    },
    computed:{
      ...mapState({
        authUser: 'authUser',
        deviceType: 'deviceType',
      }),
    },
    asyncData(context){
      return {
        currencySymbol: context.query.currency ?
          context.store.state.currencyList[context.query.currency].currencySymbol : '¥' }
    },
    created(){

    },
    mounted(){
      let path = this.$route.path;
      if(path == '/user/info'){
        this.titleBtn= 'self'
      }else if(path == '/user/:id/merchant' || path == '/user/:id/others'){
        this.titleBtn= 'others'
      }
    },
    methods: {
      //  评论星级
      rateItems(rate) {
        return setRateItems(rate)
      },
      toggleColumnEdit(){
        this.columnEdit = !this.columnEdit
      },
      deleteColumn(id){
        this.$emit('delete-column', id)
      },
      toggleModal(){
        this.$emit('toggle-modal')
      },
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';

  .user-side{
    padding-bottom: 48px;
    .list-text{
      padding: 24px 8px;
      >p{
        @include font-style(14px, $color:$t2);
      }
    }
  }
  @media screen and #{$touch-width}{
    .experience-list{
      .list-title{
        padding-top: 24px;
      }
    }
  }

  .experience-list{
    .list-title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 8px;
      >h6{
        @include font-style(18px);
        font-weight: bold;
      }
      button{
        @include font-style(14px, 18px, $color:$t3);
        &.light{
          color: $t6;
        }
      }
    }
  }
</style>
