import {BACKTOP_DISTANCE} from "./const";
import BackTop from '@/components/content/backTop/BackTop'
import {POP, NEW, SELL} from "./const";
import { debouce } from '@/common/utils'

export const backTopMixin = {
	components: {
		BackTop
	},
	data() {
		return {
			isShowBackTop: false,
      itemImgListener:null,
    }
	},
	methods: {
		backTop1() {
			this.$refs.scroll.scrollTo(0, 0, 300)
		},
    //返回顶部事件
    backTop() {
      // this.$refs.scroll 拿到的是scroll组件对象
      //this.$refs.scroll.scroll 拿到的是Scroll组件下data的scroll值
      // this.$refs.scroll.scroll.scrollTo(0, 0, 300) //x y 300毫秒
      this.$refs.scroll.scrollTo(0, 0) //默认300ms
    },
    listenShowBackTop(position) {
      this.isShow = Math.abs(position.y) > BACKTOP_DISTANCE//返回顶部默认
    }
  },
}


//混入 合并组件之间重复的代码
//图片加载更多优化的混入
export const itemImgListenerMixin = {
  data() {
    return {
      itemImgListener: null, //对首页事件总线监听图片加载的事件
      newRefresh: null
    }
  },
  components: {},
  methods: {},
  mounted() {
    //监听事件总线
    // 1.图片加载完的事件监听
    //定义图片防抖函数 可以不传毫秒事件参数
    const newRefresh = debounce(this.$refs.scroll.refresh, 50)
    this.newRefresh = debounce(this.$refs.scroll.refresh, 50)

    //2.监听事件总线
    //监听item的图片加载完成
    //对监听的事件进行保存
    this.itemImgListener = () => {
      // 所有在这里刷新 这样刷新就不会时每次30次了 而是1到几次 减轻了对服务器的压力
      this.newRefresh()//这样只保证刷新一次
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
  }
}


export const tabControlMixin = {
	data: function () {
		return {
			currentType: POP
		}
	},
	methods: {
		tabClick(index) {
			switch (index) {
				case 0:
					this.currentType = POP
					break
				case 1:
					this.currentType = NEW
					break
				case 2:
					this.currentType = SELL
					break
			}
			console.log(this.currentType);
		}
	}
}
