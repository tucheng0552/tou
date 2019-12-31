<template>

  <div>
    <section class="container is-widescreen l-page-section">
      <!--  工具栏 -->
      <aside class="aside">
        <div class="aside-main">
          <div class="main-left">
            <div class="left-box">
              <button type="button" :class="[isActiveCalendar ? 'btn-active' : '', 'left-btn', 'is-shadowless' ]" @click="toggleModalCalendar">{{textBtnDate}}</button>
              <div :class="[showModalCalendar ? 'modal-box-active' : '', 'modal-box']">
                <div class="box-background" @click="toggleModalCalendar"></div>
                <!--  日历  -->
                <div class="box-main">
                  <div class="main-head">
                    <button type="button" class="close-btn" @click="toggleModalCalendar"></button>
                    <button type="button" class="" @click="clearDate">清除</button>
                  </div>
                  <div class="main-calendar">
                    <div class="calendar-title is-hidden-desktop">
                      <p class="">{{arrivalDate}}</p>
                      <p class="light">{{dayCountStr}}</p>
                      <p class="">{{departureDate}}</p>
                    </div>
                    <aside-calendar
                      @check-in-date="checkInDate"
                      ref="asideCalendar"></aside-calendar>
                    <div class="foot-desktop is-hidden-touch">
                      <div class="foot-left">
                        <button type="button" @click="toggleModalCalendar">取消</button>
                        <button type="button" @click="clearDate">重置</button>
                      </div>
                      <button type="button" class="light" @click="setTextBtn">确定</button>
                    </div>
                    <div class="foot-touch is-hidden-desktop">
                      <button type="button" class="light" @click="setTextBtn">确定</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="left-box">
              <button type="button" :class="[isActivePeople ? 'btn-active' : '', 'left-btn', 'is-shadowless' ]" @click="toggleModalPeople">{{peopleNumSum}}</button>
              <!--  模态框 -->
              <div :class="[showModalPeople ? 'modal-box-active' : '', 'modal-box']">
                <div class="box-background" @click="toggleModalPeople"></div>
                <!--  人数  -->
                <div class="box-main">
                  <div class="main-head">
                    <button type="button" class="close-btn" @click="toggleModalPeople"></button>
                  </div>
                  <ul class="main-people">
                    <li>
                      <div class="people-left">
                        <p>成人</p>
                      </div>
                      <div class="people-right">
                        <img src="~/assets/image/icon/global_icon_minus_small_dis.png" alt="" class="min" @click="minAdultsNum">
                        <span class="right-num">{{selfPeopleNum.adultsNum}}</span>
                        <img src="~/assets/image/icon/global_icon_add_small_nor.png" alt="" class="add" @click="addAdultsNum">
                      </div>
                    </li>
                    <li>
                      <div class="people-left">
                        <p>儿童</p>
                        <span>2-12岁</span>
                      </div>
                      <div class="people-right">
                        <img src="~/assets/image/icon/global_icon_minus_small_dis.png" alt="" class="min" @click="minChildrenNum">
                        <span class="right-num">{{selfPeopleNum.childrenNum}}</span>
                        <img src="~/assets/image/icon/global_icon_add_small_nor.png" alt="" class="add" @click="addChildrenNum">
                      </div>
                    </li>
                    <li>
                      <div class="people-left">
                        <p>婴幼儿</p>
                        <span>2岁以下</span>
                      </div>
                      <div class="people-right">
                        <img src="~/assets/image/icon/global_icon_minus_small_dis.png" alt="" class="min" @click="minBabiesNum">
                        <span class="right-num">{{selfPeopleNum.babiesNum}}</span>
                        <img src="~/assets/image/icon/global_icon_add_small_nor.png" alt="" class="add" @click="addBabiesNum">
                      </div>
                    </li>
                    <li>
                      <div class="people-left">
                        <p>宠物</p>
                        <!--<span class="red">该房源不允许携带宠物入住</span>-->
                      </div>
                      <div class="u-switch">
                        <input id="switch-toggle-Animal" class="switch-toggle switch-toggle-round" type="checkbox" v-model="selfPeopleNum.acceptAnimal">
                        <label for="switch-toggle-Animal"></label>
                      </div>
                    </li>
                    <li>
                      <div class="foot-desktop is-hidden-touch">
                        <div class="foot-left">
                          <button type="button" @click="toggleModalPeople">取消</button>
                          <button type="button" @click="clearPeople">重置</button>
                        </div>
                        <button type="button" class="light" @click="setPeople">确定</button>
                      </div>

                      <div class="foot-touch is-hidden-desktop">
                        <button type="button" class="light" @click="setPeople">确定</button>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

            </div>

            <div class="left-box">
              <button type="button" :class="[isActiveFilter ? 'btn-active' : '', 'left-btn', 'is-shadowless' ]" @click="toggleModalFilter">{{textBtnFilter}}</button>
              <!--  模态框 -->
              <div :class="[showModalFilter ? 'modal-box-active' : '', 'modal-box']">
                <div class="box-background" @click="toggleModalFilter"></div>
                <!--  条件  -->
                <div class="box-main">
                  <div class="main-head">
                    <button type="button" class="close-btn" @click="toggleModalFilter"></button>
                    <p>筛选条件</p>
                    <button type="button" class="" @click="">重置</button>
                  </div>
                  <ul class="main-filter">
                    <li>
                      <div class="filter-left">
                        <div class="left-order">
                          <div class="order-info">
                            <p class="">闪订</p>
                            <span>无需等待房东确认，即可预订住宿</span>
                          </div>
                          <div class="u-switch">
                            <input id="switch-toggle-flash" class="switch-toggle switch-toggle-round" type="checkbox" v-model="selfFilterModel.acceptQuickBooking">
                            <label for="switch-toggle-flash"></label>
                          </div>
                        </div>

                        <div class="left-activity">
                          <h5>热门活动</h5>
                          <div class="activity-type">
                            <label for="sales" class="type-icon">
                              <div class="u-checkbox">
                                <input class="checkbox-toggle" type="checkbox" id="sales" value="1" v-model="selfFilterModel.activityTypes">
                                <label for="sales" class=""></label>
                              </div>
                              <p>促销</p>
                            </label>

                            <label for="hot" class="type-icon">
                              <div class="u-checkbox">
                                <input class="checkbox-toggle" type="checkbox" id="hot" value="2" v-model="selfFilterModel.activityTypes">
                                <label for="hot" class=""></label>
                              </div>
                              <p>热销</p>
                            </label>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li v-if="false">
                      <div class="filter-left">
                        <h5>价格范围</h5>
                        <div></div>
                      </div>
                    </li>
                    <li v-for="(items, idx) in resFilterList" :key="items.id">
                      <div class="filter-left">
                        <h5>{{items.groupName}}</h5>
                      </div>
                      <ul class="items-type">
                        <li v-for="(item, idn) in items.filters" :key="item.id">
                          <label :for="item.name" class="type">
                            <div class="type-des">
                              <p>{{item.name}}</p>
                              <span v-if="item.describe">{{item.describe}}</span>
                            </div>
                            <div class="u-checkbox">
                              <input class="checkbox-toggle" type="checkbox" :id="item.name" :value="item.id" v-model="selfFilterModel[items.code]">
                              <label :for="item.name" class=""></label>
                            </div>
                          </label>
                        </li>
                      </ul>
                    </li>
                  </ul>

                  <div class="foot-filter-desktop is-hidden-touch">
                    <button type="button" class="light" @click="setActiveFilter">查看{{resSearchCounter.selfCounterNum}}个房源</button>
                    <button type="button" @click="clearFilter">重置</button>
                    <button type="button" @click="toggleModalFilter">取消</button>
                  </div>
                  <div class="foot-filter-touch is-hidden-desktop">
                    <button type="button" class="light" @click="setActiveFilter">查看{{resSearchCounter.selfCounterNum}}个房源</button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div class="main-right is-hidden-touch">
            <p>显示地图</p>
            <div class="u-switch">
              <input id="switch-toggle-map" class="switch-toggle switch-toggle-round" type="checkbox" v-model="showMap">
              <label for="switch-toggle-map"></label>
            </div>
          </div>

          <!--  触屏设备  -->
          <div class="main-map is-hidden-desktop" @click="toggleMapTouch">
            <img src="~/assets/image/icon/order_details_icon_map.png" alt="">
          </div>
        </div>

      </aside>

      <div class="columns list-columns">
        <div class="column columns-column">
          <div class="c-base-todoList">
            <!--  民宿  / 酒店  -->
            <div class="columns is-mobile todoList-items" v-if="(todoListData.type == 2) || todoListData.type == 1">
              <div class="column is-12-touch item recommend"
                   :class="[showMap ? 'is-6-desktop' : 'is-4-desktop']"
                   v-for="(item, idx) in todoListData.items" :key="item.id">
                <nuxt-link :to="(item.merchantTypeId == 2) ? '/homestay/'+item.id+'?currency='+ currency
                : (item.merchantTypeId == 1) ? '/hotel/'+item.id+'?currency='+ currency : ''"
                           class="card item-card is-shadowless" @mouseover.native="setHoverMarker(idx)">
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

                      <div class="info-name">
                        <div class="info-type">
                          <p>{{item.name}}</p>
                          <span v-if="item.merchantTypeId == 2" class="type-sub">{{item.merchantSubTypeName}}-{{item.livingRoomNum}}房{{item.drawingRoomNum}}厅&nbsp;{{item.totalBedNum}}床{{item.toiletNum}}卫</span>
                          <span v-else-if="item.merchantTypeId == 1" class="type-sub">{{item.merchantSubTypeName}}-{{item.totalRoomTypeNum}}间房</span>

                        </div>
                        <img v-if="item.owner" :src="item.owner.faceUrl" alt="">
                      </div>
                    </div>
                  </div>
                </nuxt-link>
              </div>
            </div>

          </div>
          <!--  分页器 -->
          <app-navigation ref="appNavigation" @update-data="getSearchHouse"></app-navigation>
        </div>

        <!--  map -->
        <div v-show="showMap" class="column is-hidden-touch columns-column">
          <div class="aMap">
            <no-ssr>
              <el-amap class="aMap-box" :zoom="aMapZoom" :center="aMapCenter">
                <el-amap-marker v-for="(marker, idx) in aMapMarkers" :position="marker.point" :content="marker.content" :key="idx"></el-amap-marker>
              </el-amap>
            </no-ssr>
          </div>
        </div>
      </div>
    </section>

    <!--  移动端地图详情  -->
    <div :class="[showMapTouch ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="toggleMapTouch"></div>
      <div class="modal-content">
        <div class="map-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="toggleMapTouch"></button>
          </div>
          <div class="modal-main">
            <div class="main-map">
              <no-ssr>
                <el-amap class="aMap-box" :zoom="aMapZoom" :center="aMapCenter">
                  <el-amap-marker v-for="(marker, idx) in aMapMarkers" :position="marker.point" :content="marker.content" :key="idx"></el-amap-marker>
                </el-amap>
              </no-ssr>
            </div>

            <div class="main-house">
              <div v-swiper:touchSwiper="swiperTouch">
                <div class="swiper-wrapper my-swiper">
                  <div class="swiper-slide" v-for="(item, idx) in todoListData.items" :key="item.id">
                    <nuxt-link :to="(item.merchantTypeId == 2) ? '/homestay/'+item.id+'?currency='+ currency
                    : (item.merchantTypeId == 1) ? '/hotel/'+item.id+'?currency='+ currency : ''"
                               class="card item-card is-shadowless">
                      <div class="card-image card-banner">
                        <figure class="image is-4by3">
                          <div :class="[(flagActiveMarker == idx) ? 'active-marker' : '', 'index-marker']"></div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import AsideCalendar from '~/components/search/AsideCalendar.vue'
  import { mapState } from 'vuex'
  import axios from 'axios'
  import homestay from '~/assets/js/api/homestay'
  import hotel from '~/assets/js/api/hotel'
  import system from '~/assets/js/api/system'
  import AppNavigation from '~/components/AppNavigation.vue'
  import { setRateItems } from '~/assets/js/utils'
  import dayjs from 'dayjs'

  export default {
    head: {

    },
    name: "search-house",
    components: {
      AsideCalendar,
      AppNavigation
    },
    head(){
      return {
        title: '房型-搜索'
      }
    },
    data() {
      return {
        /**
         *  日历
         * */
        isActiveCalendar: false,  //  按钮选中
        showModalCalendar: false,  //  模态框
        arrivalDate : '入住日期',
        departureDate: '退房日期',
        dayCountStr: undefined, //  入住天数
        textBtnDate: '所有日期',
        /**
         *  人数
         * */
        isActivePeople: false,  //  按钮选中
        showModalPeople: false,  //  模态框
        peopleNumSum: '1人',
        selfPeopleNum:{ //  本地未保存数据
          adultsNum: 1, //  成人
          childrenNum: 0, //  儿童
          babiesNum: 0, //婴儿
          acceptAnimal: false //  宠物
        },
        peopleNum:{
          adultsNum: 1, //  成人
          childrenNum: 0, //  儿童
          babiesNum: 0, //婴儿
          acceptAnimal: false //  宠物
        },

        /**
         *  筛选条件
         * */
        textBtnFilter: '筛选条件',
        isActiveFilter: false,  //  按钮选中
        showModalFilter: false, //  模态框

        /**
         * 地图
         * */
        showMap:false,
        aMapZoom:11,
        //  触摸设备
        showMapTouch: false,

        swiperTouch: {
          slidesPerView: 2,
          spaceBetween: 12,
          slidesOffsetBefore: 16,
          slidesOffsetAfter: 16,
          on: {
            slideChange: ()=> {
              this.flagActiveMarker = this.touchSwiper.activeIndex;
              this.setHoverMarker(this.touchSwiper.activeIndex)
            },
            tap() {
              // console.log('onTap', this);
            }
          }
        },
        flagActiveMarker: 0
      }
    },
    mounted(){
    },
    watch: {
      selfFilterModel : {
        handler (val, oldVal) {
           this.getSearchCounter()
        },
        deep: true
      }

    },
    watchQuery: true,
    asyncData (context){
      let [pt, type, keywords, _selfSearchLength, currency, currencyCode, currencySymbol] = [context.store.state.deviceType.type, context.query.type,
        context.query.keywords ? decodeURI(context.query.keywords) : '',
        9,
        context.query.currency ? context.query.currency : 0,
        context.query.currency ? context.store.state.currencyList[context.query.currency].currencyCode : 'CNY',
        context.query.currency ? context.store.state.currencyList[context.query.currency].currencySymbol : '¥'];
      if(type == 2){
        return axios.all([homestay.search({pt: pt, cursor:0, length: _selfSearchLength, currency: currencyCode}, {keywords:keywords}),
          homestay.counter({pt: pt, currency: currencyCode}, {keywords:keywords}), system.filter({pt: pt})]).then(
          axios.spread( (data, counter, filter)=>{
            if(data.data.code == 0 && counter.data.code == 0){
              //  初始化地图
              let [_selfMarkers, itemsArr, _selfFilterList, _selfFilterModel, _selfCounterNum] = [[], new Array(data.data.result.length).fill({}), [], {}, 0];
              for(let [id, value] of itemsArr.entries()){
                if(id > 0){
                  value = {
                    point: data.data.result[id].location.point,
                    content: `<div style="position: relative; border: 1px solid #fff; background-color: #fff; color: #3d3a27; font-size: 16px; line-height: 1; padding: 6px 12px; border-radius: 4px;">${currencySymbol}${data.data.result[id].lowestPrice}<i style="content: ''; position: absolute; bottom: 0; left: 50%; transform: translate(-50%, 100%); width: 0; height: 0; border: 8px solid transparent; border-top: 8px solid #fff;"></i></div>`
                  };
                }else{
                  value = {
                    point: data.data.result[id].location.point,
                    content: `<div style="position: relative; border: 1px solid #ffdc2e; background-color: #ffdc2e; color: #3d3a27; font-size: 16px; line-height: 1; padding: 6px 12px; border-radius: 4px;">${currencySymbol}${data.data.result[id].lowestPrice}<i style="content: ''; position: absolute; bottom: 0; left: 50%; transform: translate(-50%, 100%); width: 0; height: 0; border: 8px solid transparent; border-top: 8px solid #ffdc2e;"></i></div>`
                  };
                }
                _selfMarkers.push(value)
              }

              //  房源数量
              for(let value of counter.data.result.counter.values()){
                _selfCounterNum += value
              }

              //  初始化筛选条件
              for(let value of filter.data.result.data.values()){
                if(value.type == type) {
                  _selfFilterList = value.filterGroups;
                  for(let item of _selfFilterList.values()){
                    _selfFilterModel[item.code] = []
                  }
                }
              }

              return {
                todoListData:{
                  type: 2,
                  items: data.data.result,
                },
                aMapMarkers: _selfMarkers,
                aMapCenter: _selfMarkers[0].point,

                resSearchCounter: {
                  selfCounterNum : _selfCounterNum,
                  ...counter.data.result
                },

                resFilterList : _selfFilterList,  //  响应搜索条件列表
                selfFilterModel:{
                  acceptQuickBooking:false, //  闪订
                  activityTypes: [],
                  // priceStart: 0,  //  最低价
                  // priceEnd: 0,  //  最高价
                  ..._selfFilterModel
                },

                selfSearchLength: _selfSearchLength,
                currency: currency,
                currencyCode: currencyCode,
                currencySymbol: currencySymbol
              }
            }else{
              throw data.data.msg+'/'+counter.data.msg
            }

          } )
        ).catch(
          e =>{
            context.error({ statusCode: 400, message: e })
          }
        )
      }else if(type == 1){
        return axios.all([hotel.search({pt: pt, cursor:0, length: _selfSearchLength, currency: currencyCode}, {keywords:keywords}),
          hotel.counter({pt: pt, currency: currencyCode}, {keywords:keywords}), system.filter({pt: pt})]).then(
          axios.spread( (data, counter, filter)=>{
            if(data.data.code == 0 && counter.data.code == 0){
              //  初始化地图
              let [_selfMarkers, itemsArr, _selfFilterList, _selfFilterModel, _selfCounterNum] = [[], new Array(data.data.result.length).fill({}), [], {}, 0];
              for(let [id, value] of itemsArr.entries()){
                if(id > 0){
                  value = {
                    point: data.data.result[id].location.point,
                    content: `<div style="position: relative; border: 1px solid #fff; background-color: #fff; color: #3d3a27; font-size: 16px; line-height: 1; padding: 6px 12px; border-radius: 4px;">${currencySymbol}${data.data.result[id].lowestPrice}<i style="content: ''; position: absolute; bottom: 0; left: 50%; transform: translate(-50%, 100%); width: 0; height: 0; border: 8px solid transparent; border-top: 8px solid #fff;"></i></div>`
                  };
                }else{
                  value = {
                    point: data.data.result[id].location.point,
                    content: `<div style="position: relative; border: 1px solid #ffdc2e; background-color: #ffdc2e; color: #3d3a27; font-size: 16px; line-height: 1; padding: 6px 12px; border-radius: 4px;">${currencySymbol}${data.data.result[id].lowestPrice}<i style="content: ''; position: absolute; bottom: 0; left: 50%; transform: translate(-50%, 100%); width: 0; height: 0; border: 8px solid transparent; border-top: 8px solid #ffdc2e;"></i></div>`
                  };
                }
                _selfMarkers.push(value)
              }

              //  房源数量
              for(let value of counter.data.result.counter.values()){
                _selfCounterNum += value
              }

              //  初始化筛选条件
              for(let value of filter.data.result.data.values()){
                if(value.type == type) {
                  _selfFilterList = value.filterGroups;
                  for(let item of _selfFilterList.values()){
                    _selfFilterModel[item.code] = []
                  }
                }
              }

              return {
                todoListData:{
                  type: 2,
                  items: data.data.result,
                },
                aMapMarkers: _selfMarkers,
                aMapCenter: _selfMarkers[0].point,

                resSearchCounter: {
                  selfCounterNum : _selfCounterNum,
                  ...counter.data.result
                },

                resFilterList : _selfFilterList,  //  响应搜索条件列表
                selfFilterModel:{
                  acceptQuickBooking:false, //  闪订
                  activityTypes: [],
                  // priceStart: 0,  //  最低价
                  // priceEnd: 0,  //  最高价
                  ..._selfFilterModel
                },

                selfSearchLength: _selfSearchLength,
                currency: currency,
                currencyCode: currencyCode,
                currencySymbol: currencySymbol
              }
            }else{
              throw data.data.msg+'/'+counter.data.msg
            }

          } )
        ).catch(
          e =>{
            context.error({ statusCode: 400, message: e })
          }
        )
      }
    },
    computed: {
      ...mapState({
        // authUser: 'authUser',
        // userInfo: 'userInfo',
        deviceType: 'deviceType'
      })
    },
    methods: {
      //  评论星级
      rateItems(rate){
        return setRateItems(rate)
      },

      /**
       *  日历
       * */
      toggleModalCalendar(){
        this.showModalCalendar = !this.showModalCalendar
      },
      async checkInDate(arrivalDate, departureDate, dayCountStr){
        this.arrivalDate = arrivalDate;
        this.dayCountStr = dayCountStr;

        if(departureDate){
          this.departureDate = departureDate;

        }else{
          this.departureDate = '退房日期';
        }
      },
      clearDate(){
        this.arrivalDate = '入住日期';
        this.departureDate = '退房日期';
        this.dayCountStr = undefined;
        this.$refs.asideCalendar.clearDayStyle();
      },
      setTextBtn(){
        if(this.departureDate != '退房日期'){
          this.textBtnDate = dayjs(this.arrivalDate).format('MM月DD日') + '-' + dayjs(this. departureDate).format('MM月DD日');
          this.isActiveCalendar = true;
        }else if(this.arrivalDate == '入住日期'){
          this.textBtnDate = '所有日期';
          this.isActiveCalendar = false
        }
        this.getSearchHouse();  //  刷新数据
        this.toggleModalCalendar();
      },
      /**
       *  设置人数
       * */
      toggleModalPeople(){
        this.showModalPeople = !this.showModalPeople
      },

      minAdultsNum() {
        this.selfPeopleNum.adultsNum > 1 &&this.selfPeopleNum.adultsNum--
      },
      addAdultsNum() {
        this.selfPeopleNum.adultsNum++
      },
      minChildrenNum() {
        this.selfPeopleNum.childrenNum > 0 &&this.selfPeopleNum.childrenNum--
      },
      addChildrenNum() {
        this.selfPeopleNum.childrenNum++
      },
      minBabiesNum() {
        this.selfPeopleNum.babiesNum > 0 &&this.selfPeopleNum.babiesNum--
      },
      addBabiesNum() {
        this.selfPeopleNum.babiesNum++
      },

      clearPeople(){
        this.selfPeopleNum = { //  本地未保存数据
          adultsNum: 1, //  成人
          childrenNum: 0, //  儿童
          babiesNum: 0, //婴儿
          acceptAnimal: false //  宠物
        }
      },

      setPeople(){
        let _selfNum = this.selfPeopleNum.adultsNum + this.selfPeopleNum.childrenNum;
        if(this.selfPeopleNum.acceptAnimal){
          if(this.selfPeopleNum.babiesNum > 0){
            this.peopleNumSum = _selfNum + '人·' + this.selfPeopleNum.babiesNum + '名婴幼儿·宠物';
            this.isActivePeople = true;
          }else{
            this.peopleNumSum = _selfNum + '人·宠物';
            this.isActivePeople = true;
          }
        }else{
          if(this.selfPeopleNum.babiesNum > 0){
            this.peopleNumSum = _selfNum + '人·' + this.selfPeopleNum.babiesNum + '名婴幼儿';
            this.isActivePeople = true;
          }else{
            this.peopleNumSum = _selfNum + '人';
            if(_selfNum > 1){
              this.isActivePeople = true;
            }else{
              this.isActivePeople = false;
            }
          }
        }

        this.peopleNum = this.selfPeopleNum;

        this.getSearchHouse();  //  刷新数据
        this.toggleModalPeople();
      },

      /**
       *  设置筛选条件
       * */
      toggleModalFilter(){
        this.showModalFilter = !this.showModalFilter
      },
      clearFilter(){
        for(let value in this.selfFilterModel){
          if(Array.isArray(this.selfFilterModel[value])){
            this.selfFilterModel[value] = []
          }else{  //  非数组
            this.selfFilterModel[value] = false
          }
        }

      },
      setActiveFilter(){
        let _selfNum = 0;
        if(this.selfFilterModel.acceptQuickBooking){
          _selfNum++;
          for(let value in this.selfFilterModel){
            if(Array.isArray(this.selfFilterModel[value])){
              _selfNum+=this.selfFilterModel[value].length
            }else{  //  非数组

            }
          }
        }else{
          for(let value in this.selfFilterModel){
            if(Array.isArray(this.selfFilterModel[value])){
              _selfNum+=this.selfFilterModel[value].length
            }else{  //  非数组

            }
          }
        }
        if(_selfNum > 0){
          this.textBtnFilter = '筛选条件·' + _selfNum;
          this.isActiveFilter = true
        }else{
          this.textBtnFilter = '筛选条件';
          this.isActiveFilter = false
        }
        this.getSearchHouse();  //  刷新数据
        this.toggleModalFilter();
      },
      async getFilter(){
        try{
          let type = this.$route.query.type;
          let { data } = await this.$api.system.filter({pt: this.deviceType.type});
          if(data.code == 0){
            for(let value of data.result.data.values()){
              if(value.type == type) {
                this.resFilterList = value.filterGroups;
                for(let item of this.resFilterList.values()){
                  this.selfFilterModel[item.code] = []
                }
              }
            }
          }else{
            throw data.msg;
          }
        }catch (e){
          this.$toast.error(e)
        }
      },

      /**
       *  地图
       * */
      //  鼠标悬停高亮 Marker
      setHoverMarker(idx){
        if(this.showMap || this.showMapTouch){
          this.aMapCenter = this.aMapMarkers[idx].point;
          for(let [id, value] of this.aMapMarkers.entries()){
            if(id == idx){
              value.content= `<div style="position: relative; border: 1px solid #ffdc2e; background-color: #ffdc2e; color: #3d3a27; font-size: 16px; line-height: 1; padding: 6px 12px; border-radius: 4px;">${this.currencySymbol}${this.todoListData.items[id].lowestPrice}<i style="content: ''; position: absolute; bottom: 0; left: 50%; transform: translate(-50%, 100%); width: 0; height: 0; border: 8px solid transparent; border-top: 8px solid #ffdc2e;"></i></div>`
            }else{
              value.content= `<div style="position: relative; border: 1px solid #fff; background-color: #fff; color: #3d3a27; font-size: 16px; line-height: 1; padding: 6px 12px; border-radius: 4px;">${this.currencySymbol}${this.todoListData.items[id].lowestPrice}<i style="content: ''; position: absolute; bottom: 0; left: 50%; transform: translate(-50%, 100%); width: 0; height: 0; border: 8px solid transparent; border-top: 8px solid #fff;"></i></div>`
            }
          }
        }
      },
      toggleMapTouch(){
        this.showMapTouch = !this.showMapTouch
      },

      //  获取搜索列表
      async getSearchHouse(){
        let [type, keywords] = [this.$route.query.type, this.$route.query.keywords ? decodeURI(this.$route.query.keywords) : ''];
        let paramsFilter = {};
        for(let value in this.selfFilterModel){
          if(Array.isArray(this.selfFilterModel[value])){
            if(this.selfFilterModel[value].length > 0){
              paramsFilter[value] = this.selfFilterModel[value].join()
            }
          }else{  //  非数组
            paramsFilter[value] = this.selfFilterModel[value]
          }
        }
        let params = {
          keywords:keywords,
          arrivalDate: this.arrivalDate,
          departureDate: this.departureDate,
          ...this.peopleNum,
          ...paramsFilter
        };
        try {
          if(type == 2){
            //  民宿
            let { data } = await this.$api.homestay.search({pt: this.deviceType.type, cursor: (this.$refs.appNavigation.flagItem-1)*this.selfSearchLength, length: this.selfSearchLength}, params);
            if(data.code == 0){
              if(data.result.length > 0){
                this.todoListData.items = data.result;

                //  初始化地图
                let [_selfMarkers, itemsArr] = [[], new Array(data.result.length).fill({})];
                for(let [id, value] of itemsArr.entries()){
                  value = {
                    point: data.result[id].location.point,
                    content: `<div style="position: relative; border: 1px solid #fff; background-color: #fff; color: #3d3a27; font-size: 16px; line-height: 1; padding: 6px 12px; border-radius: 4px;">${this.currencySymbol}${data.result[id].lowestPrice}<i style="content: ''; position: absolute; bottom: 0; left: 50%; transform: translate(-50%, 100%); width: 0; height: 0; border: 8px solid transparent; border-top: 8px solid #fff;"></i></div>`
                  };
                  _selfMarkers.push(value)
                }
                this.aMapMarkers = _selfMarkers;
                this.aMapCenter = _selfMarkers[0].point;
              }

            }else {
              throw data.msg;
            }
          }else if(type == 1){
            //  酒店
            let { data } = await this.$api.hotel.search({pt: this.deviceType.type, cursor: (this.$refs.appNavigation.flagItem-1)*this.selfSearchLength, length: this.selfSearchLength}, params);
            if(data.code == 0){
              if(data.result.length > 0){
                this.todoListData.items = data.result;

                //  初始化地图
                let [_selfMarkers, itemsArr] = [[], new Array(data.result.length).fill({})];
                for(let [id, value] of itemsArr.entries()){
                  value = {
                    point: data.result[id].location.point,
                    content: `<div style="position: relative; border: 1px solid #fff; background-color: #fff; color: #3d3a27; font-size: 16px; line-height: 1; padding: 6px 12px; border-radius: 4px;">${this.currencySymbol}${data.result[id].lowestPrice}<i style="content: ''; position: absolute; bottom: 0; left: 50%; transform: translate(-50%, 100%); width: 0; height: 0; border: 8px solid transparent; border-top: 8px solid #fff;"></i></div>`
                  };
                  _selfMarkers.push(value)
                }
                this.aMapMarkers = _selfMarkers;
                this.aMapCenter = _selfMarkers[0].point;
              }

            }else {
              throw data.msg;
            }
          }
        }catch (e){
          this.$toast.error(e)
        }
      },

      //  获取搜索统计数据
      async getSearchCounter(){
        let [type, keywords] = [this.$route.query.type, this.$route.query.keywords ? decodeURI(this.$route.query.keywords) : ''];
        let paramsFilter = {};
        for(let value in this.selfFilterModel){
          if(Array.isArray(this.selfFilterModel[value])){
            if(this.selfFilterModel[value].length > 0){
              paramsFilter[value] = this.selfFilterModel[value].join()
            }
          }else{  //  非数组
            paramsFilter[value] = this.selfFilterModel[value]
          }

        }
        let params = {
          keywords:keywords,
          arrivalDate: this.arrivalDate,
          departureDate: this.departureDate,
          ...this.peopleNum,
          ...paramsFilter
        };
        try {
          if(type == 2){
            //  民宿
            let { data } = await this.$api.homestay.counter({pt: this.deviceType.type}, params);
            if(data.code == 0){

              let _selfCounterNum =0;
              //  房源数量
              for(let value of data.result.counter.values()){
                _selfCounterNum += value
              }

              this.resSearchCounter = {
                selfCounterNum: _selfCounterNum,
                ...data.result
              }

            }else {
              throw data.msg;
            }
          }else if(type == 1){
            //  酒店
            let { data } = await this.$api.hotel.counter({pt: this.deviceType.type}, params);
            if(data.code == 0){
              let _selfCounterNum =0;
              //  房源数量
              for(let value of data.result.counter.values()){
                _selfCounterNum += value
              }

              this.resSearchCounter = {
                selfCounterNum: _selfCounterNum,
                ...data.result
              }
            }else {
              throw data.msg;
            }
          }
        }catch (e){
          this.$toast.error(e)
        }
      }
    }

  }
