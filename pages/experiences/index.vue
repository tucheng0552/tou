<template>
  <div class="experiences">
    <section class="container is-widescreen l-page-section">
      <div class="tabs">
        <ul class="tabs-items">
          <li v-for="(item, idx) in resTabsList" :key="item.id"
              :class="[(flagTabs == item.id) ? 'is-active' : '']"
              @click="toggleCategory(item.id)"><a>{{item.name}}</a></li>
        </ul>
      </div>

      <!--  精选及分类  -->
      <keep-alive>
        <component
          :is="categoryComponent"
          :vacation="vacation"
          :collections="collections"
          @show-collections="showCollections"
          :experiences="experiences"
          ref="experiencesContent"
          @update-data="getIndexList"
          :isMoreExperiencesList="isMoreExperiencesList"
          @get-experiences-list="getExperiencesList"></component>
      </keep-alive>

      <!--  发足迹 -->
      <div class="editBtn" @click="openExperiencesEdit">
        <button type="button">发足迹</button>
      </div>

    </section>

    <!--  全部足迹合辑  -->
    <div :class="[isCollections ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="closeCollections"></div>
      <div class="modal-content">
        <div class="collections-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="closeCollections"></button>
          </div>
          <div class="modal-main">
            <h2>全部足迹合辑</h2>
            <ul class="main-items">
              <li v-for="(item, idx) in resCollections" :key="item.id" @click="pathCollections(item.id)">
                <img :src="item.thumbnailUrl" alt="">
                <p>{{item.name}}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!--  发足迹  -->
    <div :class="[isExperiencesEdit ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="closeExperiencesEdit"></div>
      <div class="modal-content">

        <div v-if="isUserMerchant">
          <!--  发布  -->
          <div v-show="modalExperiencesEdit == 'edit'" class="experiences-edit-modal">
            <div class="modal-head">
              <button type="button" class="close-btn" @click="closeExperiencesEdit"></button>
            </div>
            <div class="modal-main">
              <h2>发足迹</h2>
              <div class="main-form">
                <input class="input-title" type="text" placeholder="写个标题，限6-28字" v-model="experiencesInfo.title">
                <textarea class="input-content" name="" cols="30" rows="10" maxlength="3000" placeholder="千里之行，始于足下。来写下你的事迹…" v-model="experiencesInfo.content"></textarea>
                <ul class="input-images">
                  <li v-for="(item, idx) in userExperiencesImages" :key="item.id">
                    <div class="img-item">
                      <img :src="item" alt="">
                      <button type="button" @click="delUploadImg(idx)"></button>
                    </div>
                  </li>
                  <li>
                    <div class="btn-item">
                      <input type="file" @change="setUploadImg">
                    </div>
                  </li>
                </ul>
              </div>
              <ul class="main-items">
                <li>
                  <p>分类标签</p>
                  <div class="select is-small">
                    <select v-model="experiencesInfo.categoryId">
                      <option value="undefined" disabled>选择</option>
                      <option v-for="(item, idx) in categoryTabsList" :key="item.id" :value="item.id">{{item.name}}</option>
                    </select>
                  </div>
                </li>
                <li>
                  <p>述说城市</p>
                  <div class="select is-small">
                    <select v-model="experiencesInfo.countryCode">
                      <option v-for="(item, idx) in countryCodeList" :key="item.id" :value="item.countryCode">{{item.countryName}}</option>
                    </select>
                  </div>
                  <div class="select is-small">
                    <select v-model="experiencesInfo.provinceCode">
                      <option v-for="(item, idx) in provinceCodeList" :key="item.id" :value="item.provinceCode">{{item.provinceName}}</option>
                    </select>
                  </div>
                  <div class="select is-small">
                    <select v-model="experiencesInfo.cityCode">
                      <option v-for="(item, idx) in cityCodeList" :key="item.id" :value="item.cityCode">{{item.cityName}}</option>
                    </select>
                  </div>
                </li>
                <li class="room" v-if="isRadioMerchantId">
                  <div class="item-info">
                    <div class="banner">
                      <img :src="radioMerchantInfo.banners[0]" alt="">
                      <p v-if="radioMerchantInfo.operationType == 4">自营</p>
                    </div>
                    <div class="info">
                      <h5 class="info-name">{{radioMerchantInfo.name}}</h5>
                      <p>{{radioMerchantInfo.merchantSubTypeName}}-{{radioMerchantInfo.livingRoomNum}}房{{radioMerchantInfo.drawingRoomNum}}厅&nbsp;{{radioMerchantInfo.totalBedNum}}床{{radioMerchantInfo.toiletNum}}卫</p>
                      <div class="rate">
                        <ul class="u-items-star">
                          <li v-for="(rate, rdx) in rateItems(radioMerchantInfo.rateAmount.totalAverageRate)" :key="rate.id" :class="rate"></li>
                        </ul>
                        <span class="text">{{radioMerchantInfo.totalCommentNum}}</span>
                      </div>
                    </div>
                  </div>
                  <img src="~/assets/image/icon/global_release_icon_close_nor.png" alt="" @click="cancelRadioMerchantId">
                </li>
              </ul>
            </div>
            <div class="modal-foot">
              <div class="foot-icon">
                <i class="u-icon-footprint-location-nor"></i>
                <i :class="[isRadioMerchantId ? 'u-icon-footprint-room-sle' : 'u-icon-footprint-room-nor']" @click="toggleExperiencesEdit('room')"></i>
              </div>
              <button type="button" @click="subPublish">发 布</button>
            </div>
          </div>

          <!--  关联  -->
          <div v-show="modalExperiencesEdit == 'room'" class="experiences-room-modal">
            <div class="modal-head">
              <button type="button" class="back-btn" @click="toggleExperiencesEdit('edit')"></button>
              <button type="button" class="" @click="subMerchantId">确定</button>
            </div>
            <div class="modal-main">
              <h2>选择要关联的住宿</h2>
              <ul class="main-items">
                <li v-for="(item, idx) in userMerchantList" :key="item.id" @click.stop="setRadioMerchantId(idx)">
                  <div class="item-info">
                    <div class="banner">
                      <img :src="item.banners[0]" alt="">
                      <p v-if="item.operationType == 4">自营</p>
                    </div>
                    <div class="info">
                      <h5 class="info-name">{{item.name}}</h5>
                      <p>{{item.merchantSubTypeName}}-{{item.livingRoomNum}}房{{item.drawingRoomNum}}厅&nbsp;{{item.totalBedNum}}床{{item.toiletNum}}卫</p>
                      <div class="rate">
                        <ul class="u-items-star">
                          <li v-for="(rate, rdx) in rateItems(item.rateAmount.totalAverageRate)" :key="rate.id" :class="rate"></li>
                        </ul>
                        <span class="text">{{item.totalCommentNum}}</span>
                      </div>
                    </div>
                  </div>

                  <div class="u-checkbox-round">
                    <input class="checkbox-toggle" type="radio" :id="item.id" :value="idx" v-model="radioMerchantIdx">
                    <label :for="item.id" class=""></label>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div v-else>
          <!--  默认  -->
          <div class="experiences-def-modal">
            <div class="modal-head">
              <button type="button" class="close-btn" @click="closeExperiencesEdit"></button>
            </div>
            <div class="modal-main">
              <h2>您暂时还不能写足迹</h2>
              <p>为保证足迹社区内容质量，写足迹目前只对在toU平台上至少住宿过一次的用户开放</p>
              <img src="~/assets/image/icon/footprint_publish_icon_no_data.png" alt="">
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import experiences from '~/assets/js/api/experiences'
  import CategoryIndex from '~/components/experiences/CategoryIndex.vue'
  import CategoryList from '~/components/experiences/CategoryList.vue'
  import { mapState } from 'vuex'
  import { setRateItems } from '~/assets/js/utils'

  export default {
    name: "experiences",
    components: {
      CategoryIndex,
      CategoryList
    },
    head(){
      return {
        title: '足迹'
      }
    },
    data() {
      return {
        isMoreExperiencesList: true,  //  是否显示加载更多按钮
        selfCategoryCursor: 1,  //  分类足迹分页
        selfCategoryLength: 12,  //  分类足迹分页
        categoryComponent: CategoryIndex, //  动态组件
        flagTabs: 0,  //  请求的足迹类型

        isCollections: false,  //  合辑模态框
        resCollections: undefined,

        /**
         *  发布足迹
         * */
        isExperiencesEdit: false,
        modalExperiencesEdit: 'edit',
        experiencesInfo: {  //  提交参数
          title: '',
          content: '',
          categoryId: undefined,
          countryCode: '',
          provinceCode: '',
          cityCode: '',
          geoLocation: '',
          images: [],
          merchantId: 0
        },
        userExperiencesImages: [],
        userMerchantList: undefined,
        radioMerchantIdx: undefined,
        radioMerchantInfo: undefined,
        isRadioMerchantId: false,

        countryCodeList: [],
        provinceCodeList: [],
        cityCodeList: [],
      }
    },
    asyncData (context) {
      let [userInfo, pt] = [context.store.state.userInfo, context.store.state.deviceType.type];
      let _selfIsUserMerchant = userInfo.userId && (userInfo.userType != 1 || JSON.parse(userInfo.isHasOrder)) ? true : false;
      return axios.all([experiences.homepage({pt: pt}),
        experiences.getExperienceCategoryList({pt: pt}),
        experiences.getByCategory({pt: pt, cursor:0, length:4}, 0)]).then(
        axios.spread( (data, list, category)=>{
          if(data.data.code == 0 && list.data.code == 0 && category.data.code == 0){
            return {
              vacation: {
                type: 1,
                title: '推荐城市',
                items:data.data.result.handpickedVacationSpots,
              },
              collections: {
                type: 1,  //  0：首页 / 1：足迹首页
                items: data.data.result.collections
              },
              resTabsList: [{ id: 0, name: "精选", sort: 0 }, ...list.data.result],
              categoryTabsList: list.data.result,
              experiences:{
                type: 4,
                title:'toU 足迹精选',
                items:category.data.result,
                bth: undefined
              },
              isUserMerchant: _selfIsUserMerchant,  //  是否能发布足迹
            };
          }else{
            throw data.data.msg +'/'+ list.data.msg +'/'+ category.data.msg;
          }
        } )
      ).catch(
        e =>{
          context.error({ statusCode: 400, message: e })
        }
      )
    },
    mounted (){
      if(this.isUserMerchant){
        this.getCountriesList();
      }
    },
    watch: {
      'experiencesInfo.countryCode' (){
        this.getProvincesList();
      },
      'experiencesInfo.provinceCode' (){
        if(this.experiencesInfo.provinceCode){
          this.getCitiesList();
        }
      }

    },
    computed: {
      ...mapState({
        authUser: 'authUser',
        // userInfo: 'userInfo',
        deviceType: 'deviceType'
      }),
    },
    methods: {
      //  评论星级
      rateItems(rate) {
        return setRateItems(rate)
      },
      async toggleCategory(id) {
        this.flagTabs = id;
        try {
          let { data } = await this.$api.experiences.getByCategory({pt: this.deviceType.type, cursor: 0, length: id ? this.selfCategoryLength : 4}, id);
          if(data.code == 0){
            this.experiences = {
              type: 4,
              title: id ? undefined : 'toU 足迹精选',
              items:data.result,
              bth: undefined
            };
            if(id){
              if(this.categoryComponent == CategoryIndex){
                this.categoryComponent = CategoryList;
                this.selfCategoryCursor = 1;
                if(this.experiences.items.length < this.selfCategoryLength){
                  this.isMoreExperiencesList = false
                }
              }
            }else {
              if(this.categoryComponent == CategoryList){
                this.categoryComponent = CategoryIndex
              }
            }
          }else {
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      async getIndexList(){ //  获取首页精选数据
        try {
          let { data } = await this.$api.experiences.getByCategory({pt: this.deviceType.type, cursor: (this.$refs.experiencesContent.$refs.appNavigation.flagItem-1)*4, length: 4}, 0);
          if(data.code == 0){
            if(data.result.length > 0){
              this.experiences.items = data.result;
            }
          }else {
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      async getExperiencesList(){ //  获取分类数据
        try {
          let { data } = await this.$api.experiences.getByCategory({pt: this.deviceType.type, cursor: this.selfCategoryCursor*this.selfCategoryLength, length: this.selfCategoryLength}, this.flagTabs);
          if(data.code == 0){
            if(data.result.length > 0){
              this.experiences.items.push(...data.result);
              if(this.experiences.items.length < this.selfCategoryLength){
                this.isMoreExperiencesList = false
              }else{
                this.selfCategoryCursor ++
              }
            }
          }else {
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      /**
       *  合辑
       * */
      async showCollections(){
        if(!this.resCollections){
          try {
            let { data } = await this.$api.experiences.collectionsList({pt: this.deviceType.type});
            if(data.code == 0){
              this.resCollections = data.result;
            }else{
              throw data.msg
            }
          }catch (e){
            this.$toast.error(e)
          }
        }
        this.isCollections = true
      },
      closeCollections() {
        this.isCollections = false
      },
      pathCollections(id){
        this.$router.push(`/experiences/${id}/collections`);
      },
      /**
       *  发布足迹
       * */
      openExperiencesEdit(){
        if(this.authUser.userId){
          this.isExperiencesEdit = true
        }else{
          this.openLogin()
        }
      },
      closeExperiencesEdit(){
        this.isExperiencesEdit = false
      },
      async toggleExperiencesEdit(type){
        if(type == 'room' && !this.userMerchantList){
          try {
            let { data } = await this.$api.experiences.getUserConsumedMerchantList({pt: this.deviceType.type}, this.authUser);
            if(data.code == 0){
              this.userMerchantList = data.result
            }else {
              throw data.msg
            }
          }catch (e){
            this.$toast.error(e)
          }
        }

        this.modalExperiencesEdit = type;
      },
      setRadioMerchantId(idx){  //  单选关联
        this.radioMerchantIdx = idx
      },
      subMerchantId(){  //  确定关联
        this.radioMerchantInfo = this.userMerchantList[this.radioMerchantIdx];
        this.isRadioMerchantId = true;
        this.modalExperiencesEdit = 'edit'
      },
      cancelRadioMerchantId(){  //  取消关联
        this.isRadioMerchantId = false;
        this.radioMerchantIdx = undefined;
        this.radioMerchantInfo = undefined;
      },
      setUploadImg(){ //  选择图片
        let file = event.target.files[0];
        this.experiencesInfo.images.push(file);

        let reader = new FileReader();

        reader.onload = (event) => {
          this.userExperiencesImages.push(event.target.result)
        };
        if(file){
          reader.readAsDataURL(file);
        }
      },
      delUploadImg(idx){
        this.experiencesInfo.images.splice(idx,1);
        this.userExperiencesImages.splice(idx,1)
      },
      async subPublish(){ //  发布
        try {
          if(!this.experiencesInfo.title){
            throw '请填写标题'
          }
          if(!this.experiencesInfo.content){
            throw '请填写内容'
          }
          if(!this.experiencesInfo.categoryId){
            throw '未选择分类标签'
          }

          this.radioMerchantInfo && (this.experiencesInfo.merchantId = this.radioMerchantInfo.id);
          let formDara = new FormData();
          for (let elem in this.experiencesInfo) {
            if(elem == 'images'){
              for(let item of this.experiencesInfo[elem].values()){
                formDara.append(elem, item);
              }
            }else {
              formDara.set(elem, this.experiencesInfo[elem]);
            }
          }
          this.$nuxt.$loading.start();
          let { data } = await this.$api.experiences.publish({pt: this.deviceType.type}, this.authUser, formDara);
          this.$nuxt.$loading.finish();
          if(data.code == 0){
            this.closeExperiencesEdit();
            this.$toast.success('发布成功')
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      async getCountriesList(){ //  获取国家
        try {
          let { data } = await this.$api.system.countries({pt: this.deviceType.type});
          if(data.code == 0){
            this.countryCodeList = data.result;
            this.experiencesInfo.countryCode = this.countryCodeList[0].countryCode;
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      async getProvincesList(){ //  获取省份
        try {
          let { data } = await this.$api.system.provinces({pt: this.deviceType.type}, this.experiencesInfo.countryCode);
          if(data.code == 0){
            this.provinceCodeList = data.result;
            if(this.provinceCodeList.length > 0){
              this.experiencesInfo.provinceCode = this.provinceCodeList[0].provinceCode;
            }else{
              this.experiencesInfo.provinceCode = '';
              this.getCitiesList();
            }
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      async getCitiesList(){  //  获取城市
        try {
          let params = {};
          if(this.experiencesInfo.provinceCode){
            params = {
              countryCode: this.experiencesInfo.countryCode,
              provinceCode: this.experiencesInfo.provinceCode
            }
          }else{
            params = { countryCode: this.experiencesInfo.countryCode }
          }
          let { data } = await this.$api.system.cities({pt: this.deviceType.type}, params);
          if(data.code == 0){
            this.cityCodeList = data.result;
            if(this.cityCodeList.length > 0){
              this.experiencesInfo.cityCode = this.cityCodeList[0].cityCode;
            }
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
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
    }
  }
</script>

<style scoped lang="scss">
  @import "~assets/style/scss/_base.scss";

  @media screen and #{$desktop-width}{
    .modal-content{
      max-height: 66%;
    }
  }

  .editBtn{
    position: fixed;
    z-index: 49;
    left: 50%;
    bottom: 12%;
    transform: translateX(-50%);
    >button{
      padding: 12px 38px 12px 22px;
      background-color: $t4;
      border-radius: 18px;
      @include font-style(14px);
      @include bg-image('~assets/image/icon/footprint_home_icon_add.png', 12px, 12px, 68px, center)
    }
  }

  .collections-modal{
    .modal-main{
      padding: 16px;
      >h2{
        margin-bottom: 8px;
        @include font-style(24px)
      }
      .main-items{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        >li{
          position: relative;
          padding: 8px 0;
          &:hover{
            cursor: pointer;
          }
          >img{
            width: 100%;
            height: 210px;
            border-radius: 4px;
          }
          >p{
            width: 80%;
            position: absolute;
            left: 12px;
            bottom: 20px;
            @include font-style(24px, $color:$b0);
            @include more-line-hidden;
          }
        }
      }
    }
  }

  .experiences-edit-modal{
    .modal-main{
      display: flex;
      flex-direction: column;
      padding: 16px;
      >h2{
        margin-bottom: 16px;
        @include font-style(24px)
      }
      .main-form{
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid $b3;
        .input-title{
          padding: 12px 0;
          border: none;
          border-bottom:1px solid $b3;
          @include font-style(18px, 25px, $color:$t2)
        }
        .input-content{
          padding: 8px 0;
          border: none;
          @include font-style(16px, 22px, $color:$t3)
        }
        .input-images{
          display: flex;
          flex-wrap: wrap;
          padding: 8px 0;
          >li{
            margin: 8px 8px 8px 0;
            .img-item{
              position: relative;
              >img{
                width: 72px;
                height: 72px;
                border-radius: 4px;
              }
              >button{
                position: absolute;
                top: -9px;
                right: -9px;
                width: 18px;
                height: 18px;
                @include bg-image('~assets/image/icon/global_release_icon_close_nor.png', 18px, 18px);
                &:hover{
                  cursor: pointer;
                }
              }
            }
            .btn-item{
              height: 72px;
              width: 72px;
              border: 1px dotted $b3;
              @include bg-image('~assets/image/icon/global_release_icon_add_img.png', 72px, 72px, center, center);
              >input{
                width: 100%;
                height: 100%;
                opacity: 0;
                &:hover{
                  cursor: pointer;
                }
              }
            }
          }
        }
      }
      .main-items{
        >li{
          display: flex;
          justify-content: space-between;
          align-items: center;
          .select{
            >select{
              border: none;
              &:hover{
                border: none;
              }
            }
          }
          >p{
            padding: 18px 0 18px 30px;
            @include font-style(16px);
          }
          &:not(:last-child){
            border-bottom: 1px solid $b3;
          }
          &:nth-of-type(1){
            >p{
              @include bg-image('~assets/image/icon/footprint_publish_icon_classification.png', 22px, 22px)
            }
          }
          &:nth-of-type(2){
            >p{
              @include bg-image('~assets/image/icon/footprint_publish_icon_city.png', 22px, 22px)
            }
          }
          &.room{
            padding: 16px 0;
            &:not(:last-child){
              border-bottom: 1px solid $b3;
            }
            .item-info{
              display: flex;
              .banner{
                position: relative;
                >img{
                  width: 84px;
                  height: 72px;
                  border-radius: 4px;
                  margin-right: 8px;
                }
                >p{
                  position: absolute;
                  bottom: 4px;
                  right: 10px;
                  background-color: $b0;
                  border-radius: 1px;
                  padding: 2px 4px;
                  @include font-style(10px)
                }
              }
              .info{
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .info-name{
                  @include font-style(16px);
                  @include one-line-hidden;
                }
                >p{
                  @include font-style(12px, $color:$t3)
                }
                .rate{
                  display: flex;
                  align-items: center;
                  .text{
                    @include font-style(10px, $color:$t3)
                  }
                }
              }
            }
            >img{
              &:hover{
                cursor: pointer;
              }
              width: 18px;
              height: 18px;
            }
          }
        }
      }
    }
    .modal-foot{
      display: flex;
      justify-content: space-between;
      padding: 12px 16px;
      border-top: 1px solid $b3;
      .foot-icon{
        display: flex;
        align-items: center;
        >i{
          margin-right: 24px;
          width: 22px;
          height: 22px;
          &:hover{
            cursor: pointer;
          }
        }
      }
      >button{
        padding: 8px 16px;
        background-color: $t4;
        border-radius: 4px;
        @include font-style(14px, $color:$t3)
      }
    }
  }

  .experiences-room-modal{
    .modal-head{
      justify-content: space-between;
      >button{
        &:last-child{
          @include font-style(16px, 24px);
        }
      }
    }
    .modal-main{
      padding: 16px;
      >h2{
        margin-bottom: 16px;
        @include font-style(24px)
      }
      .main-items{
        display: flex;
        flex-direction: column;
        >li{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          &:hover{
            cursor: pointer;
            background-color: $b1;
          }
          &:not(:last-child){
            border-bottom: 1px solid $b3;
          }
          .item-info{
            display: flex;
            .banner{
              position: relative;
              >img{
                width: 84px;
                height: 72px;
                border-radius: 4px;
                margin-right: 8px;
              }
              >p{
                position: absolute;
                bottom: 4px;
                right: 10px;
                background-color: $b0;
                border-radius: 1px;
                padding: 2px 4px;
                @include font-style(10px)
              }
            }
            .info{
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              .info-name{
                @include font-style(16px);
                @include one-line-hidden;
              }
              >p{
                @include font-style(12px, $color:$t3)
              }
              .rate{
                display: flex;
                align-items: center;
                .text{
                  @include font-style(10px, $color:$t3)
                }
              }
            }
          }
        }
      }
    }
  }

  .experiences-def-modal{
    .modal-main{
      display: flex;
      flex-direction: column;
      padding: 16px;
      >h2{
        margin-bottom: 16px;
        @include font-style(24px)
      }
      >p{
        @include font-style(16px, 24px, $color:$t2)
      }
      >img{
        margin: 48px auto;
        width: 254px;
        height: 204px;
      }
    }
  }

  .experiences{
    .tabs{
      padding-top: 48px;
      margin: 0;
    }
  }
  .tabs-items{
    border-bottom-color: $b3;
    >li{
      >a{
        padding: 12px 0;
        margin: 0 12px;
        border-bottom: 2px solid $b0;
        @include font-style(14px, $color: $t3);
        &:hover{
          color: $t1;
        }
      }
      &.is-active{
        >a{
          color: $t1;
          border-bottom: 2px solid $t1;
        }
      }
    }
  }
</style>
