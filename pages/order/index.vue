<template>
  <div>
    <section class="container is-widescreen order-index">
      <h1 class="index-title">我的订单</h1>
      <div v-if="resOrderList.length > 0">
        <ul class="columns is-desktop index-items">
          <li class="column is-12-touch is-6-desktop item" v-for="(item, idx) in resOrderList" :key="item.id">
            <div class="card is-shadowless" @click.stop="showDetails(item.id)">
              <header class="card-header is-shadowless">
                <div class="header-name" v-if="item.user">
                  <img :src="item.user.faceUrl">
                  <p>{{item.user.userName}}</p>
                </div>
                <div class="header-type">
                  <p v-if="item._selfStatus == 0" class="red">待付款</p>
                  <p v-else-if="item._selfStatus == 1" class="red">待付款（房东确认中）</p>
                  <p v-else-if="item._selfStatus == 2" class="red">待付款（房东已确认）</p>
                  <p v-else-if="item._selfStatus == 3">待付款（房东拒决）</p>
                  <p v-else-if="item._selfStatus == 4" class="red">已付款（房东确认中）</p>
                  <p v-else-if="item._selfStatus == 5" class="light">已付款（房东已确认）</p>
                  <p v-else-if="item._selfStatus == 6" class="red">已付款（房东拒决）</p>
                  <p v-else-if="item._selfStatus == 7" class="light">等待入住</p>
                  <p v-else-if="item._selfStatus == 8">已入住</p>
                  <p v-else-if="item._selfStatus == 9" class="red">争议处理中</p>
                  <p v-else-if="item._selfStatus == 10" class="red">待评价</p>
                  <p v-else-if="item._selfStatus == 11">已评价</p>
                  <p v-else-if="item._selfStatus == 12">已完成</p>
                  <p v-else-if="item._selfStatus == 13" class="light">已退款</p>
                  <p v-else-if="item._selfStatus == 14">已取消</p>
                  <p v-else-if="item._selfStatus == 15" class="red">退款中</p>
                </div>
              </header>
              <div class="card-content">
                <div class="content-info">
                  <img :src="item.merchant.banners[0]" >
                  <div class="info">
                    <h5 class="info-name">{{item.merchant.name}}</h5>
                    <div class="info-type">
                      <p>{{item.merchant.merchantSubTypeName}}-{{item.merchant.livingRoomNum}}房{{item.merchant.drawingRoomNum}}厅&nbsp;{{item.merchant.totalBedNum}}床{{item.merchant.toiletNum}}卫</p>
                      <p>{{item._selfCurrencySymbol}}{{item.merchant.lowestPrice}}</p>
                    </div>
                    <p class="info-date">{{item.orderDescription}}</p>
                  </div>
                </div>
                <p class="content-sum">支付金额({{item.currency ? item.currency : currencyCode}})：&nbsp;<span>{{item._selfCurrencySymbol}}{{item.actuallyPaidPrice}}</span></p>
              </div>
              <footer class="card-footer" v-if="item._selfStatus == 0 || item._selfStatus == 1 || item._selfStatus == 2">
                <button type="button" @click.stop="orderCancel(item.id)">取消订单</button>
                <button type="button" @click.stop="telMerchant(item.id)">联系房东</button>
                <button type="button" class="light" @click.stop="openPay(item)">立即支付</button>
              </footer>
              <footer class="card-footer" v-else-if="item._selfStatus == 3 || item._selfStatus == 6 || item._selfStatus == 14">
                <button type="button" @click.stop="orderDelete(item.id)">删除订单</button>
              </footer>
              <footer class="card-footer" v-else-if="item._selfStatus == 4 || item._selfStatus == 5">
                <button type="button" @click.stop="orderRefund(item.id)">申请退款</button>
                <button type="button" class="light" @click.stop="telMerchant(item.id)">联系房东</button>
              </footer>
              <footer class="card-footer" v-else-if="item._selfStatus == 7">
                <button type="button" @click.stop="orderRefund(item.id)">申请退款</button>
                <button type="button" @click.stop="telMerchant(item.id)">联系房东</button>
                <button type="button" class="light" @click.stop="getCheckInVoucher(item)">入住凭证</button>
              </footer>
              <footer class="card-footer" v-else-if="item._selfStatus == 8">
                <button type="button" class="light" @click.stop="telMerchant(item.id)">联系房东</button>
              </footer>
              <footer class="card-footer" v-else-if="item._selfStatus == 9">
                <button type="button" @click.stop="telMerchant(item.id)">联系房东</button>
                <button type="button" class="light" @click.stop="telService">联系客服</button>
              </footer>
              <footer class="card-footer" v-else-if="item._selfStatus == 10">
                <button type="button" @click.stop="toggleReport(item.merchant.id)">投诉建议</button>
                <button type="button" class="light" @click.stop="toggleComment(item)">立即评价</button>
              </footer>
              <footer class="card-footer" v-else-if="item._selfStatus == 11">
                <button type="button" @click.stop="toggleReport(item.merchant.id)">投诉建议</button>
                <button type="button" class="light" @click.stop="againComment(item)">追加评价</button>
              </footer>
              <footer class="card-footer" v-else-if="item._selfStatus == 12 || item._selfStatus == 13">
                <button type="button" @click.stop="orderDelete(item.id)">删除订单</button>
                <button type="button" @click.stop="toggleReport(item.merchant.id)">投诉建议</button>
              </footer>
              <footer class="card-footer" v-else-if="item._selfStatus == 15">
                <button type="button" @click.stop="toggleReport(item.merchant.id)">投诉建议</button>
              </footer>
            </div>

          </li>
        </ul>

        <!--  加载更多 -->
        <div class="index-foot-btn" v-if="isMoreOrderList">
          <button type="button" @click="pushOrderList">加载更多</button>
        </div>
      </div>

      <div class="index-def" v-else>
        <img src="~/assets/image/icon/global_no_data_icon_order.png" alt="">
        <p>暂时还没有订单</p>

      </div>

      <div class="index-login-bth" v-if="!authUser.userId">
        <button type="button" @click="openLogin">登录/注册</button>
      </div>

    </section>

    <!--  订单详情  -->
    <div :class="[showOrderDetails ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="closeDetails"></div>
      <div class="modal-content modal-order-details">
        <div class="order-details" v-show="modalDetails == 'index'">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="closeDetails"></button>
          </div>
          <div class="modal-main">
            <div class="main-title">
              <h2>订单详情</h2>
              <p v-if="resOrderDetails.orderBase._selfStatus == 0" class="red">待付款</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 1" class="red">待付款（房东确认中）</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 2" class="red">待付款（房东已确认）</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 3">待付款（房东拒决）</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 4" class="red">已付款（房东确认中）</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 5" class="light">已付款（房东已确认）</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 6" class="red">已付款（房东拒决）</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 7" class="light">等待入住</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 8">已入住</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 9" class="red">争议处理中</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 10" class="red">待评价</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 11">已评价</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 12">已完成</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 13" class="light">已退款</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 14">已取消</p>
              <p v-else-if="resOrderDetails.orderBase._selfStatus == 15" class="red">退款中</p>
            </div>

            <div class="content-info">
              <img :src="resOrderDetails.merchant.banners[0]">
              <div class="info">
                <h5 class="info-name">{{resOrderDetails.merchant.name}}</h5>
                <div class="info-type">
                  <p>{{resOrderDetails.merchant.merchantSubTypeName}}-{{resOrderDetails.merchant.livingRoomNum}}房{{resOrderDetails.merchant.drawingRoomNum}}厅&nbsp;{{resOrderDetails.merchant.totalBedNum}}床{{resOrderDetails.merchant.toiletNum}}卫</p>
                  <p>{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.merchant.lowestPrice}}</p>
                </div>
                <p class="info-date" v-if="resOrderDetails.orderBase">{{resOrderDetails.orderBase.orderDescription}}</p>
              </div>
            </div>

            <div class="head-logo">
              <div class="logo-left">
                <h6>{{resOrderDetails.merchant.merchantSubTypeName}}</h6>
                <p>房东：<span>{{resOrderDetails.merchantUser.userName}}</span></p>
              </div>
              <img v-if="resOrderDetails.merchantUser" :src="resOrderDetails.merchantUser.faceUrl">
            </div>

            <div class="main-map">
              <img src="~/assets/image/icon/order_details_icon_map.png" alt="">
              <p v-if="resOrderDetails.orderBase._selfStatus > 12 || resOrderDetails.orderBase._selfStatus < 4">
                {{resOrderDetails.merchant.location.street}} <b>(准确地址在付款后提供)</b>
              </p>
              <p v-else>{{locationInfo}}</p>
            </div>

            <ul class="main-items">
              <li class="flex-column" v-if="resOrderDetails.orderBase._selfStatus == 4">
                <div class="item-left item-flex-row">
                  <p>房东确认</p>
                  <!--<p class="normal">{{resOrderDetails.orderBase.payStatusDesc}}</p>-->
                  <p class="normal">待确认</p>
                </div>
                <div class="item-right">
                  <!--<span>{{resOrderDetails.orderBase.orderStatusDesc}}</span>-->
                  <span>若房东在30分钟内未确认，订单将自动取消，已付款金额将原路退回您的支付账户。</span>
                </div>
              </li>
              <li class="">
                <div class="item-left">
                  <p>入住时间</p>
                </div>
                <div class="item-right">
                  <p class="normal">{{resOrderDetails.orderBase.orderDescription}}</p>
                </div>
              </li>
              <li class="">
                <div class="item-left">
                  <p>入住人：{{resOrderDetails.orderBase.numberOfAdults + resOrderDetails.orderBase.numberOfChildren}}位&nbsp;{{(resOrderDetails.orderBase.numberOfBabies > 0) ? resOrderDetails.orderBase.numberOfBabies+'名婴幼儿' : ''}}&nbsp;{{resOrderDetails.orderBase.needTakePet ? '宠物' : ''}}</p>
                  <span v-for="(item, idx) in resOrderDetails.orderBase._selfCheckinCustomersList" :key="item.id">{{item.name}}</span>
                </div>
              </li>
              <!--              <li>
                              <div class="item-left">
                                <p>意外险</p>
                              </div>
                              <div class="item-right">
                                <p class="normal">已购买</p>
                              </div>
                            </li>-->
              <li>
                <div class="item-left">
                  <p>预定人信息</p>
                  <span>{{resOrderDetails.orderBase.bookedName}}{{resOrderDetails.orderBase.bookedTelephone}}</span>
                </div>
              </li>
              <li>
                <div class="item-left">
                  <p>入住协议</p>
                </div>
                <div class="item-right">
                  <p class="normal">已同意</p>
                </div>
              </li>
              <!--              <li>
                              <div class="item-left">
                                <p>预定人信息</p>
                                <span>发票抬头：秦艾德</span>
                              </div>
                              <div class="item-right">
                                <p class="light">下载发票(PDF)</p>
                              </div>
                            </li>-->
              <li>
                <div class="item-left">
                  <p>注意事项</p>
                  <span>已购买的折扣或活动商品，一律不支持退款</span>
                </div>

              </li>
              <li>
                <div class="item-left">
                  <p>订单号</p>
                </div>
                <div class="item-right">
                  <p class="normal">{{resOrderDetails.orderBase.orderNo}}</p>
                </div>
              </li>
              <li class="flex-column">
                <div class="item-left item-flex-row">
                  <p>支付方式</p>
                  <p class="normal">{{resOrderDetails.orderPaymentBase.paymentMethodStr}}</p>
                </div>
                <div class="item-left item-flex-row" style="margin-top: 72px;">
                  <h6>付款信息</h6>
                  <button type="button" @click="toggleDetails('pay')">明细</button>
                </div>
              </li>
              <li class="flex-column detail">
                <div class="item-left item-flex-row" v-for="(item, idx) in resOrderDetails.orderPrice.roomNum" :key="item.id">
                  <span>{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderPrice.avgPrice}} &times; {{resOrderDetails.orderPrice.dayCount}}晚</span>
                  <p class="normal">{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderPrice.roomAmount}}</p>
                </div>
              <li class="flex-column detail">
                <div class="item-left item-flex-row"><p class="normal">总金额</p><p>{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderBase.payablePrice}}</p></div>
                <!--  <div class="item-left item-flex-row" v-if="resOrderDetails.orderPaymentBase.paymentCouponAmount">
                    <span>优惠券</span>
                    <p class="normal">-{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderPaymentBase.paymentCouponAmount}}</p>
                  </div>-->
                <div class="item-left item-flex-row"><p>实付款</p>
                  <p class="money">
                  <span>{{resOrderDetails.currency}}</span>
                  {{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderBase.actuallyPaidPrice}}</p>
                </div>
              </li>
            </ul>

            <div class="main-btn">

            </div>
          </div>

          <div class="modal-foot">
            <div class="foot-card" v-if="resOrderDetails.orderBase._selfStatus == 0 || resOrderDetails.orderBase._selfStatus == 1 || resOrderDetails.orderBase._selfStatus == 2">
              <button type="button" @click.stop="orderCancel(resOrderDetails.orderBase.id)">取消订单</button>
              <button type="button" @click.stop="telMerchant(resOrderDetails.orderBase.id)">联系房东</button>
              <button type="button" class="light" @click.stop="openPay(resOrderDetails.orderBase)">立即支付</button>
            </div>
            <div class="foot-card" v-else-if="resOrderDetails.orderBase._selfStatus == 3 || resOrderDetails.orderBase._selfStatus == 6 || resOrderDetails.orderBase._selfStatus == 14">
              <button type="button" @click.stop="orderDelete(resOrderDetails.orderBase.id)">删除订单</button>
            </div>
            <div class="foot-card" v-else-if="resOrderDetails.orderBase._selfStatus == 4 || resOrderDetails.orderBase._selfStatus == 5">
              <button type="button" @click.stop="orderRefund(resOrderDetails.orderBase.id)">申请退款</button>
              <button type="button" class="light" @click.stop="telMerchant(resOrderDetails.orderBase.id)">联系房东</button>
            </div>
            <div class="foot-card" v-else-if="resOrderDetails.orderBase._selfStatus == 7">
              <button type="button" @click.stop="orderRefund(resOrderDetails.orderBase.id)">申请退款</button>
              <button type="button" @click.stop="telMerchant(resOrderDetails.orderBase.id)">联系房东</button>
              <button type="button" class="light" @click.stop="getCheckInVoucher(resOrderDetails.orderBase)">入住凭证</button>
            </div>
            <div class="foot-card" v-else-if="resOrderDetails.orderBase._selfStatus == 8">
              <button type="button" class="light" @click.stop="telMerchant(resOrderDetails.orderBase.id)">联系房东</button>
            </div>
            <div class="foot-card" v-else-if="resOrderDetails.orderBase._selfStatus == 9">
              <button type="button" @click.stop="telMerchant(resOrderDetails.orderBase.id)">联系房东</button>
              <button type="button" class="light" @click.stop="telService">联系客服</button>
            </div>
            <div class="foot-card" v-else-if="resOrderDetails.orderBase._selfStatus == 10">
              <button type="button" @click.stop="toggleReport(resOrderDetails.merchant.id)">投诉建议</button>
              <button type="button" class="light" @click.stop="toggleComment(resOrderDetails)">立即评价</button>
            </div>
            <div class="foot-card" v-else-if="resOrderDetails.orderBase._selfStatus == 11">
              <button type="button" @click.stop="toggleReport(resOrderDetails.merchant.id)">投诉建议</button>
              <button type="button" class="light" @click.stop="againComment(resOrderDetails)">追加评价</button>
            </div>
            <div class="foot-card" v-else-if="resOrderDetails.orderBase._selfStatus == 12 || resOrderDetails.orderBase._selfStatus == 13">
              <button type="button" @click.stop="orderDelete(resOrderDetails.orderBase.id)">删除订单</button>
              <button type="button" @click.stop="toggleReport(resOrderDetails.merchant.id)">投诉建议</button>
            </div>
            <div class="foot-card" v-else-if="resOrderDetails.orderBase._selfStatus == 15">
              <button type="button" @click.stop="toggleReport(resOrderDetails.merchant.id)">投诉建议</button>
            </div>
          </div>
        </div>

        <!--  付款明细  -->
        <div class="pay-details" v-show="modalDetails == 'pay'">
          <div class="modal-head">
            <button type="button" class="back-btn" @click="toggleDetails('index')"></button>
          </div>
          <div class="modal-main">
            <h2>付款明细</h2>
            <p class="pay-info">在该酒店/民宿住宿 {{resOrderDetails.orderPrice.dayCount}}晚</p>
            <ul class="pay-items">
              <li>
                <div class="item-main">
                  <p>{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderPrice.avgPrice}}	&times; {{resOrderDetails.orderPrice.dayCount}}晚</p>
                  <p class="money">{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderPrice.roomAmount}}</p>
                </div>
                <p class="item-info">平均每晚价格</p>
              </li>
              <li v-if="resOrderDetails.orderPaymentBase.weekMonthRentDiscount">
                <div class="item-main">
                  <p>周租折扣 (优惠{{parseInt(resOrderDetails.orderPaymentBase.weekMonthRentDiscount*100)}}%)</p>
                  <p class="money">{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderPaymentBase.weekMonthRentDiscountAmount}}</p>
                </div>
                <p class="item-info">入住7天及以上可享受周租折扣</p>
              </li>
              <li v-if="resOrderDetails.orderBase.depositFee">
                <div class="item-main">
                  <p>押金</p>
                  <p class="money">{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderBase.depositFee}}</p>
                </div>
                <!--<p class="item-info">芝麻信用650以上的，免押金</p>-->
              </li>
              <li v-if="resOrderDetails.orderBase.cleaningFee">
                <div class="item-main">
                  <p>清洁费</p>
                  <p class="money">{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderBase.cleaningFee}}</p>
                </div>
                <p class="item-info">房东收取的一次性清洁费，用于清洁房源</p>
              </li>
              <li v-if="resOrderDetails.orderBase.accidentInsuranceFee">
                <div class="item-main">
                  <p>意外险</p>
                  <p class="money">{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderBase.accidentInsuranceFee}}</p>
                </div>
                <!--<p class="item-info">{{currencySymbol}}20 x 2人</p>-->
              </li>
              <li v-if="resOrderDetails.orderBase.totalChargeableServiceFee">
                <div class="item-main">
                  <p>额外服务费用</p>
                  <p class="money">{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderBase.totalChargeableServiceFee}}</p>
                </div>
                <p class="item-info">额外服务为附加的收费服务，由用户自行选择需要的服务。</p>
                <ul>
                  <li class="item" v-for="(item, idx) in resOrderDetails.serviceList" :key="item.id">
                    <p>{{item.serviceName}}({{resOrderDetails.orderBase._selfCurrencySymbol}}{{item.unitPrice}}/{{item.unitName}}	&times; {{item.purchasingQuantity}})</p>
                    <p class="money">{{resOrderDetails.orderBase._selfCurrencySymbol}}{{(item.unitPrice*item.purchasingQuantity).toFixed(2)}}</p>
                  </li>
                </ul>
              </li>
              <li v-if="resOrderDetails.orderBase.consummationTax">
                <div class="item-main">
                  <p>GST (增值税)</p>
                  <p class="money">{{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderBase.consummationTax}}</p>
                </div>
                <p class="item-info">{{resOrderDetails.merchant.location.country}}GST (增值税)税率：{{parseInt(resOrderDetails.orderBase.consummationTaxRate*100)}}%</p>
              </li>
              <li>
                <p>合计</p>
                <p class="money">
                  <span>{{resOrderDetails.currency}}</span>
                  {{resOrderDetails.orderBase._selfCurrencySymbol}}{{resOrderDetails.orderBase.actuallyPaidPrice}}</p>
              </li>
            </ul>

            <div class="pay-foot">
            </div>
          </div>

        </div>
      </div>
    </div>

    <!--  检查并支付  -->
    <div :class="[showPay ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="closePay"></div>
      <div class="modal-content">
        <div class="pay-util-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="closePay"></button>
          </div>
          <div class="modal-main">
            <h2>检查并支付</h2>
            <p class="main-info">在该酒店/民宿住宿 {{payOrderItem.dayCount}}晚</p>
            <ul class="main-items">
              <li class="item-box">
                <p class="nor">剩余支付时间</p>
                <p class="red">{{_selfFormatDuring(selfPayExpiredSeconds)}}</p> <!--  || payOrderItem.payStatusDesc -->
              </li>
              <!--<li class="item-box" v-if="paypalResult.currency">-->
                <!--<p>订单金额({{paypalResult.currency}})</p>-->
                <!--<p>{{realCurrencySymbol}}{{paypalResult.amount}}</p>-->
              <!--</li>-->
              <li class="item-box">
                <p>订单金额({{paymentUtils[paymentUtils.length - 1].realCurrency}})</p>
                <p>{{realCurrencySymbol}}{{paymentUtils[paymentUtils.length - 1].amountForRealCurrency}}</p>
              </li>
              <li class="item-pay" v-if="paymentDP.payablePoints > 0" >  <!--   -->
                <label for="DP" class="item-box">
                  <div class="DP">
                    <img src="~/assets/image/icon/global_pay_icon_dp.png" alt="">
                    <div class="info">
                      <p>我的DP</p>
                      <p>剩余 {{paymentDP.points}}    抵扣 {{paymentDP.payablePoints}}</p>
                    </div>
                  </div>
                  <div class="u-checkbox-t6">
                    <input class="checkbox-toggle" type="checkbox" id="DP" value="" v-model="isActiveDP"> <!--    -->
                    <label for="DP" class=""></label>
                  </div>
                </label>
              </li>
              <li v-if="paymentDP.payablePoints > 0" class="item-box">
                <p>还需支付({{paymentUtils[paymentUtils.length - 1].realCurrency}})</p>
                <p>{{realCurrencySymbol}}{{actuallyPayPrice}}</p>
              </li>
              <li class="item-pay" v-for="(item, idx) in paymentUtils" :key="item.id" v-if="item.id == 96 || item.id == 97 || item.id == 93">
                <label :for="item.code" class="item-box">
                  <div class="pay">
                    <img src="~/assets/image/icon/global_pay_icon_alipay.png" alt="" v-if="item.id == 96">
                    <img src="~/assets/image/icon/global_pay_icon_wechat.png" alt="" v-else-if="item.id == 97">
                    <img src="~/assets/image/icon/global_pay_icon_PayPal@3x.png" alt="" v-else-if="item.id == 93">
                    <p>{{item.name}}</p>
                  </div>
                  <div class="u-checkbox-round">
                    <input class="checkbox-toggle" type="radio" :value="item.id" v-model="payUtilId" :id="item.code">
                    <label :for="item.code" class=""></label>
                  </div>
                </label>
              </li>

              <li v-if="payUtilId == 93">
                <no-ssr>
                  <v-braintree
                    :authorization="authorization"
                    :paypal="paypalResult"
                    locale="zh_CN"
                    btnText="立即支付"
                    btnClass="button is-warning"
                    @load="onLoad"
                    @loadFail="onLoadFail"
                    @success="onSuccess"
                    @error="onError"
                  ></v-braintree>
                </no-ssr>
              </li>
            </ul>

            <div>
              <canvas ref="weChatPayCode"></canvas>
            </div>
          </div>
          <div class="modal-foot">
            <button type="button" class="sub-btn" @click="subPay" v-if="payUtilId && (payUtilId != 93)">立即支付</button>
          </div>
        </div>
      </div>
    </div>

    <!--  入住凭证  -->
    <div :class="[showVoucher ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="toggleVoucher"></div>
      <div class="modal-content">

        <div class="voucher-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="toggleVoucher"></button>
          </div>
          <div class="modal-main">
            <h2>入住凭证</h2>
            <div class="main-code">
              <p>扫描二维码验证入住</p>
              <canvas ref="voucherCode"></canvas>
              <h4>{{resVoucher.checkinVoucherNo}}</h4>
            </div>
          </div>
        </div>

      </div>


    </div>

    <!--  立即评价  -->
    <div :class="[showComment ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="toggleComment"></div>
      <div class="modal-content">
        <div class="comment-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="toggleComment"></button>
          </div>
          <div class="modal-main">
            <h2>入住评价</h2>
            <div class="card-content">
              <div class="content-info">
                <img :src="commentOrderItem.merchant.banners[0]" >
                <div class="info">
                  <h5 class="info-name">{{commentOrderItem.merchant.name}}</h5>
                  <div class="info-type">
                    <p>{{commentOrderItem.merchant.merchantSubTypeName}}-{{commentOrderItem.merchant.livingRoomNum}}房{{commentOrderItem.merchant.drawingRoomNum}}厅&nbsp;{{commentOrderItem.merchant.totalBedNum}}床{{commentOrderItem.merchant.toiletNum}}卫</p>
                  </div>
                  <p class="info-date" v-if="deviceType.type == 5 && commentOrderItem.orderBase">{{commentOrderItem.orderBase.orderDescription}}</p>
                  <p class="info-date" v-else>{{commentOrderItem.orderDescription}}</p>
                </div>
              </div>
            </div>
            <ul class="main-star set-star">
              <li>
                <p>描述属实</p>
                <ul class="star-items">
                  <li v-for="(rate, rdx) in selfCommentRate.truthRate" :key="rate.id"
                      :class="rate" @click.self="setCommentRateItem('truthRate', rdx)">
                  </li>
                </ul>
              </li>
              <li>
                <p>服务态度</p>
                <ul class="star-items">
                  <li v-for="(rate, rdx) in selfCommentRate.mannerRate" :key="rate.id"
                      :class="rate" @click.self="setCommentRateItem('mannerRate', rdx)">
                  </li>
                </ul>
              </li>
              <li>
                <p>干净指数</p>
                <ul class="star-items">
                  <li v-for="(rate, rdx) in selfCommentRate.cleanlinessRate" :key="rate.id"
                      :class="rate" @click.self="setCommentRateItem('cleanlinessRate', rdx)">
                  </li>
                </ul>
              </li>
              <li>
                <p>方位设施</p>
                <ul class="star-items">
                  <li v-for="(rate, rdx) in selfCommentRate.facilityRate" :key="rate.id"
                      :class="rate" @click.self="setCommentRateItem('facilityRate', rdx)">
                  </li>
                </ul>
              </li>
              <li>
                <p>性价比</p>
                <ul class="star-items">
                  <li v-for="(rate, rdx) in selfCommentRate.costPerformanceRate" :key="rate.id"
                      :class="rate" @click.self="setCommentRateItem('costPerformanceRate', rdx)">
                  </li>
                </ul>
              </li>
            </ul>
            <textarea class="main-input" name="" cols="30" rows="10" maxlength="3000" placeholder="这次住宿还满意吗？说说您心中的想法。。。" v-model="reqMerchantComment.content"></textarea>
          </div>
          <div class="modal-foot">
            <button type="button" @click="subOrderComment">提交</button>
          </div>
        </div>
      </div>
    </div>

    <!--  追加评价  -->
    <div :class="[showAgain ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="againComment"></div>
      <div class="modal-content">
        <div class="comment-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="againComment"></button>
          </div>
          <div class="modal-main">
            <h2>入住评价</h2>
            <div class="card-content">
              <div class="content-info">
                <img :src="commentAgainItem.merchant.banners[0]" >
                <div class="info">
                  <h5 class="info-name">{{commentAgainItem.merchant.name}}</h5>
                  <div class="info-type">
                    <p>{{commentAgainItem.merchant.merchantSubTypeName}}-{{commentAgainItem.merchant.livingRoomNum}}房{{commentAgainItem.merchant.drawingRoomNum}}厅&nbsp;{{commentAgainItem.merchant.totalBedNum}}床{{commentAgainItem.merchant.toiletNum}}卫</p>
                  </div>
                  <p class="info-date" v-if="deviceType.type == 5 && commentAgainItem.orderBase">{{commentAgainItem.orderBase.orderDescription}}</p>
                  <p class="info-date" v-else>{{commentAgainItem.orderDescription}}</p>
                </div>
              </div>
            </div>
            <ul class="main-star">
              <li>
                <p>描述属实</p>
                <ul class="star-items">
                  <li v-for="(rate, rdx) in selfAgainRate.truthRate" :key="rate.id" :class="rate">
                  </li>
                </ul>
              </li>
              <li>
                <p>服务态度</p>
                <ul class="star-items">
                  <li v-for="(rate, rdx) in selfAgainRate.mannerRate" :key="rate.id" :class="rate">
                  </li>
                </ul>
              </li>
              <li>
                <p>干净指数</p>
                <ul class="star-items">
                  <li v-for="(rate, rdx) in selfAgainRate.cleanlinessRate" :key="rate.id" :class="rate">
                  </li>
                </ul>
              </li>
              <li>
                <p>方位设施</p>
                <ul class="star-items">
                  <li v-for="(rate, rdx) in selfAgainRate.facilityRate" :key="rate.id" :class="rate">
                  </li>
                </ul>
              </li>
              <li>
                <p>性价比</p>
                <ul class="star-items">
                  <li v-for="(rate, rdx) in selfAgainRate.costPerformanceRate" :key="rate.id" :class="rate">
                  </li>
                </ul>
              </li>
            </ul>
            <textarea class="main-input" name="" cols="30" rows="10" maxlength="3000"
                      placeholder="这次住宿还满意吗？说说您心中的想法。。。" v-model="reqCommentAgain.content"></textarea>
          </div>
          <div class="modal-foot">
            <button type="button" @click="subAgainComment">提交</button>
          </div>
        </div>
      </div>
    </div>

    <!--  投诉建议  -->
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

    <form method="post" :action="payFormAction" ref="payForm"  target="_blank" style="display: none">  <!--     -->
      <input type="text" v-for="(item, idx) in aliPayParams" :key="item.id" :name="item.key" :value="item.value">
    </form>

  </div>

