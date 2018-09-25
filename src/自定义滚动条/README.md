## 方法
```javascript
let wrapper = document.querySelector('...') // 容器
let content = document.querySelector('...') // 内容
// 内容的高度必须大于容器的高度
let zs = new ZScroll({
	wrapper,
	content
})
```

## 配置项
```javascript
let ops = {
	// 必填项 只有当内容的高度超出容器的高度才会有滚动条
	wrapper, // 容器dom
	content, // 内容dom
	// 非必填项, 没事不要设置
	doc, // 默认是 body, 用于事件绑定
	scrollBarStyle, // 滚动条容器样式
	scrollBarClass, // 滚动条容器类名
	sliderStyle, // 滑块容器样式
	sliderClass, // 滑块容器类名
	sliderInsideStyle, // 滑块样式
	sliderInsideClass, // 滑块类名
}
```

## API

### zs.resize
> 内容高度变更的时候调用.
```javascript
zs.resize({ // 当内容高度发生改变的时候调用
	content: document.querySelector('...') // 内容
})
```

### zs.scrollTo
> 让内容滚动到特定的高度.
```javascript
zs.scrollTo(Number) // 滚动去哪里, 目标 top (一般来说是负数或0)
```