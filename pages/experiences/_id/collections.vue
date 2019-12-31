<template>
  <div class="">
    <section class="container is-widescreen">
      <div class="columns is-desktop details">
        <div class="column is-12-touch details-main">
          <div class="user-experiences">
            <h6 class="is-hidden-touch">足迹合辑详情</h6>

            <div v-if="resData.thumbnailUrl" class="experiences-cover" ref="contentCover" :style="{backgroundImage: 'url('+ resData.thumbnailUrl +')', backgroundSize:'cover', backgroundRepeat:'no-repeat'}">
              <div class="cover-txt">
                <h2>{{resData.name}}</h2>
                <p>{{resData.introduction}}</p>
                <div @click="onDetails" class="more-button" v-if="deviceType.type == 4">
                  <span>查看合辑足迹 ({{resData.experienceCollectionItems.length}}篇)</span>
                  <i></i>
                </div>
                <div class="more-button" v-else-if="deviceType.type == 3">
                  <span>合辑足迹 ({{resData.experienceCollectionItems.length}}篇)</span>
                </div>
              </div>
            </div>

            <div>  <!--  v-show="showDetails"  -->
              <ul class="experiences-list">
                <li v-for="(item, idx) in resData.experienceCollectionItems" :key="idx">
                  <p>{{item.recommendation}}</p>
                  <img :src="item.experienceImage[0].imageUri" alt="">
                  <h6>{{item.experience.title}}</h6>
                  <p>{{item.experience.content}}</p>
                  <div class="list-footer">
                    <div class="footer-left">
                      <img :src="item.experience.faceUrl" alt="">
                      <div class="left">
                        <h6>{{item.experience.userName}}</h6>
                        <button type="button">阅读原文</button>
                      </div>
                    </div>
                    <div class="footer-right">
                      <i class="u-icon-list-like">{{item.experience.totalPraiseNum}}</i>
                      <i class="u-icon-list-comments">{{item.experience.totalCommentNum}}</i>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

          </div>

        </div>

        <div class="column is-4-desktop is-hidden-touch details-right">
          <todo-list-side :experienceList="resData.experienceList"></todo-list-side>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import axios from 'axios'
  import experiences from '~/assets/js/api/experiences'
  import TodoListSide from '~/components/experiences/TodoListSide.vue'
  import { mapState } from 'vuex'

  export default {
    name: "experiences-id-collections",
    validate ({ params }) {
      // 必须是number类型
      return /^\d+$/.test(params.id)
    },
    components: {
      TodoListSide
    },
    head(){
      return {
        title:this.resData.name
      }
    },
    data(){
      return {
        appHeight: undefined,
        showDetails: false
      }
    },
    asyncData (context) {
      let id = context.params.id;
      return axios.all([experiences.collections({pt: context.store.state.deviceType.type}, id)]).then(
        axios.spread( (data)=>{
          if(data.data.code == 0){
            return {
              resData: data.data.result
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
    computed: {
      ...mapState({
        deviceType: 'deviceType'
      }),
    },
    mounted(){
      if(this.deviceType.type == 4 || this.deviceType.type == 5){
        this.appHeight = this.$refs.contentCover.clientHeight - 73;
      }else if(this.deviceType.type == 3){
        this.showDetails = true
      }
    },
    methods: {
      onDetails(){
        if(!this.showDetails){
          this.showDetails = true;
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~assets/style/scss/_base.scss';

  @media screen and #{$desktop-width}{
    .container{
      padding: 0 .5rem 3rem .5rem;
    }
    .details{
      margin: 0;
      padding: 24px 0;
      .details-main{
        padding: 0 .5rem;
      }
      .details-right{
        margin-left: 32px;
      }
    }
    .user-experiences{
      >h6{
        margin-bottom: 16px;
        @include font-style(18px);
        font-weight: bold;
      }
      .experiences-cover{
        border-radius: 4px;
        height: 720px;
      }
    }
  }

  @media screen and #{$touch-width}{
    .container{
      padding: 0;
    }
    .details{
      margin: 0;
      padding: 0;
      .details-main{
        padding: 0;
      }
      .details-right{
        padding: 0;
      }
    }
    .user-experiences{
      .experiences-cover{
        flex: 1;
        min-height: 100vh;
      }
      .experiences-list{
        padding: 0 16px;
      }
    }
  }

  .user-experiences{
    .experiences-cover{
      position: relative;
      .cover-txt{
        position: absolute;
        bottom: 0;
        left: 0;
        padding: 0 16px;
        >h2{
          width: 86%;
          @include font-style(24px, 32px, $color:$b0);
        }
        >p{
          padding: 8px 0 0 0;
          @include font-style(18px, 26px, $color:$b0);
          @include more-line-hidden(10)
        }
        .more-button{
          display: flex;
          justify-content: space-between;
          padding: 16px 0;
          margin-top: 16px;
          border-top: 1px solid $b3;
          @include font-style(16px, $color:$b0);
          >i{
            width: 12px;
            height: 16px;
            @include bg-image('~assets/image/icon/global_icon_list_arrow_down_white.png', 12px, 6px);
          }
        }
      }
    }
    .experiences-list{
      >li {
        padding: 24px 0;
        &:not(:last-child) {
          border-bottom: 1px solid $b3;
        }
        >h6 {
          margin: 16px 0 8px 0;
          @include font-style(18px, 26px);
        }
        >p {
          margin-bottom: 16px;
          @include font-style(16px, 26px);
        }
        >img {
          width: 100%;
          height: 258px;
          border-radius: 4px;
        }
        .list-footer {
          display: flex;
          justify-content: space-between;
          .footer-left {
            display: flex;
            >img {
              @extend .l-user-info-face
            }
            .left {
              display: flex;
              flex-direction: column;
              justify-content: center;
              margin-left: 8px;
              >h6 {
                margin-bottom: 8px;
                @include font-style(16px);
              }
              >button {
                @include font-style(14px, $color: $t6);
              }
            }
          }
          .footer-right {
            display: flex;
            >i {
              padding-left: 19px;
              margin: 0 6px;
              font-style: normal;
              @include font-style(14px,48px, $color:$t3);
            }
          }
        }
      }
    }
  }

</style>
