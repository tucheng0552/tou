const pkg = require('./package');

module.exports = {
  // buildDir: 'tou_web', //  构建目录
  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/image/nav_icon_logo.png' }
      // { rel: 'icon', type: 'image/x-icon', href: '/_nuxt/img/490bfd0.png' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  // loading: { color: '#ffdc2e' },
  loading: '~/components/AppLoading.vue',

  /*
  ** Global CSS
  */
  css: [
    '~assets/style/css/reset.css',
    'swiper/dist/css/swiper.css',
    // 项目中的 Sass 文件
    { src: '~assets/style/scss/style.scss', lang: 'scss' }
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/api', ssr: false },
    '~/plugins/axios',
    { src: '~/plugins/swiper', ssr: false},
    '~/plugins/amap',
    { src: '~/plugins/braintree', ssr: false }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    // Doc:https://github.com/nuxt-community/modules/tree/master/packages/bulma
    '@nuxtjs/bulma',
    //  组件缓存
    '@nuxtjs/component-cache',
    //  toast
    '@nuxtjs/toast'
  ],
  //  toast 配置
  toast: {
    theme: "outline",
    position: 'top-center',
    duration : 4000
  },
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    //  服务端 api
    baseURL: '/koa-server/api',
    timeout: 10000*3, //  超时
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    }
  },
  router: {
    // 在每个页面渲染前运行
    middleware: ['redirect', 'device', 'currency']
  },
  /*
  ** Build configuration
  */
  build: {
    // analyze: true,
    extractCSS: true,
    optimization: {
      splitChunks: {
        chunks: 'all',
      }
    },
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      //  配置预处理器
      if(ctx.isClient){
        const vueLoader = config.module.rules.find((rule) => rule.loader === 'vue-loader');
        vueLoader.options.loaders = 'vue-style-loader!css-loader!sass-loader';
      }
    },
  }
};