</template>

<script>
  import { mapState } from 'vuex'
  import QRCode from 'qrcode';
  import config from '~/assets/js/config'
  import { setOrderStatus, formatDuring } from '~/assets/js/utils'
  import dayjs from 'dayjs'
  import order from '~/assets/js/api/order'

  export default {
    name: "order",
    components: {
    },
    head(){
      return {
        title: '订单'
      }
    },
    data(){
      return{
        instance: null,
        authorization: '',
        paypalResult: {
          // flow: 'checkout',
          // amount: '0',
          // currency: 'USD'
        },
        isMoreOrderList: true,
        selfCursor: 1,  //  请求列表下标
        resOrderList: [],  //  订单列表
        currencyCode: '',
        currencySymbol: '',

        locationInfo: undefined,  //  房源地址

        /**
         *  订单详情
         * */
        showOrderDetails:false, //模态框
        modalDetails:'index',
        resOrderDetails: {  //  订单
          orderBase: {
          },
          merchant: {
            banners: [''],
            location: {},
            currency: ''
          },
          merchantUser: {
          },
          orderPaymentBase: {},
          orderPrice: {},
          serviceList: []
        },

        /**
         *  检查并支付
         * */
        payOrderItem: {}, //  支付
        showPay:false,  //  模态框
        payUtilId: undefined, //  支付工具
        aliPayParams: [],  //  请求支付宝所需参数

        wechatPayCodeInterval: undefined, //  查询PC微信二维码订单状态
        payFormAction: '',  //  支付宝支付跳转 url

        payExpiredInterval: undefined,    //  订单超时定时器
        paymentUtils: [
          {
            realCurrency: '',
            amountForRealCurrency: 0
          }
        ],  //  普通订单，支付前使用本接口，获取当前系统可用支付手段,
        paymentDP: {},  //  普通订单，支付前使用本接口，获取当前系统可用支付手段,
        isActiveDP: false,
        realCurrencySymbol: '¥',
        selfPayExpiredSeconds: 0,
        /**
         *  入住凭证
         * */
        showVoucher: false,
        resVoucher: {},
        voucherCodeInterval: undefined,

        /**
         *  立即评价
         * */
        showComment: false,
        commentOrderItem: {
          merchant: {
            banners: []
          }
        },
        reqMerchantComment: {
          content: ''
        },
        selfCommentRate: {
          truthRate: ['', '', '', '', ''],
          mannerRate: ['', '', '', '', ''],
          cleanlinessRate: ['', '', '', '', ''],
          facilityRate: ['', '', '', '', ''],
          costPerformanceRate: ['', '', '', '', ''],
        },

        /**
         *  追加评价
         * */
        showAgain: false,
        commentAgainItem: {
          merchant: {
            banners: []
          }
        },
        reqCommentAgain: {
          content: ''
        },
        selfAgainRate: {
          truthRate: ['', '', '', '', ''],
          mannerRate: ['', '', '', '', ''],
          cleanlinessRate: ['', '', '', '', ''],
          facilityRate: ['', '', '', '', ''],
          costPerformanceRate: ['', '', '', '', ''],
        },
        /**
         *  投诉建议
         * */
        showMerchantReport: false,
        modalMerchantReport: 'index',
        resMerchantReportList: [],
        selectMerchantId: undefined,
        selectMerchantReport: {},
        merchantReportImages: [],
        reqMerchantReport: {
          reportDetail: '',
          images: [],
        },
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
    async asyncData (context) {
      let authUser = context.store.state.authUser;
      if(authUser.userId){
        let [ pt, currencyCode, currencySymbol, currencyList ] = [context.store.state.deviceType.type,
          context.query.currency ? context.store.state.currencyList[context.query.currency].currencyCode : 'CNY',
          context.query.currency ? context.store.state.currencyList[context.query.currency].currencySymbol : '¥' ,
          context.store.state.currencyList];
        try {
          let { data } = await order.list({pt: pt, cursor: 0, length: 10, currency: currencyCode}, authUser);
          if(data.code == 0){
            let _selfList = data.result;
            if(_selfList.length > 0){
              for(let item of _selfList.values()){
                item['_selfStatus'] = setOrderStatus(item);
                currencyList.find( (i) => {
                  if(i.currencyCode == item.currency){
                    item['_selfCurrencySymbol'] = i.currencySymbol;
                  }
                } )
              }
            }
            return {
              resOrderList: _selfList,
              isMoreOrderList: _selfList.length < 10 ? false : true,
              currencyCode: currencyCode,
              currencySymbol: currencySymbol,
            };

          /*  this.resOrderList = data.result;
            if(this.resOrderList.length > 0){
              for(let item of this.resOrderList.values()){
                item['_selfStatus'] = setOrderStatus(item)
              }
            }
            if(this.resOrderList.length < 10){
              this.isMoreOrderList = false
            }*/
          }else{
            throw data.msg
          }
        }catch (e){
          context.error({ statusCode: 400, message: e })
        }
      }else{
        return {
          resOrderList: [],
          isMoreOrderList: true,
        }
      }

    },
    beforeMount() {
      // this.authUser.userId && this.getOrderList()
    },
    async mounted(){
      this.payFormAction = config.ALI_PAY_URL;
      if(this.authUser.userId){
        try{
          let { data } = await this.$api.system.merchantServiceReportTypeList({pt: this.deviceType.type}, this.authUser);
          if(data.code == 0){
            this.resMerchantReportList = data.result;
            this.selectMerchantReport = this.resMerchantReportList[0];
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }

        this.formatCommentRate();

        //将要给原生调用的方法挂载到 window 上面
        window.appOrderDetail = this.appOrderDetail;
      }
    },
    watch: {

    },
    computed: {
      ...mapState({
        authUser: 'authUser',
        deviceType: 'deviceType',
        currencyList: 'currencyList'
      }),
      actuallyPayPrice(){
        let amount = this.paymentUtils[this.paymentUtils.length - 1].amountForRealCurrency;
        return this.isActiveDP ? ( (amount < this.paymentDP.payablePoints) ? 0 : (amount - this.paymentDP.payablePoints) ) : amount
      }
    },
    methods:{
      _selfFormatDuring(s){
        let _selfDate = parseInt(s * 1000);
        return formatDuring(_selfDate)
      },
      onLoad (instance) {
        this.instance = instance;
      },
      onLoadFail (instance) {
        // alert('load fail');
        this.closePay();
        this.$toast.error('超时，请重试')
      },
      async onSuccess (payload) {
        if(this.payUtilId){
          this.$nuxt.$loading.start();
          let { data } = await this.$api.order.createPaymentUtilParameters({pt: this.deviceType.type,
            currency:this.currencyCode}, this.authUser, {
            orderId: this.payOrderItem.id,
            utilId: this.payUtilId,
            paypalNonce: payload.nonce,
            // returnUrl: window.location.host + '/order',
            virtualPoints: 0
          });
          this.$nuxt.$loading.finish();
          if(data.code == 0){
            this.wechatPayCodeInterval = setInterval( ()=>{
              return this.getOrderStatus()
            }, 3000);
          }else{
            this.$toast.error(data.msg)
          }
        }else{
          this.$toast.error('请选择支付方式')
        }
        // console.log("Success!", payload.nonce);
      },
      onError (error) {
        // console.log("Error!", error);
        this.$toast.error(error.message)
      },
      //  app打开订单详情
      appOrderDetail(orderId){
        try{
          this.showDetails(orderId)
        }catch (e){
          if(this.deviceType.env == 'iOS'){
            window.webkit.messageHandlers.LOG.postMessage(e);
          }else{
            android.emitMsg(e)
          }
        }

      },
      formatCommentRate(){  //  初始化评论星级
        for(let value in this.selfCommentRate){
          this.selfCommentRate[value].fill('u-big-star-nor', 0, 5);
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

      async telMerchant(orderId){ //  联系房东
        try{
          let { data } = await this.$api.order.contactWithOwner({pt: this.deviceType.type}, this.authUser, orderId);
          if(data.code == 0){
            if(this.deviceType.type == 3){
              alert(`房东电话：${data.result.virtualMobile}`)
            }else if(this.deviceType.type == 4 || this.deviceType.type == 5){
              window.location.href = 'tel:'+ data.result.virtualMobile
            }
          }else {
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },

      telService(){
        if(this.deviceType.type == 3){
          alert(`客服电话：400 888 2441`)
        }else if(this.deviceType.type == 4 || this.deviceType.type == 5){
          window.location.href = 'tel:400 888 2441'
        }
      },

      /**
       *  立即评价
       * */
      toggleComment(item){
        this.closeDetails();
        if(item.id || item.orderBase){
          this.commentOrderItem = item
        }else{
          this.commentOrderItem = {
            merchant: {
              banners: []
            }
          }
        }
        this.showComment = !this.showComment
      },
      async subOrderComment(){
        if(this.reqMerchantComment.content){
          let [params, orderId] = [{}, this.commentOrderItem.orderBase ? this.commentOrderItem.orderBase.id : this.commentOrderItem.id];

          for(let value in this.selfCommentRate){
            params[value] = this.selfCommentRate[value].reduce( (a, v) => v === 'u-big-star-sle' ? a+1 : a+0, 0 )
          }
          try {
            let { data } = await this.$api.order.comment({pt: this.deviceType.type}, this.authUser, {
              orderId: orderId,
              content: this.reqMerchantComment.content,
              ...params
            });
            if(data.code == 0){
              this.showComment = false;
              this.commentOrderItem = {
                merchant: {
                  banners: []
                }
              };
              this.getOrderList();
              this.formatCommentRate();
              this.$toast.success('评价成功')
            }else{
              throw data.msg;
            }
          }catch (e){
            this.$toast.error(e)
          }
        }else{
          this.$toast.error('请填写内容')
        }

      },
      setCommentRateItem(item, rdx){
        let _selfItems = new Array(5).fill(undefined);
        _selfItems.fill('u-big-star-sle', 0, rdx+1).fill('u-big-star-nor', rdx+1, 5);
        this.selfCommentRate[item] = _selfItems;
      },

      /**
       *  追加评价
       * */
      againComment(item){
        this.closeDetails();
        if(item.id || item.orderBase){
          this.commentAgainItem = item;
          //  设置追评星级
          let rateAmount = this.commentAgainItem.merchant.rateAmount;
          this.selfAgainRate.truthRate.fill('u-big-star-sle', 0, parseInt(rateAmount.averageTruthRate)).fill('u-big-star-nor', 5-parseInt(rateAmount.averageTruthRate), 5);
          this.selfAgainRate.mannerRate.fill('u-big-star-sle', 0, parseInt(rateAmount.averageMannerRate)).fill('u-big-star-nor', 5-parseInt(rateAmount.averageMannerRate), 5);
          this.selfAgainRate.cleanlinessRate.fill('u-big-star-sle', 0, parseInt(rateAmount.averageCleanlinessRate)).fill('u-big-star-nor', 5-parseInt(rateAmount.averageCleanlinessRate), 5);
          this.selfAgainRate.facilityRate.fill('u-big-star-sle', 0, parseInt(rateAmount.averageFacilityRate)).fill('u-big-star-nor', 5-parseInt(rateAmount.averageFacilityRate), 5);
          this.selfAgainRate.costPerformanceRate.fill('u-big-star-sle', 0, parseInt(rateAmount.averageCostPerformanceRate)).fill('u-big-star-nor', 5-parseInt(rateAmount.averageCostPerformanceRate), 5);
        }else{
          this.commentAgainItem = {
            merchant: {
              banners: []
            }
          };
          this.formatCommentRate();
        }
        this.showAgain = !this.showAgain
      },
      async subAgainComment(){
        if(this.reqCommentAgain.content){
          let orderId = this.commentAgainItem.orderBase ? this.commentAgainItem.orderBase.id : this.commentAgainItem.id;
          try {
            let { data } = await this.$api.order.chaseComment({pt: this.deviceType.type}, this.authUser, {
              orderId: orderId,
              content: this.reqCommentAgain.content,
            });
            if(data.code == 0){
              this.showAgain = false;
              this.commentAgainItem = {
                merchant: {
                  banners: []
                }
              };
              this.getOrderList();
              this.formatCommentRate();
              this.$toast.success('追加评价成功')
            }else{
              throw data.msg;
            }
          }catch (e){
            this.$toast.error(e)
          }
        }else{
          this.$toast.error('请填写内容')
        }
      },

      /**
       *  入住凭证
       * */
      toggleVoucher(){
        this.showVoucher = !this.showVoucher;
        if(!this.showVoucher){
          clearInterval(this.voucherCodeInterval);
        }
      },

      async getCheckInVoucher(item){ //  获取二维码
        try{
          let { data } = await this.$api.order.checkInVoucher({pt: this.deviceType.type}, this.authUser, item.id);
          if(data.code == 0){
            this.closeDetails();
            this.resVoucher = data.result;
            this.getCheckInVoucherCode(this.resVoucher.qrCodeNo);
            this.toggleVoucher();
            this.voucherCodeInterval = setInterval( ()=>{
              return this.voucherOrderStatus(item)
            }, 3000)
          }else {
            throw data.msg;
          }
        }catch (e){
          this.$toast.error(e)
        }
      },

      async orderRefund(orderId) {  //  申请退款
        try{
          let { data } = await this.$api.order.refund({pt: this.deviceType.type}, this.authUser, orderId);
          if(data.code == 0){
            this.closeDetails();
            this.getOrderList();
            this.$toast.success('申请成功')
          }else {
            throw data.msg;
          }
        }catch (e){
          this.$toast.error(e)
        }
      },

      async orderCancel(orderId) {  //  取消订单
        try{
          let { data } = await this.$api.order.cancel({pt: this.deviceType.type}, this.authUser, orderId);
          if(data.code == 0){
            this.closeDetails();
            this.getOrderList();
            this.$toast.success('取消成功')
          }else {
            throw data.msg;
          }
        }catch (e){
          this.$toast.error(e)
        }
      },

      async orderDelete(orderId) {  //  删除订单
        try{
          let { data } = await this.$api.order.delete({pt: this.deviceType.type}, this.authUser, orderId);
          if(data.code == 0){
            this.closeDetails();
            this.getOrderList();
            this.$toast.success('删除成功')
          }else {
            throw data.msg;
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      /**
       * 订单详情
       * */
      async showDetails(orderId){
        try {
          let { data } = await this.$api.order.detail({pt: this.deviceType.type}, this.authUser, orderId);
          if(data.code == 0){
            this.resOrderDetails = data.result;
            this.resOrderDetails.orderBase['_selfStatus'] = setOrderStatus(this.resOrderDetails.orderBase);
            this.currencyList.find( (item) => {
              if(item.currencyCode == this.resOrderDetails.orderBase.currency){
                this.resOrderDetails.orderBase['_selfCurrencySymbol'] = item.currencySymbol;
              }
            } );
            this.resOrderDetails.orderBase._selfCheckinCustomersList = JSON.parse(this.resOrderDetails.orderBase.checkinCustomersJson);
            this.locationInfo = (data.result.merchant.location.houseNumber ? data.result.merchant.location.houseNumber+'' : '') +
              (data.result.merchant.location.vallage ? data.result.merchant.location.vallage+' ' : '') +
              (data.result.merchant.location.street ? data.result.merchant.location.street+' ' : '') +
              (data.result.merchant.location.area ? data.result.merchant.location.area+' ' : '') +
              (data.result.merchant.location.city ? data.result.merchant.location.city+' ' : '') +
              (data.result.merchant.location.province ? data.result.merchant.location.province+' ' : '') +
              (data.result.merchant.location.country ? data.result.merchant.location.country+' ' : '');
            this.showOrderDetails = true
          }else{
            throw data.msg;
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      closeDetails(){
        if(this.showOrderDetails){
          this.showOrderDetails = false;
          this.modalDetails = 'index'
        }
      },
      toggleDetails(type) {
        this.modalDetails = type
      },

      /**
       *  举报
       * */
      toggleReport(merchantId){
        this.closeDetails();
        this.showMerchantReport = !this.showMerchantReport;
        merchantId && (this.selectMerchantId = merchantId);
        if(!this.showMerchantReport){
          this.modalMerchantReport = 'index';
          this.selectMerchantId = undefined
        }
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
            formDara.set('merchantId', this.selectMerchantId);
            formDara.set('reportTypeId', this.selectMerchantReport.creditValue);
            let { data } = await this.$api.merchant.merchantServiceReport({pt: this.deviceType.type}, this.authUser, formDara);
            if(data.code == 0) {
              this.showMerchantReport = false;
              this.modalMerchantReport = 'index';
              this.reqMerchantReport.reportDetail = '';
              this.reqMerchantReport.images = [];
              this.$toast.success('提交成功')
            }else{
              throw data.msg;
            }
          }catch (e){
            this.$toast.error(e)
          }
        }else {
          this.$toast.error('请填写内容')
        }
      },

      setUploadImg(){ //  选择图片
        let file = event.target.files[0];
        this.reqMerchantReport.images.push(file);

        let reader = new FileReader();

        reader.onload = (event) => {
          this.merchantReportImages.push(event.target.result)
        };
        if(file){
          reader.readAsDataURL(file);
        }
      },
      delUploadImg(idx){
        this.reqMerchantReport.images.splice(idx,1);
        this.merchantReportImages.splice(idx,1)
      },

      //  获取订单列表
      async getOrderList() {
        try {
          let { data } = await this.$api.order.list({pt: this.deviceType.type, cursor: 0, length: 10, currency: this.currencyCode}, this.authUser);
          if(data.code == 0){
            this.resOrderList = data.result;
            if(this.resOrderList.length > 0){
              for(let item of this.resOrderList.values()){
                item['_selfStatus'] = setOrderStatus(item);

                this.currencyList.find( (i) => {
                  if(i.currencyCode == item.currency){
                    item['_selfCurrencySymbol'] = i.currencySymbol;
                  }
                } )
              }
            }
            if(this.resOrderList.length < 10){
              this.isMoreOrderList = false
            }
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      //  获取更多订单
      async pushOrderList() {
        try {
          let { data } = await this.$api.order.list({pt: this.deviceType.type, cursor: this.selfCursor*10, length: 10, currency: this.currencyCode}, this.authUser);
          if(data.code == 0){
            let _selfList = data.result;
            if(_selfList.length > 0){
              for(let item of _selfList.values()){
                item['_selfStatus'] = setOrderStatus(item);

                this.currencyList.find( (i) => {
                  if(i.currencyCode == item.currency){
                    item['_selfCurrencySymbol'] = i.currencySymbol;
                  }
                } )
              }
              this.resOrderList.push(..._selfList);
              this.selfCursor ++;
            }
            if(_selfList.length < 10){
              this.isMoreOrderList = false
            }
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },

      /**
       *  支付
       * */

      async openPay(item) {
        this.payOrderItem = item;
        this.selfPayExpiredSeconds = this.payOrderItem.payExpiredSeconds;
        this.showPay = true;
        this.payExpiredInterval = setInterval( () => {
          if(this.selfPayExpiredSeconds != 0){
            this.selfPayExpiredSeconds --;
          }else{
            clearInterval(this.payExpiredInterval);
            this.selfPayExpiredSeconds = 0;
            window.location.reload()
          }
        }, 1000 );
        try{
          //  普通订单，支付前使用本接口，获取当前系统可用支付手段
          let { data } = await this.$api.order.getUsablePaymentUtilsForCommonPay({pt: this.deviceType.type}, this.authUser, {
            userId: this.authUser.userId,
            orderId: this.payOrderItem.id
          });
          if(data.code == 0){
            this.closeDetails();

            this.paymentUtils = data.result;

            this.paymentUtils.find( (item) => {
              if(item.id == 70){
                this.paymentDP = item;
                // this.paymentDP.points = (this.paymentDP.points / 100).toFixed(2);
                // this.paymentDP.payablePoints = (this.paymentDP.payablePoints / 100).toFixed(2)
              }

              if(item.id == 93){
                this.authorization = item.paypalClientToken;
                this.paypalResult = {
                  flow: 'checkout',
                  amount: item.amountForRealCurrency.toString(), //  item.amountForRealCurrency.toString()
                  currency: item.realCurrency
                };
              }
            } );

            this.currencyList.find( (item) => {
              if(item.currencyCode == this.paymentUtils[this.paymentUtils.length - 1].realCurrency){
                this.realCurrencySymbol = item.currencySymbol;
              }
            } );

            if(this.deviceType.type != 5){
              this.paymentUtils.find( (item, idx) => {
                if(item.id == 97){
                  this.paymentUtils.splice(idx, 1)
                }
              } )
            }
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      closePay(){
        this.showPay = false;
        this.wechatPayCodeInterval && clearInterval(this.wechatPayCodeInterval);
        if(this.payExpiredInterval){
          clearInterval(this.payExpiredInterval);
          this.selfPayExpiredSeconds =0
        }
      },
      //  提交订单
      async subPay() {
        if(this.payUtilId){
          let result = {};
          if(this.deviceType.type == 5 && this.payUtilId == 97){
            result = {wechatPay: {orderNo: this.resOrderInfo.orderNo, virtualPoints: this.isActiveDP ? this.paymentDP.payablePoints : 0}};
            if(this.deviceType.env == 'iOS'){
              window.webkit.messageHandlers.subPay.postMessage(JSON.stringify(result));
            }else{
              android.subPay(JSON.stringify(result))
            }
          }else{
            this.$nuxt.$loading.start();
            let { data } = await this.$api.order.createPaymentUtilParameters({pt: this.deviceType.type}, this.authUser, {
              orderId: this.payOrderItem.id,
              utilId: this.payUtilId,
              returnUrl: window.location.host + '/order',
              virtualPoints: this.isActiveDP ? this.paymentDP.payablePoints : 0
            });
            this.$nuxt.$loading.finish();
            if(data.code == 0){
              /**
               * 桌面设备
               * */
              if(this.deviceType.type == 3){

                this.getWeChatPayCode(data.result.qyfCode);

                this.wechatPayCodeInterval = setInterval( ()=>{
                  return this.getOrderStatus()
                }, 3000);

                if(this.payUtilId == 96){  //  支付宝
                  /*          let aliPayList = data.result.aliPay;
                            aliPayList = aliPayList.split('&');
                            for(let elem of aliPayList.values()){
                              let item = elem.split('=');
                              this.aliPayParams.push({
                                key: item[0],
                                value: decodeURIComponent(item[1].replace(/\+/g,'%20'))
                              })
                            }
                            this.$refs.payForm.submit();*/

                }else if(this.payUtilId == 99){  //  微信扫码
                  //  切换二维码
                  /*       this.getWeChatPayCode(data.result.wechatPay.code_url);

                         this.wechatPayCodeInterval = setInterval( ()=>{
                           return this.getOrderStatus()
                         }, 3000)*/
                }
                /**
                 * 触屏设备
                 * */
              }else if(this.deviceType.type == 4){
                if(this.payUtilId == 96){  //  支付宝
                  /*      let aliPayList = data.result.aliPay;
                        aliPayList = aliPayList.split('&');
                        for(let elem of aliPayList.values()){
                          let item = elem.split('=');
                          this.aliPayParams.push({
                            key: item[0],
                            value: decodeURIComponent(item[1].replace(/\+/g,'%20'))
                          })
                        }
                        this.$refs.payForm.submit();*/
                  window.location.href = data.result.qyfCode
                }else if(this.payUtilId == 99){  //  微信H5
                  // window.location.href = data.result.wechatPay.mweb_url;
                  // this.payWeChatHref = data.result.wechatPay.mweb_url;
                  // this.$refs.payWeChat
                }
                /***
                 *  webView
                 * */
              }else if(this.deviceType.type == 5){
                if(this.payUtilId == 96){
                  result = {aliPay : data.result.qyfCode};
                  if(this.deviceType.env == 'iOS'){
                    window.webkit.messageHandlers.subPay.postMessage(JSON.stringify(result));
                  }else{
                    android.subPay(JSON.stringify(result))
                  }
                }else if(this.payUtilId == 97){

                }
              }
            }else{
              this.$toast.error(data.msg)
            }
          }

        }else{
          this.$toast.error('请选择支付方式')
        }

      },

      //  获取入住订单状态
      async voucherOrderStatus(item){
        try {
          let { data } = await this.$api.order.status({pt: this.deviceType.type}, this.authUser, this.resVoucher.orderId);
          if(data.code == 0){
            if(data.result.orderStatus == 10){
              this.showVoucher = false;
              clearInterval(this.voucherCodeInterval);
              if(dayjs().isBefore(dayjs(item.arrivalDate))){
                this.$toast.show('还不到最早入住时间')
              }
              this.getOrderList()
            }
          }else{
            throw data.msg;
          }
        }catch (e) {
          this.$toast.error(e)
        }
      },
      //  获取订单状态
      async getOrderStatus(){
        try {
          let { data } = await this.$api.order.status({pt: this.deviceType.type}, this.authUser, this.payOrderItem.id);
          if(data.code == 0){
            if(data.result.payStatus != 1){
              clearInterval(this.wechatPayCodeInterval);
              window.location.reload();
            }
          }else{
            throw data.msg;
          }
        }catch (e) {
          this.$toast.error(e)
        }
      },
      //  获取微信支付二维码
      async getWeChatPayCode(url){
        try {
          await QRCode.toCanvas(this.$refs.weChatPayCode, url);
        } catch (e) {
          this.$toast.error(e)
        }
      },
      //  获取入住凭证二维码
      async getCheckInVoucherCode(str){
        try {
          await QRCode.toCanvas(this.$refs.voucherCode, str);
        } catch (e) {
          this.$toast.error(e)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';
  @media screen and #{$desktop-width}{
    .modal-order-details{
      max-height: calc(100vh - 160px);
    }
  }
  .order-index{
    width: 100%;
    min-height: 100vh;
    padding: 32px 0;
    .index-login-bth{
      text-align: center;
      >button{
        padding: 15px 32px;
        background-color: $t4;
        border-radius: 4px;
        @include font-style(18px)
      }
    }
    .index-foot-btn{
      padding: 48px 0;
      text-align: center;
      >button{
        padding: 15px 32px;
        background-color: $t4;
        border-radius: 4px;
        @include font-style(18px)
      }
    }
    .index-def{
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 16px;
      >img{
        margin-top: 125px;
        width: 255px;
        height: 205px;
      }
      >p{
        margin: 48px 0 16px 0;
        @include font-style(14px, 20px)
      }
    }
    .index-title{
      padding: 0 16px;
      @include font-style(24px)
    }
    .index-items{
      flex-wrap: wrap;
      margin: 0;
      .item{

        .card{
          &:hover{
            cursor: pointer;
            background-color: $b1;
          }
          .card-header{
            justify-content: space-between;
            padding: 14px 8px;
            .header-name{
              display: flex;
              >img{
                width: 20px;
                height: 20px;
                border-radius: 50%;
              }
              >p{
                margin-left: 8px;
                @include font-style(16px, 20px)
              }
            }
            .header-type{
              >p{
                @include font-style(14px, 20px, $color:$t3);
                &.light{
                  color: $t6;
                }
                &.red{
                  color: $t5;
                }
              }
            }
          }
          .card-content{
            padding: 0 .5rem;
            .content-info{
              display: flex;
              justify-content: space-between;
              >img{
                width: 84px;
                height: 72px;
                border-radius: 4px;
                margin-right: 8px;
              }
              .info{
                flex: 1;
                overflow: hidden;
                .info-name{
                  @include font-style(16px);
                  @include one-line-hidden;
                }
                .info-type{
                  display: flex;
                  justify-content: space-between;
                  margin: 12px 0;
                  @include one-line-hidden;
                  >p{
                    &:first-child{
                      @include font-style(12px, 16px, $color:$t3)
                    }
                    &:last-child{
                      @include font-style(16px)
                    }
                  }
                }
                .info-date{
                  @include font-style(14px, $color:$t2)
                }
              }
            }
            .content-sum{
              display: flex;
              justify-content: flex-end;
              margin: 16px 0;
              @include font-style(16px, 18px);
              >span{
                font-weight: bold;
                @include font-style(18px);
              }
            }
          }
          .card-footer{
            display: flex;
            justify-content: flex-end;
            padding: 1rem 0;
            >button{
              margin: 0 .5rem;
              padding: 6px 12px;
              border-radius: 3px;
              border: 1px solid $b3;
              @include font-style(14px, $color:$t3);
              &.light{
                background-color: $t4;
                border-color: $t4;
                color: $t1;
              }
            }
          }
        }

      }
    }
  }

  .order-details{
    display: flex;
    flex-direction: column;
    .modal-main{
      padding: 0 16px;
      .main-title{
        display: flex;
        justify-content: space-between;
        margin: 16px 0 24px 0;
        >h2{
          @include font-style(24px)
        }
        >p{
          @include font-style(14px, 24px, $color:$t3);
          &.light{
            color: $t6;
          }
          &.red{
            color: $t5;
          }
        }
      }
      .content-info{
        display: flex;
        justify-content: space-between;
        >img{
          width: 84px;
          height: 72px;
          border-radius: 4px;
          margin-right: 8px;
        }
        .info{
          flex: 1;
          overflow: hidden;
          .info-name{
            @include font-style(16px);
            @include one-line-hidden;
          }
          .info-type{
            display: flex;
            justify-content: space-between;
            margin: 12px 0;
            @include one-line-hidden;
            >p{
              &:first-child{
                @include font-style(12px, 16px, $color:$t3)
              }
              &:last-child{
                @include font-style(16px)
              }
            }
          }
          .info-date{
            @include font-style(14px, $color:$t2)
          }
        }
      }
      .head-logo{
        display: flex;
        justify-content: space-between;
        padding: 24px 0;
        .logo-left{
          flex: 1;
          padding: 4px 0;
          >h6{
            margin-bottom: 12px;
            @include font-style(16px);
          }
          >p{
            @include font-style(12px, $color:$t2);
            span{
              color: $t6;
            }
          }
        }
        >img{
          @extend .l-user-info-face
        }
      }
      .main-map{
        display: flex;
        align-items: center;
        >img{
          width: 38px;
          height: 38px;
        }
        >p{
          margin-left: 8px;
          @include font-style(14px);
        }
      }
      .main-items{
        display: flex;
        flex-direction: column;
        margin-top: 24px;
        >li{
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid $b3;
          padding: 24px 0;
          &.flex-column{
            flex-direction: column;
            align-items: start;
            .item-flex-row{
              width: 100%;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
          }
          &.detail{
            padding: 8px 0;
            .item-left{
              padding: 8px 0;
              >span{
                margin-top: 0;
              }
            }

          }
          .item-left{
            >h6{
              @include font-style(20px);
            }
            >p{
              @include font-style(18px);
              &.light{
                @include font-style(16px, $color:$t6);
              }
              &.normal{
                @include font-style(16px, $color:$t2);
              }
              &.money{
                @include font-style(20px);
                >span{
                  @include font-style(14px, 16px);
                }
              }
            }
            >button{
              @include font-style(16px, $color:$t6);
            }
            >span{
              margin-top: 8px;
              display: inline-block;
              @include font-style(14px, $color:$t2);
            }
          }
          .item-right{
            >p{
              @include font-style(18px);
              &.light{
                @include font-style(16px, $color:$t6);
              }
              &.normal{
                @include font-style(16px, $color:$t2);
              }
            }
            >span{
              margin-top: 8px;
              display: inline-block;
              @include font-style(14px, $color:$t2);
            }
          }
        }
      }
      .main-btn{
        display: flex;
        justify-content: flex-end;
        padding: 1rem 0;
        >button{
          margin: 0 .5rem;
          padding: 6px 12px;
          border-radius: 3px;
          border: 1px solid $b3;
          @include font-style(14px, $color:$t3);
          &.light{
            background-color: $t4;
            border-color: $t4;
            color: $t1;
          }
        }
      }
    }
    .modal-foot{
      .foot-card{
        display: flex;
        justify-content: flex-end;
        padding: 1rem 0;
        >button{
          margin: 0 .5rem;
          padding: 6px 12px;
          border-radius: 3px;
          border: 1px solid $b3;
          @include font-style(14px, $color:$t3);
          &.light{
            background-color: $t4;
            border-color: $t4;
            color: $t1;
          }
        }
      }

    }
  }

  .pay-details{
    .modal-main{
      padding: 16px;
      >h2{
        @include font-style(18px);
      }
      .pay-info{
        margin-top: 24px;
        @include font-style(14px, 22px, $color:$t2);
      }
      .pay-items{
        >li{
          padding: 24px 0;
          &:not(:last-child){
            display: flex;
            flex-direction: column;
            border-bottom: 1px solid $b3;
          }
          &:last-child{
            display: flex;
            justify-content: space-between;
            align-items: center;
            >P{
              display: flex;
              @include font-style(20px);
              &.money{
                @include font-style(30px);
                >span{
                  @include font-style(16px, 22px);
                }
              }
            }
          }
          .item-main{
            display: flex;
            justify-content: space-between;
            align-items: center;
            >p{
              @include font-style(16px);
              &.money{
                @include font-style(20px);
              }
            }
          }
          .item-info{
            margin-top: 8px;
            @include font-style(14px, $color:$t2);
          }
          .item{
            display: flex;
            justify-content: space-between;
            align-items: center;
            >p{
              margin-top: 12px;
              @include font-style(14px);
              &.money{
                @include font-style(16px);
              }
            }
          }
        }
      }
      .pay-foot{
        padding: 24px 0;
        .sub-btn{
          width: 100%;
          height: 48px;
          background-color: $t4;
          border-radius: 4px;
          @include font-style(16px, 48px);

        }
      }
    }

  }

  //  支付工具
  .pay-util-modal{
    .modal-main{
      padding: 16px;
      >h2{
        @include font-style(24px)
      }
      .main-info{
        margin: 8px 0 16px 0;
        @include font-style(14px, 22px, $color:$t2)
      }
      .main-items{
        >li{
          padding: 16px 0;
          &:not(:last-child) {
            border-bottom: 1px solid $b3;
          }
          >p{
            @include font-style(18px);
            &.red{
              color: $t5;
            }
            &.nor{
              @include font-style(14px, 18px)
            }
          }
          &:hover{
            cursor: pointer;
            background-color: $b1;
          }
        }
        .item-box{
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .item-pay{
          .DP{
            display: flex;
            >img{
              width: 42px;
              height: 42px;
              margin-right: 8px;
            }
            .info{
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              >p{
                &:first-child{
                  padding-right: 24px;
                  @include font-style(16px);
                  @include bg-image('~assets/image/icon/global_icon_points_description.png', 18px, 18px, 100%, 100%)
                }
                &:last-child{
                  @include font-style(14px, $color: $t2)
                }
              }
            }
          }
          .pay{
            display: flex;
            >img{
              width: 30px;
              height: 30px;
            }
            >p{
              margin-left: 8px;
              line-height: 30px;
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

  .voucher-modal{
    .modal-main{
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
      background-image: url('~assets/image/icon/global_img_bg_head.png');
      background-repeat: no-repeat;
      background-size: 100% 50%;
      >h2{
        align-self: flex-start;
        @include font-style(24px)
      }
      .main-code{
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 96px 0;
        padding: 48px 64px;
        background-color: $b1;
        box-shadow: 0 2px 24px 0 rgba(125,110,39,0.18);
        border-radius: 12px;
        >canvas{
          margin: 24px 0;
          padding: 16px;
          background-image: url('~assets/image/icon/order_voucher_img_border.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
        >p{
          @include font-style(18px)
        }
        >h4{
          @include font-style(20px)
        }
      }
    }
  }

  .comment-modal{
    .modal-main{
      padding: 16px;
      >h2{
        @include font-style(24px)
      }
      .card-content{
        padding: 16px 0;
        .content-info{
          display: flex;
          justify-content: space-between;
          >img{
            width: 84px;
            height: 72px;
            border-radius: 4px;
            margin-right: 8px;
          }
          .info{
            flex: 1;
            overflow: hidden;
            .info-name{
              @include font-style(16px);
              @include one-line-hidden;
            }
            .info-type{
              display: flex;
              justify-content: space-between;
              margin: 12px 0;
              @include one-line-hidden;
              >p{
                @include font-style(12px, 16px, $color:$t3)
              }
            }
            .info-date{
              @include font-style(14px, $color:$t2)
            }
          }
        }
      }
      .main-input{
        width: 100%;
        padding: 8px 0;
        border: none;
        @include font-style(16px, 22px, $color:$t3)
      }
      .main-star{
        border-bottom: 1px solid $b1;
        >li{
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          >p{
            @include font-style(14px, 20px)
          }
          .star-items{
            display: flex;
            >li{
              width: 20px;
              height: 20px;
              &:not(:last-child){
                margin-right: 8px;
              }
            }
          }
        }
      }
      .set-star{
        >li{
          .star-items{
            >li{
              &:hover{
                cursor: pointer;
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

</style>
