class ZScroll {
	constructor(options) {
		if (!options) return
		this.ops = { // 外部可配置项
			doc: document, // 插入的父节点
			wrapper: null, // 外层容器, overflow: hidden
			content: null, // 内容, 要有正确的高度
			scrollBarStyle: null, // 滚动条的内联样式, 高度应该与 wrapper 相等
			scrollBarClass: null, // 滚动条的的类, 高度应该与 wrapper 相等, 如果设置了类, 将不会设置内联样式
			sliderStyle: null, // 滚动条滑块的内联样式
			sliderClass: null, // 滚动条滑块的类, 如果设置了类, 将不会设置内联样式
			sliderInsideStyle: null, // 滚动条滑块内部的内联样式
			sliderInsideClass: null, // 滚动条滑块内部的类, 如果设置了类, 将不会设置内联样式
		}
		this.data = { // 内部操作变量
			mousedown: false, // 鼠标是否按下
			leave: true, // 鼠标是否离开
			wheelOffsetY: 30, // 鼠标滚轮偏移量
			isScroll: false, // 处理滚动缓动
			timer: null // 缓动计时器
		}
		Object.assign(this.ops, options, this.data) // 合并配置项
		this._initSelector(this.ops) // 用 this.$ 获取配置项
		if (this.$content.offsetHeight <= this.$wrapper.offsetHeight) {
			return
		}
		this._createScrollBar() // 创建scrollbar
	}
	_createScrollBar() { // 创建 scrollbar
		// 给容器和内容设置必要的样式
		this.setStyle(this.$wrapper, { position: 'relative' })
		this.setStyle(this.$content, { position: 'absolute', top: 0, left: 0 })
		let scrollBar = this._createScrollWrapper() // 创建 滚动条容器
		this._createSlider(scrollBar) // 创建 滚动条滑块
		this._getScrollRate() //  获取滑动百分比
		this._initSliderDragEvent(this.$slider, this.$doc) // 初始化滑块的拖动功能
		this._initMousewheelEvent(this.$wrapper) // 初始化鼠标滚轮事件
		this._initSliderHoverEvent(this.$wrapper) // 初始化滑块显示隐藏效果
	}
	_createScrollWrapper() { // 设置 scrollbar 外层容器
		let wrapper = this.$wrapper
		let classList = this.$scrollBarClass ? this.$scrollBarClass : null
		let styleMap = {
			position: 'absolute',
			top: 0,
			right: 0,
			width: '10px',
			height: wrapper.offsetHeight + 'px',
			opacity: 0
		}
		let style = this.$scrollBarStyle ? Object.assign(styleMap, this.$scrollBarStyle) : styleMap
		let scrollBar = this.buildDom({ class: classList, style }, wrapper)
		this.$scrollBar = scrollBar
		return scrollBar
	}
	_createSlider(scrollBar) { // 设置 scrollbar 滑块(slider)
		let classList = this.$sliderClass ? this.$sliderClass : null
		let styleMap = {
			position: 'absolute',
			boxSizing: 'border-box',
			top: 0,
			right: 0,
			width: '100%',
			height: this.$wrapper.offsetHeight * scrollBar.offsetHeight / this.$content.offsetHeight + 'px',
			padding: '4px 2px',
		}
		let style = this.$sliderStyle ? Object.assign(styleMap, this.$sliderStyle) : styleMap
		let insideClass = this.$sliderInsideClass ? this.$sliderInsideClass : null
		let insideStyleMap = { width: '100%', height: '100%', background: 'hsla(220,4%,58%,.3)', borderRadius: '5px' }
		let insideStyle = this.$sliderInsideStyle ? Object.assign(insideStyleMap, this.$sliderInsideStyle) : insideStyleMap
		let slider = this.buildDom({ 
			class: classList, 
			style,
			children: { style: insideStyle, class: insideClass }
		}, scrollBar)
		this.$slider = slider
		return slider
	}
	_initSelector(ops) { // 方便内部获取DOM元素
		for (let n in ops) {
			this['$' + n] = ops[n]
		}
	}
	_getScrollRate() { // 获取滑动百分比
		// 内容可滚动高度 = 内容整体高度(content) 减去 外层可视区的高度(wrapper)
		let contentScrollMax = Math.max(this.$content.offsetHeight, this.$wrapper.offsetHeight) - this.$wrapper.offsetHeight
		// 滑块可滚动高度 = 滑块容器(bar) 减去 滑块高度(slider)
		let sliderScrollMax = this.$scrollBar.offsetHeight - this.$slider.offsetHeight
		let result = contentScrollMax / sliderScrollMax // 滑动比例
		this.$scrollRate = result
	}
	_initSliderDragEvent(slider, doc) { // 初始化滑块的拖动功能
		let dragStart = null // 初始坐标
		let sliderStart = null // 滑块已经移动的距离
		let down = e => { // 鼠标按下事件
			this.stopScroll()
			dragStart = slider.getBoundingClientRect().top + e.offsetY,
			sliderStart = slider.offsetTop
			this.$mousedown = true
			this.bind(doc, 'mousemove', move)
			this.bind(doc, 'mouseup', up)
		} // down end

		let move = e => { // 鼠标拖动事件
			if (!dragStart) {
				return
			}
			let positionVal = -(sliderStart + e.pageY - dragStart) * this.$scrollRate // 位置
			this._privacyScrollTo(positionVal)
		} // move end

		let up = e => { // 鼠标松开事件
			// 解绑所有事件
			this.$mousedown = false
			this._setScrollBarStates()
			this.unbind(doc, 'mousemove', move)
			this.unbind(doc, 'mouseup', up)
		} // up end
		this.bind(slider, 'mousedown', down)
	}
	_privacyScrollTo(positionVal) { // 设置滚动, 通过设置 content 主体来带动 slider
		let limit = -(this.$content.offsetHeight - this.$wrapper.offsetHeight) // 下限
		if (positionVal > 0) { // 上限
			positionVal = 0
			this.stopScroll()
		} else if (positionVal < limit) {
			positionVal = limit
			this.stopScroll()
		}
		this.$content.style.top = positionVal + 'px'
		let sliderPos = -(positionVal / this.$scrollRate)
		this.$slider.style.top = sliderPos + 'px'
	}
	scrollTo(target) { // 对外暴露, 直接滚动到目标坐标
		this.$timer = setInterval(() => {
			// target 最终的终点(一般来说是负数或0)
			let start = this.$content.offsetTop // 每一帧动画的起点(一般来说是负数或0)
			let direction = start > target ? 'up'
										: start < target ? 'down'
										: false
			let go = null // 这一帧动画的终点
			let speed = Math.floor((target - start) / 20)
			if (!direction) {
				this.stopScroll()
				return
			} else {
				if (direction === 'up') {
					speed = speed < 0 ? speed : -1
					go = start + speed
					if (go < target) go = target
				} else if (direction === 'down') {
					speed = speed > 0 ? speed : 1
					go = start + speed
					if (go > target || speed === 0) go = target
				}
			}
			let a = {start: -991, go: -991, target: -1000, speed: 0}
			this._privacyScrollTo(go)
		}, 25)
	}
	stopScroll(where) {
		if (!this.$timer) return
		where = where && typeof where === 'string' ? where + '-' : ''
		console.error(where + '缓动滚动结束:', this.$content.offsetTop)
		clearInterval(this.$timer)
		this.$timer = null
	}
	resize(ops = {}) {
		let { wrapper = this.$wrapper, content = this.$content } = ops // 若更新了content, 请务必重新传入 content
		this.$wrapper = wrapper
		this.$content = content
		if (content.offsetHeight <= wrapper.offsetHeight) { // 若内容高度小于容器高度
			this._destroyScrollBar()
		} else {
			this._createScrollBar()
		}
	}
	_destroyScrollBar() { // 销毁 scrollBar
		this.$wrapper.removeChild(this.$scrollBar)
	}
	_setScrollBarStates() { // 更改 scrollBar 显示状态
		this.$scrollBar.style.opacity = this.$leave && !this.$mousedown ? 0 : 1
	}
	_initMousewheelEvent(wrapper) { // 初始化鼠标滚轮事件
		let wheel = e => {
			this.stopScroll()
			let d = e.deltaY > 0 ? -this.$wheelOffsetY : this.$wheelOffsetY
			let top = this.$content.offsetTop + d
			this._privacyScrollTo(top)
		}
		this.bind(wrapper, 'mousewheel', wheel)
	}
	_initSliderHoverEvent(wrapper) {
		let on = e => { // 鼠标移入
			this.$leave = false
			this._setScrollBarStates()
		}
		let out = e => { // 鼠标离开
			this.$leave = true
			this._setScrollBarStates()
		}
		this.bind(wrapper, 'mouseenter', on)
		this.bind(wrapper, 'mouseleave', out)
	}
	bind(dom, event, fn) { // 绑定事件
		dom.addEventListener(event, fn, false)
	}
	unbind(dom, event, fn) { // 解绑事件
		dom.removeEventListener(event, fn, false)
	}
	setClass(dom, classList) {
		if (!classList) return
		let list = []
		if (typeof classList === 'string') {
			list = classList.indexOf(' ') > -1 ? classList.split(' ').filter(c => c) : [classList]
		} else if (Array.isArray(classList)) {
			list = classList
		}
		list.forEach(c => {
			dom.classList.add(c)
		})
	}
	setStyle(dom, styleMap) {
		if (!styleMap) return
		if (typeof styleMap === 'string') {
			dom.style = styleMap
			return
		}
		for (let style in styleMap) {
			dom.style[style] = styleMap[style]
		}
	}
	setRefs(dom, refs) {
		if (!refs) return
		for (let ref in refs) {
			dom.dataset[ref] = refs[ref]
		}
	}
	buildDom(config, parentNode) {
		let parent = parentNode || document.body
		if (typeof config === 'string') { // config 为字符串的情况下, 直接给父节点插入文字
			parent.innerHTML += config
			return parent
		}
		/**
		 * 正式开始创建dom
		 */
		let dom = document.createElement(config.tag || 'div')
		if (config.id) dom.id = config.id
		if (config.class) this.setClass(dom, config.class)
		if (config.style) this.setStyle(dom, config.style)
		if (config.refs) this.setRefs(dom, config.refs)
		let children = config.children
		if (children) {
			if (typeof children === 'string') {
				dom.innerHTML = children
			} else if (typeof children === 'object') {
				if (!Array.isArray(children)) {
					children = [children]
				}
				children.forEach(c => {
					this.buildDom(c, dom)
				})
			}
		}
		parent.appendChild(dom)
		return dom
	} // buildDom end
}