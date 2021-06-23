<template>
  <div class="tab-bar-item" @click="itemClick">
<!--    使用插槽slot动态为img 和 div 赋值-->
    <div v-if="!isActive">
      <slot name="item-icon"></slot>
    </div>
    <div v-else>
      <slot name="item-icon-active"></slot>
    </div>
<!--    <div :class="{active: isActive}">-->
    <div :style="activeStyle">
      <slot name="item-text"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabBarItem",
  props:{
    path: String,
    activeColor: {
      type: String,
      default:'red'
    }
  },
  data() {
    return {
      // isActive: true,
    }
  },
  computed: {
    isActive() {
      return  this.$route.path.indexOf(this.path) !== -1
    },
    activeStyle(){
       return this.isActive ? {color: this.activeColor}:{}
    },
  },
  methods: {
    itemClick() {
      // console.log('itemClick');
      this.$router.replace(this.path).catch(err => {})
    }
  }
}
</script>

<style scoped>
.tab-bar-item {
  flex: 1;
  text-align: center;
  height: 49px;
  font-size: 14px;
}

.tab-bar-item img {
  width: 24px;
  height: 24px;
  margin-top: 3px;
  /*  图片下边默认有3px间距
  通过vertical-align去掉
  再使用margin-bottom 改为2px*/
  vertical-align: middle;
  margin-bottom: 2px;
}
  /*.active {*/
  /*  color: blue;*/
  /*}*/
</style>
