<template>
  <div>
    <section class="container is-widescreen l-page-section">
      <div class="columns user">
        <div class="column is-4-desktop is-12-touch user-left" v-if="isPathInfo">
          <div class="left-edit" @click="pathUserInfo">
            <div class="edit-head">
              <div class="head-txt">
                <h5>{{resData.userName}}</h5>
                <p>{{resData.cityStr}}·{{resData.countryStr}}</p>
              </div>
              <img :src="resData.faceUrl" alt="">
            </div>

            <p class="edit-main">{{resData.selfIntroduction}}</p>

            <div class="edit-foot">
              <ul class="foot-left">
                <li @click.stop="toggleFollows">
                  <h6>{{resData.followsNum}}</h6>
                  <p>关注</p>
                </li>
                <li>·</li>
                <li @click.stop="toggleFans">
                  <h6>{{resData.fansNum}}</h6>
                  <p>粉丝</p>
                </li>
              </ul>

              <div class="foot-right">
                <button type="button" @click.stop="toggleEditInfo">编辑资料</button>
              </div>
            </div>
          </div>

          <ul class="left-menu is-hidden-touch">
            <!--<li>
              <nuxt-link class="menu-item" to="">
                <p>芝麻信用</p>
                <img src="~/assets/image/icon/my_list_icon_zhima@3x.png" alt="">
              </nuxt-link>
            </li>-->
            <li>
              <nuxt-link class="menu-item" to="/user/info/transaction">
                <p>交易记录</p>
                <img src="~/assets/image/icon/my_list_icon_bill@3x.png" alt="">
              </nuxt-link>
            </li>
