
/**
 * 路由为 '/' 时重定向到 '/home'
 * */
export default ({ route, redirect })=>{
  if(route.path === '/'){
    return redirect('/home')
  }
}
