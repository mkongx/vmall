<template>
  <div class="goods">
    <goods-item-list v-for="item in goods" :goods-item="item"/>
    {{goods}}
  </div>
</template>

<script>
import GoodsListItem from "@/components/content/goods/GoodsListItem";
export default {
  name: "GoodsList",
  components:{
    GoodsListItem,
  },
  props:{
    goods:{
      type: Array,
      default(){
        return []
      }
    }
  },
}
</script>

<style scoped>
 .goods{
   display: flex;
   flex-wrap:wrap ;
   justify-content: space-around;
 }
</style>