</script>

<style scoped lang="scss">
  @import "~assets/style/scss/_base.scss";

  @media screen and #{$desktop-width}{
    .modal-box{
      position: absolute;
      top: 48px;
      left: 0;
      z-index: 9;
      min-width: 414px;
      max-height: 66vh;
      box-shadow: 0 2px 24px 0 rgba(0,0,0,0.12);
      .box-background{
        position: fixed;
        z-index: 99;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255,255,255, .8);
      }
      .box-main{
        z-index: 99;
        border-radius: 4px;
        .main-head{
          display: none;
        }
        .main-calendar{
          padding: 24px 16px;
          .foot-desktop{
            display: flex;
            justify-content: space-between;
            .foot-left{
              >button{
                margin-right: 48px;
                @include font-style(18px, $color:$t3);
              }
            }
            .light{
              @include font-style(18px, $color:$t6);
            }
          }
        }
      }
    }
  }

  @media screen and #{$touch-width}{
    .modal-box{
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 99;
      max-height: 100vh;
      .box-background{
        display: none;
      }
      .box-main{
        min-height: 100vh;
        .main-head{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 9px 16px;
          .close-btn{
            width: 24px;
            height: 24px;
            @include bg-image('~assets/image/icon/nav_icon_close_nor.png', 24px, 24px);
          }
        }
        .main-calendar{
          .foot-touch{
            position: fixed;
            left: 0;
            bottom: 0;
            width: 100vw;
            border-top: 1px solid $b3;
            padding: 16px;
            .light{
              width: 100%;
              padding: 16px 0;
              background-color: $t4;
              border-radius: 4px;
              @include font-style(16px);
            }
          }
        }
      }
    }
  }

  .list-columns{
    margin: 0;
    .columns-column{
      padding: 0;
    }
  }

  .aMap{
    padding: 16px 8px;
    height: 95%;
    .aMap-box {

    }
  }

  .search-list{

  }
  .aside{
    padding: 16px 8px 0 8px;
    .aside-main{
      display: flex;
      justify-content: space-between;
      .main-left{
        display: flex;
        .left-box{
          position: relative;
        }
        .left-btn{
          cursor: pointer;
          text-align: center;
          white-space: nowrap;
          background-color: $b0;
          border: 1px solid $b3;
          border-radius: 4px;
          padding: 8px 6px;
          margin-right: 8px;
          @include font-style(14px, $color:$t3);
        }
        .btn-active{
          background-color: $t4;
          border: 1px solid $t4;
          color: $t1;
        }
        .modal-box-active{
          display: flex;
        }
      }
      .main-right{
        display: flex;
        >p{
          margin-right: 16px;
          @include font-style(18px, 32px)
        }
      }
      .main-map{
        position: fixed;
        z-index: 9;
        right: 6%;
        bottom: 6%;
        >img{
          width: 48px;
          height: 48px;
        }
      }
    }
  }

  .modal-box {
    display: none;
    overflow-y: auto;
    background-color: $b0;
    .box-main{
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      .main-calendar{
        .calendar-title{
          display: flex;
          justify-content: space-between;
          padding: 8px;
          margin: 12px 0;
          >p{
            flex-grow: 1;
            text-align: center;
            @include font-style(16px);
            &.light{
              color: $t6;
            }
          }
        }
      }
      .main-people{
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 16px;
        >li{
          display: flex;
          justify-content: space-between;
          width: 100%;
          padding: 24px 0;
          .people-left{
            display: flex;
            flex-direction: column;
            >p{
              @include font-style(24px)
            }
            >span{
              padding-top: 8px;
              @include font-style(14px, $color:$t2);
              &.red{
                color: $t5;
              }
            }
          }
          .people-right{
            display: flex;
            justify-content: space-between;
            align-items: center;
            >img{
              width: 30px;
              cursor: pointer;
              &.min{}
              &.add{}
            }
            .right-num{
              margin: 0 24px;
              @include font-style(24px)
            }
          }
          .people-foot{
            width: 100%;
            display: flex;
            justify-content: space-between;
            >button{
              @include font-style(18px, $color:$t2);
            }
            .foot-left{

            }
            .foot-right{
              color: $t6;
            }
          }

          .foot-desktop{
            display: flex;
            justify-content: space-between;
            width: 100%;
            .foot-left{
              >button{
                margin-right: 48px;
                @include font-style(18px, $color:$t3);
              }
            }
            .light{
              @include font-style(18px, $color:$t6);
            }
          }
          .foot-touch{
            width: 100%;
            .light{
              width: 100%;
              padding: 16px 0;
              background-color: $t4;
              border-radius: 4px;
              @include font-style(16px);
            }
          }

        }
      }
      .main-filter{
        display: flex;
        flex-direction: column;
        padding: 0 16px;
        >li{
          display: flex;
          flex-direction: column;
          padding: 24px 0;
          &:not(:last-child){
            border-bottom: 1px solid $b3;
          }
          .filter-left{
            display: flex;
            flex-direction: column;
            width: 100%;
            >h5{
              @include font-style(20px)
            }
            .left-order{
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              .order-info{
                >p{
                  @include font-style(18px)
                }
                >span{
                  display: inline-block;
                  margin-top: 8px;
                  @include font-style(14px, $color:$t2)
                }
              }
            }
            .left-activity{
              >h5{
                margin: 24px 0 16px 0;
                @include font-style(20px)
              }
              .activity-type{
                display: flex;
                .type-icon{
                  display: flex;
                  align-items: center;
                  >p{
                    margin: 0 40px 0 8px;
                  }
                }
              }
            }
          }
          .items-type{
            >li{
              padding: 12px 0;
            }
            .type{
              display: flex;
              justify-content: space-between;
              align-items: center;
              .type-des{
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                >p{
                  @include font-style(16px)
                }
                >span{
                  display: inline-block;
                  margin-top: 8px;
                  @include font-style(14px, $color:$t2)
                }
              }
            }
          }
        }
      }

      .foot-filter-desktop{
        display: flex;
        flex-direction: row-reverse;
        padding: 16px 0;
        background-color: $b2;
        >button{
          margin-left: 48px;
          background-color: $b2;
          @include font-style(18px, $color:$t3)
        }
        .light{
          padding: 16px 32px;
          background-color: $t4;
          border-radius: 4px;
          color: $t1;
        }

      }
      .foot-filter-touch{
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100vw;
        border-top: 1px solid $b3;
        padding: 16px;
        background-color: $b0;
        .light{
          width: 100%;
          padding: 16px 0;
          background-color: $t4;
          border-radius: 4px;
          @include font-style(16px);
        }
      }
    }
  }

  .map-modal{
    height: 100vh;
    .modal-main{
      display: flex;
      flex-direction: column;
      height: calc(100vh - 42px);
      .main-map{
        height: calc(100vh - 336px);
      }
      .main-house{
        display: flex;
        align-items: center;
        flex: 1;
        //padding: 0 12px;
        .item-card{
          display: block;
          //padding: 0 6px;
          .card-banner{
            .image{
              .index-marker{
                display: none;
                z-index: 1;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 6px;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
                background-color: $t4;
              }
              .active-marker{
                display: flex;
              }
              >img{
                border-radius: 4px;
              }
            }
            .banner-type{
              position: absolute;
              right: .5rem;
              bottom: .5rem;
              background-color: $b0;
              border-radius: 2px;
              @include font-style(14px);
              padding: .25rem .5rem;
            }
          }
          .card-info{
            padding: .5rem 0 0 0;
            .info{
              display: flex;
              flex-direction: column;
              .info-type{
                display: flex;
                justify-content: space-between;
                max-width: 100%;
                >span{
                  display: inline-block;
                  &:nth-of-type(1){
                    max-width: 68%;
                    @include font-style(12px, 16px, $color:$t6);
                    @include one-line-hidden;
                  }
                  &:nth-of-type(2){
                    padding: 0 (3rem/16);
                    @include font-style(10px, 16px, $color:$b0);
                    background-color: $t6;
                  }
                }
              }
              .info-title{
                height: 3rem;
                margin: .5rem 0;
                @include font-style(16px, 24px);
                @include more-line-hidden;
              }
              .info-price{
                margin: 0 0 .5rem 0;
                @include font-style(10px, $color:$t3);
                >i{
                  font-style: normal;
                  color: $t5;
                }
                .price-num{
                  @include font-style(16px, $color:$t5);
                }
                .price-hot{
                  @include font-style(10px, $color:$t5);
                  display: inline-block;
                  border: 1px solid $t5;
                  padding: 2px;
                  border-radius: 1px;
                }
              }
              .info-evaluate{
                display: flex;
                .evaluate-num{
                  @include font-style(10px, $color:$t3);
                }
              }
              /*  足迹部分  */
              .info-city{
                height: 3.25rem;
                margin-bottom: .5rem;
                @include font-style(16px, 26px);
                @include more-line-hidden;
              }
              .info-face{
                display: flex;
                >img{
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                }
                >i{
                  padding-left: 19px;
                  margin: 0 6px;
                  font-style: normal;
                  @include font-style(14px,24px, $color:$t3);
                }
              }
            }
          }
        }
      }
    }
  }
</style>
