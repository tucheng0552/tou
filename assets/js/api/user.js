import http from './_base'
import { baseApiParams, formInterceptor } from '../utils'

const formHttp = http;

const user = {
  /**
   * 密码登录
   * params: { timestamp（当前时间戳）, telephoneCountryPrefix(86), telephone, SHA256(password).toLocaleUpperCase() }
   * */
  loginByPwd : ({pt}, params) =>{
    let uri = '/api/v1/user/loginByPwd';
    return http.post(uri+ baseApiParams({pt}, {}), params)
  },

  /**
   * 验证码登录
   * params: { timestamp（当前时间戳）, telephoneCountryPrefix(86), telephone, authCode }
   * */
  loginByAuthCode : ({pt}, params) =>{
    let uri = '/api/v1/user/loginByAuthCode';
    return http.post(uri+ baseApiParams({pt}, {}), params)
  },

  /**
   * 获取验证码(未登陆时可以使用)
   * params: { telephoneCountryPrefix(86), telephone, neetNotUsed(0 || 1 || 2) }
   * */
  authCode : ({pt}, params) =>{
    let uri = '/api/v1/user/authCode';
    return http.post(uri+ baseApiParams({pt}, {}), params)
  },

  /**
   * 获取验证码(登陆后可以使用)
   * params: { telephoneCountryPrefix(86), telephone, neetNotUsed(0 || 1 || 2), mustBeSelf(0 || 1) }
   * */
  authCodeForLogin : ({pt}, {timeDiffMills, userId, token}, params) =>{
    let uri = '/api/v1/user/authCodeForLogin';
    return http.post(uri + baseApiParams({pt}, {uri, timeDiffMills, userId, token}), params)
  },

  /**
   * 验证码校验
   * */
  checkAuthCode : ({pt}, params) =>{
    let uri = '/api/v1/user/checkAuthCode';
    return http.post(uri + baseApiParams({pt}, {}), params)
  },

  /**
   * 手机密码注册用户
   * params: { telephoneCountryPrefix(86), telephone, SHA256(password).toLocaleUpperCase(), authCode }
   * */
  regist : ({pt}, params) =>{
    let uri = '/api/v1/user/regist';
    return http.post(uri+ baseApiParams({pt}, {}), params)
  },

  /**
   * 修改登录密码
   * params: { oldPassword, newPassword }
   * */
  modifyLoginPwd : ({pt}, {timeDiffMills, userId, token}, params) =>{
    let uri = '/api/v1/user/modifyLoginPwd';
    return http.post(uri + baseApiParams({pt}, {uri, timeDiffMills, userId, token}), params)
  },

  /**
   * 忘记登录密码
   * params: { 	telephoneCountryPrefix(86), telephone, password, authCode }
   * */
  forgetLoginPwd : ({pt}, params) =>{
    let uri = '/api/v1/user/forgetLoginPwd';
    return http.post(uri + baseApiParams({pt}, {}), params)
  },

  /**
   * 变更手机号码
   * params: { 	telephoneCountryPrefix(86), telephone, authCode, newTelephoneCountryPrefix, newTelephone, newAuthCode }
   * */
  changeTelephone : ({pt}, {timeDiffMills, userId, token}, params) =>{
    let uri = '/api/v1/user/changeTelephone';
    return http.post(uri + baseApiParams({pt}, {uri, timeDiffMills, userId, token}), params)
  },

  /**
   * 获取我的用户信息
   * params: { userId }
   * */
  myProfile : ({pt}, {timeDiffMills, userId, token}) =>{
    let uri = '/api/v1/user/myProfile';
    return http.get(uri + baseApiParams({pt}, {uri, timeDiffMills, userId, token}))
  },

  /**
   * 获取预定人信息(APP用户的实名信息)
   * */
  realName : ({pt}, {timeDiffMills, userId, token}) =>{
    let uri = '/api/v1/user/realName';
    return http.get(uri + baseApiParams({pt}, {uri, timeDiffMills, userId, token}))
  },

  /**
   * 添加预定人信息(APP用户的实名信息)
   * */
  realAdd : ({pt}, {timeDiffMills, userId, token}, params) =>{
    let uri = '/api/v1/user/realName/add';
    return http.post(uri + baseApiParams({pt}, {uri, timeDiffMills, userId, token}), params)
  },

  /**
   * 获取入住人列表
   * params: { name }
   * */
  list : ({pt}, {timeDiffMills, userId, token}) =>{
    let uri = '/api/v1/user/checkinUser/list';
    return http.get(uri + baseApiParams({pt}, {uri, timeDiffMills, userId, token}))
  },

  /**
   * 添加入住人
   * params: { name }
   * */
  add : ({pt}, {timeDiffMills, userId, token}, params) =>{
    let uri = '/api/v1/user/checkinUser/add';
    return http.post(uri + baseApiParams({pt}, {uri, timeDiffMills, userId, token}), params)
  },

  /**
   * 修改入住人
   * params: { id }
   * */
  edit : ({pt}, {timeDiffMills, userId, token}, params) =>{
    let uri = `/api/v1/user/checkinUser/${params.id}/edit`;
    return http.post(uri + baseApiParams({pt}, {uri, timeDiffMills, userId, token}), params)
  },

  /**
   * 删除入住人
   * params: { id }
   * */
  delete : ({pt}, {timeDiffMills, userId, token}, id) =>{
    let uri = `/api/v1/user/checkinUser/${id}/delete`;
    return http.delete(uri + baseApiParams({pt}, {uri, timeDiffMills, userId, token}))
  },

  /**
   * 获取普通用户主页信息
   * params: { id }
   * */
  homepage : ({pt}, targetUserId, userId) =>{
    let uri = `/api/v1/user/homepage/${targetUserId}`;
    return http.get(uri + baseApiParams({pt}, {}), {params: {userId: userId}})
  },

  /**
   * 获取商户用户主页信息
   * params: { id }
   * */
  merchantHomepage : ({pt}, id, userId) =>{
    let uri = `/api/v1/user/merchantHomepage`;
    return http.get(uri + baseApiParams({pt}, {}), {params:{targetUserId: id, userId: userId}})
  },

  /**
   * 获取指定用户的粉丝列表
   * params: { id }
   * */
  fansList : ({pt, cursor, length}, targetUserId) =>{
    let uri = `/api/v1/user/fansList/${targetUserId}`;
    return http.get(uri + baseApiParams({pt, cursor, length}, {}))
  },

  /**
   * 关注用户
   * params: { id }
   * */
  follow : ({pt}, {timeDiffMills, userId, token}, targetUserId) =>{
    let uri = `/api/v1/user/follow`;
    return http.post(uri + baseApiParams({pt}, {uri, timeDiffMills, userId, token}), {userId: userId, targetUserId: targetUserId})
  },

  /**
   * 取消关注用户
   * params: { id }
   * */
  unFollow : ({pt}, {timeDiffMills, userId, token}, targetUserId) =>{
    let uri = `/api/v1/user/unFollow`;
    return http.post(uri + baseApiParams({pt}, {uri, timeDiffMills, userId, token}), {userId: userId, targetUserId: targetUserId})
  },

  /**
   * 获取指定用户的关注人列表
   * params: { id }
   * */
  followsList : ({pt, cursor, length}, targetUserId) =>{
    let uri = `/api/v1/user/followsList/${targetUserId}`;
    return http.get(uri + baseApiParams({pt, cursor, length}, {}))
  },

  /**
   * 获取用户消息和通知信息
   * params: { msgType }
   * */
  messages : ({pt, cursor, length}, {timeDiffMills, userId, token}, msgType) =>{
    let uri = `/api/v1/user/messages`;
    return http.get(uri + baseApiParams({pt, cursor, length}, {uri, timeDiffMills, userId, token}), {params:{msgType: msgType}})
  },

  /**
   * 获取用户已邀请好友列表
   * params: { userId }
   * */
  inviteList : ({pt, cursor, length}, {timeDiffMills, userId, token}) =>{
    let uri = `/api/v1/user/inviteList`;
    return http.get(uri + baseApiParams({pt, cursor, length}, {uri, timeDiffMills, userId, token}))
  },

  /**
   * 获取用户收藏夹
   * params: { userId }
   * */
  favorites : ({pt, cursor, length}, {timeDiffMills, userId, token}, favoriteType) =>{
    let uri = `/api/v1/user/favorites`;
    return http.get(uri + baseApiParams({pt, cursor, length}, {uri, timeDiffMills, userId, token}), {params:{favoriteType:favoriteType}})
  },

  /**
   * 获取用户持有的优惠券列表
   * params: { userId }
   * */
  getUserCouponList : ({pt, cursor, length}, {timeDiffMills, userId, token}) =>{
    let uri = `/api/v1/coupon/getUserCouponList`;
    return http.get(uri + baseApiParams({pt, cursor, length}, {uri, timeDiffMills, userId, token}))
  },

  /**
   * 修改用户基础信息
   * params: {  }
   * */
  modifyBaseInfo : ({pt}, {timeDiffMills, userId, token}, params) =>{
    let uri = `/api/v1/user/modifyBaseInfo`;
    return http.post(uri + baseApiParams({pt}, {uri, timeDiffMills, userId, token}), params)
  },

  /**
   * 修改用户介绍信息
   * params: { introduction }
   * */
  modifyIntroInfo : ({pt}, {timeDiffMills, userId, token}, params) =>{
    let uri = `/api/v1/user/modifyIntroInfo`;
    return http.post(uri + baseApiParams({pt}, {uri, timeDiffMills, userId, token}), params)
  },

  /**
   * 修改用户头像
   * params: {  }
   * */
  modifyAvatar : ({pt}, {timeDiffMills, userId, token}, params) =>{
    formHttp.interceptors.request.eject(formInterceptor);
    let uri = `/api/v1/user/modifyAvatar`;
    return formHttp.post(uri + baseApiParams({pt}, {uri, timeDiffMills, userId, token}), params)
  },

  /**
   * 用户言论举报
   * params: {  }
   * */
  userExpressionReport : ({pt}, {timeDiffMills, userId, token}, params) =>{
    formHttp.interceptors.request.eject(formInterceptor);
    let uri = `/api/v1/user/userExpressionReport`;
    return formHttp.post(uri + baseApiParams({pt}, {uri, timeDiffMills, userId, token}), params)
  },

  /**
   * 修改用户介绍信息
   * params: { introduction }
   * */
  setTransactionPwd : ({pt}, params) =>{
    let uri = `/api/v1/user/setTransactionPwd`;
    return http.post(uri + baseApiParams({pt}, {}), params)
  },

  /**
   * 修改用户交易密码
   * params: { introduction }
   * */
  modifyTransactionPwd : ({pt}, params) =>{
    let uri = `/api/v1/user/modifyTransactionPwd`;
    return http.post(uri + baseApiParams({pt}, {}), params)
  },

  /**
   * 修改用户交易密码
   * params: { introduction }
   * */
  resetTransactionPwd : ({pt}, params) =>{
    let uri = `/api/v1/user/resetTransactionPwd`;
    return http.post(uri + baseApiParams({pt}, {}), params)
  },
};

export default user
