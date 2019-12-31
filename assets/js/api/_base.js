/**
 *  封装 axios
 * */
import axios from 'axios'
import qs from 'qs'
//  导入配置
import config from '../config'
/**
 *  实例化
 * */
const http = axios.create({
  timeout: 10000*3, //  超时
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
  }
});

/**
 *  不同环境时请求路径的切换
 * */
if (process.env.NODE_ENV == 'development') {
  http.defaults.baseURL = config.API_URL_TEST;
} else if (process.env.NODE_ENV == 'test') {
  http.defaults.baseURL = config.API_URL_TEST;
} else if (process.env.NODE_ENV == 'production') {
  http.defaults.baseURL = config.API_URL;
}

/**
 *  POST 请求时设置参数的提交方式
 * */
// http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

/**
 *  请求拦截器
 * */
http.interceptors.request.use(
  config =>{
    //  post 请求时格式化参数
    if (config.method.toLocaleLowerCase() === 'post'
      || config.method.toLocaleLowerCase() === 'put'
      || config.method.toLocaleLowerCase() === 'delete') {
      config.data = qs.stringify(config.data)
    }
    return config
  }, error => {
    return Promise.reject(error);
  }
);

/**
 *  响应拦截器
 * */
http.interceptors.response.use(
  response =>{
    if(response.data.code == 10015){
      // throw new Error('请重新登录')
    }
    return response
  }, error => {

    return Promise.reject(error.response);
  }
);

export default http
