import { getDeviceType } from '~/assets/js/utils'

/**
 *  判断设备类型
 * */
export default (context)=>{
  context.userAgent = process.server
    ? context.req.headers["user-agent"]
    : navigator.userAgent;
  // 给全局上下文添加一个属性来保存返回的匹配信息

  if(parseInt(context.store.state.deviceType.type) !== 5){
    context.store.commit("SET_DEVICE_TYPE", getDeviceType(context.userAgent));
  }
  // context.deviceType = getDeviceType(context.userAgent);

  /**
   * 3 WEB_PC
     4 WEB_Mobile (env: android/iOS)
   * */
  if (parseInt(context.store.state.deviceType.type) === 3) {
    // return context.redirect()
  }
}
