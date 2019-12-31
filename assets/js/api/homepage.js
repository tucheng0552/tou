import http from './_base'
import { baseApiParams } from '../utils'

const homepage = {

  /**
   * 获取首页数据
   * */
  data : ({pt, currency}) =>{
    let uri = '/api/v1/homepage/data';
    return http.get(uri + baseApiParams({pt, currency}, {}));
  },

  /**
   * 首页-toU推荐
   * */
  getRecommendMerchants : ({pt, cursor, length, currency}) =>{
    let uri = '/api/v1/homepage/getRecommendMerchants';
    return http.get(uri+ baseApiParams({pt, cursor, length, currency}, {}))
  },

  /**
   * 全局搜索&附近
   * */
  search : ({pt, currency}, params) =>{
    let uri = '/api/v1/search';
    return http.get(uri+ baseApiParams({pt, currency}, {}), {params:params})
  },

  /**
   * 搜索输入补全
   * */
  tips : ({pt, currency}, params) =>{
    let uri = '/api/v1/search/tips';
    return http.get(uri+ baseApiParams({pt, currency}, {}), {params:params})
  },

};

export default homepage
