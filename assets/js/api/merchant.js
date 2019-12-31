import http from './_base'
import {baseApiParams, formInterceptor} from '../utils'

const formHttp = http;

const merchant = {
  //  商户通用
  /**
   * 获取指定用户发布的房源列表
   * params : { userId / merchantTypeId }
   * */
  merchantList : ({pt, cursor, length}, params) =>{
    let uri = `/api/v1/merchant/${params.userId}/merchantList`;
    return http.get(uri + baseApiParams({pt, cursor, length}, {}), {params:params});
  },

  /**
   * 获取商户评论列表
   * */
  comments : ({pt, cursor, length}, id) =>{
    let uri = `/api/v1/merchant/${id}/comments`;
    return http.get(uri + baseApiParams({pt, cursor, length}, {}));
  },

  /**
   * 获取商户评论列表
   * */
  getCommentsByUserId : ({pt, cursor, length}, id) =>{
    let uri = `/api/v1/merchant/${id}/getCommentsByUserId`;
    return http.get(uri + baseApiParams({pt, cursor, length}, {}));
  },

  /**
   * 提交申请房源的主类型和合作类型
   * params: { merchantTypeId, cooperationType }
   * */
  submitCooperationType : ({pt}, params) =>{
    let uri = '/api/v1/merchantMode/settleIn/submitCooperationType';
    return http.post(uri + baseApiParams({pt}, {}), params);
  },

  /**
   * 提交房屋认证证明
   * params: { applyId, certificateImage }
   * */
  submitCertificateImage : ({pt}, params) =>{
    let uri = '/api/v1/merchantMode/settleIn/submitCertificateImage';
    return http.post(uri + baseApiParams({pt}, {}), params);
  },

  /**
   * 商家行为举报
   * params: { applyId, certificateImage }
   * */
  merchantServiceReport : ({pt}, {timeDiffMills, userId, token}, params) =>{
    formHttp.interceptors.request.eject(formInterceptor);
    let uri = '/api/v1/merchant/merchantServiceReport';
    return http.post(uri + baseApiParams({pt}, {uri, timeDiffMills, userId, token}), params);
  },


  /**
   * 获取渠道商下的商家列表
   * params: { channelCode }
   * */
  merchantListOfChannel : ({pt}, channelCode) =>{
    let uri = '/api/v1/merchantListOfChannel';
    return http.get(uri + baseApiParams({pt}, {}), {params: {channelCode: channelCode}});
  },


};

export default merchant
