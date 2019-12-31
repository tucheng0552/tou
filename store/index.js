
// window.fetch() 的 Polyfill
// require('whatwg-fetch');

export const state = () => ({
  authUser: {
    timeDiffMills: undefined,
    token: undefined,
    userId: undefined
  },
  userInfo: {
    userName:undefined,
    faceUrl:undefined
  },
  //  设备类型
  deviceType: {
    type: undefined,
    env: undefined
  },
  //  模态框（登录）
  showModalLogin: false,

  currencyList: [],
  //  搜索内容
  // searchText:''
});

export const mutations = {
  SET_AUTH_USER (state, authUser) {
    state.authUser = authUser
  },
  SET_DEVICE_TYPE (state, deviceType) {
    state.deviceType = deviceType
  },
  TOGGLE_MODAL_LOGIN (state) {
    state.showModalLogin = !state.showModalLogin
  },
  SET_USER_INFO (state, userInfo){
    state.userInfo = userInfo
  },

  SET_CURRENCY_LIST (state, currencyList){
    state.currencyList = currencyList
  },

  /*SET_SEARCH_TEXT(state, text){
    state.searchText = text
  }*/
};

export const actions= {
  nuxtServerInit ({ commit }, { req }) {
    if (req.session && req.session.authUser) {
      commit('SET_AUTH_USER', req.session.authUser);
      commit('SET_USER_INFO', req.session.userInfo)
    }

    if (req.session && req.session.deviceType){
      commit('SET_DEVICE_TYPE', req.session.deviceType);
    }

  }
};
