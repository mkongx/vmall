import Toast from './Toast'

const plugin = {}

function removeDom(event) {
	if (event.target.parentNode) {
		event.target.parentNode.removeChild(event.target)
	}
}

plugin.install = (Vue) => {
	const ToastConstructor = Vue.extend(Toast)

	// 注意:这里不能用箭头函数
	ToastConstructor.prototype.close = function() {
		this.isShow = false
		this.$el.addEventListener('transitionend', removeDom)
	}

	Vue.prototype.$toast = (options={}) => {
		// 1.new创建组件构造器
		const toast = new ToastConstructor()
    // 2.挂载到某个元素(div)中
		toast.$mount(document.createElement('div'))

		// 3.将toast的$el添加到body中----toast.$el就是div元素
		document.body.appendChild(toast.$el)

		// 3.获取用户自定义数据
		const duration = options.duration || 2500
		toast.message = options.message
		toast.isShow = true

		// 4.定时器让toast消失
		setTimeout(() => {
			toast.close()
		}, duration)
	}
}

export default plugin



