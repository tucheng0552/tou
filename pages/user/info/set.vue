<template>

  <div>
    <!--  设置  -->
    <div class="set">
      <h2>设置</h2>
      <ul class="set-list">
        <li @click="openSafe">
          <p>安全中心</p>
        </li>
        <!--<li>
          <p>通知管理</p>
        </li>-->
        <li>
          <p>建议反馈</p>
        </li>
        <li v-if="deviceType.type == 4" @click="logout">
          <p>退出登录</p>
        </li>
      </ul>
    </div>

    <div :class="[showSafe ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="closeSafe"></div>
      <div class="modal-content">

        <div v-show="modalSafeSet == 'index'" class="safe-index">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="closeSafe"></button>
          </div>
          <div class="modal-main">
            <h2>安全中心</h2>
            <ul class="main-items">
              <li @click="toggleSafe('phone')">
                <p>手机号码</p>
                <span>{{formatPhone}}</span>
              </li>
              <li @click="toggleSafe('pwdUpdate')">
                <p>修改密码</p>
                <!--<span></span>-->
              </li>
              <li @click="toggleSafe('pwdReset')">
                <p>重置密码</p>
              </li>
              <ul class="main-item" v-if="userInfo.isHasTransPassword">  <!--  userInfo.isHasTransPassword -->
                <li @click="toggleSafe('payPwdRevise')">
                  <p>修改交易密码</p>
                </li>
                <li @click="toggleSafe('payPwdReset')">
                  <p>重置交易密码</p>
                </li>
              </ul>
              <li @click="toggleSafe('payPwdSet')" v-else>
                <p>设置交易密码</p>
              </li>

              <li v-if="userInfo ? JSON.parse(userInfo.isBindingWeiXin) : false">
                <p>微信</p>
                <span>已绑定</span>
              </li>
              <li v-else @click="">
                <p>微信</p>
                <span>未绑定</span>
              </li>
              <li v-if="userInfo ? JSON.parse(userInfo.isBindingQQ) : false">
                <p>QQ</p>
                <span>已绑定</span>
              </li>
              <li v-else @click="">
                <p>QQ</p>
                <span>未绑定</span>
              </li>
            </ul>
          </div>
        </div>

        <!--  改绑手机  -->
        <div v-show="modalSafeSet == 'phone'" class="phone-index">
          <div class="modal-head">
            <button type="button" class="back-btn" @click="toggleSafe('index')"></button>
          </div>
          <div class="modal-main">
            <h2>当前手机号</h2>
            <h1>{{formatPhone}}</h1>
            <p>更换手机号不影响您的个人资料及信用认证信息</p>
            <button type="button" @click="toggleSafe('phoneAuth')">更换手机号</button>
          </div>
        </div>

        <!--  验证当前手机号 -->
        <div v-show="modalSafeSet == 'phoneAuth'" class="phone-auth">
          <div class="modal-head">
            <button type="button" class="back-btn" @click="toggleSafe('phone')"></button>
          </div>
          <div class="modal-main">
            <h1>验证当前手机号</h1>
            <ul class="main-items">
              <li>
                <p>手机号</p>
                <div class="item-input">
                  <input type="tel" :value="'+'+authPhone.prefix" readonly class="prefix">
                  <input type="tel" placeholder="输入已绑定手机号" v-model="authPhone.phone">
                </div>
              </li>
              <li>
                <p>验证码</p>
                <div class="item-input">
                  <input type="tel" placeholder="输入验证码" v-model="authPhone.authCode">
                  <button type="button" class="btn-code" @click="getAuthCode" :disabled="authPhone.disabled">{{authPhone.authBtnText}}</button>
                </div>
              </li>
            </ul>
          </div>
          <div class="modal-foot">
            <button type="button" class="sub-btn" @click="checkAuthCode">验证</button>
          </div>
        </div>

        <!--  新手机号码 -->
        <div v-show="modalSafeSet == 'phoneReset'" class="phone-reset">
          <div class="modal-head">
            <button type="button" class="back-btn" @click="toggleSafe('phoneAuth')"></button>
          </div>
          <div class="modal-main">
            <h1>新手机号码</h1>
            <ul class="main-items">
              <li>
                <p>手机号</p>
                <div class="item-input">
                  <input type="tel" :value="'+'+resetPhone.prefix" readonly class="prefix">
                  <input type="tel" placeholder="输入新手机号" v-model="resetPhone.phone">
                </div>
              </li>
              <li>
                <p>验证码</p>
                <div class="item-input">
                  <input type="tel" placeholder="输入验证码" v-model="resetPhone.authCode">
                  <button type="button" class="btn-code" @click="getAuthCode" :disabled="resetPhone.disabled">{{resetPhone.authBtnText}}</button>
                </div>
              </li>
            </ul>
          </div>
          <div class="modal-foot">
            <button type="button" class="sub-btn" @click="changeTelephone">提交</button>
          </div>
        </div>

        <!--  修改密码  -->
        <div v-show="modalSafeSet == 'pwdUpdate'" class="pwd-update">
          <div class="modal-head">
            <button type="button" class="back-btn" @click="toggleSafe('index')"></button>
          </div>
          <div class="modal-main">
            <h1>修改密码</h1>
            <ul class="main-items">
              <li>
                <p>原密码密码</p>
                <div class="item-input">
                  <input :type="updatePwd.oldType" placeholder="请输入原密码" v-model="updatePwd.oldPwd">
                  <button type="button" :class="updatePwd.oldBtnToggle" @click="togglePwdType('old')"></button>
                </div>
              </li>
              <li>
                <p>设置新密码</p>
                <div class="item-input">
                  <input :type="updatePwd.newType" placeholder="6-18位字母和数字" v-model="updatePwd.newPwd">
                  <button type="button" :class="updatePwd.newBtnToggle" @click="togglePwdType('new')"></button>
                </div>
              </li>
            </ul>
          </div>
          <div class="modal-foot">
            <button type="button" class="sub-btn" @click="subUpdate">提交</button>
          </div>
        </div>

        <!--  忘记密码  -->
        <div  v-show="modalSafeSet == 'pwdReset'" class="pwd-reset">
          <div class="modal-head">
            <button type="button" class="back-btn" @click="toggleSafe('index')"></button>
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

        <!--  设置交易密码  -->
        <div v-show="modalSafeSet == 'payPwdSet'" class="pay-pwd-set">
          <div class="modal-head">
            <button type="button" class="back-btn" @click="toggleSafe('index')"></button>
          </div>
          <div class="modal-main" v-show="payPwdSet.type == 'first'">
            <h2>设置交易密码</h2>
            <p>请输入6位数字，做为交易密码</p>
            <div class="verify-input">
              <!-- 实际显示 -->
              <ul class="input-list">
                <li v-for="(item, idx) in payPwdSet.payPwdArr" :key="item.id">{{item}}</li>
              </ul>
              <!-- 用户输入 -->
              <div class="input">
                <input type="tel" maxlength="6" @input="setPayPwd(payPwdSet, 'last')" v-model="payPwdSet.payPwd">
              </div>
            </div>
          </div>

          <div class="modal-main" v-show="payPwdSet.type == 'last'">
            <h2>验证交易密码</h2>
            <p>请输入刚设置的6位数字交易密码</p>
            <div class="verify-input">
              <!-- 实际显示 -->
              <ul class="input-list">
                <li v-for="(item, idx) in payPwdSet.verifyPayPwdArr" :key="item.id">{{item}}</li>
              </ul>
              <!-- 用户输入 -->
              <div class="input">
                <input type="tel" maxlength="6" @input="submitSetPayPwd" v-model="payPwdSet.verifyPayPwd">
              </div>
            </div>
          </div>
        </div>

        <!--  修改交易密码  -->
        <div v-show="modalSafeSet == 'payPwdRevise'" class="pay-pwd-set">
          <div class="modal-head">
            <button type="button" class="back-btn" @click="toggleSafe('index')"></button>
          </div>
          <div class="modal-main" v-show="payPwdRevise.type == 'first'">
            <h2>修改交易密码</h2>
            <p>输入原交易密码，完成身份验证</p>
            <div class="verify-input">
              <!-- 实际显示 -->
              <ul class="input-list">
                <li v-for="(item, idx) in payPwdRevise.payPwdArr" :key="item.id">{{item}}</li>
              </ul>
              <!-- 用户输入 -->
              <div class="input">
                <input type="tel" maxlength="6" @input="setPayPwd(payPwdRevise, 'second')" v-model="payPwdRevise.payPwd">
              </div>
            </div>
          </div>

          <div class="modal-main" v-show="payPwdRevise.type == 'second'">
            <h2>设置新交易密码</h2>
            <p>请输入6位数字，作为新交易密码</p>
            <div class="verify-input">
              <!-- 实际显示 -->
              <ul class="input-list">
                <li v-for="(item, idx) in payPwdRevise.newPayPwdArr" :key="item.id">{{item}}</li>
              </ul>
              <!-- 用户输入 -->
              <div class="input">
                <input type="tel" maxlength="6" @input="newSetPayPwd(payPwdRevise)" v-model="payPwdRevise.newPayPwd">
              </div>
            </div>
          </div>
          <div class="modal-main" v-show="payPwdRevise.type == 'last'">
            <h2>验证交易密码</h2>
            <p>请输入刚设置的6位数字交易密码</p>
            <div class="verify-input">
              <!-- 实际显示 -->
              <ul class="input-list">
                <li v-for="(item, idx) in payPwdRevise.verifyPayPwdArr" :key="item.id">{{item}}</li>
              </ul>
              <!-- 用户输入 -->
              <div class="input">
                <input type="tel" maxlength="6" @input="submitRevisePayPwd" v-model="payPwdRevise.verifyPayPwd">
              </div>
            </div>
          </div>
        </div>

        <!--  重置交易密码  -->
        <div v-show="modalSafeSet == 'payPwdReset'" class="pay-pwd-set">
          <div class="modal-head">
            <button type="button" class="back-btn" @click="toggleSafe('index')"></button>
          </div>
          <div class="modal-main" v-show="payPwdReset.type == 'first'">
            <h2>验证码</h2>
            <!--<p></p>-->
            <div class="main-input">
              <p class="info">我们已给{{formatPhone}}发送了一个验证码。</p> <!--  userInfo.telephone -->
              <div class="auth-btn">
                <p>验证码</p>
                <button type="button"
                  @click="getAuthCode"
                  :disabled="payPwdReset.disabled">{{payPwdReset.authBtnText}}</button>
              </div>
              <div class="auth-input">
                <!-- 实际显示 -->
                <ul class="input-list">
                  <li v-for="(item, idx) in payPwdReset.authCodeArr" :key="item.id">{{item}}</li>
                </ul>
                <!-- 用户输入 -->
                <div class="input">
                  <input type="tel" maxlength="6" v-model="payPwdReset.authCode" @input="setAuthCode(payPwdReset, 'first')">
                </div>
              </div>
              <button type="button" @click="authResetPayPwd">验证</button>
            </div>
          </div>

          <div class="modal-main" v-show="payPwdReset.type == 'second'">
            <h2>设置新交易密码</h2>
            <p>请输入6位数字，作为新交易密码</p>
            <div class="verify-input">
              <!-- 实际显示 -->
              <ul class="input-list">
                <li v-for="(item, idx) in payPwdReset.newPayPwdArr" :key="item.id">{{item}}</li>
              </ul>
              <!-- 用户输入 -->
              <div class="input">
                <input type="tel" maxlength="6" @input="newSetPayPwd(payPwdReset)" v-model="payPwdReset.newPayPwd">
              </div>
            </div>
          </div>
          <div class="modal-main" v-show="payPwdReset.type == 'last'">
            <h2>验证交易密码</h2>
            <p>请输入刚设置的6位数字交易密码</p>
            <div class="verify-input">
              <!-- 实际显示 -->
              <ul class="input-list">
                <li v-for="(item, idx) in payPwdReset.verifyPayPwdArr" :key="item.id">{{item}}</li>
              </ul>
              <!-- 用户输入 -->
              <div class="input">
                <input type="tel" maxlength="6" @input="submitResetPayPwd" v-model="payPwdReset.verifyPayPwd">
              </div>
            </div>
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
    name: "info-set",
    layout: 'back',
    data(){
      return {
        /**
         *  安全设置
         * */
        showSafe: false,
        modalSafeSet: 'index',  //  index

        authPhone: {  //  验证手机
          prefix: 86,
          phone:undefined,
          authCode:undefined,
          countTime:60,
          interval: undefined,  //  计数定时器
          authBtnText: '发送验证码',
          disabled:false
        },

        resetPhone: {  //  验证手机
          prefix: 86,
          phone:undefined,
          authCode:undefined,
          countTime:60,
          interval: undefined,  //  计数定时器
          authBtnText: '发送验证码',
          disabled:false
        },

        updatePwd: {  //  验证手机
          oldPwd: undefined,
          oldType: 'password',
          oldBtnToggle: 'btn-toggle-pwd',
          newPwd: undefined,
          newType: 'password',
          newBtnToggle: 'btn-toggle-pwd',
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

        /**
         *  通知
         * */
        // showInform: true

        /**
         *  交易密码
         * */
        payPwdSet:{
          type: 'first',
          payPwd: '',
          payPwdArr: ['', '', '', '', '', ''],
          verifyPayPwd: '',
          verifyPayPwdArr: ['', '', '', '', '', '']
        },

        //  修改交易密码
        payPwdRevise:{
          type: 'first',
          payPwd: '',
          payPwdArr: ['', '', '', '', '', ''],
          newPayPwd: '',
          newPayPwdArr: ['', '', '', '', '', ''],
          verifyPayPwd: '',
          verifyPayPwdArr: ['', '', '', '', '', '']
        },

        //  重置交易密码
        payPwdReset:{
          type: 'first',
          authCode: '',
          authCodeArr: ['', '', '', '', '', ''],
          newPayPwd: '',
          newPayPwdArr: ['', '', '', '', '', ''],
          verifyPayPwd: '',
          verifyPayPwdArr: ['', '', '', '', '', ''],
          interval: undefined,
          countTime: 60,
          authBtnText: '没收到？点击重新发送',
          disabled: false
        }
      }
    },
    computed: {
      ...mapState({
        authUser: 'authUser',
        userInfo: 'userInfo',
        deviceType: 'deviceType',
      }),
      formatPhone(){
        if(this.userInfo){
          return [this.userInfo.telephone.slice(0, 3), '*','*','*','*', this.userInfo.telephone.slice(7)].join('')
        }else{
          return ''
        }
      },
    },
    methods: {
      togglePwdType(flag) {
        if(this.modalSafeSet == 'pwdUpdate'){
          if(flag == 'old'){
            if(this.updatePwd.oldType == 'password'){
              this.updatePwd.oldType = 'text';
              this.updatePwd.oldBtnToggle = 'btn-toggle-pwd-light'
            }else if(this.updatePwd.oldType == 'text'){
              this.updatePwd.oldType = 'password';
              this.updatePwd.oldBtnToggle = 'btn-toggle-pwd'
            }
          }else if(flag == 'new'){
            if(this.updatePwd.newType == 'password'){
              this.updatePwd.newType = 'text';
              this.updatePwd.newBtnToggle = 'btn-toggle-pwd-light'
            }else if(this.updatePwd.newType == 'text'){
              this.updatePwd.newType = 'password';
              this.updatePwd.newBtnToggle = 'btn-toggle-pwd'
            }
          }

        }else if(this.modalSafeSet == 'pwdReset'){
          if(this.resetAccount.pwdType == 'password'){
            this.resetAccount.pwdType = 'text';
            this.resetAccount.btnTogglePwd = 'btn-toggle-pwd-light'
          }else if(this.resetAccount.pwdType == 'text'){
            this.resetAccount.pwdType = 'password';
            this.resetAccount.btnTogglePwd = 'btn-toggle-pwd'
          }
        }
      },
      async logout(){
        try{
          let { data } = await this.$axios.post(`/logout`);
          if(data.code == 0){
            this.$store.commit('SET_AUTH_USER', {timeDiffMills:undefined, token:undefined, userId:undefined});
            this.$store.commit('SET_USER_INFO', undefined);
            this.$router.push({path:'/', query:{currency: this.$route.query.currency}});
            // this.$toast.success('退出成功')
          }else{
            throw data.msg;
          }
        }catch (e){
          this.$toast.error(e)
        }
      },

      async getAuthCode() { //  获取验证码
        try {
          if(this.modalSafeSet == 'phoneAuth'){  //  验证
            if(!REG_EXP_PHONE.test(this.authPhone.phone)){
              throw '手机号必须为11位纯数字';
            }

            let { data } = await this.$api.user.authCodeForLogin({pt: this.deviceType.type}, this.authUser, {
              telephoneCountryPrefix: this.authPhone.prefix,
              telephone: this.authPhone.phone,
              mustBeSelf:true,  //  必须是当前号码
            });
            if(data.code == 0){
              this.authPhone.interval = setInterval( () => {
                if(this.authPhone.countTime != 0){
                  this.authPhone.countTime --;
                  this.authPhone.authBtnText = `重新发送 ${this.authPhone.countTime}s`;
                  this.authPhone.disabled = 0
                }else{
                  clearInterval(this.authPhone.interval);
                  this.authPhone.countTime = 60;
                  this.authPhone.authBtnText = '发送验证码';
                  this.authPhone.disabled = false
                }
              }, 1000 )
            }else {
              throw data.msg;
            }
          }else if(this.modalSafeSet == 'phoneReset'){ //  新设置
            if(!REG_EXP_PHONE.test(this.resetPhone.phone)){
              throw '手机号必须为11位纯数字';
            }

            let { data } = await this.$api.user.authCodeForLogin({pt: this.deviceType.type}, this.authUser, {
              telephoneCountryPrefix: this.resetPhone.prefix,
              telephone: this.resetPhone.phone,
              neetNotUsed:1,  //  必须未使用
            });
            if(data.code == 0){
              this.resetPhone.interval = setInterval( () => {
                if(this.resetPhone.countTime != 0){
                  this.resetPhone.countTime --;
                  this.resetPhone.authBtnText = `重新发送 ${this.resetPhone.countTime}s`;
                  this.resetPhone.disabled = 0
                }else{
                  clearInterval(this.resetPhone.interval);
                  this.resetPhone.countTime = 60;
                  this.resetPhone.authBtnText = '发送验证码';
                  this.resetPhone.disabled = false
                }
              }, 1000 )
            }else {
              throw data.msg;
            }
          }else if(this.modalSafeSet == 'pwdReset'){ //  重置
            if(!REG_EXP_PHONE.test(this.resetAccount.phone)){
              throw '手机号必须为11位纯数字';
            }

            let { data } = await this.$api.user.authCodeForLogin({pt: this.deviceType.type}, this.authUser, {
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
              throw data.msg
            }
          }else if(this.modalSafeSet == 'payPwdReset'){ //  重置交易密码
            if(this.payPwdReset.countTime == 60){
              let { data } = await this.$api.user.authCodeForLogin({pt: this.deviceType.type}, this.authUser, {
                telephoneCountryPrefix: this.userInfo.telephoneCountryPrefix,
                telephone: this.userInfo.telephone,
                neetNotUsed:2,  //  必须使用过
              });
              if(data.code == 0){
                this.payPwdReset.interval = setInterval( () => {
                  if(this.payPwdReset.countTime != 0){
                    this.payPwdReset.countTime --;
                    this.payPwdReset.authBtnText = `没收到？点击重新发送 (${this.payPwdReset.countTime}s)`;
                    this.payPwdReset.disabled = 0
                  }else{
                    clearInterval(this.payPwdReset.interval);
                    this.payPwdReset.countTime = 60;
                    this.payPwdReset.authBtnText = '没收到？点击重新发送';
                    this.payPwdReset.disabled = false
                  }
                }, 1000 )
              }else {
                throw data.msg
              }
            }
          }
        }catch (e){
          this.$toast.error(e)
        }
      },

      async checkAuthCode(){  //  验证码校验
        try {
          if(!REG_EXP_PHONE.test(this.authPhone.phone)){
            throw '手机号必须为11位纯数字';
          }
          if(!this.authPhone.authCode){
            throw '请输入验证码';
          }

          let { data } = await this.$api.user.checkAuthCode({pt: this.deviceType.type}, {
            telephoneCountryPrefix: this.authPhone.prefix,
            telephone: this.authPhone.phone,
            authCode: this.authPhone.authCode,
          });
          if(data.code == 0){
            this.modalSafeSet = 'phoneReset'
          }else {
            throw data.msg;
          }
        }catch (e){
          this.$toast.error(e)
        }

      },

      async changeTelephone(){  //  变更手机号
        try {
          if(!REG_EXP_PHONE.test(this.resetPhone.phone)){
            throw '手机号必须为11位纯数字';
          }
          if(!this.resetPhone.authCode){
            throw '请输入验证码';
          }

          let { data: change} = await this.$api.user.changeTelephone({pt: this.deviceType.type}, this.authUser, {
            telephoneCountryPrefix: this.authPhone.prefix,
            telephone: this.authPhone.phone,
            authCode: this.authPhone.authCode,
            newTelephoneCountryPrefix: this.resetPhone.prefix,
            newTelephone: this.resetPhone.phone,
            newAuthCode: this.resetPhone.authCode,
          });
          if(change.code == 0){
            this.closeSafe();
            let { data } = await this.$axios.post(`/logout`);
            if(data.code == 0){
              this.$store.commit('SET_AUTH_USER', {timeDiffMills:undefined, token:undefined, userId:undefined});
              this.$store.commit('SET_USER_INFO', undefined);
              this.$router.push({path:'/', query:{currency: this.$route.query.currency}});
              this.$toast.success('变更成功');
              this.$store.commit('TOGGLE_MODAL_LOGIN');
            }else{
              throw data.msg
            }
          }else {
            throw change.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      async subUpdate(){  //  修改密码
        try {
          if(!this.updatePwd.oldPwd){
            throw '请输入原密码';
          }
          if(!REG_EXP_PWD.test(this.updatePwd.newPwd)){
            throw '密码必须为6-18位字母和数字的组合';
          }

          let { data } = await this.$api.user.modifyLoginPwd({pt: this.deviceType.type}, this.authUser, {
            oldPassword: aesDecrypt(this.updatePwd.oldPwd),
            newPassword: aesDecrypt(this.updatePwd.newPwd)
          });
          if(data.code == 0){
            this.logout();
            this.$toast.success('修改成功，请重新登录')
          }else {
            throw data.msg;
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
            this.logout();
            this.$toast.success('重置成功，请重新登录')
          }else {
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      /**
       *  安全设置
       * */
      openSafe(){
        this.showSafe = true
      },
      closeSafe(){
        this.showSafe = false;
        this.modalSafeSet != 'index' && (this.modalSafeSet = 'index')
      },
      toggleSafe(type){
        this.modalSafeSet = type;
        if(this.modalSafeSet == 'payPwdSet'){
          this.payPwdSet.type != 'first' && (this.payPwdSet.type = 'first')
        }
        if(this.modalSafeSet == 'payPwdRevise'){
          this.payPwdRevise.type != 'first' && (this.payPwdRevise.type = 'first');
        }
        if(this.modalSafeSet == 'payPwdReset'){
          this.payPwdReset.type != 'first' && (this.payPwdReset.type = 'first');

          this.getAuthCode()
        }


      },

      /**
       *  通知
       * */
      /*      toggleInform(){
              this.showInform = !this.showInform
            },*/

      setPayPwd(payPwdSet, type){
        let _selfArr = payPwdSet.payPwd.split('');
        for (let index of payPwdSet.payPwdArr.keys()) {
          if(_selfArr[index]){
            payPwdSet.payPwdArr[index] = _selfArr[index]
          }else{
            payPwdSet.payPwdArr[index] = ''
          }
        }
        if(_selfArr.length > 5){
          payPwdSet.type = type
        }
      },
      async submitSetPayPwd(){
        let _selfArr = this.payPwdSet.verifyPayPwd.split('');
        for (let index of this.payPwdSet.verifyPayPwdArr.keys()) {
          if(_selfArr[index]){
            this.payPwdSet.verifyPayPwdArr[index] = _selfArr[index]
          }else{
            this.payPwdSet.verifyPayPwdArr[index] = ''
          }
        }
        if(_selfArr.length > 5){
          try{
            if(this.payPwdSet.verifyPayPwd == this.payPwdSet.payPwd){
              let { data } = await this.$api.user.setTransactionPwd({pt: this.deviceType.type}, {
                userId: this.authUser.userId,
                transPassword: aesDecrypt(this.payPwdSet.verifyPayPwd)
              });
              if(data.code == 0){

                let { data: myProfile } = await this.$api.user.myProfile({pt: this.deviceType.type}, this.authUser);
                if(myProfile.code == 0){
                  let userInfo = await this.$axios.post(`/userInfo`, myProfile.result);
                  if(userInfo.data.code == 0){
                    this.$store.commit('SET_USER_INFO', myProfile.result);

                    this.closeSafe();
                    this.$toast.success('设置成功')
                  }else{
                    throw userInfo.data.msg
                  }
                }else{
                  throw myProfile.msg
                }

              }else{
                throw data.msg
              }
            }else{
              throw '输入不一致'
            }
          }catch (e){
            this.$toast.error(e)
          }
        }
      },

      //  修改交易密码
      newSetPayPwd(payPwdSet){
        let _selfArr = payPwdSet.newPayPwd.split('');
        for (let index of payPwdSet.newPayPwdArr.keys()) {
          if(_selfArr[index]){
            payPwdSet.newPayPwdArr[index] = _selfArr[index]
          }else{
            payPwdSet.newPayPwdArr[index] = ''
          }
        }
        if(_selfArr.length > 5){
          payPwdSet.type = 'last'
        }
      },

      async submitRevisePayPwd(){
        let _selfArr = this.payPwdRevise.verifyPayPwd.split('');
        for (let index of this.payPwdRevise.verifyPayPwdArr.keys()) {
          if(_selfArr[index]){
            this.payPwdRevise.verifyPayPwdArr[index] = _selfArr[index]
          }else{
            this.payPwdRevise.verifyPayPwdArr[index] = ''
          }
        }
        if(_selfArr.length > 5){
          try{
            if(this.payPwdRevise.verifyPayPwd == this.payPwdRevise.newPayPwd){
              let { data } = await this.$api.user.modifyTransactionPwd({pt: this.deviceType.type}, {
                userId: this.authUser.userId,
                transPassword: aesDecrypt(this.payPwdRevise.payPwd),
                newTransPassword: aesDecrypt(this.payPwdRevise.verifyPayPwd)
              });
              if(data.code == 0){
                this.closeSafe();
                this.$toast.success('修改成功')
              }else{
                throw data.msg
              }
            }else{
              throw '输入不一致'
            }
          }catch (e){
            this.$toast.error(e)
          }
        }
      },

      //  重置交易密码
      setAuthCode(payPwdReset, type){
        let _selfArr = payPwdReset.authCode.split('');
        for (let index of payPwdReset.authCodeArr.keys()) {
          if(_selfArr[index]){
            payPwdReset.authCodeArr[index] = _selfArr[index]
          }else{
            payPwdReset.authCodeArr[index] = ''
          }
        }
        if(_selfArr.length > 5){
          payPwdReset.type = type
        }
      },

      async submitResetPayPwd(){
        let _selfArr = this.payPwdReset.verifyPayPwd.split('');
        for (let index of this.payPwdReset.verifyPayPwdArr.keys()) {
          if(_selfArr[index]){
            this.payPwdReset.verifyPayPwdArr[index] = _selfArr[index]
          }else{
            this.payPwdReset.verifyPayPwdArr[index] = ''
          }
        }
        if(_selfArr.length > 5){
          try{
            if(this.payPwdReset.verifyPayPwd == this.payPwdReset.newPayPwd){
              let { data } = await this.$api.user.resetTransactionPwd({pt: this.deviceType.type}, {
                telephoneCountryPrefix: this.userInfo.telephoneCountryPrefix,
                telephone: this.userInfo.telephone,
                authCode: this.payPwdReset.authCode,
                transPassword: aesDecrypt(this.payPwdReset.verifyPayPwd)
              });
              if(data.code == 0){
                this.closeSafe();
                this.$toast.success('重置成功')
              }else{
                throw data.msg
              }
            }else{
              throw '输入不一致'
            }
          }catch (e){
            this.$toast.error(e)
          }
        }
      },

      authResetPayPwd(){
        let _selfArr = this.payPwdReset.authCode.split('');
        if(_selfArr.length > 5){
          this.payPwdReset.type = 'second'
        }else{
          this.$toast.error('请填写验证码')
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';

  .set{
    padding: 0 8px;
    >h2{
      margin-bottom: 24px;
      @include font-style(24px)
    }
  }

  .set-list{
    >li{
      padding: 24px 14px 24px 0;
      @include bg-image('~assets/image/icon/global_icon_list_arrow.png', 6px, 12px);
      background-position: top 27px right 0;
      &:hover{
        cursor: pointer;
        background-color: $b1;
      }
      &:not(:first-child){
        border-top: 1px solid $b3;
      }
      >p{
        @include font-style(18px)
      }
    }
  }

  .safe-index{
    .modal-main{
      padding: 16px;
      >h2{
        margin-bottom: 24px;
        @include font-style(24px)
      }
      .main-items{
        @extend .set-list;
        >li{
          display: flex;
          justify-content: space-between;
          >span{
            @include font-style(14px, 18px, $t2)
          }
        }

        .main-item{
          @extend .set-list;
          >li{
            border-top: 1px solid $b3;
          }
        }
      }
    }
  }
  .phone-index{
    .modal-main{
      margin: 0 auto;
      padding: 16px;
      max-width: 512px;
      >h2{
        margin-bottom: 24px;
        @include font-style(24px)
      }
      h1{
        @include font-style(36px)
      }
      >p{
        padding: 16px 0;
        @include font-style(14px 24px, $t2)
      }
      >button{
        width: 100%;
        padding: 16px 0;
        @include font-style(16px);
        border-radius: 4px;
        background-color: $t4;

      }
    }
  }

  .modal-input{
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
  }

  .phone-auth{
    @extend .modal-input
  }
  .phone-reset{
    @extend .modal-input
  }
  .pwd-update{
    @extend .modal-input
  }
  .pwd-reset{
    @extend .modal-input
  }

  .pay-pwd-set{
    .modal-main{
      display: flex;
      flex-direction: column;
      padding: 0 16px;
      >h2{
        margin: 16px 0;
        @include font-style(24px)
      }
      >p{
        margin-bottom: 48px;
        @include font-style(14px, 22px, $color:$t2)
      }
      .verify-input{
        align-self: center;
        position: relative;
        .input{  //  输入表单
          position: absolute;
          top: 0;
          width: 100%;
          opacity: 0;
          input{
            width: 200%;
            height: 44px;
            margin-left: -100%;
            text-indent: -999em;
            color: transparent;
            background-color: transparent;
          }
        }
        .input-list{ //  展示表单
          display: flex;
          width: 100%;
          >li{
            width: 40px;
            height: 46px;
            text-align: center;
            @include font-style(24px, 46px);
            font-weight: bold;
            border-top: 1px solid $t6;
            border-bottom: 1px solid $t6;
            &:first-child{
              border-left: 1px solid $t6;
              border-bottom-left-radius: 4px;
              border-top-left-radius: 4px;
            }
            &:last-child{
              border-right: 1px solid $t6;
              border-bottom-right-radius: 4px;
              border-top-right-radius: 4px;
            }
            &:not(:last-child){
              border-right: 1px solid $b3;
            }
          }
        }
      }
      .main-input{
        .info{
          margin-bottom: 24px;
          @include font-style(16px, 26px, $color:$t2)
        }
        .auth-btn{
          display: flex;
          justify-content: space-between;
          >p{
            @include font-style(14px)
          }
          >button{
            &:disabled{
              color: $t2
            }
            @include font-style(14px, $color: $t6)
          }
        }
        >p{
          margin-bottom: 24px;
          @include font-style(14px)
        }
        >input{
          width: 100%;
          padding: 12px 0;
          border-bottom: 2px solid $b3;
          @include font-style(24px);
        }
        >button{
          margin-top: 48px;
          width: 100%;
          padding: 16px 0;
          @include font-style(18px);
          background-color: $t4;
          border-radius: 4px;
        }
        .auth-input{
          position: relative;
          .input{  //  输入表单
            position: absolute;
            top: 0;
            width: 100%;
            opacity: 0;
            input{
              width: 200%;
              height: 44px;
              margin-left: -100%;
              text-indent: -999em;
              color: transparent;
              background-color: transparent;
            }
          }
          .input-list{ //  展示表单
            display: flex;
            justify-content: space-evenly;
            width: 100%;
            padding: 12px 0;
            >li{
              flex: 1;
              margin: 0 4px;
              padding: 10px 0;
              height: 46px;
              text-align: center;
              @include font-style(24px, $color:$t1);
              font-weight: bold;
              border-bottom: 2px solid $b3;
            }
          }
        }
        .btn{
          display: flex;
          justify-content: space-between;
          padding: 16px 0;
          >a{
            @include font-style(14px, $color:$t2);
          }
        }
      }
    }
  }
</style>
