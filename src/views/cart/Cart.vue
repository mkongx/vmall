<template>
<!--导航-->
 <nav-bar class="nav-bar">
   <div slot="center" class="cart">
     购物车({{length}})
   </div>
 </nav-bar>
<!-- 商品列表 -->
  <cart-list></cart-list>
<!-- 底部汇总 -->
</template>
  <cart-bottom-bar></cart-bottom-bar>
<script>
import NavBar from "@/components/common/navbar/NavBar";
import CartList from "@/views/cart/childComps/CartList";

import {mapGetters} from 'vuex'

  export default {
    name: "Cart",
    components: {
      NavBar,
      CartList,
    },
    computed: {
      //要想改名的话就写对象，反之写数组
      //两种语法----不改名
      ...mapGetters(['cartLength','cartList']),
      //两种语法----改名
      ...mapGetters({
        length:'cartLength',
      })
    },
  }
</script>

<style scoped>
.cart{
  height:100vh;

}
  .nav-bar{
    background-color:var(--color-tint);
    color: #fff;
  }
</style>
