<template>
  <div id="detail">
    <detail-nav-bar @titleClick="titleClick" @ref="nav"/>
    <!--   <detail-swiper v-if="topImages!=''" :top-images="topImages"/>-->
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <!--     属性：topImages 驼峰 传入值：top-images 蛇形-->
<!--      <ul>-->
<!--        <li v-for="item in $store.state.cartList">-->
<!--          {{item}}-->
<!--        </li>-->
<!--      </ul>-->
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goodsInfo"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imgLoad="goodsImgLoad"></detail-goods-info>
      <detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <goods-list ref="recommend" :goods="recommends"></goods-list>

    </scroll>
    <detail-bot-bar @addCart="addToCart"></detail-bot-bar>
    <back-top @click.native="backTop" v-show="isShowBackTop"></back-top>
    <toast></toast>
  </div>
</template>

<script>
import Scroll from "@/components/common/scroll/Scroll.vue";
import GoodsList from "@/components/content/goods/GoodsList";
import BackTop from "@/components/content/backTop/BackTop";
import Toast from "@/components/common/toast/Toast";

import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
import DetailSwiper from "@/views/detail/childComps/DetailSwiper";
import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";
import DetailShopInfo from "@/views/detail/childComps/DetailShopInfo";
import DetailGoodsInfo from "@/views/detail/childComps/DetailGoodsInfo";
import DetailParamInfo from "@/views/detail/childComps/DetailParamInfo";
import DetailCommentInfo from "@/views/detail/childComps/DetailCommentInfo";
import DetailBotBar from "./childComps/DetailBotBar";

import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "@/network/detail"
import {debounce} from "@/common/utils"
import {itemImgListenerMixin} from "@/common/mixin"
import {BACKTOP_DISTANCE} from "@/common/const";

import { } from 'vuex'

// import {Shop} from "@/network/detail";
export default {
  name: "Detail",
  components: {
    Scroll,
    GoodsList,
    BackTop,
    Toast,

    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBotBar,
  },
  mixins: [itemImgListenerMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goodsInfo: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [0, 1000, 2000, 3000],
      getThemeTopY: null,
      currentIndex: 0,
      isShowBackTop: false,
      // itemImgListener:null,
    }
  },
  methods: {
    addToCart(){
      //1 获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goodsInfo.title
      product.desc = this.goodsInfo.desc
      product.price = this.goodsInfo.realPrice
      product.iid = this.iid

      //2.将商品添加到购物车
      // this.$store.cartList.push(product)
      this.$store.commit('addCart',product)

    },
    goodsImgLoad() {
      this.$refs.scroll.refresh();
      this.getThemeTopY()
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
    },
    contentScroll(position) {
      //1.获取y值
      const positionY = -position.y
      //2.positionY和主题中值进行对比

      //法一
      // for(let i in this.themeTopYs){
      //   if (positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) {
      //   }
      // }

      // 法二
      // let length = this.themeTopYs.length;
      // for(let i= 0;i < length; i++){
      //   if(this.currentIndex !== i && ((i < length-1 && positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) || (i===length-1 && positionY > this.themeTopYs[i])))  {
      //     this.currentIndex = i
      //     console.log(this.currentIndex)
      //     this.$refs.nav.currentIndex = this.currentIndex
      //   }
      // }

      //法三
      let length = this.themeTopYs.length;
      for(let i= 0;i < length; i++){
        if(this.currentIndex !== i && (positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]))  {
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
      //3是否显示回到顶部
      this.isShowBackTop = -position.y > BACKTOP_DISTANCE
    },
  },
  mounted() {

  },
  updated() {
    this.themeTopYs = []

    this.themeTopYs.push(0)
    //参数的offsetTop
    this.themeTopYs.push(this.$refs.params.$el.offsetTop)
    //评论的offsetTop
    this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
    //推荐的offsetTop
    this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
  },
  destroyed() {
  },
  created() {
    //1保存传入的iid
    this.iid = this.$route.params.iid;
    //2跟据iid请求详情数据
    getDetail(this.iid).then(res => {
      const data = res.result
      //获取顶部轮播图数据
      this.topImages = data.itemInfo.topImages
      // 获取商品信息
      // this.goods= new Goods(res.result)
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      //3.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo)
      //4.保存商品详情数据
      this.detailInfo = new Shop(data.detailInfo)
      //5.获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
      //6.获取参数信息
      this.itemParams = data.itemParams
      //7.获取评论信息
      this.commentInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
      //a.第一次获取值不对
      // 原因：this.$refs.params.$el压根没有渲染
      this.themeTopYs = []

      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)

      this.$nextTick(() => {
        //b.第二次获取值不对
        // 原因：图片没有计算在内
        //根据最新的数据，对应的DOM已经被渲染出来了
        //但是图片仍然是没有加载完（目前获取到offsetzTop不包含其中的图片）
        //offset值不对的时候，都是因为图片的问题
        this.themeTopYs = []

        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      })

      //3请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      })
    })
    //3请求推荐数据
    getRecommend().then(res => {
      this.recomends = res.data.list
    })
    //4给getThemeTopY赋值
    this.getThemeTopY = debounce(() => {
      this.themeTopY = [];
      this.themeTopY.push(0);
      this.themeTopY.push(this.$refs.param.$el.offsetTop);
      this.themeTopY.push(this.$refs.comment.$el.offsetTop);
      this.themeTopY.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE)
    })
  },
}
</script>

<style scoped>
.detail {
  height: 100vh;
  background-color: #fff;
  position: relative;
  z-index: 10;
}

.top-nav {
  background-color: #fff;
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  z-index: 11;
}

.content {
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
</style>
