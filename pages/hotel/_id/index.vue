<template>
  <div>
    <section class="container is-widescreen">
      <index-banner :banners="resData.banners"></index-banner>

      <div class="columns index">

        <div class="column is-12-touch hotel">
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

        <div class="column is-narrow-desktop is-hidden-touch hotel-date"> <!-- is-hidden-touch -->
          <div class="date">
            <div class="date-head">
              <p class="price"><span class="currency">{{currencySymbol}}</span><span class="lowest">{{resPriceRoomType.lowestPrice ? resPriceRoomType.lowestPrice : resData.lowestPrice}}</span>&nbsp;起</p>
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

            <div class="date-room-type">
              <div v-swiper:mySwiper="swiperOption">
                <div class="swiper-wrapper my-swiper">
                  <div class="swiper-slide" v-for="(item, idx) in resData.roomTypes" :key="item.id">
                    <figure class="image is-2by1" @click="toggleCalendar('banner', item)">
                      <img :src="item.banners[0]">
                      <div class="txt">
                        <div class="left">
                          <p>{{item.name}} <span>{{item.banners.length}}图</span></p>
                          <p class="price">{{currencySymbol}}{{resPriceRoomType.lowestPrice ? resPriceRoomType.lowestPrice : resData.lowestPrice}}起</p>
                        </div>

                        <div class="right">
                          <img src="~/assets/image/icon/global_icon_minus_small_nor.png" alt="" class="min" @click.stop="minRoomTypeNum">
                          <span class="right-num">{{roomTypeNum}}</span>
                          <img src="~/assets/image/icon/global_icon_add_small_nor.png" alt="" class="add" @click.stop="addRoomTypeNum">
                        </div>
                      </div>
                    </figure>

                    <div class="details" @click="toggleCalendar('info', item)">
                      <ul v-if="item.facilities.length > 0" class="items">
                        <li v-for="(elem, ids) in showFacilities(item.facilities)" :key="elem.id">
                          <img :src="elem.iconUrl" alt="">
                        </li>
                        <li v-if="item.facilities.length>4" class="more">更多</li>
                      </ul>
                      <p class="txt">
                        {{item.livingRoomNum}}间卧室，{{item.totalBedNum}}张床，{{item.toiletNum}}个卫生间
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="sub">
                <span>{{dayCountStr || '0晚'}}</span>
                <button type="button" @click="hotelSub">预订</button>
                <span>{{roomTypeNum}}间</span>
              </div>
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
            <h2>酒店介绍</h2>
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
            <ul class="main-items" v-if="resComments.merchantComments.length > 0">
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

    <!--  额外服务  -->
    <div :class="[showService ? 'is-active' : '', 'modal']" v-if="resData.chargeableServices.length > 0">
      <div class="modal-background" @click="toggleService"></div>
      <div class="modal-content">
        <div class="hotel-modal">
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
            <button type="button" class="sub-btn">提交</button>
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
      <div class="modal-background" @click="closeCalendar"></div>
      <div class="modal-content">
        <!--  日历  -->
        <div class="touch-calendar" v-show="modalTouchCalendar == 'index'">
          <div class="modal-head">
            <button type="button" class="back-btn" @click="closeCalendar"></button>
            <p class="head-title">{{arrivalDate}}-{{departureDate}}{{dayCountStr}}</p>
            <button type="button" class="" @click="clearDate">清除</button>
          </div>
          <div class="modal-main">
            <price-calendar
              :resCalendar="resCalendar"
              :currencySymbol="currencySymbol"
              @check-in-date="checkInDate"
              @toggle-foot-calendar="toggleFootCalendar"
              ref="touchCalendar"></price-calendar>
          </div>
          <div class="modal-foot">
            <div class="date-room-type" v-show="footCalendarStyle == 'touchToggle'">
              <div v-swiper:touchSwiper="swiperTouch">
                <div class="swiper-wrapper my-swiper">
                  <div class="swiper-slide" v-for="(item, idx) in resData.roomTypes" :key="item.id">
                    <figure class="image is-2by1" @click="toggleCalendar('banner', item)">
                      <img :src="item.banners[0]">
                      <div class="txt">
                        <div class="left">
                          <p>{{item.name}} <span>{{item.banners.length}}图</span></p>
                          <p class="price">{{currencySymbol}}{{resPriceRoomType.lowestPrice ? resPriceRoomType.lowestPrice : resData.lowestPrice}}起</p>
                        </div>

                        <div class="right">
                          <img src="~/assets/image/icon/global_icon_minus_small_nor.png" alt="" class="min" @click.stop="minRoomTypeNum">
                          <span class="right-num">{{roomTypeNum}}</span>
                          <img src="~/assets/image/icon/global_icon_add_small_nor.png" alt="" class="add" @click.stop="addRoomTypeNum">
                        </div>
                      </div>
                    </figure>

                    <div class="details" @click="toggleCalendar('info', item)">
                      <ul v-if="item.facilities.length > 0" class="items">
                        <li v-for="(elem, ids) in showFacilities(item.facilities)" :key="elem.id">
                          <img :src="elem.iconUrl" alt="">
                        </li>
                        <li v-if="item.facilities.length>4">更多</li>
                      </ul>
                      <p class="txt">
                        {{item.livingRoomNum}}间卧室，{{item.totalBedNum}}张床，{{item.toiletNum}}个卫生间
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="sub">
                <span>{{dayCountStr || '0晚'}}</span>
                <button type="button" @click="hotelSub">预订</button>
                <span>{{roomTypeNum}}间</span>
              </div>
            </div>

            <div class="date-room-btn" v-show="footCalendarStyle == 'touchDefined'">
              <div v-swiper:footSwiper="swiperFoot">
                <div class="swiper-wrapper foot-swiper">
                  <div class="swiper-slide" v-for="(item, idx) in resData.roomTypes" :key="item.id">
                    <div class="foot">
                      <img :src="item.banners[0]">
                      <p>{{item.name}} &times; {{roomTypeNum}}间</p>
                      <button type="button" @click="hotelSub">预订</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--  大图  -->
        <div v-show="modalTouchCalendar == 'banner'" class="room-banner-modal">
          <div class="modal-head">
            <button type="button" class="close-btn is-hidden-touch" @click="closeCalendar"></button>
            <button type="button" class="close-btn is-hidden-desktop" @click="toggleCalendar('index')"></button>
          </div>
          <div class="modal-main">
            <div v-swiper:roomSwiper="swiperRoom">
              <div class="swiper-wrapper room-swiper">
                <div class="swiper-slide" v-for="(item, idx) in selectRoomType.banners" :key="item.id">
                  <figure class="image">
                    <img :src="item">
                  </figure>

                </div>
              </div>
            </div>
            <p class="page">{{roomBannerPage}}</p>
          </div>
        </div>

        <!--  房间详情  -->
        <div v-show="modalTouchCalendar == 'info'" class="facility-modal">
          <div class="modal-head">
            <button type="button" class="close-btn is-hidden-touch" @click="closeCalendar"></button>
            <button type="button" class="close-btn is-hidden-desktop" @click="toggleCalendar('index')"></button>
          </div>
          <div class="modal-main">
            <h2>{{selectRoomType.name}}详情</h2>
            <p>{{selectRoomType.description}}</p>
            <h4>基本情况</h4>
            <ul class="main-items">
              <li v-if="selectRoomType.area">
                <div class="info">
                  <h6>面积：{{selectRoomType.area}}m&sup2;</h6>
                </div>
                <img src="~/assets/image/icon/hotel_details_layout_icon_acreage.png" alt="">
              </li>
              <li v-if="selectRoomType.livingRoomNum">
                <div class="info">
                  <h6>{{selectRoomType.livingRoomNum}}间卧室</h6>
                </div>
                <img src="~/assets/image/icon/bnb_details_layout_icon_bedroom.png" alt="">
              </li>
              <li v-if="selectRoomType.totalBedNum">
                <div class="info">
                  <h6>{{selectRoomType.totalBedNum}}张床</h6>
                </div>
                <img src="~/assets/image/icon/bnb_details_layout_icon_bed.png" alt="">
              </li>
              <li v-if="selectRoomType.toiletNum">
                <div class="info">
                  <h6>{{selectRoomType.toiletNum}}个卫生间</h6>
                </div>
                <img src="~/assets/image/icon/bnb_details_layout_icon_bathroom.png" alt="">
              </li>

            </ul>
            <h4>床位安排</h4>
            <ul class="main-items" v-if="selectRoomType.bedRooms.length > 0">
              <li v-for="(item, idx) in selectRoomType.bedRooms" :key="item.id">
                <div class="info">
                  <h6>{{item.bedRoomName}}</h6>
                  <div class="beds">
                    <p v-for="(bed, ids) in item.beds" :key="bed.id">{{bed.totalNum}}张{{bed.name}}</p>
                  </div>
                </div>
                <img :src="item.iconUrl" alt="">
              </li>
            </ul>
            <h4>房间设施</h4>
            <ul class="main-items" v-if="selectRoomType.facilities.length > 0">
              <li v-for="(item, idx) in selectRoomType.facilities" :key="item.id">
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

    <!--  移动端固定页脚 -->
    <div class="is-hidden-desktop touch-foot">
      <div class="foot-left">
        <p class="price"><span class="currency">{{currencySymbol}}</span><span class="lowest">{{resPriceRoomType.lowestPrice ? resPriceRoomType.lowestPrice : resData.lowestPrice}}</span>&nbsp;起</p>
        <div class="rate">
          <ul class="u-items-star">
            <li v-for="(rate, rdx) in rateItems(resData.rateAmount.totalAverageRate)" :key="rate.id" :class="rate"></li>
          </ul>
          <span class="text">{{resComments.commentCount}}条评价</span>
        </div>
      </div>
      <button type="button" @click="openCalendar">查看房型</button>
    </div>

  </div>
