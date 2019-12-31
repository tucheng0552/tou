import http from './_base'
import { baseApiParams, formInterceptor } from '../utils'

const formHttp = http;

const experiences = {
  /**
   * 全局搜索&附近
   * */
  getExperienceBySearch : ({pt, cursor, length}, params) =>{
    let uri = '/api/v1/experiences/getExperienceBySearch';
    return http.get(uri+ baseApiParams({pt, cursor, length}, {}), {params:params})
  },

  /**
   * 获取指定用户的足迹列表
   * */
  getByUserId : ({pt, cursor, length}, targetUserId) =>{
    let uri = `/api/v1/experiences/getByUserId/${targetUserId}`;
    return http.get(uri + baseApiParams({pt}, {}));
  },

  /**
   * 足迹首页
   * */
  homepage : ({pt}) =>{
    let uri = `/api/v1/experiences/homepage`;
    return http.get(uri + baseApiParams({pt}, {}));
  },

  /**
   * 获取指定用户已消费过商家和拥有房源列表
   * */
  getUserConsumedMerchantList : ({pt}, {timeDiffMills, userId, token}) =>{
    let uri = `/api/v1/experiences/getUserConsumedMerchantList`;
    return http.get(uri + baseApiParams({pt}, {uri, timeDiffMills, userId, token}));
  },

  /**
   * 获取足迹类别列表
   * */
  getExperienceCategoryList : ({pt}) =>{
    let uri = `/api/v1/experiences/getExperienceCategoryList`;
    return http.get(uri + baseApiParams({pt}, {}));
  },

  /**
   * 获取指定分类的足迹列表
   * */
  getByCategory : ({pt, cursor, length}, categoryId) =>{
    let uri = `/api/v1/experiences/getByCategory`;
    return http.get(uri + baseApiParams({pt, cursor, length}, {}), {params:{categoryId: categoryId}});
  },

  /**
   * 获取指定分类的足迹列表
   * */
  getExperienceDetail : ({pt}, experienceId, userId) =>{
    let uri = `/api/v1/experiences/getExperienceDetail/${experienceId}`;
    return http.get(uri + baseApiParams({pt}, {}), {params: {userId: userId}});
  },

  /**
   * 获取指定分类的足迹列表
   * */
  collectionsList : ({pt} ) =>{
    let uri = `/api/v1/experiences/collections`;
    return http.get(uri + baseApiParams({pt}, {}));
  },

  /**
   * 获取指定足迹合集的详情
   * */
  collections : ({pt}, collectionId) =>{
    let uri = `/api/v1/experiences/collections/${collectionId}`;
    return http.get(uri + baseApiParams({pt}, {}));
  },

  /**
   * 足迹收藏
   * */
  favoritesPost : ({pt}, {timeDiffMills, userId, token}, experienceId) =>{
    let uri = `/api/v1/experiences/favorites/${experienceId}`;
    return http.post(uri + baseApiParams({pt}, {uri, timeDiffMills, userId, token}), {experienceId: experienceId, userId: userId});
  },

  /**
   * 取消足迹收藏
   * */
  favoritesDel : ({pt}, {timeDiffMills, userId, token}, params) =>{
    let uri = `/api/v1/experiences/favorites/${params.experienceId}`;
    return http.delete(uri + baseApiParams({pt}, {uri, timeDiffMills, userId, token}), params);
  },

  /**
   * 足迹点赞
   * */
  praise : ({pt}, {timeDiffMills, userId, token}, experienceId) =>{
    let uri = `/api/v1/experiences/praise/${experienceId}`;
    return http.post(uri + baseApiParams({pt}, {uri, timeDiffMills, userId, token}), {experienceId: experienceId, userId: userId});
  },

  /**
   * 提交足迹评论
   * */
  commentsPost : ({pt}, {timeDiffMills, userId, token}, params) =>{
    let uri = `/api/v1/experiences/${params.experiencesId}/comments`;
    return http.post(uri + baseApiParams({pt}, {uri, timeDiffMills, userId, token}), {userId: userId, ...params});
  },

  /**
   * 获取指定足迹的评论列表
   * */
  commentsList : ({pt, cursor, length}, experiencesId, userId) =>{
    let uri = `/api/v1/experiences/${experiencesId}/comments`;
    return http.get(uri + baseApiParams({pt, cursor, length}, {}), {params: {userId: userId}});
  },

  /**
   * 评论点赞
   * */
  commentPraise : ({pt}, {timeDiffMills, userId, token}, experienceCommentId) =>{
    let uri = `/api/v1/experiences/commentPraise/${experienceCommentId}`;
    return http.post(uri + baseApiParams({pt}, {uri, timeDiffMills, userId, token}), {experienceCommentId: experienceCommentId, userId: userId});
  },

  /**
   * 删除足迹信息
   * */
  delete : ({pt}, {timeDiffMills, userId, token}, experiencesId) =>{
    let uri = `/api/v1/experiences/${experiencesId}`;
    return http.delete(uri + baseApiParams({pt}, {uri, timeDiffMills, userId, token}));
  },


  /**
   * 发布足迹信息
   * */
  publish : ({pt}, {timeDiffMills, userId, token}, params) =>{
    formHttp.interceptors.request.eject(formInterceptor);
    let uri = `/api/v1/experiences/experiences`;
    return http.post(uri + baseApiParams({pt}, {uri, timeDiffMills, userId, token}), params);
  },

};

export default experiences
