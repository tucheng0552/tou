import system from '~/assets/js/api/system'

export default async (context)=>{

  if(context.store.state.currencyList.length < 1){
    let { data } = await system.currencyList();
    if(data.code ==0){
      context.store.commit("SET_CURRENCY_LIST", data.result);
    }
  }

  // let { currency } = context.route.query;
  //
  // if(currency){
  //   return context.redirect(context.route.path+=`?currency=${currency}`)
  // }

}
