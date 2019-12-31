<template>
  <div class="">
    <section class="container is-widescreen">
      <index-banner :banners="resData.banners"></index-banner>

      <div class="columns index">

        <div class="column is-12-touch home-stay">
          <index-detail :resData="resData" :resComments="resComments" :locationInfo="locationInfo"
                        @toggle-activity="toggleActivity"
                        @toggle-virtual-points="toggleVirtualPoints"
                        @toggle-facility="toggleFacility"
                        @toggle-introduction="toggleIntroduction"
                        @toggle-comments="toggleComments"
                        @toggle-map="toggleMap"
                        @toggle-protocol="toggleProtocol"
                        @toggle-rule="toggleRule"
                        @toggle-service="toggleService"
                        @toggle-report="toggleReport"></index-detail>

        </div>

        <div class="column is-narrow-desktop is-hidden-touch home-stay-date"> <!-- is-hidden-touch -->
          <div class="date">
            <div class="date-head">
              <p class="price"><span class="currency">{{currencySymbol}}</span><span class="lowest">{{resPriceList.lowestPrice ? resPriceList.lowestPrice : resData.lowestPrice}}</span>&nbsp;起</p>
              <div class="rate">
                <ul class="u-items-star">
                  <li v-for="(rate, rdx) in rateItems(resData.rateAmount.totalAverageRate)" :key="rate.id" :class="rate"></li>
                </ul>
                <span class="text">{{resComments.commentCount}}条评价</span>
              </div>
            </div>

            <div class="date-main">
              <div class="main-title">
                <p class="">{{arrivalDate}}</p>
                <p class="">{{departureDate}}</p>
              </div>
              <price-calendar
                :resCalendar="resCalendar"
                :currencySymbol="currencySymbol"
                @check-in-date="checkInDate"
                ref="desktopCalendar"></price-calendar>
              <div class="main-foot">
                <button type="button" class="clear" @click="clearDate">清除日期</button>
              </div>
            </div>

            <div class="date-sub">
              <button type="button" @click="homeStaySub">预订</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!--  活动  -->
    <div :class="[showActivity ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="toggleActivity"></div>
      <div class="modal-content" style="display: flex">
        <div class="activity-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="toggleActivity"></button>
          </div>
          <div class="modal-main">
            <iframe :src="webAssetsUrl+'/docSalesDir.html?merchantId='+resData.id" style="border: none; width: 100%; height: 100%"></iframe>
          </div>
        </div>
      </div>
    </div>

    <!--  返利  -->
    <div :class="[showVirtualPoints ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="toggleVirtualPoints"></div>
      <div class="modal-content" style="display: flex">
        <div class="activity-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="toggleVirtualPoints"></button>
          </div>
          <div class="modal-main">
            <iframe :src="dpAssetsUrl+'/DP-explain.html'" style="border: none; width: 100%; height: 100%"></iframe>
          </div>
        </div>
      </div>
    </div>

    <!--  阅读更多  -->
    <div :class="[showIntroduction ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="toggleIntroduction"></div>
      <div class="modal-content">
        <div class="introduction-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="toggleIntroduction"></button>
          </div>
          <div class="modal-main">
            <h2>民宿介绍</h2>
            <div class="translate" v-if="false">
              <p></p>
              <button></button>
            </div>
            <div class="info">
              <p>{{resData.introduction}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--  各类设施  -->
    <div :class="[showFacility ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="toggleFacility"></div>
      <div class="modal-content">
        <div class="facility-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="toggleFacility"></button>
          </div>
          <div class="modal-main">
            <h2>各类设施</h2>
            <p>旅客可使用的各种独立设施和公共设施</p>
            <h4>便利设施</h4>
            <ul class="main-items" v-if="resData.basicFacilities.length > 0">
              <li v-for="(item, idx) in resData.basicFacilities" :key="item.id">
                <div class="info">
                  <h6>{{item.facilityName}}</h6>
                  <p>{{item.facilityDesc}}</p>
                </div>
                <img :src="item.iconUrl" alt="">
              </li>
            </ul>
            <h4>附加设施</h4>
            <ul class="main-items" v-if="resData.additionalFacilities.length > 0">
              <li v-for="(item, idx) in resData.additionalFacilities" :key="item.id">
                <div class="info">
                  <h6>{{item.facilityName}}</h6>
                  <p>{{item.facilityDesc}}</p>
                </div>
                <img :src="item.iconUrl" alt="">
              </li>
            </ul>
            <h4>安全设施</h4>
            <ul class="main-items" v-if="resData.securityFacilities.length > 0">
              <li v-for="(item, idx) in resData.securityFacilities" :key="item.id">
                <div class="info">
                  <h6>{{item.facilityName}}</h6>
                  <p>{{item.facilityDesc}}</p>
                </div>
                <img :src="item.iconUrl" alt="">
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!--  评论列表  -->
    <div :class="[showListComments ? 'is-active' : '', 'modal']" v-if="resComments.commentCount">
      <div class="modal-background" @click="toggleComments"></div>
      <div class="modal-content">
        <div v-show="modalListComments == 'index'" class="list-comments-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="toggleComments"></button>
          </div>
          <div class="modal-main">
            <h2>{{resComments.commentCount}}条评论</h2>
            <ul class="u-items-star">
              <li v-for="(rate, rdx) in rateItems(resComments.merchantServiceRating.totalAverageRate)" :key="rate.id" :class="rate"></li>
            </ul>
            <ul class="main-rate">
              <li>
                <p>描述属实</p>
                <ul class="u-items-star">
                  <li v-for="(rate, rdx) in rateItems(resComments.merchantServiceRating.averageTruthRate)" :key="rate.id" :class="rate"></li>
                </ul>
              </li>
              <li>
                <p>服务态度</p>
                <ul class="u-items-star">
                  <li v-for="(rate, rdx) in rateItems(resComments.merchantServiceRating.averageMannerRate)" :key="rate.id" :class="rate"></li>
                </ul>
              </li>
              <li>
                <p>干净指数</p>
                <ul class="u-items-star">
                  <li v-for="(rate, rdx) in rateItems(resComments.merchantServiceRating.averageCleanlinessRate)" :key="rate.id" :class="rate"></li>
                </ul>
              </li>
              <li>
                <p>方位设施</p>
                <ul class="u-items-star">
                  <li v-for="(rate, rdx) in rateItems(resComments.merchantServiceRating.averageFacilityRate)" :key="rate.id" :class="rate"></li>
                </ul>
              </li>
              <li>
                <p>性价比</p>
                <ul class="u-items-star">
                  <li v-for="(rate, rdx) in rateItems(resComments.merchantServiceRating.averageCostPerformanceRate)" :key="rate.id" :class="rate"></li>
                </ul>
              </li>
            </ul>
            <ul class="main-items">
              <li v-for="(item, idx) in resComments.merchantComments" :key="item.id">
                <div class="msg-info">
                  <img :src="item.commentUser.faceUrl" alt="">
                  <div class="info-head">
                    <div class="head-left">
                      <h6>{{item.commentUser.userName}}</h6>
                      <p>{{item.createdAt}}</p>
                    </div>
                  </div>
                </div>
                <p class="msg-txt">{{item.content}}</p>
                <div class="msg-all">
                  <ul class="u-items-star">
                    <li v-for="(rate, rdx) in rateItems(item.rate)" :key="rate.id" :class="rate"></li>
                  </ul>
                  <button type="button" @click="toggleCommentReport(item.commentUser.id)">举报</button>
                </div>
              </li>
            </ul>
          </div>
          <div class="modal-foot" v-if="isMoreCommentList">
            <button type="button" @click="pushCommentList">加载更多</button>
          </div>
        </div>

        <div v-show="modalListComments == 'report'" class="report-modal">
          <div class="modal-head">
            <button type="button" class="back-btn" @click="setModalComment('index')"></button>
          </div>
          <div class="modal-main">
            <h2>举报此用户言论</h2>
            <ul class="main-items">
              <li v-for="(item, idx) in resCommentReportList" :key="item.id" @click="setModalComment('detail', item)">
                <p>{{item.name}}</p>
              </li>
            </ul>
          </div>
        </div>

        <div v-show="modalListComments == 'detail'" class="report-modal">
          <div class="modal-head">
            <button type="button" class="back-btn" @click="setModalComment('report')"></button>
          </div>
          <div class="modal-main">
            <h2>{{selectCommentReport.name}}</h2>
            <p class="text">{{selectCommentReport.desc}}</p>
            <div class="main-form">
              <textarea class="input-content" name="" cols="30" rows="10" maxlength="3000" placeholder="填写详细描述" v-model="reqCommentReport.reportDetail"></textarea>
              <ul class="input-images">
                <li v-for="(item, idx) in commentReportImages" :key="item.id">
                  <div class="img-item">
                    <img :src="item" alt="">
                    <button type="button" @click="delUploadImg(idx)"></button>
                  </div>
                </li>
                <li>
                  <div class="btn-item">
                    <input type="file" @change="setUploadImg">
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div class="modal-foot">
            <button type="button" @click="subCommentReport">举报</button>
          </div>
        </div>
      </div>
    </div>

    <!--  地图详情  -->
    <div :class="[showMap ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="toggleMap"></div>
      <div class="modal-content">
        <div class="map-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="toggleMap"></button>
          </div>
          <div class="modal-main">
            <no-ssr>
              <el-amap class="aMap-box" :zoom="aMapZoom" :center="aMapCenter">
                <el-amap-circle :center="aMapCenter" radius="500" strokeColor="#5CA0DC" strokeOpacity="0.8" strokeWeight="1" fillColor="#5CA0DC" fillOpacity="0.2"></el-amap-circle>
              </el-amap>
            </no-ssr>
          </div>
        </div>
      </div>
    </div>

    <!--  额外服务  -->
    <div :class="[showService ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="toggleService"></div>
      <div class="modal-content">
        <div class="home-stay-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="toggleService"></button>
          </div>
          <div class="modal-main">
            <h2>额外服务及费用</h2>
            <ul class="service-items">
              <li v-for="(item, idx) in resData._selfChargeableServices" :key="item.id">
                <p class="item-left">{{item.serviceName}}</p>
                <div class="item-right">
                  <p class="right-txt"><span>{{currencySymbol}}&nbsp;{{item.unitPrice}}</span>/{{item.unitName}}</p>
                  <div class="right-btn">
                    <img src="~/assets/image/icon/global_icon_minus_small_dis.png" alt="" class="min" @click="minServicesNum(item)">
                    <span class="btn-num">{{item._selfNum}}</span>
                    <img src="~/assets/image/icon/global_icon_add_small_nor.png" alt="" class="add" @click="addServicesNum(item)">
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="modal-foot">
            <button type="button" class="sub-btn" @click="toggleService">提交</button>
          </div>
        </div>
      </div>
    </div>

    <!--  入住协议  -->
    <div :class="[showProtocol ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="toggleProtocol"></div>
      <div class="modal-content">
        <div class="protocol-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="toggleProtocol"></button>
          </div>
          <div class="modal-main">
            <h2>入住协议</h2>
            <p>以下是入住该民宿需要遵守的几条规定，请您了解具体事项</p>
            <ul class="main-items">
              <li v-for="(item, idx) in resData.protocols" :key="item.id">
                {{item}}
              </li>
              <li v-if="resData.defects.length > 0">
                <p>旅客须了解的一些房源细节</p>
                <span v-for="(item, idx) in resData.defects" :key="item.id" class="red">{{item}}&nbsp;&nbsp;</span>
              </li>
              <li v-if="resData.buyNotice">
                <p>其他规定</p>
                <span>{{resData.buyNotice}}</span>
              </li>
            </ul>

          </div>
        </div>

      </div>
    </div>

    <!--  退订规则  -->
    <div :class="[showRule ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="toggleRule"></div>
      <div class="modal-content" style="display: flex">
        <div class="activity-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="toggleRule"></button>
          </div>
          <div class="modal-main">
            <iframe :src="webAssetsUrl+'/refundRule.html'" style="border: none; width: 100%; height: 100%"></iframe>
          </div>
        </div>
      </div>
    </div>

    <!--  举报（商户）  -->
    <div :class="[showMerchantReport ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="toggleReport"></div>
      <div class="modal-content">
        <div v-show="modalMerchantReport == 'index'" class="report-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="toggleReport"></button>
          </div>
          <div class="modal-main">
            <h2>举报此酒店/民宿</h2>
            <ul class="main-items">
              <li v-for="(item, idx) in resMerchantReportList" :key="item.id" @click="setModalReport('detail', item)">
                <p>{{item.name}}</p>
              </li>
            </ul>

          </div>
        </div>

        <div v-show="modalMerchantReport == 'detail'" class="report-modal">
          <div class="modal-head">
            <button type="button" class="back-btn" @click="setModalReport('index')"></button>
          </div>
          <div class="modal-main">
            <h2>{{selectMerchantReport.name}}</h2>
            <p class="text">{{selectMerchantReport.desc}}</p>
            <div class="main-form">
              <textarea class="input-content" name="" cols="30" rows="10" maxlength="3000" placeholder="填写详细描述" v-model="reqMerchantReport.reportDetail"></textarea>
              <ul class="input-images">
                <li v-for="(item, idx) in merchantReportImages" :key="item.id">
                  <div class="img-item">
                    <img :src="item" alt="">
                    <button type="button" @click="delUploadImg(idx)"></button>
                  </div>
                </li>
                <li>
                  <div class="btn-item">
                    <input type="file" @change="setUploadImg">
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div class="modal-foot">
            <button type="button" @click="subMerchantReport">举报</button>
          </div>
        </div>

      </div>
    </div>

    <!--  价格日历（触屏设备）-->
    <div :class="[showCalendar ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="toggleCalendar"></div>
      <div class="modal-content">
        <div class="touch-calendar">
          <div class="modal-head">
            <button type="button" class="back-btn" @click="toggleCalendar"></button>
            <button type="button" class="" @click="clearDate">清除</button>
          </div>
          <div class="modal-main">
            <div class="main-title">
              <p class="">{{arrivalDate}}</p>
              <p class="light">{{dayCountStr}}</p>
              <p class="">{{departureDate}}</p>
            </div>
            <price-calendar
              :resCalendar="resCalendar"
              :currencySymbol="currencySymbol"
              @check-in-date="checkInDate"
              ref="touchCalendar"></price-calendar>
          </div>
          <div class="modal-foot">
            <p class="price"><span class="currency">{{currencySymbol}}</span><span class="lowest">{{resPriceList.lowestPrice ? resPriceList.lowestPrice : resData.lowestPrice}}</span>&nbsp;起</p>
            <button type="button" @click="homeStaySub">预订</button>
          </div>
        </div>
      </div>
    </div>

    <!--  移动端固定页脚 -->
    <div class="is-hidden-desktop touch-foot">
      <div class="foot-left">
        <p class="price"><span class="currency">{{currencySymbol}}</span><span class="lowest">{{resPriceList.lowestPrice ? resPriceList.lowestPrice : resData.lowestPrice}}</span>&nbsp;起</p>
        <div class="rate">
          <ul class="u-items-star">
            <li v-for="(rate, rdx) in rateItems(resData.rateAmount.totalAverageRate)" :key="rate.id" :class="rate"></li>
          </ul>
          <span class="text">{{resComments.commentCount}}条评价</span>
        </div>
      </div>
      <button type="button" @click="toggleCalendar">查看全部报价</button>
    </div>
  </div>
</template>

<script>
  import PriceCalendar from '~/components/house/PriceCalendar.vue'
  import IndexBanner from '~/components/house/IndexBanner.vue'
  import IndexDetail from '~/components/house/IndexDetail.vue'
  import { mapState } from 'vuex'
  import axios from 'axios'
  import homestay from '~/assets/js/api/homestay'
  import merchant from '~/assets/js/api/merchant'
  import { setRateItems } from '~/assets/js/utils'
  import config from '~/assets/js/config'

  export default {
    name: "homestay-id",
    validate ({ params }) {
      // 必须是number类型
      return /^\d+$/.test(params.id)
    },
    components: {
      PriceCalendar,
      IndexBanner,
      IndexDetail
    },
    head(){
      return {
        title:this.resData.name
      }
    },
    data(){
      return{
        webAssetsUrl: undefined,
        dpAssetsUrl: undefined,
        aMapZoom: 15,
        //  预订价格
        resPriceList:{
          roomTypeId: undefined,
          stock: 0,
          lowestPrice:undefined
        },
        /**
         *  模态框
         * */
        showActivity: false,  //  活动
        showVirtualPoints: false,  //  返利
        showFacility: false,  //  各类设施
        showIntroduction: false,  //  介绍
        showMap: false, //  地图
        showService: false, //  额外服务

        /**
         * 价格日历
         * */
        arrivalDate : '入住日期',
        departureDate: '退房日期',
        dayCountStr: undefined, //  入住天数

        //  价格日历（触屏）
        showCalendar: false,

        showProtocol: false, //  入住协议

        //  退订规则
        showRule: false,

        //  举报（商户）
        showMerchantReport: false,
        modalMerchantReport: 'index',
        resMerchantReportList: [],
        selectMerchantReport: {},
        merchantReportImages: [],
        reqMerchantReport: {
          reportDetail: '',
          images: [],
        },

        /**
         *  评论列表
         * */
        showListComments: false,
        modalListComments: 'index',
        resCommentReportList: [],
        selectCommentReport: {},
        commentReportImages: [],
        reqCommentReport: {
          reportDetail: '',
          images: [],
        },
        commentReportTarget: undefined,
        selfCursor:0,
      }
    },
    // watchQuery: ['currency'],
    watch: {
      $route : {
        handler (val, oldVal) {
          window.location.reload()
        },
      }
    },
    asyncData (context) {
      let [id, pt, currency, currencySymbol] = [context.params.id, context.store.state.deviceType.type,
        context.query.currency ? context.store.state.currencyList[context.query.currency].currencyCode : 'CNY',
        context.query.currency ? context.store.state.currencyList[context.query.currency].currencySymbol : '¥'];
      return axios.all([homestay.get({pt: pt, currency: currency}, id),
        merchant.comments({pt: pt, cursor: 0, length: 10}, id),
        homestay.calendar({pt: pt, currency: currency}, id)]).then(
        axios.spread( (data, comments, calendar)=>{
          if(data.data.code == 0 && comments.data.code == 0 && calendar.data.code == 0){
            let _selfChargeableServices = data.data.result.chargeableServices;
            if(_selfChargeableServices.length > 0){
              for (let elem of _selfChargeableServices.values()) {
                elem._selfNum = 0;
              }
            }
            return {
              resData:{
                _selfChargeableServices : _selfChargeableServices,
                _selfAllFacilities : [...data.data.result.basicFacilities, ...data.data.result.additionalFacilities, ...data.data.result.securityFacilities],
                ...data.data.result
              },
              locationInfo: (data.data.result.location.houseNumber ? data.data.result.location.houseNumber+' ' : '') +
              (data.data.result.location.vallage ? data.data.result.location.vallage+' ' : '') +
              (data.data.result.location.street ? data.data.result.location.street+' ' : '') +
              (data.data.result.location.area ? data.data.result.location.area+' ' : '') +
              (data.data.result.location.city ? data.data.result.location.city+' ' : '') +
              (data.data.result.location.province ? data.data.result.location.province+' ' : '') +
              (data.data.result.location.country ? data.data.result.location.country+' ' : ''),
              //  评论列表
              resComments:comments.data.result,
              isMoreCommentList: (comments.data.result.merchantComments.length < 10) ? false: true,
              //  可预订日历
              resCalendar:calendar.data.result,
              //  地图详情
              aMapCenter: data.data.result.location.point,
              currency: currency,
              currencySymbol: currencySymbol
            }
          }else{
            throw  `详情：${data.data.msg} / 评论：${comments.data.msg} / 日历：${calendar.data.msg}`
          }
        })
      ).catch(
        e =>{
          context.error({ statusCode: 400, message: e })
        }
      )
    },
    async mounted(){
      this.webAssetsUrl = config.WEB_ASSETS_URL;
      this.dpAssetsUrl = config.DP_ASSETS_URL;

      if(this.authUser.userId){
        try{
          let [ { data: merchant }, { data: comment } ] = await Promise.all([
            this.$api.system.merchantServiceReportTypeList({pt: this.deviceType.type}, this.authUser),
            this.$api.system.userExpressionReportTypeList({pt: this.deviceType.type}, this.authUser) ]);
          if(merchant.code == 0 && comment.code == 0){
            this.resMerchantReportList = merchant.result;
            this.selectMerchantReport = this.resMerchantReportList[0];
            this.resCommentReportList = comment.result;
            this.selectCommentReport = this.resCommentReportList[0]
          }else{
            throw merchant.msg + '/' + comment.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      }
    },
    computed: {
      ...mapState({
        authUser: 'authUser',
        deviceType: 'deviceType'
      }),
    },
    methods: {
      //  评论星级
      rateItems(rate) {
        return setRateItems(rate)
      },
      toggleIntroduction(){
        this.showIntroduction = !this.showIntroduction
      },
      async checkInDate(arrivalDate, departureDate, dayCountStr){
        this.arrivalDate = arrivalDate;
        this.dayCountStr = dayCountStr;

        if(departureDate){
          this.departureDate = departureDate;
          try{
            let id = this.$route.params.id;
            let { data } = await this.$api.homestay.priceList({pt: this.deviceType.type, currency: this.currency}, {
              id: id,
              arrivalDate: this.arrivalDate,
              departureDate: this.departureDate
            });
            if(data.code == 0){
              this.resPriceList = data.result[0]
            }else{
              throw data.msg
            }
          }catch (e){
            this.$toast.error(e)
          }
        }else{
          this.departureDate = '退房日期';
        }
      },
      clearDate(){
        this.arrivalDate = '入住日期';
        this.departureDate = '退房日期';
        this.dayCountStr = undefined;
        this.resPriceList = {
          roomTypeId: undefined,
          stock: 0,
          lowestPrice:undefined
        };
        if(this.deviceType.type == 3){
          this.$refs.desktopCalendar.clearDayStyle();
        }else if(this.deviceType.type == 4 || this.deviceType.type == 5){
          this.$refs.touchCalendar.clearDayStyle();
        }
      },
      //  预订提交
      homeStaySub() {
        if(this.authUser.userId){
          if(this.dayCountStr){ //  是否选择了日期
            if(this.resPriceList.stock){
              /*            let orderDate = {
                            arrivalDate : this.arrivalDate,
                            departureDate: this.departureDate
                          };
                          localStorage.setItem('orderDate', JSON.stringify(orderDate));*/
              let [queryParams, serviceArr] = [{
                arrivalDate:this.arrivalDate,
                departureDate:this.departureDate,
                currency: this.$route.query.currency}, []];
              if(this.resData.chargeableServices.length > 0){
                for(let elem of this.resData._selfChargeableServices.values()){
                  serviceArr.push(`${elem.id}-${elem._selfNum}`)
                }
                queryParams.s = serviceArr.join()
              }
              this.$router.push({path:`${this.$route.path}/order`, query:queryParams})
            }else{
              this.$toast.error('库存不足')
            }
          }else{
            this.$toast.error('请选择预订时间')
          }
        }else{
          this.showCalendar && (this.showCalendar = false);
          this.openLogin()
        }
      },

      //  活动
      toggleActivity(){
        this.showActivity = !this.showActivity;
      },
      //  返利
      toggleVirtualPoints(){
        this.showVirtualPoints = !this.showVirtualPoints;
      },

      //  各类设施
      toggleFacility(){
        this.showFacility = !this.showFacility
      },

      //  地图详情
      toggleMap() {
        this.showMap = !this.showMap
      },

      /**
       *  评论
       * */
      toggleComments(){
        this.showListComments = !this.showListComments;
      },
      setModalComment(type, item){ //  切换显示
        this.modalListComments = type;
        item && (this.selectCommentReport = item)
      },
      async pushCommentList(){
        try {
          this.selfCursor ++;
          let { data } = await this.$api.merchant.comments({pt: this.deviceType.type,
            cursor: this.selfCursor*10, length: 10}, this.$route.params.id);
          if(data.code == 0){
            if(data.result.merchantComments.length > 0){
              this.resComments.merchantComments.push(...data.result.merchantComments)
            }
            if(data.result.merchantComments.length < 10){
              this.isMoreCommentList = false
            }
          }else {
            throw data.msg
          }

        }catch (e){
          this.$toast.error(e)
        }
      },
      toggleCommentReport(id){
        if(this.authUser.userId){
          this.modalListComments = 'report';
          this.commentReportTarget = id
        }else{
          this.toggleComments();
          this.openLogin()
        }
      },
      async subCommentReport(){
        if(this.reqCommentReport.reportDetail){
          try {
            let formDara = new FormData();
            for (let elem in this.reqCommentReport) {
              if(elem == 'images'){
                for(let item of this.reqCommentReport[elem].values()){
                  formDara.append(elem, item);
                }
              }else {
                formDara.set(elem, this.reqCommentReport[elem]);
              }
            }
            formDara.set('targetUserId', this.commentReportTarget);
            formDara.set('reportTypeId', this.selectCommentReport.creditValue);
            let { data } = await this.$api.user.userExpressionReport({pt: this.deviceType.type}, this.authUser, formDara);
            if(data.code == 0) {
              this.showListComments = false;
              this.modalListComments = 'index';
              this.reqCommentReport.reportDetail = '';
              this.reqCommentReport.images = [];
              this.$toast.success('提交成功')
            }else{
              throw data.msg
            }
          }catch (e){
            this.$toast.error(e)
          }
        }else{
          this.$toast.error('请填写内容')
        }
      },

      /**
       *  额外服务
       * */
      toggleService() {
        this.showService = !this.showService
      },

      minServicesNum(item) {
        item._selfNum > 0 && item._selfNum--
      },
      addServicesNum(item) {
        (item._selfNum < item.limit) && item._selfNum++
      },

      /**
       *  日历（触屏）
       * */
      toggleCalendar(){
        this.showCalendar = !this.showCalendar
      },

      //  入住协议
      toggleProtocol(){
        this.showProtocol = !this.showProtocol
      },
      //  退订规则
      toggleRule(){
        this.showRule = !this.showRule
      },

      /**
       *  举报
       * */
      toggleReport(){
        if(this.authUser.userId){
          this.showMerchantReport = !this.showMerchantReport
        }else{
          this.openLogin()
        }
        !this.showMerchantReport && (this.modalMerchantReport = 'index')
      },

      setModalReport(type, item){ //  切换显示
        this.modalMerchantReport = type;
        item && (this.selectMerchantReport = item)
      },
      async subMerchantReport(){  //  提交举报
        if(this.reqMerchantReport.reportDetail){
          try {
            let formDara = new FormData();
            for (let elem in this.reqMerchantReport) {
              if(elem == 'images'){
                for(let item of this.reqMerchantReport[elem].values()){
                  formDara.append(elem, item);
                }
              }else {
                formDara.set(elem, this.reqMerchantReport[elem]);
              }
            }
            formDara.set('merchantId', this.resData.id);
            formDara.set('reportTypeId', this.selectMerchantReport.creditValue);
            let { data } = await this.$api.merchant.merchantServiceReport({pt: this.deviceType.type}, this.authUser, formDara);
            if(data.code == 0) {
              this.showMerchantReport = false;
              this.modalMerchantReport = 'index';
              this.reqMerchantReport.reportDetail = '';
              this.reqMerchantReport.images = [];
              this.$toast.success('提交成功')
            }else{
              throw data.msg
            }
          }catch (e){
            this.$toast.error(e)
          }
        }else {
          this.$toast.error('请填写内容')
        }
      },

      setUploadImg(){ //  选择图片
        if(this.showMerchantReport){
          let file = event.target.files[0];
          this.reqMerchantReport.images.push(file);

          let reader = new FileReader();

          reader.onload = (event) => {
            this.merchantReportImages.push(event.target.result)
          };
          if(file){
            reader.readAsDataURL(file);
          }
        }else if(this.showListComments){
          let file = event.target.files[0];
          this.reqCommentReport.images.push(file);

          let reader = new FileReader();

          reader.onload = (event) => {
            this.commentReportImages.push(event.target.result)
          };
          if(file){
            reader.readAsDataURL(file);
          }
        }

      },
      delUploadImg(idx){
        if(this.showMerchantReport){
          this.reqMerchantReport.images.splice(idx,1);
          this.merchantReportImages.splice(idx,1)
        }else if(this.showListComments){
          this.reqCommentReport.images.splice(idx,1);
          this.commentReportImages.splice(idx,1)
        }
      },

      openLogin() {
        if(this.deviceType.type == 5){
          if(this.deviceType.env == 'iOS'){
            window.webkit.messageHandlers.appRouter.postMessage('SignInViewController');
          }else{
            android.appRouter('Login')
          }
        }else{
          this.$store.commit('TOGGLE_MODAL_LOGIN')
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';

  @media screen and #{$desktop-width}{
    .modal-content{
      max-height: 66%;
    }
    .map-modal{
      .modal-main{
        height: calc(66vh - 56px);
      }
    }
  }

  @media screen and #{$touch-width}{
    .map-modal{
      .modal-main{
        height: calc(100vh - 56px);
        .aMap-box{}
      }
    }
  }

  .index{
    margin: 0;
    padding: 0 .5rem;
  }

  .home-stay{
    @extend .l-house-index
  }

  .home-stay-modal{
    display: flex;
    flex-direction: column;
    .modal-main{
      padding: 16px;
      >h2{
        margin-bottom: 16px;
        @include font-style(24px)
      }
      .service-items{
        >li{
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 60px;
          &:not(:last-child){
            border-bottom: 1px solid $b3;
          }
          .item-left{
            @include font-style(18px)
          }
          .item-right{
            display: flex;
            align-items: center;
            .right-txt{
              @include font-style(16px);
              >span{
                color: $t5;
              }
            }
            .right-btn{
              display: flex;
              justify-content: space-between;
              align-items: center;
              >img{
                width: 24px;
                cursor: pointer;
                &.min{
                  margin-left: 12px;
                }
                &.add{}
              }
              .btn-num{
                margin: 0 12px;
                @include font-style(20px)
              }
            }
          }
        }
      }
    }
    .modal-foot{
      padding: 16px;
      .sub-btn{
        width: 100%;
        height: 48px;
        background-color: $t4;
        border-radius: 4px;
        @include font-style(16px, 48px);

      }
    }
  }

  .home-stay-date{
    @extend .l-house-date
  }

  .touch-foot{
    position: fixed;
    z-index: 9;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-top: 1px solid $b3;
    background-color: $b0;
    .foot-left{
      .price{
        @include font-style(12px, 24px, $color:$t3);
        .currency{
          @include font-style(14px, 24px, $color:$t5)
        }
        .lowest{
          @include font-style(24px, $color:$t5)
        }
      }
      .rate{
        display: flex;
        align-items: center;
        .text{
          @include font-style(10px, $color:$t3)
        }
      }
    }
    >button{
      padding: 1rem 40px;
      @include font-style(16px);
      background-color: $t4;
      border-radius: 4px;
    }
  }

  .touch-calendar{
    .modal-head{
      justify-content: space-between;
    }
    .modal-main{
      .main-title{
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
    .modal-foot{
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100vw;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-top: 1px solid $b3;
      background-color: $b0;
      .price{
        @include font-style(12px, 24px, $color:$t3);
        .currency{
          @include font-style(14px, 24px)
        }
        .lowest{
          @include font-style(24px)
        }
      }
      >button{
        padding: 1rem 40px;
        @include font-style(16px);
        background-color: $t4;
        border-radius: 4px;
      }
    }
  }

  .activity-modal{
    flex: 1;
    overflow-y: hidden;
    .modal-main{
      height: calc(100% - 42px);
    }
  }

  .protocol-modal{
    .modal-main{
      display: flex;
      flex-direction: column;
      padding: 16px;
      >h2{
        @include font-style(24px)
      }
      >p{
        padding: 8px 0 16px 0;
        @include font-style(14px, 22px, $color:$t2)
      }
      .main-items{
        >li{
          padding: 24px 0;
          @include font-style(16px);
          &:not(:last-child){
            border-bottom: 1px solid $b3;
          }
          >p{
            margin-bottom: 12px;
          }
          .red{
            color: $t5;
          }
        }
      }
    }
  }

  .facility-modal{
    .modal-main{
      display: flex;
      flex-direction: column;
      padding: 16px;
      >h2{
        @include font-style(24px)
      }
      >p{
        padding: 16px 0;
        @include font-style(14px, 22px, $color:$t2)
      }
      >h4{
        margin: 32px 0 16px 0;
        @include font-style(20px)
      }
      .main-items{
        >li{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 0;
          &:not(:last-child){
            border-bottom: 1px solid $b3;
          }
          .info{
            >h6{
              @include font-style(16px)
            }
            >p{
              margin-top: 8px;
              @include font-style(14px, $color:$t2)
            }
          }
          >img{
            width: 30px;
          }
        }
      }
    }
  }

  .list-comments-modal{
    .modal-main{
      display: flex;
      flex-direction: column;
      padding: 16px;
      >h2{
        margin-bottom: 8px;
        @include font-style(24px)
      }
      .main-rate{
        >li{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          >p{
            @include font-style(14px, 20px, $color:$t2)
          }
        }

      }
      .main-items{
        overflow-y: auto;
        >li{
          padding: 16px 0 24px 0;
          border-top: 1px solid $b3;
        }
        .msg-info{
          display: flex;
          >img{
            margin-right: 8px;
            @extend .l-user-info-face
          }
          .info-head{
            display: flex;
            flex: 1;
            justify-content: space-between;
            .head-left{
              padding: 5px 0;
              >h6{
                @include font-style(16px);
                margin-bottom: 8px;
              }
              >p{
                @include font-style(14px, $color:$t2);
              }
            }
          }
        }
        .msg-txt{
          margin-top: 16px;
          @include font-style(18px, 26px);
        }
        .msg-all{
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
          >button{
            @include font-style(16px, $color:$t6);
          }
        }
      }
    }

    .modal-foot{
      padding: 48px 0;
      text-align: center;
      >button{
        padding: 15px 32px;
        background-color: $t4;
        border-radius: 4px;
        @include font-style(18px)
      }
    }
  }

  .report-modal{
    .modal-main{
      display: flex;
      flex-direction: column;
      padding: 16px;
      >h2{
        margin-bottom: 16px;
        @include font-style(24px)
      }
      .text{
        @include font-style(14px, 22px, $color:$t2)
      }
      .main-items{
        >li{
          padding: 24px 0;
          >p{
            @include font-style(16px)
          }
          &:hover{
            cursor: pointer;
            background-color: $b1;
          }
          &:not(:last-child){
            border-bottom: 1px solid $b3;
          }
        }
      }
      .main-form{
        margin-top: 24px;
        display: flex;
        flex-direction: column;
        border-top: 1px solid $b3;
        .input-content{
          padding: 8px 0;
          border: none;
          @include font-style(16px, 22px, $color:$t3)
        }
        .input-images{
          display: flex;
          flex-wrap: wrap;
          padding: 8px 0;
          >li{
            margin: 8px 8px 8px 0;
            .img-item{
              position: relative;
              >img{
                width: 72px;
                height: 72px;
                border-radius: 4px;
              }
              >button{
                position: absolute;
                top: -9px;
                right: -9px;
                width: 18px;
                height: 18px;
                @include bg-image('~assets/image/icon/global_release_icon_close_nor.png', 18px, 18px);
                &:hover{
                  cursor: pointer;
                }
              }
            }
            .btn-item{
              height: 72px;
              width: 72px;
              border: 1px dotted $b3;
              @include bg-image('~assets/image/icon/global_release_icon_add_img.png', 72px, 72px, center, center);
              >input{
                width: 100%;
                height: 100%;
                opacity: 0;
                &:hover{
                  cursor: pointer;
                }
              }
            }
          }
        }
      }
    }
    .modal-foot{
      padding: 16px;
      >button{
        width: 100%;
        padding: 16px 0;
        background-color: $t4;
        border-radius: 4px;
        @include font-style(16px)
      }
    }
  }

  .introduction-modal{
    .modal-main{
      display: flex;
      flex-direction: column;
      padding: 16px;
      >h2{
        @include font-style(24px)
      }
      .translate{
        margin-top: 16px;
        display: flex;
        justify-content: space-between;
        >p{
          @include font-style(14px, 22px, $color:$t2);
        }
        .light{
          @include font-style(14px, 22px, $color:$t6);
        }
      }
      .info{
        margin-top: 24px;
        padding: 24px 0;
        border-top: 1px solid $b3;
        >p{
          margin-bottom: 24px;
          @include font-style(16px, 26px)
        }
      }
    }
  }
</style>
