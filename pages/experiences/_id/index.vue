<template>
  <div class="">
    <section class="container is-widescreen l-page-section">
      <div class="user-info">
        <div class="info-txt">
          <nuxt-link :to="(resData.userType == 1) ? '/user/'+resData.userId+'/other' : '/user/'+resData.userId+'/merchant'" class="face">
            <img :src="resData.faceUrl" alt="">
          </nuxt-link>
          <div class="txt">
            <h6>{{resData.userName}}</h6>
            <p><span>{{resData.userCityStr || ''}}</span><span>{{resData.createdAt}}</span></p>
          </div>
          <div class="num">
            <i class="u-icon-list-like-sle" v-if="resData.isPraise">{{resData.totalPraiseNum}}</i>
            <i class="u-icon-list-like" @click="subPraise" v-else>{{resData.totalPraiseNum}}</i>
            <i class="u-icon-list-comments">{{resData.totalCommentNum}}</i>
          </div>
        </div>
        <div class="info-btn">
          <button type="button" class="" @click="delFollows(resData.userId)" v-if="resData.isFollows">已关注</button>
          <button type="button" class="active" @click="subFollows(resData.userId)" v-else>关&nbsp;注</button>
          <button type="button" class="light" @click="toggleEditComments">写评论</button>
        </div>
      </div>
      <div class="columns is-desktop details">
        <div class="column is-12-touch details-main">
          <div class="user-experiences">
            <h6 class="">足迹详情</h6>
            <ul class="experiences-photo">
              <li v-for="(item, idx) in resData.experienceImages" :key="idx">
                <img :src="item.imageUri" alt="">
              </li>
              <li><p>{{resData.relatedCity}}</p></li>
            </ul>
            <article class="experiences-article">
              <h4>{{resData.title}}</h4>
              <p class="txt">{{resData.content}}</p>
              <div class="other">
                <p>{{resData.totalPraiseNum}}人已赞</p>
                <button type="button" @click="toggleReport">举报</button>
              </div>
            </article>
          </div>

          <div class="user-comments" v-if="resData.totalCommentNum">
            <div class="comments-title">
              <h4>{{resData.totalCommentNum}}条评论</h4>
              <button class="all" @click="toggleListComments">查看全部</button>
            </div>
            <ul class="comments-content">
              <li>
                <div class="content-info">
                  <img :src="resData.comment.faceUrl" alt="">
                  <div class="info-head">
                    <div class="head-left">
                      <h6>{{resData.comment.userName}}</h6>
                      <p>{{resData.comment.createdAt}}</p>
                    </div>
                    <div class="head-right">
                      <i class="u-icon-list-like-sle" v-if="resData.comment.isPraise">{{resData.comment.praiseNum}}</i>
                      <i class="u-icon-list-like" @click="subPraiseComments(resData.comment.id)" v-else>{{resData.comment.praiseNum}}</i>
                    </div>
                  </div>
                </div>
                <p class="content-txt">{{resData.comment.content}}</p>
              </li>
            </ul>
            <div class="comments-add" @click="toggleEditComments">
              <button type="button">添加评论</button>
            </div>
          </div>
        </div>

        <div class="column is-4-desktop is-12-touch details-right">
          <todo-list-side :experienceList="resData.experienceList"></todo-list-side>
        </div>
      </div>

    </section>

    <!--  写评论  -->
    <div :class="[showEditComments ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="toggleEditComments"></div>
      <div class="modal-content">
        <div class="edit-comments-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="toggleEditComments"></button>
          </div>
          <div class="modal-main">
            <h2>写评论</h2>
            <textarea class="txt" name="editIntroduction" cols="30" rows="10" v-model="editComments" placeholder="说点儿什么…"></textarea>
          </div>
          <div class="modal-foot">
            <button type="button" class="sub-btn" @click="subEditComments">提交</button>
          </div>
        </div>
      </div>
    </div>

    <!--  评论列表  -->
    <div :class="[showListComments ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="toggleListComments"></div>
      <div class="modal-content">
        <div class="list-comments-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="toggleListComments"></button>
            <button type="button" @click="toggleEditComments('list')">写评论</button>
          </div>
          <div class="modal-main">
            <h2>{{resData.totalCommentNum}}条评论</h2>
            <ul class="main-items">
              <li v-for="(item, idx) in resCommentsList" :key="item.id">
                <div class="content-info">
                  <img :src="item.faceUrl" alt="">
                  <div class="info-head">
                    <div class="head-left">
                      <h6>{{item.userName}}</h6>
                      <p>{{item.createdAt}}</p>
                    </div>
                    <div class="head-right">
                      <i class="u-icon-list-like-sle" v-if="item.isPraise">{{item.praiseNum}}</i>
                      <i class="u-icon-list-like" @click="subPraiseComments(item.id, 'list')" v-else>{{item.praiseNum}}</i>
                    </div>
                  </div>
                </div>
                <p class="content-txt">{{item.content}}</p>
              </li>
            </ul>
          </div>

          <div class="modal-foot" v-if="isMoreCommentList">
            <button type="button" @click="pushCommentsList">加载更多</button>
          </div>
        </div>
      </div>
    </div>

    <!--  评论列表  -->
    <div :class="[showReport ? 'is-active' : '', 'modal']">
      <div class="modal-background" @click="toggleReport"></div>
      <div class="modal-content">
        <div v-show="modalReportType == 'report'" class="report-modal">
          <div class="modal-head">
            <button type="button" class="close-btn" @click="setModalReport('index')"></button>
          </div>
          <div class="modal-main">
            <h2>举报此用户言论</h2>
            <ul class="main-items">
              <li v-for="(item, idx) in resCommentReportList" :key="item.id" @click="setModalReport('detail', item)">
                <p>{{item.name}}</p>
              </li>
            </ul>
          </div>
        </div>
        <div v-show="modalReportType == 'detail'" class="report-modal">
          <div class="modal-head">
            <button type="button" class="back-btn" @click="setModalReport('report')"></button>
          </div>
          <div class="modal-main">
            <h2>{{selectCommentReport.name}}</h2>
            <p class="text">{{selectCommentReport.desc}}</p>
            <div class="main-form">
              <textarea class="input-content" name="" cols="30" rows="10" maxlength="3000" placeholder="填写详细描述" v-model="reqCommentReport.reportDetail"></textarea>
              <ul class="input-images">
                <li v-for="(item, idx) in commentReportImages" :key="item.id">
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
          </div>

          <div class="modal-foot">
            <button type="button" @click="subCommentReport">举报</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import experiences from '~/assets/js/api/experiences'
  import TodoListSide from '~/components/experiences/TodoListSide.vue'
  import { mapState } from 'vuex'

  export default {
    name: "experiences-id",
    validate ({ params }) {
      // 必须是number类型
      return /^\d+$/.test(params.id)
    },
    components: {
      TodoListSide
    },
    head(){
      return {
        title:this.resData.title
      }
    },
    data() {
      return {
        showReport:false,
        modalReportType: 'report',
        resCommentReportList: [],
        selectCommentReport: {},
        commentReportImages: [],
        reqCommentReport: {
          reportDetail: '',
          images: [],
        },
        /**
         *  评论
         * */
        showEditComments: false, //  模态框（写）
        showListComments: false, //  模态框（列表）
        editComments: '',
        isMoreCommentList: false,
        selfCursor:0
      }
    },
    asyncData (context) {
      let [pt, id, userId] = [context.store.state.deviceType.type, context.params.id, context.store.state.authUser.userId];
      return axios.all([experiences.getExperienceDetail({pt: pt}, id, userId)]).then(
        axios.spread( (data)=>{
          if(data.data.code == 0){
            return {
              resData: data.data.result,
              resCommentsList: (data.data.result.totalCommentNum > 10) ? true : false,
            };
          }else{
            throw data.data.msg;
          }
        } )
      ).catch(
        e =>{
          context.error({ statusCode: 400, message: e })
        }
      )
    },
    async mounted(){
      if(this.authUser.userId){
        try{
          let { data } = await this.$api.system.userExpressionReportTypeList({pt: this.deviceType.type}, this.authUser);
          if(data.code == 0){
            this.resCommentReportList = data.result;
            this.selectCommentReport = this.resCommentReportList[0]
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      }
    },
    computed: {
      ...mapState({
        authUser: 'authUser',
        deviceType: 'deviceType',
        userInfo: 'userInfo'
      }),
    },
    methods: {
      setUploadImg(){ //  选择图片
        let file = event.target.files[0];
        this.reqCommentReport.images.push(file);

        let reader = new FileReader();

        reader.onload = (event) => {
          this.commentReportImages.push(event.target.result)
        };
        if(file){
          reader.readAsDataURL(file);
        }

      },
      delUploadImg(idx){
        this.reqCommentReport.images.splice(idx,1);
        this.commentReportImages.splice(idx,1)
      },
      /**
       *  举报
       * */
      toggleReport(){
        if(this.authUser.userId){
          this.showReport = !this.showReport
        }else{
          this.openLogin()
        }
        !this.showReport && (this.modalReportType = 'report')
      },
      setModalReport(type, item){ //  切换显示
        this.modalReportType = type;
        item && (this.selectCommentReport = item)
      },
      async subCommentReport(){
        if(this.reqCommentReport.reportDetail){
          try {
            let formDara = new FormData();
            for (let elem in this.reqCommentReport) {
              if(elem == 'images'){
                for(let item of this.reqCommentReport[elem].values()){
                  formDara.append(elem, item);
                }
              }else {
                formDara.set(elem, this.reqCommentReport[elem]);
              }
            }
            formDara.set('targetUserId', this.resData.userId);
            formDara.set('reportTypeId', this.selectCommentReport.creditValue);
            let { data } = await this.$api.user.userExpressionReport({pt: this.deviceType.type}, this.authUser, formDara);
            if(data.code == 0) {
              this.showReport = false;
              this.modalReportType = 'report';
              this.reqCommentReport.reportDetail = '';
              this.reqCommentReport.images = [];
              this.$toast.success('提交成功')
            }else{
              throw data.msg
            }
          }catch (e){
            this.$toast.error(e)
          }
        }else{
          this.$toast.error('请填写内容')
        }
      },

      async getExperienceDetail(){  //  获取数据
        try {
          let { data } = await this.$api.experiences.getExperienceDetail({pt: this.deviceType.type}, this.$route.params.id, this.authUser.userId);
          if(data.code == 0){
            this.resData = data.result
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      async getCommentsList(){  //  获取评论列表
        try {
          let { data } = await this.$api.experiences.commentsList({pt: this.deviceType.type, cursor: 0, length: 10}, this.$route.params.id, this.authUser.userId);
          if(data.code == 0){
            this.resCommentsList = data.result;
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },
      async pushCommentsList(){  //  获取更多评论列表
        if(this.isMoreCommentList){
          try {
            this.selfCursor ++;
            let { data } = await this.$api.experiences.commentsList({pt: this.deviceType.type,
              cursor: this.selfCursor*10, length: 10}, this.$route.params.id, this.authUser.userId);
            if(data.code == 0){
              if(data.result.length > 0){
                this.resCommentsList.push(...data.result)
              }
              if(data.result.length < 10){
                this.isMoreCommentList = false
              }

            }else{
              throw data.msg
            }
          }catch (e){
            this.$toast.error(e)
          }
        }
      },
      async subPraise(){ //  点赞
        if(this.authUser.userId){
          try {
            let { data } = await this.$api.experiences.praise({pt: this.deviceType.type}, this.authUser, this.$route.params.id);
            if(data.code == 0){
              this.getExperienceDetail();
              this.$toast.success('点赞成功')
            }else{
              throw data.msg
            }
          }catch (e){
            this.$toast.error(e)
          }
        }else{
          this.openLogin()
        }
      },
      async subPraiseComments(id, type){  //  点赞评论
        if(this.authUser.userId){
          try {
            let { data } = await this.$api.experiences.commentPraise({pt: this.deviceType.type}, this.authUser, id);
            if(data.code == 0){
              if(type == 'list'){
                this.getCommentsList()
              }else{
                this.getExperienceDetail()
              }
              this.$toast.success('点赞成功')
            }else{
              throw data.msg
            }
          }catch (e){
            this.$toast.error(e)
          }
        }else{
          this.showListComments && (this.showListComments = false);
          this.openLogin()
        }
      },
      async subFollows(targetUserId){ //  关注
        if(this.authUser.userId){
          try {
            let { data } = await this.$api.user.follow({pt: this.deviceType.type}, this.authUser, targetUserId);
            if(data.code == 0){
              this.getExperienceDetail();
              this.$toast.success('关注成功')
            }else{
              throw data.msg
            }
          }catch (e){
            this.$toast.error(e)
          }
        }else{
          this.openLogin()
        }
      },
      async delFollows(targetUserId){ //  取消关注
        try {
          let { data } = await this.$api.user.unFollow({pt: this.deviceType.type}, this.authUser, targetUserId);
          if(data.code == 0){
            this.getExperienceDetail();
            this.$toast.success('取消成功')
          }else{
            throw data.msg
          }
        }catch (e){
          this.$toast.error(e)
        }
      },

      /**
       *  评论
       * */
      toggleEditComments(type){
        (type == 'list') && (this.showListComments = false);
        if(this.authUser.userId){
          this.showEditComments = !this.showEditComments
        }else{
          this.showEditComments && (this.showEditComments = false);
          this.openLogin()
        }
      },
      async toggleListComments(){
        this.showListComments = !this.showListComments;
        if(!this.resCommentsList){
          this.getCommentsList()
        }
      },
      async subEditComments(){  //  提交
        if(this.editComments){
          try {
            let { data } = await this.$api.experiences.commentsPost({pt: this.deviceType.type}, this.authUser, {
              experiencesId: this.$route.params.id,
              content: this.editComments,
              // replyTargetUid: this.resData.userId
            });
            if(data.code == 0){
              this.showEditComments = false;
              this.getExperienceDetail();
              this.$toast.success('提交成功')
            }else{
              throw data.msg
            }
          }catch (e){
            this.$toast.error(e)
          }
        }else{
          this.$toast.error('请填写内容')
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
  @import '~assets/style/scss/_base.scss';
  @media screen and #{$desktop-width}{
    .details{
      .details-right{
        margin-left: 32px;
      }
    }
    .modal-content{
      max-height: 66%;
    }
    .user-info{
      .info-txt{
        .num{
          margin-left: 48px;
        }
      }
    }
  }

  @media screen and #{$touch-width}{
    .user-comments{
      .comments-add{
        border-bottom: 1px solid $b3;
      }
    }
    .user-info{
      .info-bt{
        flex-direction: column;
      }
    }
  }

  .details{
    margin: 0;
    padding: 24px 0;
    .details-main{
      padding: 0 .5rem;
    }
    .details-right{
      padding: 0;
    }
  }

  .user-info{
    display: flex;
    justify-content: space-between;
    padding: 1rem .5rem;
    .info-txt{
      display: flex;
      .face{
        &:hover{
          cursor: pointer;
        }
        >img{
          @extend .l-user-info-face
        }
      }
      .txt{
        padding: 5px 9px;
        >h6{
          @include font-style(16px);
          margin-bottom: 8px;
        }
        >p{
          @include font-style(14px);
          span{
            margin-right: 8px;
            color: $t3;
          }
        }
      }
      .num{
        display: flex;
        align-items: center;
        >i{
          padding-left: 19px;
          margin: 0 6px;
          font-style: normal;
          @include font-style(14px, 48px, $color:$t2)
        }
      }
    }
    .info-btn{
      display: flex;
      align-items: center;
      >button{
        margin: 0 12px;
        padding: 8px 16px;
        background-color: $b1;
        border-radius: 4px;
        @include font-style(14px, $color: $t3);
        &.light{
          background-color: $t6;
          color: $b0;
        }
        &.active{
          background-color: $t4;
          color: $t1;
        }
      }
    }
  }
  .user-experiences{
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid $b3;
    >h6{
      margin-bottom: 16px;
      @include font-style(18px);
      font-weight: bold;
    }

    .experiences-photo{
      display: flex;
      flex-direction: column;
      >li{
        >img{
          width: 100%;
          margin-bottom: 4px;
          border-radius: 4px;
        }
        >p{
          padding-left: 20px;
          margin: 12px 0 24px 0;
          @include bg-image('~assets/image/icon/footprint_publish_icon_location_nor.png', 16px, 16px);
          @include font-style($size:14px, $height:16px, $color:$t6);
        }
      }
    }
    .experiences-article{
      >h4{
        font-weight: bold;
        @include font-style(20px, 28px);
      }
      .txt{
        @include font-style(16px, 26px);
        padding-top: 16px;
      }
      .other{
        display: flex;
        justify-content: space-between;
        margin: 26px 0;
        >p{
          @include font-style(18px, $color:$t6);
        }
        >button{
          @include font-style(14px, 18px, $color:$t2);
        }
      }
    }
  }

  //  用户评论
  .user-comments{
    .comments-title{
      display: flex;
      justify-content: space-between;
      margin-top: 24px;
      >h4{
        @include font-style(18px);
      }
      .all{
        @include bg-image('~assets/image/icon/global_icon_list_arrow.png', 6px, 12px, $top:100%, $left:100%);
        @include font-style(14px, $color:$t3);
        padding: 2px 10px 2px 0;
      }
    }
    .comments-content{
      >li{
        padding: 16px 0;
        &:not(:last-child) {
          border-bottom: 1px solid $b3;
        }
      }
      .content-info{
        display: flex;
        >img{
          @extend .l-user-info-face;
          margin-right: 8px;
        }
        .info-head{
          display: flex;
          flex: 1;
          justify-content: space-between;
          .head-left{
            padding: 5px 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            >h6{
              @include font-style(16px);
            }
            >p{
              @include font-style(14px, $color:$t2);
            }
          }
          .head-right{
            display: flex;
            align-items: center;
            >i{
              padding-left: 19px;
              margin: 0 6px;
              font-style: normal;
              @include font-style(14px,24px, $color:$t3);
            }
          }
        }
      }
      .content-txt{
        padding: 16px 0;
        @include font-style(18px, 26px);
      }
    }
    .comments-add{
      padding: 24px 0;
      border-top: 1px solid $b3;
      &:hover{
        cursor: pointer;
        background-color: $b1;
      }
      >button{
        @include font-style(18px, $color:$t6);
      }
    }
  }

  .edit-comments-modal{
    .modal-main{
      padding: 16px;
      >h2{
        margin-bottom: 24px;
        @include font-style(24px)
      }
      .txt{
        width: 100%;
        border: none;
        @include font-style(16px, $color:$t3)

      }
    }
    .modal-foot{
      padding: 16px;
      .sub-btn{
        width: 100%;
        height: 48px;
        background-color: $t4;
        border-radius: 4px;
        @include font-style(16px, 48px);

      }
    }
  }
  .list-comments-modal{
    .modal-head{
      justify-content: space-between;
      >button{
        @include font-style(14px, 24px, $color:$t6)
      }
    }
    .modal-main{
      padding: 16px;
      >h2{
        margin-bottom: 24px;
        @include font-style(24px)
      }
      .main-items{
        >li{
          padding: 16px 0;
          border-top: 1px solid $b3;
        }
        .content-info{
          display: flex;
          >img{
            @extend .l-user-info-face;
            margin-right: 8px;
          }
          .info-head{
            display: flex;
            flex: 1;
            justify-content: space-between;
            .head-left{
              padding: 5px 0;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              >h6{
                @include font-style(16px);
              }
              >p{
                @include font-style(14px, $color:$t2);
              }
            }
            .head-right{
              display: flex;
              align-items: center;
              >i{
                padding-left: 19px;
                margin: 0 6px;
                font-style: normal;
                @include font-style(14px,24px, $color:$t3);
              }
            }
          }
        }
        .content-txt{
          padding: 16px 0;
          @include font-style(18px, 26px);
        }
      }
    }
    .modal-foot{
      padding: 48px 0;
      text-align: center;
      >button{
        padding: 15px 32px;
        background-color: $t4;
        border-radius: 4px;
        @include font-style(18px)
      }
    }
  }
</style>
