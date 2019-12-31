
const Koa = require('koa');
const consola = require('consola');
const { Nuxt, Builder } = require('nuxt');

const app = new Koa();
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
/**
 * 添加 bodyparser 中间件，用于解析请求体
 * */
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());
/**
 * 添加服务端 session
 * */
const session = require('koa-session');
app.keys = ['some secret hurr'];
//  session 配置
const CONFIG = {
  key: 'koa:sess',
  maxAge: 86400000,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false,
};

app.use(session(CONFIG, app));

/**
 * 注册服务端路由
 * */
const router = require('./router');
app
  .use(router.routes())
  .use(router.allowedMethods());

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js');
config.dev = !(app.env === 'production');

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config);

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build()
  }

  app.use(ctx => {
    ctx.status = 200; // koa defaults to 404 when it sees that status is unset
    //  为koa注册 req.session （nuxtServerInit）
    ctx.req.session = ctx.session;

    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve);
      ctx.res.on('finish', resolve);
      nuxt.render(ctx.req, ctx.res, promise => {
        // nuxt.render passes a rejected promise into callback on error.
        promise.then(resolve).catch(reject)
      })
    })
  });

  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start();
