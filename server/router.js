const Router = require('koa-router');
const router = new Router();

const API_URL_SERVER = '/koa-server/api';

// 发起 POST /api/login 请求完成用户登录，并添加该用户到 session.authUser
router.post(`${API_URL_SERVER}/login`, (ctx, next) => {
  let {timeDiffMills, token, userId} = ctx.request.body;

  if(token && userId){
    ctx.session.authUser = {
      timeDiffMills: timeDiffMills,
      token: token,
      userId: userId
    };
    return ctx.body={ code:0, msg: 'ok'}
  }
  return ctx.body={ msg: 'session.authUser保存失败' }
});

// userInfo 添加用户信息到 session.userInfo
router.post(`${API_URL_SERVER}/userInfo`, (ctx, next) => {
  ctx.session.userInfo = ctx.request.body;

  return ctx.body={ code:0, msg:'ok'}
});

// 发起 POST /api/logout 请求注销当前用户，并从 session 中移除
router.post(`${API_URL_SERVER}/logout`, (ctx, next) => {
  delete ctx.session.authUser;
  delete ctx.session.userInfo;
  delete ctx.session.deviceType;

  return ctx.body={ code:0, msg: 'ok' }
});

// 在session中保存设备类型
router.get(`${API_URL_SERVER}/setDeviceType`, (ctx, next) => {
  let { type, env } = ctx.query;
  if(type && env){
    ctx.session.deviceType = {
      type: type,
      env: env
    };
    return ctx.body={ code:0, msg: 'ok' }
  }

  return ctx.body={ msg: 'deviceType保存失败' }
});

module.exports = router;
