<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control ref="tabControl1" class="tab-control"
                 v-show="isTabFixed"
                 :titles="['流行','新款','精选']"
                 @tabClick="tabClick"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pulligUp="loadMore" >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
<!--      <tab-control class="tab-control"-->
<!--      <tab-control ref="tabControl"  :class="{fixed:isTabFixed}"-->
      <tab-control ref="tabControl2"
                   :titles="['流行','新款','精选']"
                   @tabClick="tabClick"/>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
<!--监听组件原生事件时，必须给对应组件加上native修饰符-->
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import HomeSwiper from './childComps/HomeSwiper';
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import NavBar from '@/components/common/navbar/NavBar';
import TabControl from "@/components/content/tabControl/TabControl";
import GoodsList from "@/components/content/goods/GoodsList";
import Scroll from "@/components/common/scroll/Scroll";
import BackTop from "@/components/content/backTop/BackTop";

import {
  getHomeMultiData,
  getHomeGoods,
}
  from "@/network/home"
import {BACK_POSITION} from "common/const";
import {debounce} from "common/utils";
import {itemListenerMixin,backTopMixin} from "common/mixin"

// import Swiper from "components/common/swiper";
// import SwiperItem from "components/common/swiperItem";
// import {Swiper,SwiperItem} from 'components/common/swiper'

export default {
  name: "Home",
  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,
    TabControl,
    GoodsList,
    Scroll,
    BackTop,
  },
  mixins:[itemListenerMixin],
  data() {
    return {
      // result:null,
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []},
      },
      currentType: 'pop',
      // isShowBackTop:false,
      tabOffsetTop:0,
      isTabFixed:false,
      saveY:0,
      // itemImgListener:null,
    }
  },
  destroyed(){
    console.log("home destroyed");
  },
  activated() {
    console.log("activated")
    this.$refs.scroll.scrollTo(0,this.saveY,0)
    this.$refs.scroll.refresh()
  },
  deactivated() {
    // console.log("deactivated");
    //保存Y值
    this.saveY = this.$refs.scroll.getScrollY()
    // 取消全局事件监听

  },
  computed:{
    showGoods(){
      return this.goods[this.currentType].list
    },
  },
  created() {
    //1 请求多个数据
    this.getHomeMultiData()

    //2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')

  },
  mounted() {
    //1.监听item中图片加载完成
    this.$bus.$on('itemImageLoad',()=>{
      console.log('-----');
      this.$refs.scroll.refresh()
    })

    //2.获取tabControl对的offsetTop
    this.tabOffsetTop = this.$refs.tabControl

  },
  methods: {
    swiperImageLoad(){
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },
    loadMore(){
      this.getHomeGoods(this.currentType)
      this.$refs.scroll.scroll.refresh()
    },
    // 石川blue老师的js教程讲过一个好办法，类似澳门广告推送栏的设计，让Top随着offsetTop变化
    contentScroll(position){
      // 1. 判断tabControl是否显示
      this.isShowBackTop=(-position.y) > 1000
      //2.决定tabControl是否吸顶position ：fixed
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    backClick() {
      this.$refs.scroll.scrollTo(0,0)
    },
    /*
    * 事件监听相关方法
    * */
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType= 'pop'
              break
        case 1:
          this.currentType= 'new'
              break
        case 2:
          this.currentType = 'sell'
              break
      }
      this.$refs.tabControl1.currentIndex =index
      this.$refs.tabControl2.currentIndex =index
    },
    /*
    * 网络请求相关方法
    * */
    getHomeMultiData(){
      getHomeMultiData().then((res) => {
        // this.result = res;
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
      })
    },
    getHomeGoods(type){
      const page=this.goods[type].page+1
      getHomeGoods(type,page).then(res =>{
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1

        this.$refs.scroll.finishedPullUp()
      })
    },
  },
}
</script>

<style scoped>
/*.fixed{*/
/*  position: fixed;*/
/*  left: 0;*/
/*  right: 0;*/
/*  top: 44px;*/
/*}*/
#home {
  padding-top: 44px;
  /*viewport height*/
  height: 100vh;
  position: relative;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  /*在使用浏览器原生滚动时，为了让导航不跟随一起滚动*/
  /*position: fixed;*/
  /*left: 0;*/
  /*right: 0;*/
  /*top: 0;*/
  /*z-index: 9;*/
}

/*.tab-control {
  position: sticky;
  top: 44px;
}*/
.tab-control {
   position: relative;
   z-index: 9;
 }
.content{
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
/*.content{*/
/*  height: calc(100% - 93px);*/
/*  overflow: hidden;*/
/*  margin-top: 44px;*/
/*}*/
</style>
