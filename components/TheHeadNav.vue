<template>
  <div style="height: 73px;">
    <header class="head" @click="searchInputBlur">
      <nav class="navbar head-nav" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <nuxt-link class="navbar-item nav-logo" :to="'/home'+addPathQuery()">
            <img src="~/assets/image/icon/nav_icon_logo.png" >
          </nuxt-link>

          <div class="navbar-item brand-search">
            <div class="nav-search">
              <!--  search-text -->
              <input type="search" placeholder="目的地、城市或景点" class="input" ref="searchInput"
                     v-model="searchText"
                     @focus="openTips" @input="getTips" @keyup.enter="searchIndex(searchText)"> <!--  @blur="closeTips" -->
            </div>
          </div>

          <a role="button" :class="[showMenu ? 'is-active' : '', 'navbar-burger', 'burger']" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" @click="toggleMenu">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>

        </div>

        <div id="navbarBasicExample" :class="[showMenu ? 'is-active' : '', 'navbar-menu']">
          <!--        <div class="navbar-start">

                  </div>-->

          <div :class="[authUser.userId ? 'navbar-end-padding' : 'navbar-end-default', 'navbar-end']" @click="toggleMenu">
            <nuxt-link :to="'/home'+addPathQuery()" class="navbar-item">首页</nuxt-link>
            <nuxt-link :to="'/experiences'" class="navbar-item">足迹</nuxt-link>
            <nuxt-link :to="'/order'+addPathQuery()" class="navbar-item">订单</nuxt-link>
            <a href="http://www.sztou.cn" class="navbar-item" v-if="deviceType.type != 5">下载APP</a>

            <div class="navbar-user is-hidden-touch" v-if="authUser.userId">
              <img v-if="userInfo" :src="userInfo.faceUrl" alt="">
              <!--<img src="~/assets/image/icon/nav_icon_logo.png" alt="" v-else>-->

              <ul class="user-item">
                <li class="item-info" @click="pathUserInfo">
                  <div class="info-left">
                    <h5 v-if="userInfo">{{userInfo.userName}}</h5>
                    <p>查看或编辑个人资料</p>
                  </div>
                  <img v-if="userInfo" :src="userInfo.faceUrl" alt="">
                </li>
                <li @click="logout">
                  <p>退出登录</p>
                  <img src="~/assets/image/icon/my_list_icon_out@3x.png" alt="">
                </li>
              </ul>
            </div>

            <nuxt-link to="/user" class="navbar-item is-hidden-desktop" v-if="authUser.userId">我的</nuxt-link>
            <a class="navbar-item" @click="openLogin" v-else>登录/注册</a>

            <!--<div class="navbar-item has-dropdown is-hoverable">-->
            <!--<a class="navbar-link">-->
            <!--简体中文-->
            <!--</a>-->

            <!--<div class="navbar-dropdown">-->
            <!--<a class="navbar-item">-->
            <!--About-->
            <!--</a>-->
            <!--<a class="navbar-item">-->
            <!--Jobs-->
            <!--</a>-->
            <!--</div>-->
            <!--</div>-->

          </div>
        </div>
      </nav>

    </header>

    <!--  搜索补全  -->
    <div class="modal-box" v-show="showModal">
      <div class="box-background" @click="closeTips"></div>
      <div class="box-main">
        <ul class="main-items">
          <li @click="searchIndex(item.name)" v-for="(item, idx) in searchItems" :key="item.id">
            <!--  v-if  本地  -->
            <!--<img src="~/assets/image/icon/global_search_icon_record.png" alt="">-->
            <!--  v-else  -->
            <img src="~/assets/image/icon/global_search_icon_location.png" alt="">
            <div class="item-txt">
              <h5>{{item.name}}</h5>
              <p>{{item.opt.city}}·{{item.opt.address}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!--  登录  -->
    <div :class="[showModalLogin ? 'is-active' : '', 'modal', 'modal-login']">
      <div class="modal-background" @click="closeLogin"></div>
      <div class="modal-content">

        <!--  默认  -->
        <div v-show="modalLogin == 'index'" class="login-index">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="closeLogin"></button>
            <button type="button" @click="toggleModalLogin('login')">登录</button>
          </div>
          <div class="modal-main">
            <div class="main-logo">
              <img src="~/assets/image/icon/login_icon_logo.png" alt="">
              <h1>欢迎来到toU</h1>
              <p>请您先登录</p>
            </div>
            <ul class="main-items">
              <!--<li><button type="button" class="light we-chat">微信登录</button></li>-->
              <!--<li><button type="button" class="light qq">QQ 登录</button></li>-->
              <li><button type="button" class="new" @click="toggleModalLogin('register')">创建账号</button></li>
            </ul>
          </div>
          <div class="modal-foot">

          </div>
        </div>

        <!--  绑定手机  -->
        <div  v-show="modalLogin == ''" class="">
          <div class="modal-head">
            <button type="button" class="back-btn" @click="toggleModalLogin('index')"></button>
          </div>
          <div class="modal-main">
            <h1>绑定手机</h1>
          </div>
          <div class="modal-foot">
            <button type="button" class="sub-btn" @click="">提交</button>
          </div>
        </div>

        <!--  注册  -->
        <div  v-show="modalLogin == 'register'" class="register">
          <div class="modal-head">
            <button type="button" class="back-btn" @click="toggleModalLogin('index')"></button>
          </div>
          <div class="modal-main">
            <h1>注册</h1>
            <ul class="main-items">
              <li>
                <p>手机号</p>
                <div class="item-input">
                  <input type="tel" :value="'+'+registerAccount.prefix" readonly class="prefix">
                  <input type="tel" placeholder="输入手机号" v-model="registerAccount.phone">
                </div>
              </li>
              <li>
                <p>验证码</p>
                <div class="item-input">
                  <input type="tel" placeholder="输入验证码" v-model="registerAccount.authCode">
                  <button type="button" class="btn-code" @click="getAuthCode" :disabled="registerAccount.disabled">{{registerAccount.authBtnText}}</button>
                </div>
              </li>
              <li>
                <p>设置密码</p>
                <div class="item-input">
                  <input :type="registerAccount.pwdType" placeholder="6-18位字母和数字" v-model="registerAccount.pwd">
                  <button type="button" :class="registerAccount.btnTogglePwd" @click="togglePwdType"></button>
                </div>
              </li>
            </ul>
          </div>
          <div class="modal-foot">
            <button type="button" class="sub-btn" @click="subRegister">提交</button>
          </div>
        </div>

        <!--  登录  -->
        <div  v-show="modalLogin == 'login'" class="login-in">
          <div class="modal-head">
            <button type="button" class="back-btn" @click="toggleModalLogin('index')"></button>
            <button type="button" @click="toggleModalLogin('reset')">忘记密码？</button>
          </div>
          <div class="modal-main">
            <h1>登录</h1>
            <ul class="main-items">
              <li>
                <p>手机号</p>
                <div class="item-input">
                  <input type="tel" :value="'+'+loginAccount.prefix" readonly class="prefix">
                  <input type="tel" placeholder="已注册手机号" v-model="loginAccount.phone">
                </div>
              </li>
              <li>
                <p>密码</p>
                <div class="item-input">
                  <input :type="loginAccount.pwdType" placeholder="输入密码" v-model="loginAccount.pwd" @keyup.enter="subLogin">
                  <button type="button" :class="loginAccount.btnTogglePwd" @click="togglePwdType"></button>
                </div>
              </li>
            </ul>

          </div>
          <div class="modal-foot">
            <button type="button" class="sub-btn" @click="subLogin">登录</button>
          </div>
        </div>

        <!--  忘记密码  -->
        <div  v-show="modalLogin == 'reset'" class="reset">
          <div class="modal-head">
            <button type="button" class="back-btn" @click="toggleModalLogin('index')"></button>
          </div>
          <div class="modal-main">
            <h1>忘记密码</h1>
            <ul class="main-items">
              <li>
                <p>手机号</p>
                <div class="item-input">
                  <input type="tel" :value="'+'+resetAccount.prefix" readonly class="prefix">
                  <input type="tel" placeholder="已注册手机号" v-model="resetAccount.phone">
                </div>
              </li>
              <li>
                <p>验证码</p>
                <div class="item-input">
                  <input type="tel" placeholder="输入验证码" v-model="resetAccount.authCode">
                  <button type="button" class="btn-code" @click="getAuthCode" :disabled="resetAccount.disabled">{{resetAccount.authBtnText}}</button>
                </div>
              </li>
              <li>
                <p>设置新密码</p>
                <div class="item-input">
                  <input :type="resetAccount.pwdType" placeholder="6-18位字母和数字" v-model="resetAccount.pwd">
                  <button type="button" :class="resetAccount.btnTogglePwd" @click="togglePwdType"></button>
                </div>
              </li>
            </ul>

          </div>
          <div class="modal-foot">
            <button type="button" class="sub-btn" @click="subReset">提交</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { REG_EXP_PWD, REG_EXP_PHONE, aesDecrypt } from "~/assets/js/utils";

  export default {
    name: "the-head-nav",
    data() {
      return {
        showMenu:false, //
        //  搜索内容
        searchText:'',
        //  模态框
        showModal:false,
        //  搜索补全
        searchItems:[],
        /**
         * 登录
         * */
        modalLogin:'index', //  默认（index）， 注册（register）， 登录（login）， 重置（reset）
        loginAccount:{  //  登录
          prefix: 86,
          phone:undefined,
          pwd: undefined,
          pwdType:'password', //  password  | text
          btnTogglePwd:'btn-toggle-pwd',  //  btn-toggle-pwd  | btn-toggle-pwd-light
        },
        registerAccount: {  //注册
          prefix: 86,
          phone:undefined,
          authCode:undefined,
          pwd: undefined,
          pwdType:'password', //  password  | text
          btnTogglePwd:'btn-toggle-pwd',  //  btn-toggle-pwd  | btn-toggle-pwd-light
          countTime:60,
          interval: undefined,  //  计数定时器
          authBtnText: '发送验证码',
          disabled:false
        },
        resetAccount: {  //  重置
          prefix: 86,
          phone:undefined,
          authCode:undefined,
          pwd: undefined,
          pwdType:'password', //  password  | text
          btnTogglePwd:'btn-toggle-pwd',  //  btn-toggle-pwd  | btn-toggle-pwd-light
          countTime:60,
          interval: undefined,  //  计数定时器
          authBtnText: '发送验证码',
          disabled:false
        },

      }
    },
    asyncData(context){

    },
    mounted(){
      this.closeTips();
      //将要给原生调用的方法挂载到 window 上面
      window.appAutoLogin = this.appAutoLogin;
      window.appAutoLogout = this.appAutoLogout;
      window.appSaveDeviceType = this.appSaveDeviceType;
    },
    watch: {},
    computed: {
      ...mapState({
        authUser: 'authUser',
        showModalLogin:'showModalLogin',
        deviceType: 'deviceType',
        userInfo: 'userInfo'
      })
    },
    methods: {

      addPathQuery(){
        let { currency } = this.$route.query;
        return currency ? `?currency=${currency}` : ``
      },
      //  保存app类型
      async appSaveDeviceType(deviceType){
        try{
          let { data } = await this.$axios.get(`/setDeviceType`, {params: deviceType});
          if(data.code == 0){
            this.$store.commit('SET_DEVICE_TYPE', deviceType);
          }else{
            throw data.msg
          }
        }catch (e){
          if(deviceType.env == 'iOS'){
            window.webkit.messageHandlers.LOG.postMessage(e);
          }else{
            android.emitMsg(e)
          }
        }
      },
      //  app自动登录
      async appAutoLogin({deviceType, result}){
        let [_selfDeviceType, _selfResult] = [deviceType, result];
        if(_selfDeviceType.env != 'iOS'){
          [_selfDeviceType, _selfResult] = [JSON.parse(_selfDeviceType), JSON.parse(_selfResult)]
        }
        try{
          //  设备类型设置为5
          let login = await this.$axios.post(`/login`, _selfResult);
          if(login.data.code == 0) {
            this.$store.commit('SET_AUTH_USER', _selfResult);
            let myProfile = await this.$api.user.myProfile({pt: _selfDeviceType.type}, this.authUser);
            if(myProfile.data.code == 0){
              let { data } = await this.$axios.post(`/userInfo`, myProfile.data.result);
              if(data.code == 0){
                this.$store.commit('SET_USER_INFO', myProfile.data.result);
                // window.location.reload();
                // this.$toast.success('登录成功')
                if(_selfDeviceType.env == 'iOS'){
                  window.webkit.messageHandlers.appCallBack.postMessage('ok');
                }else{
                  android.appCallBack('ok')
                }
              }else{
                throw data.msg; //'用户信息保存失败'+
              }
            }else{
              throw myProfile.data.msg; //'用户信息获取失败'+
            }
          }else{
            throw login.data.msg
          }
        }catch (e){
          if(_selfDeviceType.env == 'iOS'){
            window.webkit.messageHandlers.LOG.postMessage(e);
          }else{
            android.emitMsg(e)
          }
        }
      },
      //  登录失败退出
      async appAutoLogout(){
        try{
          let { data: logout } = await this.$axios.post(`/logout`);
          if(logout.code == 0){
            this.$store.commit('SET_AUTH_USER', {timeDiffMills:undefined, token:undefined, userId:undefined});
            this.$store.commit('SET_USER_INFO', undefined);
            if(this.deviceType.env == 'iOS'){
              window.webkit.messageHandlers.appCallBack.postMessage('ok');
            }else{
              android.appCallBack('ok')
            }
          }else{
            throw logout.msg;
          }
        }catch (e){
          if(this.deviceType.env == 'iOS'){
            window.webkit.messageHandlers.LOG.postMessage(e);
          }else{
            android.emitMsg(e)
          }
        }
      },
      searchInputBlur(){
        if(event.target != this.$refs.searchInput){
          this.closeTips()
        }
      },
      toggleMenu() {
        this.showMenu = !this.showMenu
      },
      //  打开搜索补全
      openTips(){
        (this.searchItems.length > 0) && (this.showModal = true);
      },

      //  关闭搜索补全
      closeTips(){
        this.showModal && (this.showModal = false);
      },

      //  搜索补全
      async getTips(){
        if(this.searchText){
          try{
            let { data } = await this.$api.homepage.tips({pt: this.deviceType.type}, {keyword:this.searchText});
            if(data.code == 0){
              this.searchItems = (data.result.length > 0) ? data.result : [];
              this.openTips()
            }else {
              throw data.msg;
            }
          }catch (e){
            this.$toast.error(e)
          }
        }else{
          this.closeTips()
        }

      },

      //
      searchIndex(name){
        // this.searchText = name;
        let keywords = encodeURI(name);
        // localStorage.setItem('keywords', this.searchText);
        let routePath = this.$route.path;
        if(routePath == '/search/house'){
          this.$router.push({path:'/search/house', query:{type: this.$route.query.type, keywords:keywords, currency: this.$route.query.currency}});
        }else{
          this.$router.push({path:'/search', query:{keywords:keywords, currency: this.$route.query.currency}});
        }

        this.closeTips()
      },

      /**
       * 登录
       * */
      openLogin() {
        if(this.deviceType.type == 5){
          if(this.deviceType.env == 'iOS'){
            window.webkit.messageHandlers.appRouter.postMessage('SignInViewController');
          }else{
            android.appRouter('Login')
          }
        }else{
          this.$store.commit('TOGGLE_MODAL_LOGIN')
        }
      },
      toggleModalLogin(type) {
        this.modalLogin = type
      },
      async subLogin() {  //  提交登录
         try{
           if(!this.loginAccount.phone){
             throw '请输入手机号';
           }
           if(!this.loginAccount.pwd){
             throw '请输入密码';
           }

           this.$nuxt.$loading.start();
           let res = await this.$api.user.loginByPwd({pt: this.deviceType.type}, {
             telephoneCountryPrefix: this.loginAccount.prefix,
             telephone: this.loginAccount.phone,
             password: aesDecrypt(this.loginAccount.pwd),
             timestamp: new Date().getTime()
           });

           this.$nuxt.$loading.finish();
           if(res.data.code == 0){
             let result = res.data.result;
             let login =await this.$axios.post(`/login`, result);
             if(login.data.code == 0){
               this.$store.commit('SET_AUTH_USER', result);
               this.closeLogin();
               let myProfile = await this.$api.user.myProfile({pt: this.deviceType.type}, this.authUser);
               if(myProfile.data.code == 0){
                 let { data } = await this.$axios.post(`/userInfo`, myProfile.data.result);
                 if(data.code == 0){
                   this.$store.commit('SET_USER_INFO', myProfile.data.result);
                   if(this.$route.path == '/order'){
                     window.location.reload();
                   }
                   // this.$toast.success('登录成功')
                 }else{
                   throw data.msg;
                 }
               }else{
                 throw myProfile.data.msg;
               }
             }else{
               throw login.data.msg;
             }
           }else{
             throw res.data.msg;
           }
         }catch (e){
           this.$toast.error(e)
         }
      },
      async getAuthCode() { //  获取验证码
        try {
          if(this.modalLogin == 'register'){  //  注册
            if(!REG_EXP_PHONE.test(this.registerAccount.phone)){
              throw '手机号必须为11位纯数字';
            }

            let { data } = await this.$api.user.authCode({pt: this.deviceType.type}, {
              telephoneCountryPrefix: this.registerAccount.prefix,
              telephone: this.registerAccount.phone,
              neetNotUsed:1,  //  必须未使用
            });
            if(data.code == 0){
              this.registerAccount.interval = setInterval( () => {
                if(this.registerAccount.countTime != 0){
                  this.registerAccount.countTime --;
                  this.registerAccount.authBtnText = `重新发送 ${this.registerAccount.countTime}s`;
                  this.registerAccount.disabled = 0
                }else{
                  clearInterval(this.registerAccount.interval);
                  this.registerAccount.countTime = 60;
                  this.registerAccount.authBtnText = '发送验证码';
                  this.registerAccount.disabled = false
                }
              }, 1000 )
            }else {
              throw data.msg;
            }
          }else if(this.modalLogin == 'reset'){ //  重置
            if(!REG_EXP_PHONE.test(this.resetAccount.phone)){
              throw '手机号必须为11位纯数字';
            }

            let { data } = await this.$api.user.authCode({pt: this.deviceType.type}, {
              telephoneCountryPrefix: this.resetAccount.prefix,
              telephone: this.resetAccount.phone,
              neetNotUsed:2,  //  必须使用过
            });
            if(data.code == 0){
              this.resetAccount.interval = setInterval( () => {
                if(this.resetAccount.countTime != 0){
                  this.resetAccount.countTime --;
                  this.resetAccount.authBtnText = `重新发送 ${this.resetAccount.countTime}s`;
                  this.resetAccount.disabled = 0
                }else{
                  clearInterval(this.resetAccount.interval);
                  this.resetAccount.countTime = 60;
                  this.resetAccount.authBtnText = '发送验证码';
                  this.resetAccount.disabled = false
                }
              }, 1000 )
            }else {
              throw data.msg;
            }
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      async subRegister() { //  提交注册
        try {
          if(!REG_EXP_PHONE.test(this.registerAccount.phone)){
            throw '手机号必须为11位纯数字';
          }
          if(!this.registerAccount.authCode){
            throw '请输入验证码';
          }
          if(!REG_EXP_PWD.test(this.registerAccount.pwd)){
            throw '密码必须为6-18位字母和数字的组合';
          }

          this.$nuxt.$loading.start();
          let res = await this.$api.user.regist({pt: this.deviceType.type}, {
            telephoneCountryPrefix: this.registerAccount.prefix,
            telephone: this.registerAccount.phone,
            password: aesDecrypt(this.registerAccount.pwd),
            authCode:this.registerAccount.authCode,
            timestamp: new Date().getTime()
          });
          this.$nuxt.$loading.finish();
          if(res.data.code == 0){
            let result = res.data.result;
            let login =await this.$axios.post(`/login`, result);
            if(login.data.code == 0){
              this.$store.commit('SET_AUTH_USER', result);
              this.closeLogin();
              let myProfile = await this.$api.user.myProfile({pt: this.deviceType.type}, this.authUser);
              if(myProfile.data.code == 0){
                let { data } = await this.$axios.post(`/userInfo`, myProfile.data.result);
                if(data.code == 0){
                  this.$store.commit('SET_USER_INFO', myProfile.data.result);
                  this.$toast.success('注册成功')
                }else{
                  throw data.msg
                }
              }else{
                throw myProfile.data.msg
              }
            }else{
              throw login.data.msg
            }
          }else {
            throw res.data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      async subReset(){ //  重置密码
        try {
          if(!REG_EXP_PHONE.test(this.resetAccount.phone)){
            throw '手机号必须为11位纯数字';
          }
          if(!this.resetAccount.authCode){
            throw '请输入验证码';
          }
          if(!this.resetAccount.pwd){
            throw '密码必须为6-18位字母和数字的组合';
          }

          let { data } = await this.$api.user.forgetLoginPwd({pt: this.deviceType.type}, {
            telephoneCountryPrefix: this.resetAccount.prefix,
            telephone: this.resetAccount.phone,
            password: aesDecrypt(this.resetAccount.pwd),
            authCode:this.resetAccount.authCode
          });
          if(data.code == 0){
            this.modalLogin = 'login';
            this.$toast.success('重置成功，请重新登录')
          }else {
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      togglePwdType() {
        if(this.modalLogin == 'register'){
          if(this.registerAccount.pwdType == 'password'){
            this.registerAccount.pwdType = 'text';
            this.registerAccount.btnTogglePwd = 'btn-toggle-pwd-light'
          }else if(this.registerAccount.pwdType == 'text'){
            this.registerAccount.pwdType = 'password';
            this.registerAccount.btnTogglePwd = 'btn-toggle-pwd'
          }
        }else if(this.modalLogin == 'login'){
          if(this.loginAccount.pwdType == 'password'){
            this.loginAccount.pwdType = 'text';
            this.loginAccount.btnTogglePwd = 'btn-toggle-pwd-light'
          }else if(this.loginAccount.pwdType == 'text'){
            this.loginAccount.pwdType = 'password';
            this.loginAccount.btnTogglePwd = 'btn-toggle-pwd'
          }
        }else if(this.modalLogin == 'reset'){
          if(this.resetAccount.pwdType == 'password'){
            this.resetAccount.pwdType = 'text';
            this.resetAccount.btnTogglePwd = 'btn-toggle-pwd-light'
          }else if(this.resetAccount.pwdType == 'text'){
            this.resetAccount.pwdType = 'password';
            this.resetAccount.btnTogglePwd = 'btn-toggle-pwd'
          }
        }
      },
      closeLogin(){
        this.$store.commit('TOGGLE_MODAL_LOGIN');
        this.modalLogin = 'index'
      },
      pathUserInfo() {
        this.$router.push('/user/info');
      },
      async logout(){
        try{
          let { data } = await this.$axios.post(`/logout`);
          if(data.code == 0){
            this.$store.commit('SET_AUTH_USER', {timeDiffMills:undefined, token:undefined, userId:undefined});
            this.$store.commit('SET_USER_INFO', undefined);
            this.$router.push({path:'/', query:{currency: this.$route.query.currency}});            this.$toast.success('退出成功')
          }else{
            throw data.msg;
          }
        }catch (e){
          this.$toast.error(e)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~/assets/style/scss/_base.scss';

  @media screen and #{$touch-width}{
    .modal-login{
      z-index: 1999 !important;
    }
  }

  .head{
    border-bottom: 1px solid $b3;
    top: 0;
    left: 0;
    position: fixed;
    right: 0;
    z-index: 99;
    background-color: $b0;
    .head-nav{
      max-width: 1152px;
      margin: 0 auto;
      padding: 0 .5rem;
      .navbar-brand{
        flex: 1;
        align-items: center;
        .brand-search{
          flex: 1;
          .nav-search{
            flex: 1;
            .input{
              padding-left: 36px;
              @include bg-image('~assets/image/icon/search_bar_icon.png', 24px, 24px, 8px)
            }
          }
        }
        .navbar-burger{
          /*padding-right: 8px;*/
        }
      }
      .nav-logo{
        border: none;
        padding: 18px .5rem;
        >img{
          max-height: 36px;
          border-radius: 18px;
        }
      }
    }
    @media screen and #{$touch-width}{
      .navbar-menu{
        box-shadow: none;
      }
    }
    .navbar-menu{
      .navbar-end-padding{
        padding: 15px 52px 15px 0;
      }
      .navbar-end-default{
        padding: 15px 0;
      }
      .navbar-end{

        .navbar-user{
          position: absolute;
          top: 0;
          right: 12px;
          width: 52px;
          padding: 22px 0;
          text-align: center;
          &:hover{
            cursor: pointer;
            .user-item{
              display: block;
            }
          }
          >img{
            width: 28px;
            height: 28px;
            border-radius: 50%;
          }
          .user-item{
            display: none;
            border-top: 1px solid $b3;
            width: 360px;
            position: absolute;
            top: 72px;
            right: 0;
            background-color: $b0;
            box-shadow: 0 2px 24px 0 rgba(0,0,0,0.12);
            padding: 0 16px;
            >li{
              display: flex;
              justify-content: space-between;
              padding: 24px 0;
              &:hover{
                cursor: pointer;
                background-color: $b1;
              }
              &.item-info{
                .info-left{
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  padding: 9px 0;
                  text-align: left;
                  >h5{
                    @include one-line-hidden;
                    @include font-style(24px)
                  }
                  >p{
                    @include font-style(18px)
                  }
                }
                >img{
                  width: 72px;
                  height: 72px;
                  border-radius: 50%;
                }
              }
              &:not(:first-child){
                border-top: 1px solid $b3;
                >p{
                  @include font-style(18px, 30px)
                }
                >img{
                  width: 30px;
                  height: 30px;
                }
              }
            }
          }
        }
        .navbar-item{

          padding: 0;
          margin: 0 12px;
          height: 42px;
          @include font-style(14px, 42px, $color:$t3);
          border-bottom: 2px solid $b0;
          &:hover{
            background-color: $b0;
            color: $t1;
          }
        }
        .nuxt-link-active{
          color: $t1;
        }
        @media screen and #{$desktop-width}{
          .nuxt-link-active{
            border-bottom: 2px solid $t1;
          }
        }
      }
    }
  }

  .modal-box{
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 99;
    width: 100%;
    height: 100%;
    top: 73px;
    left: 0;
    background-color: rgba(255,255,255, .8);
    .box-background{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    .box-main{
      position: absolute;
      top: 0;
      max-width: 1152px;
      width: 100%;
      padding: 16px 18px;
      background-color: $b0;
      box-shadow: 0 2px 24px 0 rgba(0,0,0,0.12);
      border-radius: 4px;
      .main-items{
        >li{
          display: flex;
          padding: 18px 0;
          &:hover{
            cursor: pointer;
            background-color: $b2;
          }
          &:not(:last-child){
            border-bottom: 1px solid $b3;
          }
          >img{
            height: 20px;
            margin: 8px 4px;
          }
          .item-txt{
            >h5{
              @include font-style(16px, 1);
              margin-bottom: 8px;
            }
            >P{
              @include font-style(12px, 1, $color:$t3)
            }
          }

          &:hover{}

        }
      }
    }
  }

  /*  登录  */
  .modal-main{
    margin: 0 auto;
    padding: 0 16px;
    max-width: 512px;
    >h1{
      @include font-style(36px)
    }
    .main-items{
      margin-top: 32px;
      >li{
        padding: 16px 0;
        >p{
          padding-bottom: 16px;
          @include font-style(14px)
        }
        .item-input{
          display: flex;
          position: relative;
          align-items: center;
          >input{
            width: 100%;
            height: 44px;
            padding: 10px 0;
            border: none;
            border-bottom: 1px solid $b3;
            @include font-style(24px);
            &.prefix{
              width: 44px;
              color: $t6;
              margin-right: 16px;
            }
          }
          >button{
            &.btn-toggle-pwd{
              width: 20px;
              height: 20px;
              position: absolute;
              right: 0;
              @include bg-image('~assets/image/icon/login_icon_hide_nor.png', 20px, 20px)
            }
            &.btn-toggle-pwd-light{
              width: 20px;
              height: 20px;
              position: absolute;
              right: 0;
              @include bg-image('~assets/image/icon/login_icon_hide_sle.png', 20px, 20px)

            }
          }
          .btn-code{
            position: absolute;
            right: 0;
            border: 1px solid $b3;
            border-radius: 2px;
            padding: 8px 16px;
            @include font-style(14px);
            &:enabled{
              border: 1px solid $t4;
              background-color: $t4;
            }
          }
        }
      }
    }
  }
  .modal-foot{
    margin: 0 auto;
    padding: 16px;
    max-width: 512px;
    .sub-btn{
      width: 100%;
      height: 48px;
      background-color: $t4;
      border-radius: 4px;
      @include font-style(16px, 48px);

    }
  }
  .login-index{
    .modal-head{
      justify-content: space-between;
      >button{
        &:last-child{
          @include font-style(16px, 24px);
        }
      }
    }
    .modal-main{
      .main-logo{
        display: flex;
        flex-direction: column;
        >img{
          width: 54px;
          height: 54px;
        }
        >h1{
          margin: 16px 0;
          @include font-style(36px)
        }
        >p{
          @include font-style(18px);
        }
      }
      .main-items{
        display: flex;
        flex-direction: column;
        >li{
          padding: 8px 0;
          >button{
            width: 100%;
            border-radius: 4px;
            border: 1px solid $b3;
            text-align: center;
            @include font-style(18px, 48px);
            &.light{
              border: 1px solid $t4;
              background-color: $t4;
            }
            &.we-chat{
              @include bg-image('~assets/image/icon/login_icon_wechat.png', 24px, 24px, 12px, 24px)
            }
            &.qq{
              @include bg-image('~assets/image/icon/login_icon_qq.png', 24px, 24px, 12px, 24px)
            }
            &.new{
              @include bg-image('~assets/image/icon/login_icon_new.png', 24px, 24px, 12px, 24px)
            }
          }
        }
      }
    }
  }
  .login-in{
    .modal-head{
      justify-content: space-between;
      >button{
        &:last-child{
          @include font-style(16px, 24px);
        }
      }
    }
  }
  .register{
    .main-items{
      >li{

      }
    }
  }
  .reset{
    .main-items{
      >li{

      }
    }
  }
</style>
