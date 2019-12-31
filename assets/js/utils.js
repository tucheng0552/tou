//  加载 MD5 模块
import md5 from 'md5'
import axios from 'axios'
import CryptoJS from "crypto-js";
import config from './config'
/**
 *  通用工具类
 * */

/**
 *  通用接口签名
 * */
const baseApiSign = ({uri, timestamp, userId, token}) => {
  let sign = uri + timestamp + userId + token;
  return md5(sign)
};

/**
 *  通用接口参数
 *  params: {ver(版本号), pt(平台类型), cursor(列表当前位置), length(列表长度), lang(语言:zh-cn)}
 * */
const baseApiParams = ({ ver=13, pt=3 || 4, cursor=0, length=10, lang='zh', currency='CNY'}, {uri, timeDiffMills, userId, token}) => {

  let result = `?ver=${ver}&pt=${pt}&cursor=${cursor}&length=${length}&lang=${lang}&currency=${currency ? currency : 'CNY'}`;
  //  判断是非为游客模式，否则不添加签名
  if(uri && userId && token){
    let timestamp = new Date().getTime() - parseInt(timeDiffMills);
    result += `&timestamp=${timestamp}&userId=${userId}&sign=${baseApiSign({uri, timestamp, userId, token})}`;
  }
  return result
};

/**
 *  设备类型
 *  return type: 设备类型（3 WEB_PC
 4 WEB_Mobile）
 *          env: 访问环境（android/iOS/微信/QQ/微博）
 * */
const getDeviceType = (UA) =>{
  const isWechat = /MicroMessenger/i;
  const isWeibo = /Weibo/i;
  const isQQ = /QQ/i;
  const isMoible = /(Android|webOS|iPhone|iPad|iPod|tablet|BlackBerry|Mobile)/i;
  const isIOS = /iPhone|iPad|iPod/i;
  const isAndroid = /Android/i;
  if(isMoible.test(UA)){
    if(isAndroid.test(UA)){
      return {
        type: 4,
        env: 'android'
      }
    }
    if(isIOS.test(UA)){
      return {
        type: 4,
        env: 'iOS'
      }
    }
    return {
      type: 4
    }
  }else{
    return {
      type: 3
    }
  }
};

/**
 *  设置评分星级
 *  params : rateAmount（评级对象）
 *  return : rateItems（评级样式 Array）
 * */
const setRateItems = (rate)=> {
  let rateItems= new Array(5).fill(undefined);
  let rateNum;
  if(rate){
    rateNum = rate;
    if(rateNum<1){
      if(Math.round(rateNum)>rateNum){
        rateItems.fill('u-icon-star-half', 0, 1).fill('u-icon-star-nor',1, 5)
      }else{
        rateItems.fill('u-icon-star-nor', 0, 5)
      }
    }else if(rateNum<5){
      let rateInt = Math.floor(rateNum);
      rateItems.fill('u-icon-star-sle', 0, rateInt);
      if(Math.round(rateNum)>rateNum){
        rateItems.fill('u-icon-star-half', rateInt, rateInt+1);
        rateItems.fill('u-icon-star-nor', rateInt+1, 5);
      }else{
        rateItems.fill('u-icon-star-nor', rateInt, 5);
      }
    }else{
      rateItems.fill('u-icon-star-sle', 0, 5)
    }
  }else{
    rateItems.fill('u-icon-star-sle', 0, 5)
  }
  return rateItems
};

/**
 *  设置订单状态
 * */
const setOrderStatus = (item) => {
  let [orderStatus, payStatus] = [item.orderStatus, item.payStatus];
  switch (payStatus){
    case 1:
    case 2: {
      switch (orderStatus) {
        case 1: {
          return 0; // 待付款
        }
          break;
        case 2: {
          if (payStatus == 1) {
            return 1; // 待付款（房东确认中）
          } else {
            return 4; // 已付款（房东确认中）
          }
        }
          break;
        case 3: {
          if (payStatus == 1) {
            return 2; // 待付款（房东已确认）
          } else {
            return 7; // 等待入住
          }
        }
          break;
        case 4: {
          if (payStatus == 1) {
            return 14;  // 已取消
          } else {
            return 13;  // 已退款
          }
        }
          break;
        case 5: {
          if (payStatus == 1) {
            return 14;  // 已取消
          } else {
            return 13;  // 已退款
          }
        }
          break;
        case 6: {
          return 14;  // 已取消
        }
          break;
        case 7: {
          return 13;  // 已退款
        }
          break;
        case 8: {
          return 14;  // 已取消
        }
          break;
        case 9: {
          return 7;  // 等待入住
        }
          break;
        case 10: {
          return 8; // 已入住
        }
          break;
        case 11: {
          return 9; // 争议处理中
        }
          break;
        case 12: {
          return 10;  // 待评价
        }
          break;
        case 13: {
          return 9; // 争议处理中
        }
          break;
        case 14: {
          return 10;  // 待评价
        }
          break;
        case 15: {
          return 11;  // 已评价
        }
          break;
        default: {
          return 12;  // 已完成
        }
          break;
      }
    }
      break;
    case 8:
    case 9: {
      return 15; // 退款中
    }
      break;
    default: {
      return 13; // 已退款
    }
      break;
  }

};

/**
 * 生成微信登录二维码
 * */
const weChatLogin = (a)=> {
  let c = "default";
  a.self_redirect === !0 ? c = "true" : a.self_redirect === !1 && (c = "false");
  let d = document.createElement("iframe"),
    e = "https://open.weixin.qq.com/connect/qrconnect?appid=" + a.appid + "&scope=" + a.scope + "&redirect_uri=" + a.redirect_uri + "&state=" + a.state + "&login_type=jssdk&self_redirect=" + c;
  e += a.style ? "&style=" + a.style : "", e += a.href ? "&href=" + a.href : "",
    d.src = e, d.frameBorder = "0", d.allowTransparency = "true",
    d.scrolling = "no", d.width = "300px", d.height = "400px";
  let f = document.getElementById(a.id);
  f.appendChild(d);
};

/**
 *  重置表单请求的拦截器
 * */
const formInterceptor = axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error);
});

//  正则密码
const REG_EXP_PWD = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/;
//  正则手机
const REG_EXP_PHONE = /^\d{11}$/;

//  AES加密
const aesDecrypt = (pwd) => {
  let [key, iv] = [CryptoJS.enc.Utf8.parse(config.AES_KEY), CryptoJS.enc.Utf8.parse(config.AES_iv)];

  return CryptoJS.AES.encrypt(pwd, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC
  }).toString();
};

const formatDuring = (s) => {
  let minutes = parseInt((s % (1000 * 60 * 60)) / (1000 * 60)) <10 ? '0'+parseInt((s % (1000 * 60 * 60)) / (1000 * 60)) : parseInt((s % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = ((s % (1000 * 60)) / 1000 < 10) ? ('0'+(s % (1000 * 60)) / 1000) : (s % (1000 * 60)) / 1000;
  return minutes + ":" + seconds;
};

export {
  baseApiParams,
  getDeviceType,
  setRateItems,
  weChatLogin,
  setOrderStatus,
  formInterceptor,
  REG_EXP_PWD,
  REG_EXP_PHONE,
  aesDecrypt,
  formatDuring
}
