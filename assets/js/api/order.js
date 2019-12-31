import http from './_base'
import { baseApiParams } from '../utils'

const order = {

  /**
   * 获取用户的订单列表
   * params: {  }
   * */
  list : ({pt, cursor, 	length, currency}, {timeDiffMills, userId, token}) =>{
    let uri = `/api/v1/order/list`;
    return http.get(uri+ baseApiParams({pt, cursor, length, currency}, {uri, timeDiffMills, userId, token}), {params:{userId:userId}})
  },

  /**
   * 获取订单详情
   * params: {  }
   * */
  detail : ({pt}, {timeDiffMills, userId, token}, orderId) =>{
    let uri = `/api/v1/order/detail`;
    return http.get(uri+ baseApiParams({pt}, {uri, timeDiffMills, userId, token}), {params:{orderId:orderId}})
  },

  /**
   * 获取订单状态
   * params: {  }
   * */
  status : ({pt, currency}, {timeDiffMills, userId, token}, orderId) =>{
    let uri = `/api/v1/order/status`;
    return http.get(uri+ baseApiParams({pt, currency}, {uri, timeDiffMills, userId, token}), {params:{orderId:orderId}})
  },

  /**
   * 取消订单
   * params: {  }
   * */
  cancel : ({pt}, {timeDiffMills, userId, token}, orderId) =>{
    let uri = `/api/v1/order/cancel`;
    return http.post(uri+ baseApiParams({pt}, {uri, timeDiffMills, userId, token}), {orderId: orderId})
  },

  /**
   * 删除订单(用户端)
   * params: {  }
   * */
  delete : ({pt}, {timeDiffMills, userId, token}, orderId) =>{
    let uri = `/api/v1/order/delete`;
    return http.post(uri+ baseApiParams({pt}, {uri, timeDiffMills, userId, token}), {orderId: orderId})
  },

  /**
   * 获取退款预计信息
   * params: {  }
   * */
  refundInfo : ({pt}, params) =>{
    let uri = `/api/v1/order/${params.orderId}/refundInfo`;
    return http.get(uri+ baseApiParams({pt}, {}), {params:params})
  },

  /**
   * 申请退款
   * params: {  }
   * */
  refund : ({pt}, {timeDiffMills, userId, token}, orderId) =>{
    let uri = `/api/v1/order/refund`;
    return http.post(uri+ baseApiParams({pt}, {uri, timeDiffMills, userId, token}), {orderId: orderId})
  },

  /**
   * 获取支付信息
   * params: {  }
   * */
  createPaymentUtilParameters : ({pt, currency}, {timeDiffMills, userId, token}, params) =>{
    let uri = `/api/v1/order/${params.orderId}/createPaymentUtilParameters`;
    return http.get(uri+ baseApiParams({pt, currency}, {uri, timeDiffMills, userId, token}), {params:params})
  },

  /**
   * 普通订单，支付前使用本接口，获取当前系统可用支付手段
   * params: { userId,  orderId }
   * */
  getUsablePaymentUtilsForCommonPay : ({pt, currency}, {timeDiffMills, userId, token}, params) =>{
    let uri = `/api/v1/order/getUsablePaymentUtilsForCommonPay`;
    return http.post(uri+ baseApiParams({pt, currency}, {uri, timeDiffMills, userId, token}), params)
  },

  /**
   * 获取可用支付工具列表
   * params: {  }
   * */
  paymentUtils : ({pt}) =>{
    let uri = `/api/v1/order/paymentUtils`;
    return http.get(uri+ baseApiParams({pt}, {}))
  },

  /**
   * 联系房东
   * params: {  }
   * */
  contactWithOwner : ({pt}, {timeDiffMills, userId, token}, orderId) =>{
    let uri = `/api/v1/order/contactWithOwner`;
    return http.post(uri+ baseApiParams({pt}, {uri, timeDiffMills, userId, token}), {orderId: orderId})
  },

  /**
   * 入住凭证(即订单二维码或凭证码)
   * params: {  }
   * */
  checkInVoucher : ({pt}, {timeDiffMills, userId, token}, orderId) =>{
    let uri = `/api/v1/order/checkInVoucher`;
    return http.post(uri+ baseApiParams({pt}, {uri, timeDiffMills, userId, token}), {orderId: orderId})
  },

  /**
   * 订单评价
   * params: {  }
   * */
  comment : ({pt}, {timeDiffMills, userId, token}, params) =>{
    let uri = `/api/v1/order/comment`;
    return http.post(uri+ baseApiParams({pt}, {uri, timeDiffMills, userId, token}), params)
  },

  /**
   * 订单追评
   * params: {  }
   * */
  chaseComment : ({pt}, {timeDiffMills, userId, token}, params) =>{
    let uri = `/api/v1/order/chaseComment`;
    return http.post(uri+ baseApiParams({pt}, {uri, timeDiffMills, userId, token}), params)
  },


  /**
   * 渠道商支付订单
   * params: { @param channelCode  渠道代码 String
@param storefrontId 下单店铺 ID  Integer
@param payTools     支付工具。 Integer
    97 乾易付-微信 APP;
    96 乾易付-支付宝 APP;
    95 包括 pc web 和 手机 web;
    94 乾易付-支付宝-WEB;
@param amount 以分为单位。 Long }
   * */
  submitChannelPayOrder : ({pt}, {timeDiffMills, userId, token}, params) =>{
    let uri = `/api/v1/submitChannelPayOrder`;
    return http.post(uri+ baseApiParams({pt}, {uri, timeDiffMills, userId, token}), params)
  },


};

export default order
