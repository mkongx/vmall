import {
  ADD_COUNTER,
  ADD_TO_CART,
} from './mutations-types'

export default {
  addCart(context, payload) {
    // state.cartList.push(payload)
    // 方法一 循环判断
    // let oldProduct = null
    // for (const item of state.cartList) {
    //   if (item.iid === payload.iid) {
    //     oldProduct = item
    //   }
    // }
    // if (oldProduct) {
    //   oldProduct.count += 1
    // } else {
    //   payload.count = 1
    //   state.cartList.push(payload)
    // }
    //方法二 数组高阶函数
    let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

    if (oldProduct) {
      // oldProduct.count += 1
      context.commit(ADD_COUNTER,oldProduct)
    }
    else {
      payload.count = 1
      // context.state.cartList.push(payload)
      context.commit(ADD_TO_CART,payload)
    }
  },
}