</template>

<script>
  import PriceCalendar from '~/components/house/PriceCalendar.vue'
  import IndexBanner from '~/components/house/IndexBanner.vue'
  import IndexDetail from '~/components/house/IndexDetail.vue'
  import { mapState } from 'vuex'
  import axios from 'axios'
  import hotel from '~/assets/js/api/hotel'
  import merchant from '~/assets/js/api/merchant'
  import { setRateItems } from '~/assets/js/utils'
  import config from '~/assets/js/config'

  export default {
    name: "hotel-id",
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
    data() {
      return {
        webAssetsUrl: undefined,
        dpAssetsUrl: undefined,
        aMapZoom: 15,
        swiperOption: {
          // autoplay: true,//可选选项，自动滑动
          // loop: true,
          slidesPerView: 'auto',
          slidesOffsetBefore: 12,
          slidesOffsetAfter: 12,
          // spaceBetween: 8,
          // centeredSlides: true,
          on: {
            slideChange: ()=> {
              this.roomTypeIndex = this.mySwiper.activeIndex;
              this.roomTypeId = this.resData.roomTypes[this.roomTypeIndex].id;
              this.updateCalendar(this.$route.params.id, this.roomTypeId);
            },
            tap() {
              // console.log('onTap', this);
            }
          }
        },
        swiperTouch: {
          slidesPerView: 'auto',
          slidesOffsetBefore: 12,
          slidesOffsetAfter: 12,
          on: {
            slideChange: ()=> {
              this.roomTypeIndex = this.touchSwiper.activeIndex;
              this.roomTypeId = this.resData.roomTypes[this.roomTypeIndex].id;
              this.updateCalendar(this.$route.params.id, this.roomTypeId);
            },
            tap() {
              // console.log('onTap', this);
            }
          }
        },
        swiperFoot: {
          slidesPerView: 'auto',
          slidesOffsetBefore: 12,
          slidesOffsetAfter: 12,
          on: {
            slideChange: ()=> {
              this.roomTypeIndex = this.footSwiper.activeIndex;
              this.roomTypeId = this.resData.roomTypes[this.roomTypeIndex].id;
              this.updateCalendar(this.$route.params.id, this.roomTypeId)
            },
            tap() {
              // console.log('onTap', this);
            }
          }
        },
        swiperRoom: {
          slidesPerView: 1,
          on: {
            slideChange: ()=> {
              this.roomBannerPage = `${this.roomSwiper.activeIndex + 1}/${this.selectRoomType.banners.length}`
            },
            tap() {
              // console.log('onTap', this);
            }
          }
        },

        //  预订价格
        resPriceList: [],
        resPriceRoomType:{
          roomTypeId: undefined,
          stock: 0,
          lowestPrice:undefined
        },
        roomTypeNum: 1, //  预订房型数量
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
        selectRoomType: {
          banners: [],
          facilities: [],
          bedRooms: [],
        }, //  选中的房型
        roomBannerPage: '',

        //  价格日历（触屏）
        showCalendar: false,
        modalTouchCalendar: 'index',
        footCalendarStyle: 'touchToggle',

        showProtocol: false, //  入住协议

        //  退订规则
        showRule: false,

        //  举报
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
        selfCursor:0
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
      return axios.all([hotel.get({pt: pt, currency: currency}, id),
        merchant.comments({pt: pt, cursor: 0, length: 10}, id)]).then(
        axios.spread( (data, comments)=>{
          if(data.data.code == 0 && comments.data.code == 0){
            return hotel.calendar({pt: pt, currency: currency}, data.data.result.id, data.data.result.roomTypes[0].id).then(
              calendar => {
                if(calendar.data.code == 0){
                  let _selfChargeableServices = data.data.result.chargeableServices;
                  if(_selfChargeableServices.length > 0){
                    for (let elem of _selfChargeableServices.values()) {
                      elem._selfNum = 0;
                    }
                  }
                  return {
                    //  响应酒店详情
                    resData:{
                      _selfChargeableServices : _selfChargeableServices,
                      _selfAllFacilities : [...data.data.result.basicFacilities, ...data.data.result.additionalFacilities, ...data.data.result.securityFacilities],
                      ...data.data.result
                    },
                    roomTypeIndex: 0,
                    roomTypeId:data.data.result.roomTypes[0].id,
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
                    //  价格日历
                    resCalendar:calendar.data.result,
                    //  地图详情
                    aMapCenter: data.data.result.location.point,
                    currency: currency,
                    currencySymbol: currencySymbol
                  }
                }else{
                  throw `日历：${calendar.data.msg}`
                }
              }
            );
          }else{
            throw `详情：${data.data.msg} / 评论：${comments.data.msg}`
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
      showFacilities(arr) {
        if(arr.length > 4){
          return arr.slice(0, 4)
        }else {
          return arr
        }
      },
      //  刷新价格日历
      async updateCalendar(merchantId, roomType){
        try {
          let { data } = await this.$api.hotel.calendar({pt: this.deviceType.type, currency: this.currency}, merchantId, roomType);
          if(data.code == 0){
            this.resCalendar = data.result;
          }else {
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      async checkInDate(arrivalDate, departureDate, dayCountStr){
        this.arrivalDate = arrivalDate;
        this.dayCountStr = dayCountStr;

        if(departureDate){
          this.departureDate = departureDate;
          try{
            let id = this.$route.params.id;
            let { data } = await this.$api.hotel.roomTypePriceList({pt: this.deviceType.type, currency: this.currency}, {
              id: id,
              arrivalDate: this.arrivalDate,
              departureDate: this.departureDate
            });
            if(data.code == 0){
              this.resPriceList = data.result;
              for(let [id, value] of this.resPriceList.entries()){
                if(value.roomTypeId == this.roomTypeId){
                  this.resPriceRoomType = this.resPriceList[id]
                }
              }
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
        this.resPriceRoomType = {
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
      hotelSub() {
        if(this.authUser.userId){
          if(this.dayCountStr){ //  是否选择了日期
            if(this.resPriceRoomType.stock){
              let [queryParams, serviceArr] = [{
                roomTypeId: this.roomTypeId, roomTypeIndex:this.roomTypeIndex, roomTypeNum:this.roomTypeNum,
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
          this.openLogin();
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
            formDara.set('reportTypeId', this.selectMerchantReport.creditValue);
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

      //  酒店房型
      minRoomTypeNum() {
        this.roomTypeNum > 1 && this.roomTypeNum--
      },
      addRoomTypeNum() {
        this.roomTypeNum++
      },

      /**
       *  日历（触屏）
       * */
      openCalendar() {
        this.showCalendar = true
      },
      closeCalendar() {
        this.showCalendar = false;
        if(this.modalTouchCalendar != 'index'){
          this.modalTouchCalendar = 'index'
        }
        if(this.modalTouchCalendar == 'banner'){
          // this.roomSwiper.activeIndex = 0
          // console.log(this.roomSwiper.activeIndex)
        }
      },
      toggleCalendar(type, item) {
        if(item){
          this.selectRoomType = item;
          this.roomBannerPage = `${this.roomSwiper.activeIndex + 1}/${this.selectRoomType.banners.length}`;
          !this.showCalendar && (this.showCalendar = true);
        }
        this.modalTouchCalendar = type;
      },
      toggleFootCalendar(state){  //  切换房型显示效果
        if(this.footCalendarStyle != state){
          this.footCalendarStyle = state
        }
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
        }else{
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
      },
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
    .room-banner-modal{
      .modal-main{
        .page{
          color: $t1;
        }
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
    .room-banner-modal{
      height: calc(100vh - 42px);
      .modal-main{
        height: 100%;
        background-color: $t1;
        .page{
          color: $b1;
        }
      }
    }
  }

  .index{
    margin: 0;
    padding: 0 .5rem;
  }

  .hotel{
    @extend .l-house-index
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

  .hotel-modal{
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

  .hotel-date{
    @extend .l-house-date
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
        }
      }
      .calendar{
        height: calc(100vh - 123px);
      }
    }
    .modal-foot{
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100vw;
      display: flex;
      border-top: 1px solid $b3;
      height: 81px;
      .date-room-type{
        position: absolute;
        bottom: 36px;
        .my-swiper{
          width: 100vw;
          .swiper-slide{
            width: 92%;
            margin: 0 4px;
            background-color: $b0;
            .image{
              position: relative;
              >img{
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
              }
              .txt{
                width: 100%;
                position: absolute;
                left: 0;
                bottom: 0;
                display: flex;
                justify-content: space-between;
                padding: 8px;
                .left{
                  >p{
                    @include font-style(16px, $color:$b0);
                    >span{
                      border-radius: 8px;
                      background-color: $b0;
                      padding: 0 6px;
                      @include font-style(10px, 16px, $color:$t2);
                    }
                  }
                  .price{
                    margin-top: 8px;
                    @include font-style(20px, $color:$b0)
                  }
                }
                .right{
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  >img{
                    position: relative;
                    width: 24px;
                    height: 24px;
                    cursor: pointer;
                  }
                  .right-num{
                    @include font-style(20px, $color:$b0);
                    padding: 0 12px;
                  }

                }
              }
            }
            .details{
              border: 1px solid $b2;
              border-top: none;
              border-bottom-left-radius: 8px;
              border-bottom-right-radius: 8px;
              cursor: pointer;
              padding: 12px 8px 36px 8px;
              .items{
                display: flex;
                position: relative;
                >li{
                  margin-right: 28px;
                  height: 30px;
                  text-align: center;
                  &.more{
                    margin-right: 0;
                    position: absolute;
                    right: 0;
                  }
                  >img{
                    width: 30px;
                    margin: 0 auto;
                  }
                  @include font-style(16px, 30px, $color:$t6);
                }
              }
              .txt{
                margin-top: 12px;
              }
            }
          }
        }
        .sub{
          width: 100%;
          position: absolute;
          bottom: 0;
          display: flex;
          justify-content: center;
          transform: translateY(50%);
          z-index: 9;
          align-items: center;
          >span{
            padding: 10px 24px;
            background-color: #F7EDED;;
            @include font-style(14px, $color:$t2);
            &:first-child{
              border-top-left-radius: 4px;
              border-bottom-left-radius: 4px;
            }
            &:last-child{
              border-top-right-radius: 4px;
              border-bottom-right-radius: 4px;
            }
          }
          >button{
            padding: 12px 36px;
            border-radius: 4px;
            background-color: $t4;
            @include font-style(16px)
          }
        }
      }

      .date-room-btn{
        position: absolute;
        top: -1px;
        .foot-swiper{
          width: 100vw;
          .swiper-slide{
            width: 92%;
            margin: 0 4px;
            .foot{
              display: flex;
              background-color: $b0;
              >img{
                width: 48px;
                height: 42px;
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
              }
              >p{
                flex: 1;
                padding-left: 8px;
                border-bottom: 1px solid $b3;
                @include font-style(14px, 41px, $color:$t2)
              }
              >button{
                padding: 12px 30px;
                background-color: $t4;
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
                @include font-style(16px)
              }
            }
          }
        }
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
            .beds{
              display: flex;
              >p{
                &:not(:last-child) {
                  margin-right: 8px;
                }
              }
            }
            >h6{
              @include font-style(16px)
            }
            p{
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
        >li{
          padding: 16px 0 24px 0;
          border-top: 1px solid $b1;
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

  .room-banner-modal{
    .modal-main{
      display: flex;
      align-items: center;
      .room-swiper{
        .image{

        }
      }
      .page{
        z-index: 1;
        position: absolute;
        bottom: 8px;
        width: 100%;
        text-align: center;
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