<!--            <li>
              <nuxt-link class="menu-item" to="/user/info/DP">
                <p>我的DP</p>
                <img src="~/assets/image/icon/my_list_icon_wallet@3x.png" alt="">
              </nuxt-link>
            </li>-->
            <li>
              <nuxt-link class="menu-item" to="/user/info/messages">
                <p>消息和通知</p>
                <img src="~/assets/image/icon/my_list_icon_notification@3x.png" alt="">
              </nuxt-link>
            </li>
         <!--   <li>
              <nuxt-link class="menu-item" to="/user/info/coupon">
                <p>优惠券</p>
                <img src="~/assets/image/icon/my_list_icon_coupon@3x.png" alt="">
              </nuxt-link>
            </li>-->
            <li>
              <nuxt-link class="menu-item" to="/user/info/favorites">
                <p>收藏夹</p>
                <img src="~/assets/image/icon/my_list_icon_favorites@3x.png" alt="">
              </nuxt-link>
            </li>
            <li>
              <nuxt-link class="menu-item" to="/user/info/invite">
                <p>邀请好友</p>
                <img src="~/assets/image/icon/my_list_icon_invite@3x.png" alt="">
              </nuxt-link>
            </li>
            <!--<li>
              <nuxt-link class="menu-item" to="">
                <p>成为房东</p>
                <img src="~/assets/image/icon/my_list_icon_landlord@3x.png" alt="">
              </nuxt-link>
            </li>-->
            <li>
              <nuxt-link class="menu-item" to="/user/info/set">
                <p>设置</p>
                <img src="~/assets/image/icon/my_list_icon_setting@3x.png" alt="">
              </nuxt-link>
            </li>
            <li>
              <nuxt-link class="menu-item" to="/user/info/help">
                <p>帮助中心</p>
                <img src="~/assets/image/icon/my_list_icon_help@3x.png" alt="">
              </nuxt-link>
            </li>
          </ul>
        </div>

        <div class="column is-12-touch user-right">
          <nuxt-child />
        </div>
      </div>
    </section>

    <!--  关注列表  -->
    <div :class="[showFollows ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="toggleFollows"></div>
      <div class="modal-content">
        <div class="follows-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="toggleFollows"></button>
          </div>
          <div class="modal-main">
            <h2>我的关注</h2>
            <ul class="main-items" v-if="resFollowsList">
              <li v-for="(item, idx) in resFollowsList.fansAndFollows" :key="item.id">
                <img :src="item.faceUrl" alt="">
                <div class="info">
                  <h6>{{item.userName}}</h6>
                  <p>{{item.cityStr}}·{{item.countryStr}}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!--  粉丝列表  -->
    <div :class="[showFans ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="toggleFans"></div>
      <div class="modal-content">
        <div class="fans-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="toggleFans"></button>
          </div>
          <div class="modal-main">
            <h2>我的粉丝</h2>
            <ul class="main-items" v-if="resFansList">
              <li v-for="(item, idx) in resFansList.fansAndFollows" :key="item.id">
                <img :src="item.faceUrl" alt="">
                <div class="info">
                  <p>{{item.userName}}</p>
                  <p>{{item.cityStr}}·{{item.countryStr}}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!--  编辑资料  -->
    <div :class="[showEditInfo ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="toggleEditInfo"></div>
      <div class="modal-content">
        <div v-show="modalEditInfo == 'home'" class="edit-info-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="toggleEditInfo"></button>
            <p>编辑个人资料</p>
            <button type="button" @click="subEditInfo">保存</button>
          </div>
          <div class="modal-main">
            <h2>个人信息</h2>
            <ul class="main-items">
              <li>
                <div class="item-head">
                  <input type="file" name="avatar" accept="image/png,image/gif,image/jpeg" @change="subEditAvatar">
                  <p>头像</p>
                  <div class="head-icon">
                    <img :src="resData.faceUrl" alt="">
                    <p class="txt">更换</p>
                  </div>
                </div>
              </li>
              <li>
                <p>名字</p>
                <div class="item-input">
                  <input type="text" placeholder="请输入姓名" v-model="baseInfo.userName">
                </div>
              </li>
              <li>
                <p>性别</p>
                <div class="select">
                  <select v-model="baseInfo.gender">
                    <option :value="0" disabled>请选择性别</option>
                    <option :value="1">男</option>
                    <option :value="2">女</option>
                    <option :value="3">其他</option>
                  </select>
                </div>
              </li>
              <li>
                <p>生日</p>
                <div>
                  <!--<input type="text" placeholder="请选择出生日期" v-model="baseInfo.birthday">-->
                  <div class="select">
                    <select v-model="birthdayRange.selectYear">
                      <option value="undefined" disabled>年</option>
                      <option v-for="(item, idx) in birthdayRange.year" :key="item.id" :value="item">{{item}}年</option>
                    </select>
                  </div>
                  <div class="select">
                    <select v-model="birthdayRange.selectMonth">
                      <option value="undefined" disabled>月</option>
                      <option v-for="(item, idx) in birthdayRange.month" :key="item.id" :value="item">{{item}}月</option>
                    </select>
                  </div>
                  <div class="select">
                    <select v-model="birthdayRange.selectDay">
                      <option value="undefined" disabled>日</option>
                      <option v-for="(item, idx) in birthdayRange.day" :key="item.id" :value="item">{{item}}日</option>
                    </select>
                  </div>
                </div>
              </li>
              <li>
                <div class="item-btn" @click="toggleModalEdit('intro')">
                  <h5>自我介绍</h5>
                  <button type="button">添加</button>
                </div>
              </li>
            </ul>
            <h2>地区与职业</h2>
            <ul class="main-items">
              <li>
                <p>国家</p>
                <div class="select">
                  <select v-model="baseInfo.countryCode">
                    <option selected :value="0" disabled>请选择国家</option>
                    <option v-for="(item, idx) in resCountries" :key="item.id" :value="item.countryCode">{{item.countryName}}</option>
                  </select>
                </div>
              </li>
              <li>
                <p>城市</p>
                <div class="select">
                  <select v-model="baseInfo.provinceCode">
                    <option selected :value="0" disabled>省</option>
                    <option v-for="(item, idx) in resProvinces" :key="item.id" :value="item.provinceCode">{{item.provinceName}}</option>
                  </select>
                </div>
                <div class="select">
                  <select v-model="baseInfo.cityCode">
                    <option selected :value="0" disabled v-show="resProvinces.length > 0">市</option>
                    <option selected :value="0" disabled v-show="resProvinces.length == 0">区</option>
                    <option v-for="(item, idx) in resCityList" :key="item.id" :value="item.cityCode">{{item.cityName}}</option>
                  </select>
                </div>
                <div class="select" v-show="resProvinces.length > 0">
                  <select v-model="baseInfo.areaCode">
                    <option selected :value="0" disabled>区</option>
                    <option v-for="(item, idx) in resAreaList" :key="item.id" :value="item.areaCode">{{item.areaName}}</option>
                  </select>
                </div>
              </li>

              <li>
                <p>职业</p>
                <div class="item-input">
                  <input type="text" placeholder="请输入职业" v-model="baseInfo.career">
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div v-show="modalEditInfo == 'intro'" class="edit-intro-modal">
          <div class="modal-head">
            <button type="button" class="back-btn" @click="toggleModalEdit('home')"></button>
            <button type="button" class="sub" @click="subEditIntro">保存</button>
          </div>
          <div class="modal-main">
            <h2>自我介绍</h2>
            <p>简单的介绍一下您自己，这样您将来的房东和房客会更了解您。</p>
            <textarea class="txt" name="editIntroduction" cols="30" rows="10" v-model="editIntroduction" placeholder="说点儿什么…"></textarea>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import user from '~/assets/js/api/user'
  import { mapState } from 'vuex'
  import dayjs from 'dayjs'

  export default {
    name: "user-info",
    layout (context) {
      if(context.store.state.deviceType.type == 4){
        return 'back'
      }
    },
    components: {

    },
    data() {
      return {
        /**
         *  关注
         * */
        showFollows: false,
        resFollowsList: undefined,

        /**
         *  粉丝
         * */
        showFans: false,
        resFansList: undefined,

        /**
         *  编辑资料
         * */
        showEditInfo: false, //  （模态框）
        modalEditInfo: 'home',  //  当前展示内容

        resCountries: undefined,  //  响应国家列表
        resProvinces: [],  //  省份列表
        resCityList: [],  //  城市列表
        resAreaList: [],  //  区列表
        birthdayRange: {
          year: [],
          month: [1,2,3,4,5,6,7,8,9,10,11,12],
          day: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31 ],
          selectYear: undefined,
          selectMonth: undefined,
          selectDay: undefined,
        },

      }
    },

    async asyncData (context) {
      !context.store.state.authUser.userId && context.redirect('/');

      let [id, pt, userInfo, path, _selfIsPathInfo] = [context.store.state.authUser.userId, context.store.state.deviceType.type, context.store.state.userInfo, context.route.path, false];
      if( (pt == 3) || (path == '/user/info') ){
        _selfIsPathInfo = true
      }
      try{
        let { data } = await user.homepage({pt: pt}, id);
        if(data.code == 0){
          return {
            resData: data.result,
            //  基础资料
            baseInfo: {
              userName: data.result.userName || '',
              gender: data.result.gender || 0,
              birthday: userInfo.birthday || '',
              countryCode: 0,
              provinceCode: 0,
              cityCode: 0,
              areaCode: 0,
              career: userInfo.career || ''
            },
            editIntroduction: data.result.selfIntroduction || '', //  用户输入的简介
            isPathInfo: _selfIsPathInfo
          }
        }else{
          throw data.msg
        }
      }catch (e){
        context.error({ statusCode: 400, message: e })
      }
    },
    watch: {
      'baseInfo.countryCode' (){
        if(this.baseInfo.countryCode){
          this.getProvincesList();
        }
      },
      'baseInfo.provinceCode' (){
        if(this.baseInfo.provinceCode){
          this.getCitiesList();
        }else{
          this.getCitiesList();
        }
      },
      'baseInfo.cityCode' (){
        if(this.baseInfo.cityCode){
          this.getAreaList();
        }
      },

    },
    computed: {
      ...mapState({
        authUser: 'authUser',
        deviceType: 'deviceType',
        userInfo: 'userInfo'
      }),
    },

    mounted(){
      let _selfYear = new Array(100);
      let beginYear = dayjs().year();
      for (let index of _selfYear.keys()) {
        this.birthdayRange.year.push(beginYear - index)
      }
      //  初始化生日的显示
      if(this.baseInfo.birthday){
        this.birthdayRange.selectYear = dayjs(this.baseInfo.birthday).year();
        this.birthdayRange.selectMonth = dayjs(this.baseInfo.birthday).month()+1;
        this.birthdayRange.selectDay = dayjs(this.baseInfo.birthday).date();
      }
    },
    methods:{
      pathUserInfo() {
        this.$router.push('/user/info');
      },
      /**
       *  更新用户个人资料
       * */
      async updateUserInfo(){
        try {
          let { data: myProfile } = await this.$api.user.myProfile({pt: this.deviceType.type}, this.authUser);
          if(myProfile.code == 0){
            let { data } = await this.$axios.post(`/userInfo`, myProfile.result);
            if(data.code == 0){
              this.$store.commit('SET_USER_INFO', myProfile.result);
            }else{
              throw data.msg
            }
          }else{
            throw myProfile.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      /**
       *  更新个人主页
       * */
      async updateUserHome(){
        try {
          let { data } = await this.$api.user.homepage({pt: this.deviceType.type}, this.authUser.userId);
          if(data.code == 0){
            this.resData = data.result;
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      /**
       *  关注
       * */
      async toggleFollows() {
        if(!this.resFollowsList){
          try {
            let { data } = await this.$api.user.followsList({pt: this.deviceType.type}, this.authUser.userId);
            if(data.code == 0){
              this.resFollowsList = data.result
            }else {
              throw data.msg
            }
          }catch (e){
            this.$toast.error(e)
          }
        }

        this.showFollows = !this.showFollows
      },

      /**
       *  粉丝
       * */
      async toggleFans() {
        if(!this.resFansList){
          try {
            let { data } = await this.$api.user.fansList({pt: this.deviceType.type}, this.authUser.userId);
            if(data.code == 0){
              this.resFansList = data.result;
            }else {
              throw data.msg
            }
          }catch (e){
            this.$toast.error(e)
          }
        }

        this.showFans = !this.showFans
      },

      /**
       *  编辑个人信息
       * */
      async toggleEditInfo(){ //  切换模态框
        this.showEditInfo = !this.showEditInfo;
        if(this.showEditInfo && !this.resCountries){
          await this.getCountries();

          //  初始化国家地区
          (this.userInfo.countryCode) && (this.baseInfo.countryCode = this.userInfo.countryCode);
          (this.userInfo.provinceCode) && (this.baseInfo.provinceCode = this.userInfo.provinceCode);
          (this.userInfo.cityCode) && (this.baseInfo.cityCode = this.userInfo.cityCode);
          (this.userInfo.areaCode) && (this.baseInfo.areaCode = this.userInfo.areaCode);
        }
      },
      //  返回编辑页面
      async toggleModalEdit(type){
        this.modalEditInfo = type
      },
      //  编辑介绍信息
      async subEditIntro(){
        try {
          if(!this.editIntroduction){
            throw '请输入内容'
          }
          let { data } = await this.$api.user.modifyIntroInfo({pt: this.deviceType.type}, this.authUser, {
            introduction: this.editIntroduction
          });
          if(data.code == 0){
            this.showEditInfo = false;
            this.updateUserHome();
            this.modalEditInfo = 'home';
            this.$toast.success('保存成功')
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      //  编辑头像
      async subEditAvatar(){
        try {
          this.$nuxt.$loading.start();
          let formDara = new FormData();
          formDara.set('faceFile', event.target.files[0]);
          let { data } = await this.$api.user.modifyAvatar({pt: this.deviceType.type}, this.authUser, formDara);
          this.$nuxt.$loading.finish();
          if(data.code == 0){
            this.updateUserHome();
            this.updateUserInfo();
            this.$toast.success('更换成功')
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      //  编辑基础信息
      async subEditInfo(){
        if( this.birthdayRange.selectYear && this.birthdayRange.selectMonth && this.birthdayRange.selectDay ){
          this.baseInfo.birthday = `${this.birthdayRange.selectYear}-${this.birthdayRange.selectMonth}-${this.birthdayRange.selectDay}`;
        }else{
          this.baseInfo.birthday = ''
        }

        try {
          if(!this.baseInfo.userName){
            throw '请输入姓名'
          }
          if(!this.baseInfo.gender){
            throw '请选择性别'
          }
          if(!this.baseInfo.birthday){
            throw '请选择生日'
          }
          if(!this.baseInfo.countryCode){
            throw '请选择国家'
          }
          let { data } = await this.$api.user.modifyBaseInfo({pt: this.deviceType.type}, this.authUser, this.baseInfo);
          if(data.code == 0){
            this.showEditInfo = false;
            this.updateUserHome();
            this.modalEditInfo = 'home';
            this.$toast.success('保存成功')
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },

      async getCountries(){ //  获取国家
        try {
          let { data } = await this.$api.system.countries({pt: this.deviceType.type});
          if(data.code == 0){
            this.resCountries = data.result;
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      async getProvincesList(){ //  获取省份
        try {
          let { data } = await this.$api.system.provinces({pt: this.deviceType.type}, this.baseInfo.countryCode);
          if(data.code == 0){
            this.resProvinces = data.result;

            if(this.resProvinces.length == 0){
              this.baseInfo.provinceCode = 0;
              this.baseInfo.cityCode = 0;
              this.baseInfo.areaCode = 0
            }
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      async getCitiesList(){ //  获取城市
        try {
          if(this.baseInfo.provinceCode){
            let { data } = await this.$api.system.cities({pt: this.deviceType.type}, { provinceCode: this.baseInfo.provinceCode });
            if(data.code == 0){
              this.resCityList = data.result;
            }else{
              throw data.msg
            }
          }else{
            let { data } = await this.$api.system.cities({pt: this.deviceType.type}, { countryCode: this.baseInfo.countryCode });
            if(data.code == 0){
              this.resCityList = data.result;
            }else{
              throw data.msg
            }
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      async getAreaList(){ //  获取区    countryCode: this.baseInfo.countryCode,
        try {
          let { data } = await this.$api.system.areas({pt: this.deviceType.type}, {cityCode: this.baseInfo.cityCode});
          if(data.code == 0){
            this.resAreaList = data.result;
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';
  @media screen and #{$desktop-width}{
    .user{
      padding: 32px 8px;
      .user-left{
        .left-menu{
          border: 1px solid $b3;
          .nuxt-link-active{
            background-color: $b1;
          }
        }
        .left-edit{
          padding: 24px 16px;
          border: 1px solid $b3;
          &:hover{
            cursor: pointer;
            background-color: $b1;
          }
        }
      }
      .user-right{
        padding: 0 0 0 40px;
      }
    }

    .modal-content{
      max-height: 66%;
    }
  }

  @media screen and #{$touch-width}{
    .user{
      .user-left{
        .left-edit{
          padding: 24px 0;
          border-bottom: 1px solid $b3;
        }
      }
      .user-right{
        padding: 0;
      }
    }
  }

  .user{
    margin: 0;
    .user-left{
      padding: 0 8px;
      .left-edit{
        margin-bottom: 16px;
        .edit-head{
          display: flex;
          justify-content: space-between;
          .head-txt{
            padding: 10px 0 8px 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            >h5{
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
        .edit-main{
          margin: 16px 0 24px 0;
          @include font-style(16px, 26px);
          @include one-line-hidden
        }
        .edit-foot{
          display: flex;
          justify-content: space-between;
          align-items: center;
          .foot-left{
            display: flex;
            align-items: center;
            >li{
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              text-align: center;
              &:nth-of-type(2){
                padding: 0 24px;
              }
              &:not(:nth-of-type(2)){
                &:hover{
                  cursor: pointer;
                  //  background-color: $b1;
                }
              }
              >h6{
                margin-bottom: 8px;
                @include font-style(24px)
              }
              >p{
                @include font-style(14px)
              }
            }
          }
          .foot-right{
            >button{
              padding: 10px 16px;
              background-color: $t4;
              @include font-style(16px);
              border-radius: 4px;
            }
          }
        }

      }
      .left-menu{
        padding: 0 16px;
        >li{
          &:hover{
            cursor: pointer;
            background-color: $b1;
          }
          &:not(:first-child){
            border-top: 1px solid $b3;
          }
          .menu-item{
            display: flex;
            justify-content: space-between;
            padding: 24px 0;
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

  }

  .follows-modal{
    @extend .l-user-list-modal
  }

  .fans-modal{
    @extend .l-user-list-modal
  }

  .edit-info-modal{
    .modal-head{
      justify-content: space-between;
      >p{
        @include font-style(16px, 24px)
      }
      >button{
        @include font-style(16px, 24px)
      }
    }
    .modal-main{
      padding: 16px;
      >h2{
        @include font-style(24px)
      }
      .main-items{
        padding: 12px 0;
        >li{
          padding: 12px 0;
          .item-head{
            display: flex;
            justify-content: space-between;
            position: relative;
            &:hover{
              //background-color: $b1;
              .head-icon{
                .txt{
                  display: block;
                }
              }
            }
            >input{
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: 9;
              opacity: 0;
              &:hover{
                cursor: pointer;
              }
            }
            >p{
              @include font-style(18px, 72px)
            }
            .head-icon{
              position: relative;
              >img{
                width: 72px;
                height: 72px;
                border-radius: 50%;
              }
              .txt{
                display: none;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                @include font-style(14px, $color:$b0)
              }
            }

          }
          .select{
            margin-top: 8px;
          }
          >p{
            @include font-style(14px);
          }
          .item-input{
            margin-top: 8px;
            display: flex;
            >input{
              width: 100%;
              height: 39px;
              padding: 10px 0;
              border: none;
              border-bottom: 1px solid $b3;
              @include font-style(18px);
            }
          }
          .item-btn{
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            margin-bottom: 24px;
            &:hover{
              cursor: pointer;
            }
            >h5{
              @include font-style(18px)
            }
            >button{
              @include font-style(16px, 18px, $color:$t6)
            }
          }
        }

      }
    }
  }

  .edit-intro-modal{
    .modal-head{
      justify-content: space-between;
      >button{
        @include font-style(16px, 24px)
      }
    }
    .modal-main{
      padding: 16px;
      >h2{
        @include font-style(24px)
      }
      >p{
        margin-bottom: 8px;
        padding: 16px 0;
        @include font-style(14px, 22px, $color:$t2)
      }
      .txt{
        width: 100%;
        border: none;
        @include font-style(16px, $color:$t3)

      }
    }
  }
</style>
