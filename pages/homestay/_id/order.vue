<template>
  <div>
    <section class="container is-widescreen">
      <div class="columns order">
        <order-detail :resData="resData"
                      :currencySymbol="currencySymbol"
                      :locationInfo="locationInfo"
                      :resPrice="resPrice"
                      :selectPriceServices="selectPriceServices"
                      :pop="pop"
                      :listInfoPop="listInfoPop"
                      :isInvoice.sync="isInvoice"
                      :isInsurance.sync="isInsurance"
                      :isProtocol.sync="isProtocol"
                      @set-pop="setPop"
                      @open-infoPop="openInfoPop"
                      @open-protocol="openProtocol"
                      @toggle-protocol="toggleProtocol"
                      @open-invoice="openInvoice"
                      @all-service="allService"
                      @toggle-insurance="toggleInsurance"></order-detail>


        <!--  付款明细（桌面端） -->
        <div class="column is-4-desktop order-pay is-hidden-touch">
          <order-pay :resPrice="resPrice" :resData="resData"
                     :currencyCode="currencyCode"
                     :currencySymbol="currencySymbol"
                     :selectPriceServices="selectPriceServices"
                     @open-pay="openPay"></order-pay>

        </div>
      </div>

    </section>

    <!--  设置人数  -->
    <div :class="[showModalPop ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="closePop"></div>
      <div class="modal-content">
        <div class="set-pop-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="closePop"></button>
          </div>
          <div class="modal-main">
            <ul class="main-pop">
              <li>
                <div class="pop-left">
                  <p>成人</p>
                </div>
                <div class="pop-right">
                  <img src="~/assets/image/icon/global_icon_minus_small_dis.png" alt="" class="min" @click="minGrownUp">
                  <span class="right-num">{{pop.grownUp}}</span>
                  <img src="~/assets/image/icon/global_icon_add_small_nor.png" alt="" class="add" @click="addGrownUp">
                </div>
              </li>
              <li>
                <div class="pop-left">
                  <p>儿童</p>
                  <span>2-12岁</span>
                </div>
                <div class="pop-right">
                  <img src="~/assets/image/icon/global_icon_minus_small_dis.png" alt="" class="min" @click="minChild">
                  <span class="right-num">{{pop.child}}</span>
                  <img src="~/assets/image/icon/global_icon_add_small_nor.png" alt="" class="add" @click="addChild">
                </div>
              </li>
              <li>
                <div class="pop-left">
                  <p>婴幼儿</p>
                  <span>2岁以下</span>
                </div>
                <div class="pop-right">
                  <img src="~/assets/image/icon/global_icon_minus_small_dis.png" alt="" class="min" @click="minBaby">
                  <span class="right-num">{{pop.baby}}</span>
                  <img src="~/assets/image/icon/global_icon_add_small_nor.png" alt="" class="add" @click="addBaby">
                </div>
              </li>
              <li>
                <div class="pop-left">
                  <p>宠物</p>
                  <span class="red" v-if="!resData.acceptPet">该房源不允许携带宠物入住</span>
                </div>
                <div class="pop-right" v-if="resData.acceptPet">
                  <div class="u-switch" >
                    <input id="switch-toggle-Animal" class="switch-toggle switch-toggle-round" type="checkbox">
                    <label for="switch-toggle-Animal"></label>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="modal-foot">
            <button type="button" class="sub-btn" @click="subPop">确认</button>
          </div>
        </div>
      </div>
    </div>

    <!--  入住人信息  -->
    <div :class="[showInfoPop ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="closeInfoPop"></div>
      <div class="modal-content">
        <!--  入住人信息 -->
        <div v-show="modalInfoPop == 'list'" class="list-info-pop">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="closeInfoPop"></button>
            <button type="button" @click="toggleInfoPop('add')">添加入住人</button>
          </div>
          <!--  选择入住人 -->
          <div class="modal-main">
            <h2>入住人信息</h2>
            <p class="main-info">您需要添加即将入住人的身份信息，以方便您入住时我们验证入住人的合法身份。</p>
            <ul class="main-items">
              <li v-for="(item, idx) in infoPopList" :key="item.id">
                <label :for="item.id" class="item-box">
                  <div class="item-info">
                    <p>
                      <span>{{item.name}}</span>
                      <span>{{item.telephone}}</span>
                    </p>
                    <p>身份证号：{{item.identificationNumber}}</p>
                  </div>
                  <div class="item-action">
                    <div class="u-checkbox-round">
                      <input class="checkbox-toggle" type="checkbox" :id="item.id" :value="item" v-model="isInfoPop">
                      <label :for="item.id" class=""></label>
                    </div>
                    <button type="button" class="check" @click="toggleInfoPop('show', item)" v-if="item.isOrderer">查看预定人信息</button>
                    <div class="action-btn" v-else>
                      <button type="button" @click="toggleInfoPop('edit', item)">编辑</button>
                      <button type="button" @click="deleteInfoPop(item)">删除</button>
                    </div>
                  </div>
                </label>
              </li>
            </ul>
          </div>
          <div class="modal-foot">
            <button type="button" class="sub-btn" @click="setInfoPopList">提交</button>
          </div>
        </div>

        <!--  预定人信息（补全） -->
        <div v-show="modalInfoPop == 'real'" class="real-info-pop">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="closeInfoPop"></button>
          </div>
          <div class="modal-main">
            <h2>预定人信息</h2>
            <ul class="main-items">
              <li>
                <p>国籍</p>
                <div class="select">
                  <select v-model="realInfoPop.country">
                    <option :value="0" disabled>请选择国家</option>
                    <option v-for="(item, idx) in resCountries" :key="item.id" :value="item.countryCode">{{item.countryName}}</option>
                  </select>
                </div>
              </li>
              <li>
                <p>姓名</p>
                <div class="item-input">
                  <input type="text" placeholder="请输入真实姓名" v-model="realInfoPop.realName">
                </div>
              </li>
              <li>
                <div class="item-identity">
                  <label for="repIdCard" class="identity-No">
                    <div class="u-checkbox-round">
                      <input id="repIdCard" class="checkbox-toggle" :value="1" type="radio" v-model="realInfoPop.identityCardType">
                      <label for="repIdCard"></label>
                    </div>
                    <p>身份证</p>
                  </label>
                  <label for="repIdPass" class="identity-No">
                    <div class="u-checkbox-round">
                      <input id="repIdPass" class="checkbox-toggle" :value="2" type="radio" v-model="realInfoPop.identityCardType">
                      <label for="repIdPass"></label>
                    </div>
                    <p>护照</p>
                  </label>
                </div>

                <div class="item-input">
                  <input v-show="realInfoPop.identityCardType == 1" type="text" placeholder="请输入身份证号码" v-model="realInfoPop.idNo">
                  <input v-show="realInfoPop.identityCardType == 2" type="text" placeholder="请输入护照" v-model="realInfoPop.idNo">
                </div>
              </li>
              <li>
                <p>手机号</p>
                <div class="item-input">
                  <input type="tel" :value="'+'+realInfoPop.telephoneCountryPrefix" readonly class="prefix">
                  <input type="tel" :value="realInfoPop.telephone" readonly>
                </div>
              </li>
              <li>
                <p class="red">*提交后不可以自行修改；请确保信息真实有效，否则一旦出现不良后果，请自行负责。</p>
              </li>
            </ul>
          </div>
          <div class="modal-foot">
            <button type="button" class="sub-btn" @click="subRealAdd">提交</button>
          </div>
        </div>

        <!--  预定人信息（查看） -->
        <div v-show="modalInfoPop == 'show'" class="show-info-pop">
          <div class="modal-head">
            <button type="button" class="back-btn" @click="toggleInfoPop('list')"></button>
          </div>
          <div class="modal-main">
            <h2>预定人信息</h2>
            <ul class="main-items">
              <li>
                <p>国籍</p>
                <div class="item-input">
                  <input type="text" :value="realInfoPopDetail.country" readonly>
                </div>
              </li>
              <li>
                <p>姓名</p>
                <div class="item-input">
                  <input type="text" :value="realInfoPopDetail.name" readonly>
                </div>
              </li>
              <li v-if="realInfoPopDetail.identityCardType == 1">
                <p>身份证</p>
                <div class="item-input">
                  <input type="text" :value="realInfoPopDetail.identificationNumber" readonly>
                </div>
              </li>
              <li v-else-if="realInfoPopDetail.identityCardType == 2">
                <p>护照</p>
                <div class="item-input">
                  <input type="text" :value="realInfoPopDetail.identificationNumber" readonly>
                </div>
              </li>
              <li>
                <p>手机号</p>
                <div class="item-input">
                  <input type="tel" :value="'+'+realInfoPopDetail.telephoneCountryPrefix" readonly class="prefix">
                  <input type="tel" :value="realInfoPopDetail.telephone" readonly>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!--  添加入住人 -->
        <div v-show="modalInfoPop == 'add'" class="add-info-pop">
          <div class="modal-head">
            <button type="button" class="back-btn" @click="toggleInfoPop('list')"></button>
          </div>
          <div class="modal-main">
            <h2>添加入住人</h2>
            <ul class="main-items">
              <li>
                <p>国籍</p>
                <div class="select">
                  <select v-model="addInfoPop.country">
                    <option :value="0" disabled>请选择国家</option>
                    <option v-for="(item, idx) in resCountries" :key="item.id" :value="item.countryCode">{{item.countryName}}</option>
                  </select>
                </div>
              </li>
              <li>
                <p>姓名</p>
                <div class="item-input">
                  <input type="text" placeholder="请输入真实姓名" v-model="addInfoPop.name">
                </div>
              </li>
              <li>
                <div class="item-identity">
                  <label for="addIdCard" class="identity-No">
                    <div class="u-checkbox-round">
                      <input id="addIdCard" class="checkbox-toggle" :value="1" type="radio" v-model="addInfoPop.identityCardType">
                      <label for="addIdCard"></label>
                    </div>
                    <p>身份证</p>
                  </label>
                  <label for="addIdPass" class="identity-No">
                    <div class="u-checkbox-round">
                      <input id="addIdPass" class="checkbox-toggle" :value="2" type="radio" v-model="addInfoPop.identityCardType">
                      <label for="addIdPass"></label>
                    </div>
                    <p>护照</p>
                  </label>
                </div>

                <div class="item-input">
                  <input v-show="addInfoPop.identityCardType == 1" type="text" placeholder="请输入身份证号码" v-model="addInfoPop.identificationNumber">
                  <input v-show="addInfoPop.identityCardType == 2" type="text" placeholder="请输入护照" v-model="addInfoPop.identificationNumber">
                </div>
              </li>
              <li>
                <p>手机号（选填）</p>
                <div class="item-input">
                  <input type="tel" v-model="'+'+addInfoPop.telephoneCountryPrefix" class="prefix">
                  <input type="tel" placeholder="" v-model="addInfoPop.telephone">
                </div>
              </li>
              <li>
                <p class="red">*提交后不可以自行修改；请确保信息真实有效，否则一旦出现不良后果，请自行负责。</p>
              </li>
            </ul>
          </div>
          <div class="modal-foot">
            <button type="button" class="sub-btn" @click="subInfoPop">提交</button>
          </div>
        </div>

        <!--  编辑入住人 -->
        <div v-show="modalInfoPop == 'edit'" class="edit-info-pop">
          <div class="modal-head">
            <button type="button" class="back-btn" @click="toggleInfoPop('list')"></button>
          </div>
          <div class="modal-main">
            <h2>编辑入住人信息</h2>
            <ul class="main-items">
              <li>
                <p>国籍</p>
                <div class="select">
                  <select v-model="editInfoPop.country">
                    <option :value="0" disabled>请选择国家</option>
                    <option v-for="(item, idx) in resCountries" :key="item.id" :value="item.countryCode">{{item.countryName}}</option>
                  </select>
                </div>
              </li>
              <li>
                <p>姓名</p>
                <div class="item-input">
                  <input type="text" placeholder="请输入真实姓名" v-model="editInfoPop.name">
                </div>
              </li>
              <li>
                <div class="item-identity">
                  <label for="editIdCard" class="identity-No">
                    <div class="u-checkbox-round">
                      <input id="editIdCard" class="checkbox-toggle" :value="1" type="radio" v-model="editInfoPop.identityCardType">
                      <label for="editIdCard"></label>
                    </div>
                    <p>身份证</p>
                  </label>
                  <label for="editIdPass" class="identity-No">
                    <div class="u-checkbox-round">
                      <input id="editIdPass" class="checkbox-toggle" :value="2" type="radio" v-model="editInfoPop.identityCardType">
                      <label for="editIdPass"></label>
                    </div>
                    <p>护照</p>
                  </label>
                </div>

                <div class="item-input">
                  <input v-show="editInfoPop.identityCardType == 1" type="text" placeholder="请输入身份证号码" v-model="editInfoPop.identificationNumber">
                  <input v-show="editInfoPop.identityCardType == 2" type="text" placeholder="请输入护照" v-model="editInfoPop.identificationNumber">
                </div>
              </li>
              <li>
                <p>手机号（选填）</p>
                <div class="item-input">
                  <input type="tel" v-model="'+'+editInfoPop.telephoneCountryPrefix" class="prefix">
                  <input type="tel" placeholder="" v-model="editInfoPop.telephone">
                </div>
              </li>
              <li>
                <p class="red">*提交后不可以自行修改；请确保信息真实有效，否则一旦出现不良后果，请自行负责。</p>
              </li>
            </ul>
          </div>
          <div class="modal-foot">
            <button type="button" class="sub-btn" @click="subInfoPopEdit">提交</button>
          </div>
        </div>

      </div>
    </div>

    <!--  入住协议 -->
    <div :class="[showProtocol ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="closeProtocol"></div>
      <div class="modal-content">
        <div class="protocol-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="closeProtocol"></button>
          </div>
          <div class="modal-main">
            <h2>入住协议</h2>
            <p class="main-info">以下是入住该民宿需要遵守的几条规定，请您了解具体事项</p>
            <ul class="main-items" v-if="resData.protocols">
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
          <div class="modal-foot">
            <button type="button" class="sub-btn" @click="subProtocol">确认</button>
          </div>
        </div>
      </div>
    </div>

    <!--  发票信息  -->
    <div :class="[showInvoice ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="closeInvoice"></div>
      <div class="modal-content">
        <div class="invoice-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="closeInvoice"></button>
          </div>
          <div class="modal-main">
            <h2>发票信息</h2>
            <p class="main-info">默认开具电子发票，开票成功后会把发票下载地址发送到预订人的手机上。</p>
            <div>
              <div>
                <label for="person">
                  <div class="u-checkbox-round">
                    <input id="person" class="checkbox-toggle" value="1" type="radio" v-model="invoiceType">
                    <label for="person"></label>
                  </div>
                  <p>个人</p>
                </label>
                <label for="corporation">
                  <div class="u-checkbox-round">
                    <input id="corporation" class="checkbox-toggle" value="2" type="radio" v-model="invoiceType">
                    <label for="corporation"></label>
                  </div>
                  <p>公司</p>
                </label>
              </div>

              <div v-show="invoiceType == 1">
                <span>发票抬头</span>
                <input type="text" placeholder="请填写“个人”或“真实姓名”">
              </div>

              <div v-show="invoiceType == 2">
                <span>发票抬头</span>
                <input type="text" placeholder="请填写公司全称">
                <span>公司税号</span>
                <input type="text" placeholder="请填写纳税人识别号">
              </div>

            </div>
          </div>
          <div class="modal-foot">
            <button type="button" class="sub-btn" @click="subInvoice">保存</button>
          </div>
        </div>
      </div>
    </div>

    <!--  额外服务  -->
    <div :class="[isService ? 'is-active' : '', 'modal']" v-if="resPrice.services">
      <div class="modal-background" @click="closeService"></div>
      <div class="modal-content">
        <div class="service-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="closeService"></button>
          </div>
          <div class="modal-main">
            <h2>额外服务及费用</h2>
            <ul class="main-items">
              <li v-for="(item, idx) in resPrice.services" :key="item.id">
                <p class="item-left">{{item.name}}</p>
                <div class="item-right">
                  <p class="right-txt"><span>{{currencySymbol}}&nbsp;{{item.unitPrice}}</span>/{{item.unit}}</p>
                  <div class="right-btn">
                    <img src="~/assets/image/icon/global_icon_minus_small_dis.png" alt="" class="min" @click="minServicesNum(item)">
                    <span class="btn-num">{{item.quantity}}</span>
                    <img src="~/assets/image/icon/global_icon_add_small_nor.png" alt="" class="add" @click="addServicesNum(idx, item)">
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="modal-foot">
            <button type="button" class="sub-btn" @click="subService">提交</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 付款明细 -->
    <div :class="[showPayDetail ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="togglePayDetail"></div>
      <div class="modal-content">
        <div class="pay-detail-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="togglePayDetail"></button>
          </div>
          <div class="modal-main">
            <order-pay :resPrice="resPrice" :resData="resData"
                       :currencyCode="currencyCode"
                       :currencySymbol="currencySymbol"
                       :selectPriceServices="selectPriceServices"
                       @open-pay="openPay"></order-pay>

          </div>
          <div class="modal-foot">
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
            <p class="main-info">在该酒店/民宿住宿 {{resPrice.dayCount}}晚</p>
            <ul class="main-items">
              <li class="item-box">
                <p class="nor">剩余支付时间</p>
                <p class="red">{{_selfFormatDuring(resOrderInfo.payExpiredSeconds)}}</p>
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
            <!--<div v-show="payUtilId == 93" style="width: 100%;text-align: center"></div>-->
            <button type="button" class="sub-btn" @click="subPay" v-if="payUtilId && (payUtilId != 93)">立即支付</button>
          </div>
        </div>
      </div>
    </div>

    <!--  移动端固定页脚 -->
    <div class="is-hidden-desktop touch-foot">
      <div class="foot-left" @click="togglePayDetail">
        <p class="money"><span class="light">{{currencySymbol}}</span>{{resPrice.amount}}<span>总额</span></p>
        <button type="button">查看价格明细</button>
      </div>
      <button type="button" @click="openPay">提交订单</button>
    </div>

    <form method="post" :action="payFormAction" ref="payForm"  target="_blank" style="display: none">  <!--     -->
      <input type="text" v-for="(item, idx) in aliPayParams" :key="item.id" :name="item.key" :value="item.value">
    </form>
    <!--<a :href="payWeChatHref" style="display: none" ref="payWeChat"></a>-->
  </div>
