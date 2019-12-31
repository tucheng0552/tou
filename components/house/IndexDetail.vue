<template>
  <div>
    <!--  民宿  -->
    <div v-if="resData.merchantTypeId == 2">
      <div class="home-stay-head">
        <h2>{{resData.name}}</h2>
        <div class="head-logo">
          <div class="logo-left">
            <h6>{{resData.merchantSubTypeName}}</h6>
            <p>房东：<span>{{resData.owner.username}}</span></p>
          </div>
          <nuxt-link :to="'/user/'+resData.owner.id+'/merchant'" class="logo-face">
            <img :src="resData.owner.faceUrl" alt="">
          </nuxt-link>

        </div>

        <div v-if="resData.activityDays.salePromotion || resData.activityDays.hotSale" class="head-activity" @click="toggleActivity">
          <div class="activity-content">
            <span v-if="resData.activityDays.salePromotion && resData.activityDays.hotSale">促销·热销</span>
            <span v-else-if="resData.activityDays.salePromotion">促销</span>
            <span v-else-if="resData.activityDays.hotSale">热销</span>
            <ul class="days">
              <li v-for="(item, idx) in selfActivityDays" :key="item.id">
                {{item}}
              </li>
            </ul>
            <i></i>
          </div>
        </div>

        <div v-if="resData.virtualPointsRate" class="head-activity" @click="toggleVirtualPoints">
          <div class="activity-content">
            <span>送</span>
            <ul class="days">
              <li>
                入住后，赠送 [{{parseInt(resData.virtualPointsRate*100)}}%] DP
              </li>
            </ul>
            <i></i>
          </div>
        </div>

        <ul class="head-list">
          <li>
            <i class="u-icon-bnb-details-roomer"></i>
            <span>{{resData.maxCustomers}}位房客</span>
          </li>
          <li>
            <i class="u-icon-bnb-details-bedroom"></i>
            <span v-if="resData.livingRoomNum && resData.drawingRoomNum">{{resData.livingRoomNum}}室{{resData.drawingRoomNum}}厅</span>
            <span v-else-if="resData.livingRoomNum">{{resData.livingRoomNum}}间卧室</span>
            <span v-else>{{resData.drawingRoomNum}}个大厅</span>
          </li>
          <li v-if="resData.totalBedNum">
            <i class="u-icon-bnb-details-bed"></i>
            <span>{{resData.totalBedNum}}张床</span>
          </li>
          <li v-if="resData.toiletNum">
            <i class="u-icon-bnb-details-bathroom"></i>
            <span>{{resData.toiletNum}}个卫生间</span>
          </li>
        </ul>
      </div>
      <div class="home-stay-info">
        <h4>民宿介绍</h4>
        <p ref="houseIntroduction"
           :class="[isMoreIntroduction ? 'more' : '']">{{resData.introduction}}</p> <!--    -->
        <div class="info-translate">
          <!--<span>将本页翻译为中文</span>-->
          <!--<button type="button">翻译</button>-->
          <button type="button"
                  v-if="isMoreIntroduction"
                  @click="toggleIntroduction">阅读更多</button>
        </div>
      </div>
      <div class="home-stay-bad">
        <h4>床位安排</h4>
        <ul class="bad-list">
          <li v-for="(item, idx) in resData.bedRooms" :key="item.id">
            <img :src="item.iconUrl" alt="">
            <h6>{{item.bedRoomName}}</h6>
            <p v-if="item.beds[0]">{{item.beds[0].totalNum}}张{{item.beds[0].name}}</p>
          </li>
        </ul>
      </div>
      <div class="home-stay-address">
        <ul class="address-icon" v-if="resData._selfAllFacilities.length > 0" @click="toggleFacility">
          <li v-for="(item, idx) in showFacilities(resData._selfAllFacilities)" :key="idx">
            <img :src="item.iconUrl" alt="">
          </li>
          <li v-if="resData._selfAllFacilities.length>5">+{{resData._selfAllFacilities.length-5}}</li>
        </ul>
        <div class="address-map" @click="toggleMap">
          <img :src="resData.mapUrl" alt="">
          <div class="map-mark">
            <div class="mark-info">
              <!--<p>{{locationInfo}}</p>-->
              <p>{{resData.location.street}}</p>
              <span>准确地址将在预订后提供</span>
            </div>
            <div class="mark-circle"></div>
          </div>
        </div>
      </div>
      <div class="home-stay-comments" v-if="resComments.commentCount">
        <ul class="comments-msg">
          <li>
            <div class="msg-info">
              <img :src="resComments.merchantComments[0].commentUser.faceUrl" alt="">
              <div class="info-head">
                <div class="head-left">
                  <h6>{{resComments.merchantComments[0].commentUser.userName}}</h6>
                  <p>{{resComments.merchantComments[0].createdAt}}</p>
                </div>
              </div>
            </div>
            <p class="msg-txt">{{resComments.merchantComments[0].content}}</p>
            <div class="msg-all">
              <button type="button" @click="toggleComments">阅读全部评价 ({{resComments.commentCount}}条)</button>
              <ul class="u-items-star">
                <li v-for="(rate, rdx) in rateItems(resComments.merchantComments[0].rate)" :key="rdx" :class="rate"></li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <div class="home-stay-doc">
        <ul class="doc-items">
          <li v-if="resData.chargeableServices.length > 0" @click="toggleService">额外服务</li>
          <li @click="toggleProtocol">入住协议</li>
          <li @click="toggleRule">退订规则</li>
          <li @click="toggleReport">我要举报</li>
        </ul>
      </div>
    </div>

    <!--  酒店  -->
    <div v-else-if="resData.merchantTypeId == 1">
      <div class="home-stay-head">
        <h2>{{resData.name}}{{'&#45;'+resData.placardText}}</h2>
        <div class="head-logo">
          <div class="logo-left">
            <h6>{{resData.merchantSubTypeName}}</h6>
            <p>房东：<span>{{resData.owner.username}}</span></p>
          </div>
          <nuxt-link :to="'/user/'+resData.owner.id+'/merchant'" class="logo-face">
            <img :src="resData.owner.faceUrl" alt="">
          </nuxt-link>
        </div>

        <div v-if="selfRoomTypesActivity.salePromotion || selfRoomTypesActivity.hotSale" class="head-activity" @click="toggleActivity">
          <div class="activity-content">
            <span v-if="selfRoomTypesActivity.salePromotion && selfRoomTypesActivity.hotSale">促销·热销</span>
            <span v-else-if="selfRoomTypesActivity.salePromotion">促销</span>
            <span v-else-if="selfRoomTypesActivity.hotSale">热销</span>
            <ul class="days">
              <li v-for="(item, idx) in selfActivityDays" :key="item.id">
                {{item}}
              </li>
            </ul>
            <i></i>
          </div>
        </div>

        <div v-if="resData.virtualPointsRate" class="head-activity" @click="toggleVirtualPoints">
          <div class="activity-content">
            <span>送</span>
            <ul class="days">
              <li>
                入住后，赠送 [{{parseInt(resData.virtualPointsRate*100)}}%] DP
              </li>
            </ul>
            <i></i>
          </div>
        </div>
      </div>
      <div class="hotel-info">
        <h4>酒店介绍</h4>
        <p ref="houseIntroduction"
           :class="[isMoreIntroduction ? 'more' : '']">{{resData.introduction}}</p>
        <div class="info-translate">
          <!--<span>将本页翻译为中文</span>-->
          <!--<button type="button">翻译</button>-->
          <button type="button"
                  v-if="isMoreIntroduction"
                  @click="toggleIntroduction">阅读更多</button>
        </div>
      </div>
      <div class="home-stay-address">
        <ul class="address-icon" v-if="resData._selfAllFacilities.length > 0" @click="toggleFacility">
          <li v-for="(item, idx) in showFacilities(resData._selfAllFacilities)" :key="idx">
            <img :src="item.iconUrl" alt="">
          </li>
          <li v-if="resData._selfAllFacilities.length>5">+{{resData._selfAllFacilities.length-5}}</li>
        </ul>
        <div class="address-map" @click="toggleMap">
          <img :src="resData.mapUrl" alt="">
          <div class="map-mark">
            <div class="mark-info">
              <!--<p>{{locationInfo}}</p>-->
              <p>{{resData.location.street}}</p>
              <span>准确地址将在预订后提供</span>
            </div>
            <div class="mark-circle"></div>
          </div>
        </div>
      </div>
      <div class="home-stay-comments" v-if="resComments.commentCount">
        <ul class="comments-msg">
          <li>
            <div class="msg-info">
              <img :src="resComments.merchantComments[0].commentUser.faceUrl" alt="">
              <div class="info-head">
                <div class="head-left">
                  <h6>{{resComments.merchantComments[0].commentUser.userName}}</h6>
                  <p>{{resComments.merchantComments[0].createdAt}}</p>
                </div>
              </div>
            </div>
            <p class="msg-txt">{{resComments.merchantComments[0].content}}</p>
            <div class="msg-all">
              <button type="button" @click="toggleComments">阅读全部评价 ({{resComments.commentCount}}条)</button>
              <ul class="u-items-star">
                <li v-for="(rate, rdx) in rateItems(resComments.merchantComments[0].rate)" :key="rdx" :class="rate"></li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <div class="home-stay-doc">
        <ul class="doc-items">
          <li v-if="resData.chargeableServices.length > 0" @click="toggleService">额外服务</li>
          <li @click="toggleProtocol">入住协议</li>
          <li @click="toggleRule">退订规则</li>
          <li @click="toggleReport">我要举报</li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
  import { setRateItems } from '~/assets/js/utils'
  // import dayjs from 'dayjs'

  export default {
    name: "index-detail",
    props: {
      resData: {
        type: Object,
        request: true,
        default: () => {}
      },
      resComments: {
        type: Object,
        request: true,
        default: () => {}
      },
      locationInfo: {
        type: String,
        request: true,
        default: () => ''
      }
    },
    data() {
      return {
        isMoreIntroduction: false,
        selfActivityDays: [],
        selfRoomTypesActivity:{

        }
      }
    },
    computed: {

    },
    mounted(){

      if(this.resData.merchantTypeId == 2){
        if(this.resData.activityDays.salePromotion || this.resData.activityDays.hotSale){
          this.setActivityDays([...this.resData.activityDays.salePromotion || [], ...this.resData.activityDays.hotSale || []])
        }
      }else if(this.resData.merchantTypeId == 1){

        for(let value of this.resData.roomTypes.values()){
          if(value.activityDays.salePromotion && value.activityDays.hotSale){
            this.selfRoomTypesActivity = {
              salePromotion: true,
              hotSale: true
            }
          }else if(value.activityDays.salePromotion){
            this.selfRoomTypesActivity.salePromotion = true
          }else if(value.activityDays.hotSale){
            this.selfRoomTypesActivity.hotSale = true
          }


          if(value.activityDays.salePromotion || value.activityDays.hotSale){
            this.setActivityDays([...value.activityDays.salePromotion || [], ...value.activityDays.hotSale || []])
          }
        }

      }
      this.$nextTick(() => {

      })


    },

    updated(){
      if(this.$refs.houseIntroduction.clientHeight > 104){
        this.isMoreIntroduction = true
      }
    },
    methods: {
      showFacilities(arr) {
        if(arr.length > 5){
          return arr.slice(0, 5)
        }else {
          return arr
        }
      },

      setActivityDays(arr){
        let _selfArr  = Array.from(new Set(arr));
        for(let [id, value] of _selfArr.entries()){
          if(id < 4){
            //dayjs().format('M月D日')
            this.selfActivityDays.push(value.slice(0, 2)+'月'+value.slice(2)+'日');
          }
        }
      },

      //  评论星级
      rateItems(rate) {
        return setRateItems(rate)
      },

      //  活动
      toggleActivity() {
        this.$emit('toggle-activity');
      },

      toggleVirtualPoints() {
        this.$emit('toggle-virtual-points');
      },

      //  各类设施
      toggleFacility() {
        this.$emit('toggle-facility');
      },

      //  地图详情
      toggleMap() {
        this.$emit('toggle-map');
      },

      //  评论列表
      toggleComments(){
        this.$emit('toggle-comments');
      },

      //  额外服务
      toggleService() {
        this.$emit('toggle-service');
      },

      //  入住协议
      toggleProtocol(){
        this.$emit('toggle-protocol');
      },
      //  退订规则
      toggleRule(){
        this.$emit('toggle-rule');
      },
      //  举报
      toggleReport(){
        this.$emit('toggle-report');
      },

      toggleIntroduction(){
        this.$emit('toggle-introduction');
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';

  .home-stay-head{
    @extend .l-house-index-head
  }
  .home-stay-info{
    @extend .l-house-index-info
  }
  .hotel-info{
    border-top: 1px solid $b3;
    @extend .l-house-index-info
  }
  .home-stay-bad{
    @extend .l-house-index-bad
  }
  .home-stay-address{
    @extend .l-house-index-address
  }
  .home-stay-comments{
    @extend .l-house-index-comments
  }
  .home-stay-doc{
    @extend .l-house-index-doc
  }
</style>
