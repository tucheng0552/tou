import http from './_base'
import { baseApiParams } from '../utils'

const hotel = {
  /**
   * 民宿搜索
   * */
  search : ({pt, cursor, length, currency}, params) =>{
    let uri = '/api/v1/hotel/search';
    return http.get(uri + baseApiParams({pt, cursor, length, currency}, {}), {params:params});
  },

  /**
   * 民宿详情
   * */
  get : ({pt, currency}, id) =>{
    let uri = `/api/v1/hotel/${id}`;
    return http.get(uri + baseApiParams({pt, currency}, {}));
  },

  /**
   * 获取所有房型预定价格列表
   * params: { id: 民宿id, arrivalDate: 入住日期, departureDate: 离店日期 }
   * */
  roomTypePriceList : ({pt,currency}, params) =>{
    let uri = `/api/v1/hotel/${params.id}/roomTypePriceList`;
    return http.get(uri + baseApiParams({pt,currency}, {}), {params:params});
  },

  /**
   * 获取预定价格
   * params: { arrivalDate: 入住日期, departureDate: 离店日期 }
   * */
  price : ({pt,currency}, merchantId, roomTypeId, params) =>{
    let uri = `/api/v1/hotel/${merchantId}/roomType/${roomTypeId}/price`;
    return http.get(uri + baseApiParams({pt,currency}, {}), {params:params});
  },

  /**
   * 获取民宿可预定日历
   * */
  calendar : ({pt, currency}, merchantId, roomType) =>{
    let uri = `/api/v1/hotel/${merchantId}/roomType/${roomType}/calendar`;
    return http.get(uri + baseApiParams({pt, currency}, {}));
  },

  /**
   * 民宿预定
   * params: { arrivalDate: 入住日期, departureDate: 离店日期 }
   * */
  order : ({pt, currency}, {timeDiffMills, userId, token}, params) =>{
    let uri = `/api/v1/hotel/${params.id}/roomType/${params.roomTypeId}/order`;
    return http.post(uri + baseApiParams({pt, currency}, {uri, timeDiffMills, userId, token}), params);
  },

  /**
   * 民宿搜索统计数据
   * */
  counter : ({pt}, params) =>{
    let uri = '/api/v1/hotel/search/counter';
    return http.get(uri + baseApiParams({pt}, {}), {params:params});
  },
};

export default hotel
