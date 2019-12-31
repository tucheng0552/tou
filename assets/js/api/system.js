import http from './_base'
import { baseApiParams } from '../utils'

const system = {
  /**
   * 获取最新搜索条件
   * */
  filter : ({pt}) =>{
    let uri = '/api/v1/system/filter/1';
    return http.get(uri + baseApiParams({pt}, {}));
  },

  /**
   * 获取国家列表
   * */
  countries : ({pt}) =>{
    let uri = '/api/v1/geo/countries';
    return http.get(uri + baseApiParams({pt}, {}));
  },

  /**
   * 获取省份列表
   * params: { countryCode}
   * */
  provinces : ({pt}, countryCode) =>{
    let uri = '/api/v1/geo/provinces';
    return http.get(uri + baseApiParams({pt}, {}), {params:{countryCode:countryCode}});
  },

  /**
   * 获取城市列表
   * params: { countryCode, provinceCode}
   * */
  cities : ({pt}, params) =>{
    let uri = '/api/v1/geo/cities';
    return http.get(uri + baseApiParams({pt}, {}), {params:params});
  },

  /**
   * 获取地区列表
   * params: { countryCode, provinceCode}
   * */
  areas : ({pt}, params) =>{
    let uri = '/api/v1/geo/areas';
    return http.get(uri + baseApiParams({pt}, {}), {params:params});
  },

  /**
   * 获取商户服务行为举报类型列表
   *
   * */
  merchantServiceReportTypeList : ({pt}, {timeDiffMills, userId, token}) =>{
    let uri = '/api/v1/system/merchantServiceReportTypeList';
    return http.get(uri + baseApiParams({pt}, {uri, timeDiffMills, userId, token}));
  },

  /**
   * 获取用户言论行为举报类型列表
   *
   * */
  userExpressionReportTypeList : ({pt}, {timeDiffMills, userId, token}) =>{
    let uri = '/api/v1/system/userExpressionReportTypeList';
    return http.get(uri + baseApiParams({pt}, {uri, timeDiffMills, userId, token}));
  },

  /**
   * 获取系统货币列表
   *
   * */
  currencyList : () =>{
    let uri = '/api/v1/system/currencyList';
    return http.get(uri + baseApiParams({}, {}));
  },
};

export default system
