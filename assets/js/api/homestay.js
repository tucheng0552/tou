import http from './_base'
import { baseApiParams } from '../utils'

const homestay = {
  /**
   * 民宿搜索
   * */
  search : ({pt, cursor, length, currency}, params) =>{
    let uri = '/api/v1/homestay/search';
    return http.get(uri + baseApiParams({pt, cursor, length, currency}, {}), {params:params});
  },

  /**
   * 民宿搜索统计数据
   * */
  counter : ({pt, currency}, params) =>{
    let uri = '/api/v1/homestay/search/counter';
    return http.get(uri + baseApiParams({pt, currency}, {}), {params:params});
  },

  /**
   * 民宿详情
   * */
  get : ({pt, currency}, id) =>{
    let uri = `/api/v1/homestay/${id}`;
    return http.get(uri + baseApiParams({pt, currency}, {}));
  },

  /**
   * 获取民宿房型预定价格列表
   * params: { id: 民宿id, arrivalDate: 入住日期, departureDate: 离店日期 }
   * */
  priceList : ({pt, currency}, params) =>{
    let uri = `/api/v1/homestay/${params.id}/priceList`;
    return http.get(uri + baseApiParams({pt, currency}, {}), {params:params});
  },

  /**
   * 获取预定价格
   * params: { arrivalDate: 入住日期, departureDate: 离店日期 }
   * */
  price : ({pt, currency}, id, params) =>{
    let uri = `/api/v1/homestay/${id}/price`;
    return http.get(uri + baseApiParams({pt, currency}, {}), {params:params});
  },

  /**
   * 获取民宿可预定日历
   * */
  calendar : ({pt, currency}, id) =>{
    let uri = `/api/v1/homestay/${id}/calendar`;
    return http.get(uri + baseApiParams({pt, currency}, {}));
  },

  /**
   * 民宿预定
   * params: { arrivalDate: 入住日期, departureDate: 离店日期 }
   * */
  order : ({pt, currency}, {timeDiffMills, userId, token}, params) =>{
    let uri = `/api/v1/homestay/${params.id}/order`;
    return http.post(uri + baseApiParams({pt, currency}, {uri, timeDiffMills, userId, token}), params);
  },

};

export default homestay
