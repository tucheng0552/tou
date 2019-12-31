import qs from 'qs'

export default function ({ $axios, redirect }) {
  $axios.onRequest(config =>{
    //  post 请求时设置参数的提交方式 form
    if (config.method.toLocaleLowerCase() === 'post'
      || config.method.toLocaleLowerCase() === 'put'
      || config.method.toLocaleLowerCase() === 'delete') {
      config.data = qs.stringify(config.data)
    }
    return config
  });

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status);
    if (code === 500) {
      redirect('/sorry')
    }
  })
}
