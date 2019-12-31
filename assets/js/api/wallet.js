import http from './_base'
import { baseApiParams } from '../utils'

const wallet = {
  /**
   * 帐单列表
   * params: {  }
   * */
  getBillList : ({pt}, params) =>{
    let uri = `/api/v1/wallet/getBillList/${params.uid}`;
    return http.get(uri+ baseApiParams({pt}, {}), {params: params})
  },

  /**
   * 获取用户钱包信息
   * params: {  }
   * */
  getAssetSummaryInfo : ({pt}, uid) =>{
    let uri = `/api/v1/wallet/getAssetSummaryInfo/${uid}`;
    return http.get(uri+ baseApiParams({pt}, {}))
  },

  /**
   * 帐单详情
   * params: {  }
   * */
  getBillDetail : ({pt}, params) =>{
    let uri = `/api/v1/wallet/getBillDetail/${params.uid}`;
    return http.get(uri+ baseApiParams({pt}, {}), {params: params})
  },

  /**
   * 获取用户DP收支列表
   * params: {  }
   * */
  getVirtualPointList : ({pt}, uid) =>{
    let uri = `/api/v1/wallet/getVirtualPointList/${uid}`;
    return http.get(uri+ baseApiParams({pt}, {}))
  },

  /**
   * 获取卡券列表
   * params: {  }
   * */
  getGiftCardList : ({pt}, {timeDiffMills, userId, token}) =>{
    let uri = `/api/v1/wallet/card/getGiftCardList`;
    return http.get(uri+ baseApiParams({pt}, {uri, timeDiffMills, userId, token}))
  },

  /**
   * 获取卡券列表
   * params: {  }
   * */
  buyGiftCard : ({pt}, params) =>{
    let uri = `/api/v1/wallet/card/buyGiftCard`;
    return http.post(uri+ baseApiParams({pt}, {}), params)
  }

};

export default wallet