</template>

<script>
  import OrderDetail from '~/components/house/OrderDetail.vue'
  import OrderPay from '~/components/house/OrderPay.vue'
  import { mapState } from 'vuex'
  import axios from 'axios'
  import homestay from '~/assets/js/api/homestay'
  import system from '~/assets/js/api/system'
  import QRCode from 'qrcode';
  import config from '~/assets/js/config'
  import { formatDuring } from '~/assets/js/utils'

  export default {
    name: "homestay-id-order",
    layout: 'back',
    validate ({ params }) {
      // 必须是number类型
      return /^\d+$/.test(params.id)
    },
    components: {
      OrderDetail,
      OrderPay
    },
    head(){
      return {
        title: '民宿预定'
      }
    },
    data() {
      return {
/*        paypalStyle: {
          label: 'checkout',
          size:  'large',
          shape: 'pill',
          color: 'gold'
        },
        paypalResult: {
          id: undefined,
          amountForRealCurrency: '',
          realCurrency: '',
          paypalClientToken: ''
        },*/
        instance: null,
        authorization: '',
        paypalResult: {
          // flow: 'checkout',
          // amount: '0',
          // currency: 'USD'
        },
        //payWeChatHref: '',  //  H5 微信支付 url
        payFormAction: '',  //  支付宝支付跳转 url
        /**
         * 发票
         * */
        showInvoice: false, //  模态框
        isInvoice:false,  //  发票选中
        invoiceType:1,  //  发票类型
        invoiceTitle: undefined,  //  发票抬头
        taxNumber: undefined, //  公司税号，公司发票时必填

        //  意外险
        isInsurance:false,

        /**
         * 人数
         * */
        showModalPop: false,  //  模态框（设置人数）
        pop:{
          sum:1,  //  总人数
          grownUp: 1, //  成人
          child: 0, //  儿童
          baby: 0 //婴儿
        },
        //  模态框（入住协议）
        showProtocol: false,
        isProtocol: false,  //是否同意协议

        isService: false, //  模态框（额外服务）

        /**
         * 模态框（检查并支付）
         * */
        showPay:false,
        realCurrencySymbol: '¥',
        /**
         * 入住人
         * */
        //  模态框（入住人信息）
        showInfoPop:false,
        //模态框内容
        modalInfoPop: undefined,  //  默认（list），补充（real）， 详情（show）， 添加（add）
        isInfoPop:[],  //  选中提交的入住人
        listInfoPop:[],
        infoPopList: undefined, //  响应入住人信息
        //  预定人信息（补全）
        realInfoPop:{
          country: 0,
          realName:undefined,
          identityCardType: 1, //  类型
          idNo:undefined,  //证件号码
          telephone:undefined,
          telephoneCountryPrefix:undefined,
        },
        //  预定人信息（查看）
        realInfoPopDetail:{
          country: 0,
          name:undefined,
          identityCardType: 1, //  类型
          identificationNumber:undefined,  //证件号码
          telephone:undefined,
          telephoneCountryPrefix:undefined,
        },
        //  添加入住人
        addInfoPop:{
          country: 0,
          name:undefined,
          identityCardType: 1, //  类型
          identificationNumber:undefined,  //证件号码
          telephone:undefined,
          telephoneCountryPrefix: 86,
        },
        //  编辑入住人
        editInfoPop:{
          country: 0,
          id:undefined,
          name:undefined,
          identityCardType: 1, //  类型
          identificationNumber:undefined,  //证件号码
          telephone:undefined,
          telephoneCountryPrefix:undefined,
        },

        /**
         * 付款明细
         * */
        showPayDetail:false,
        resOrderInfo: {
          orderId: undefined,
          payExpiredSeconds: 0 //  订单超时时间
        },
        payUtilId: undefined, //  支付工具
        aliPayParams: [],  //  请求支付宝所需参数
        payExpiredInterval: undefined,    //  订单超时定时器

        wechatPayCodeInterval: undefined, //  查询PC微信二维码订单状态

        paymentUtils: [
          {
            realCurrency: '',
            amountForRealCurrency: 0
          }
        ],  //  普通订单，支付前使用本接口，获取当前系统可用支付手段,
        paymentDP: {},  //  普通订单，支付前使用本接口，获取当前系统可用支付手段,
        isActiveDP: false
      }
    },
    // watchQuery: true,
    watch: {
      $route : {
        handler (val, oldVal) {
          window.location.reload()
        },
      }
    },
    asyncData (context) {
      !context.store.state.authUser.userId && context.redirect('/');

      let [id, _selfArrivalDate, _selfDepartureDate, _selfServiceStr, pt, currency, currencyCode, currencySymbol] = [context.params.id,
        context.query.arrivalDate,
        context.query.departureDate,
        context.query.s,
        context.store.state.deviceType.type,
        context.query.currency ? context.query.currency : 0,
        context.query.currency ? context.store.state.currencyList[context.query.currency].currencyCode : 'CNY',
        context.query.currency ? context.store.state.currencyList[context.query.currency].currencySymbol : '¥'];

      if(_selfArrivalDate && _selfDepartureDate){
        /**
         * 房源详情 / 房源价格 / 国家列表
         * */
        let reqBodyPrice = {arrivalDate: _selfArrivalDate, departureDate:_selfDepartureDate};
        if(_selfServiceStr){
          reqBodyPrice.s = _selfServiceStr;
        }

        return axios.all([homestay.get({pt: pt, currency: currencyCode}, id),
          homestay.price({pt: pt, currency: currencyCode}, id, reqBodyPrice),
          system.countries({pt: pt})]).then(
          axios.spread( (data, price, countries)=>{
            if(data.data.code == 0 && countries.data.code == 0 && price.data.code == 0){

              let _selfResData = data.data.result;
              context.store.state.currencyList.find( (i) => {
                if(i.currencyCode == _selfResData.currency){
                  _selfResData['_selfCurrencySymbol'] = i.currencySymbol;
                }
              } );
              //  设置用户选中的服务
              let _selfSelectPriceServices = [];
              if(price.data.result.services){
                for(let elem of price.data.result.services.values()){
                  if(elem.quantity > 0){
                    _selfSelectPriceServices.push(elem)
                  }
                }
              }

              return {
                /**
                 * 入住日期
                 * */
                arrivalDate: _selfArrivalDate,
                departureDate: _selfDepartureDate,
                //  响应房源信息
                resData: _selfResData,

                locationInfo: (data.data.result.location.houseNumber ? data.data.result.location.houseNumber+' ' : '') +
                (data.data.result.location.vallage ? data.data.result.location.vallage+' ' : '') +
                (data.data.result.location.street ? data.data.result.location.street+' ' : '') +
                (data.data.result.location.area ? data.data.result.location.area+' ' : '') +
                (data.data.result.location.city ? data.data.result.location.city+' ' : '') +
                (data.data.result.location.province ? data.data.result.location.province+' ' : '') +
                (data.data.result.location.country ? data.data.result.location.country+' ' : ''),

                //  响应预订价格
                resPrice : price.data.result,

                //  选中的服务信息
                selectPriceServices: _selfSelectPriceServices,

                //  响应国家列表
                resCountries : countries.data.result,
                currency: currency,
                currencyCode: currencyCode,
                currencySymbol: currencySymbol
              }
            }else{
              throw data.data.msg+'/'+price.data.msg+'/'+countries.data.msg;
            }
          } )
        ).catch(
          e =>{
            context.error({ statusCode: 400, message: e })
          }
        );
      }
    },
    async mounted() {
      this.payFormAction = config.ALI_PAY_URL;

      try {
        // 预定人信息
        let { data: real } = await this.$api.user.realName({pt: this.deviceType.type}, this.authUser);
        if(real.code == 0){
          this.realInfoPop = real.result;

          this.getCheckInList()

        }else if(real.code == 20040){
          this.realInfoPop.telephone= this.userInfo.telephone;
          this.realInfoPop.telephoneCountryPrefix= this.userInfo.telephoneCountryPrefix;

          this.modalInfoPop = 'real';
        }else{
          throw real.msg
        }
      }catch (e){
        this.$toast.error(e)
      }
    },
    computed: {
      ...mapState({
        authUser: 'authUser',
        userInfo: 'userInfo',
        deviceType: 'deviceType',
        currencyList: 'currencyList'
      }),
      actuallyPayPrice(){
        let amount = this.paymentUtils[this.paymentUtils.length - 1].amountForRealCurrency;
        return this.isActiveDP ? ( (amount < this.paymentDP.payablePoints) ? 0 : (amount - this.paymentDP.payablePoints) ) : amount
      }
    },
    methods: {
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
            orderId: this.resOrderInfo.orderId,
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
      //  获取 入住人列表
      async getCheckInList(){
        try {
          let { data } = await this.$api.user.list({pt: this.deviceType.type}, this.authUser);
          if(data.code == 0){
            this.infoPopList = data.result;
            this.modalInfoPop = 'list';
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      /**
       * 入住人数
       * */
      setPop() {
        this.showModalPop = true
      },
      minGrownUp() {
        this.pop.grownUp > 1 && this.pop.grownUp--
      },
      addGrownUp() {
        this.pop.grownUp++
      },
      minChild() {
        this.pop.child > 0 && this.pop.child--
      },
      addChild() {
        this.pop.child++
      },
      minBaby() {
        this.pop.baby > 0 && this.pop.baby--
      },
      addBaby() {
        this.pop.baby++
      },
      subPop() {
        this.pop.sum = this.pop.grownUp+this.pop.child+this.pop.baby;
        this.showModalPop = false
      },
      closePop() {
        this.showModalPop = false
      },

      /**
       * 入住协议
       * */
      openProtocol() {
        if(this.isProtocol){
          this.isProtocol = false
        }else{
          this.showProtocol = true
        }
      },
      toggleProtocol() {
        this.isProtocol && (this.isProtocol = false)
      },
      subProtocol() {
        this.isProtocol = true;
        this.showProtocol = false;
      },
      closeProtocol() {
        this.showProtocol = false
      },

      /**
       * 发票
       * */
      openInvoice(){
        this.showInvoice = true
      },
      subInvoice() {

      },
      closeInvoice(){
        this.showInvoice = false
      },

      /**
       * 入住人信息
       * */
      openInfoPop(){
        this.showInfoPop = true
      },
      closeInfoPop(){
        this.showInfoPop = false;
        this.modalInfoPop = this.infoPopList? 'list' : 'real';
      },
      toggleInfoPop(type, info) {
        if(type == 'show'){
          this.realInfoPopDetail = info
        }
        if(type == 'edit'){
          this.editInfoPop = info;
          let country =  this.resCountries.find( (item) => ( item.countryName == info.country )  );
          this.editInfoPop.country = country ? country.countryCode : 0;
        }
        this.modalInfoPop = type;
      },

      /**
       *  额外服务
       * */
      allService() {
        this.isService = true
      },
      closeService() {
        this.isService = false
      },
      minServicesNum(item) {
        item.quantity > 0 && item.quantity--
      },
      addServicesNum(idx, item) {
        (item.quantity < this.resData.chargeableServices[idx].limit) && item.quantity++
      },
      subService() {
        let serviceArr = [];
        for(let elem of this.resPrice.services.values()){
          serviceArr.push(`${elem.id}-${elem.quantity}`)
        }
        this.$router.push({query:{arrivalDate:this.arrivalDate, departureDate:this.departureDate, currency: this.$route.query.currency, s: serviceArr.join()}});
        // this.isService = false
      },

      /**
       *  意外险
       * */
      async toggleInsurance(){
        this.isInsurance = !this.isInsurance;
        let reqBody = {
          arrivalDate: this.arrivalDate,
          departureDate: this.departureDate,
          s: this.$route.query.s
        };
        if(this.isInsurance){
          reqBody.accidentInsuranceCount = this.pop.grownUp
        }
        try{
          let { data } = await this.$api.homestay.price({pt: this.deviceType.type, currency: this.currencyCode}, this.$route.params.id, reqBody);
          if(data.code == 0){
            this.resPrice = data.result
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }

      },

      /**
       *  付款明细（触屏设备）
       * */
      togglePayDetail() {
        this.showPayDetail = !this.showPayDetail
      },

      /**
       *  设置预定人
       * */
      //  提交添加预定人
      async subRealAdd() {
        try{
          if(!this.realInfoPop.realName){
            throw '请输入预定人姓名'
          }
          if(!this.realInfoPop.country){
            throw '请选择预定人国籍'
          }
          if(!this.realInfoPop.idNo){
            throw '请输入证件号码'
          }
          if(!this.realInfoPop.identityCardType){
            throw '请选择证件类型'
          }

          let { data } = await this.$api.user.realAdd({pt: this.deviceType.type}, this.authUser, {
            name: this.realInfoPop.realName,
            countryCode: this.realInfoPop.country,
            identificationNumber: this.realInfoPop.idNo,
            identityCardType: this.realInfoPop.identityCardType
          });
          if(data.code == 0){

            this.getCheckInList()

          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      //  提交添加入住人
      async subInfoPop() {
        try {
          if(!this.addInfoPop.name){
            throw '请输入入住人姓名'
          }
          if(!this.addInfoPop.country){
            throw '请选择入住人国籍'
          }
          if(!this.addInfoPop.identificationNumber){
            throw '请输入证件号码'
          }
          if(!this.addInfoPop.identityCardType){
            throw '请选择证件类型'
          }

          let { data } = await this.$api.user.add({pt: this.deviceType.type}, this.authUser, {
            countryCode: this.addInfoPop.country,
            ...this.addInfoPop
          });
          if(data.code == 0){

            this.getCheckInList()

          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      //  编辑入住人
      async subInfoPopEdit() {
        try {
          if(!this.editInfoPop.name){
            throw '请输入入住人姓名'
          }
          if(!this.editInfoPop.country){
            throw '请选择入住人国籍'
          }
          if(!this.editInfoPop.identificationNumber){
            throw '请输入证件号码'
          }
          if(!this.editInfoPop.identityCardType){
            throw '请选择证件类型'
          }

          let { data } = await this.$api.user.edit({pt: this.deviceType.type}, this.authUser, {
            countryCode: this.editInfoPop.country,
            ...this.editInfoPop
          });
          if(data.code == 0){
            this.getCheckInList()
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }

      },
      //  删除入住人
      async deleteInfoPop(info) {
        try {
          let { data } = await this.$api.user.delete({pt: this.deviceType.type}, this.authUser, info.id);
          if(data.code == 0){
            this.getCheckInList()
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }

      },
      //  设置入住人列表
      setInfoPopList(){
        this.listInfoPop = this.isInfoPop;
        this.showInfoPop = false;
      },

      /**
       * 检查并支付
       * */
/*      togglePayUtilId(n){ //  切换支付工具
        this.payUtilId = n
      },*/
      setCheckInList(list) {  //  设置提交的入住人ID
        let result = [];
        for(let item of list.values()){
          result.push(item.id)
        }
        return result
      },

      async openPay() {
        if(this.resPrice.dayCount && this.listInfoPop.length && this.isProtocol){
          if(this.resOrderInfo.payExpiredSeconds > 0){
            this.showPay = true;
            this.wechatPayCodeInterval = setInterval( ()=>{
              return this.getOrderStatus()
            }, 3000);
          }else{
            try{
              let id = this.$route.params.id;
              let checkInList = await this.setCheckInList(this.listInfoPop);
              let [reqBody, reqInvoice] = [{}, undefined];
              if(this.isInvoice){
                reqInvoice = {
                  needInvoice: this.isInvoice,
                  invoiceType: this.invoiceType,
                  invoiceTitle: this.invoiceTitle,
                  taxNumber: this.taxNumber
                }
              }
              reqBody = {
                id: id,
                arrivalDate: this.arrivalDate,
                departureDate: this.departureDate,
                isBuyAccidentInsurance: this.isInsurance,
                //  needTakePet:
                checkinUserIds: checkInList.join(),
                adultsNum: this.pop.grownUp,
                childrenNum: this.pop.child,
                babiesNum: this.pop.baby,
                s: this.$route.query.s,
                // c: undefined,
                price: this.resPrice.amount,
                ...reqInvoice
              };
              this.$nuxt.$loading.start();
              let { data : order } = await this.$api.homestay.order({pt: this.deviceType.type, currency: this.currencyCode}, this.authUser, reqBody);
              this.$nuxt.$loading.finish();
              if(order.code == 0){
                this.resOrderInfo = order.result;
                this.showPay = true;

                this.payExpiredInterval = setInterval( () => {
                  if(this.resOrderInfo.payExpiredSeconds != 0){
                    this.resOrderInfo.payExpiredSeconds --;
                  }else{
                    clearInterval(this.payExpiredInterval);
                    clearInterval(this.wechatPayCodeInterval);
                    this.resOrderInfo.payExpiredSeconds = 0;
                    this.$router.push({path: `/order`, query: {currency: this.currency}})
                  }
                }, 1000 );

                //  普通订单，支付前使用本接口，获取当前系统可用支付手段
                let { data } = await this.$api.order.getUsablePaymentUtilsForCommonPay({pt: this.deviceType.type,
                  currency: this.currencyCode}, this.authUser, {
                  userId: this.authUser.userId,
                  orderId: this.resOrderInfo.orderId
                });
                if(data.code == 0){
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
                  //  非web view 去掉微信支付
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
              }else{
                throw order.msg
              }

            }catch (e){
              this.$toast.error(e)
            }
          }
        }else{
          this.$toast.error('请添加入住人并勾选协议')
        }
      },
      closePay(){
        this.showPay = false;
        this.payUtilId = undefined;
        this.wechatPayCodeInterval && clearInterval(this.wechatPayCodeInterval);
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
            let { data } = await this.$api.order.createPaymentUtilParameters({pt: this.deviceType.type,
              currency:this.currencyCode}, this.authUser, {
              orderId: this.resOrderInfo.orderId,
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

      //  获取订单状态
      async getOrderStatus(){
        try {
          let { data } = await this.$api.order.status({pt: this.deviceType.type, currency: this.currencyCode}, this.authUser, this.resOrderInfo.orderId);
          if(data.code == 0){
            if(data.result.payStatus != 1){
              clearInterval(this.wechatPayCodeInterval);
              this.$router.push({path: `/order`, query: {currency: this.currency}})
            }
          }else{
            throw data.msg
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
      }
    },
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';

  @media screen and #{$desktop-width}{
    .modal-content{
      max-height: 66%;
    }
  }

  .order{
    margin: 0;
    padding: 24px 8px;
    .order-pay{
      margin-left: 40px;
      border: 1px solid $b3;
      padding: 1rem;

    }
  }

  .set-pop-modal{
    display: flex;
    flex-direction: column;
    .modal-main{
      padding: 16px;
      >h2{
        margin-bottom: 16px;
        @include font-style(24px)
      }
      .main-pop{
        display: flex;
        flex-direction: column;
        >li{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 21px 0;
          .pop-left{
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
          .pop-right{
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
          .pop-foot{
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
  .protocol-modal{
    display: flex;
    flex-direction: column;
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
  .invoice-modal{
    display: flex;
    flex-direction: column;
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
          padding: 21px 0;
          &:not(:last-child){
            border-bottom: 1px solid $b3;
          }
          >p{
            @include font-style(16px)
          }
        }
      }
      .main-oth{
        padding: 24px 0;
        .defects{
          display: flex;
          flex-wrap: wrap;
          >li{
            >span{
              @include font-style(14px, $color:$t5);
            }
          }
        }
        >p{
          margin-bottom: 8px;
          @include font-style(16px)
        }
        >span{
          @include font-style(14px, $color:$t2);
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

  .service-modal{
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

  //  付款明细（触屏）
  .pay-detail-modal{
    .modal-main{
      padding: 16px;

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

  .list-info-pop{
    .modal-head{
      justify-content: space-between;
      >button{
        &:last-child{
          @include font-style(16px, 24px);
        }
      }
    }
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
          .item-box{
            display: block;
            &:hover{
              cursor: pointer;
            }
          }
          .item-info{
            display: flex;
            flex-direction: column;
            padding: 1rem 0;
            border-bottom: 1px solid $b3;
            >p{
              &:first-child{
                margin-bottom: 8px;
                >span{
                  display: inline-block;
                  &:first-child{
                    @include font-style(18px)
                  }
                  &:last-child{
                    @include font-style(14px, 18px)
                  }
                }
              }
              &:last-child{
                @include font-style(14px, $color:$t2);

              }
            }
          }
          .item-action{
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            .check{
              @include font-style(14px, 24px, $color:$t3);
            }
            .action-btn{
              >button{
                padding: 0 0 0 18px;
                @include font-style(14px, 24px, $color:$t3);
                background-color: $b0;
                &:first-child{
                  @include bg-image('~assets/image/icon/global_icon_edit_nor.png', 15px, 15px)
                }
                &:last-child{
                  margin-left: 24px;
                  @include bg-image('~assets/image/icon/global_icon_delete_nor.png', 15px, 15px)
                }
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

  //  预定人信息（补全）
  .real-info-pop{
    .modal-main{
      padding: 16px;
      >h2{
        @include font-style(24px)
      }
      .main-items{
        padding: 12px 0;
        >li{
          padding: 12px 0;
          .select{
            margin-top: 8px;
          }
          .item-identity{
            display: flex;
            .identity-No{
              display: flex;
              >p{
                margin: 0 32px 0 8px;
              }
            }
          }
          >p{
            @include font-style(14px);
            &.red{
              color: $t5;
            }
          }
          .item-input{
            margin-top: 8px;
            display: flex;
            >input{
              width: 100%;
              height: 39px;
              padding: 10px 0;
              border: none;
              border-bottom: 1px solid $b3;
              @include font-style(18px);
              &.prefix{
                width: 36px;
                color: $t6;
                margin-right: 16px;
                &:disabled{
                  background-color: #fff;
                }
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

  //  预定人信息（查看）
  .show-info-pop{
    @extend .real-info-pop
  }

  //  添加入住人
  .add-info-pop{
    @extend .real-info-pop
  }

  //  编辑入住人
  .edit-info-pop{
    @extend .real-info-pop
  }

  .touch-foot{
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 99;
    display: flex;
    justify-content: space-between;
    background-color: $b0;
    border-top: 1px solid $b3;
    width: 100%;
    padding: 1rem 1rem;
    .foot-left{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .money{
        @include font-style(24px, $color:$t5);
        >span{
          margin-left: 4px;
          @include font-style(12px, 24px);
          &.light{
            margin-left: 0;
            @include font-style(14px, 24px, $color:$t5);
          }
        }
      }
      >button{
        text-align: left;
        @include font-style(14px, $color:$t6);
      }
    }
    >button{
      padding: 1rem 40px;
      @include font-style(16px);
      background-color: $t4;
      border-radius: 4px;
    }
  }
</style>
