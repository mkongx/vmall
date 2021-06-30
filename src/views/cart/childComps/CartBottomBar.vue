<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button"
                    :is-checked="isSelectAll"
                    @click.native="checkClick"></check-button>
      <span>全选</span>
    </div>
    <div class="price">
      合计{{totalPrice}}
    </div>
    <div class="calculate">
      去结算({{checkLength}})
    </div>
  </div>
</template>

<script>
import CheckButton from "@/components/content/checkButton/CheckButton";

import  {mapGetters} from 'vuex'

export default {
  name: "CartBottomBar",
  components: {
    CheckButton,
  },
  computed:{
    ...mapGetters(['cartList']),
    totalPrice() {
      return '￥' + this.cartList.filter(item => item.checked).reduce((preValue, item) =>{
        return item.price * item.count + preValue
      },0).toFixed(2)
    },
    checkLength(){
      this.cartList.filter(item => item.checked).length
    },
    isSelectAll(){
      //1使用 filter
      // return ! (this.cartList.filter(item => item.checked).length);

      // 2使用find
      // return !!this.cartList.length && !this.cartList.find(item => !item.checked) 搞定
      //return this.cartList.length!==0 && this.cartList.every(item=>item.checked)

      //3普通遍历
      for (let item of this.cartList) {
        if(!item.checked){
          return false
        }
      }
    },
  },
  methods: {
    checkClick(){
      // if (this.isSelectAll) {
      //   this.cartList.forEach(item => item.checked = false)
      // }else {
      //   this.cartList.forEach(item => item.checked = true)
      // }
      this.forEach(item => item.checked = ! this.isSelectAll)
    },
  },
}
</script>

<style scoped>
.calculate {
  width: 90px;
  background-color:red;
  color: #FFF;
  text-align: center;
}
.price{
  margin-left: 20px;
  flex: 1;
}
.check-content {
  display: flex;
  align-items: center;
  margin-left: 10px;
  width: 60px;
}

.check-button {
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-right: 5px;
}

.bottom-bar {
  display:flex;
  position: relative;

  line-height: 40px;
  height: 40px;

  background-color: #eee;

  font-size: 14px;
}
</style>
