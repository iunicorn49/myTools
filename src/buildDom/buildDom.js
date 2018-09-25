function buildDom(config, parentNode) {
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
	if (config.class) _setClass(dom, config.class)
	if (config.style) _setStyle(dom, config.style)
	if (config.refs) _setRefs(dom, config.refs)
	let children = config.children
	if (children) {
		if (typeof children === 'string') {
			dom.innerHTML = children
		} else if (typeof children === 'object') {
			if (!Array.isArray(children)) {
				children = [children]
			}
			children.forEach(c => {
				buildDom(c, dom)
			})
		}
	}
	parent.appendChild(dom)
	return dom
} // buildDom end

function _setClass(dom, classList) {
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
function _setStyle(dom, styleMap) {
	if (!styleMap) return
	if (typeof styleMap === 'string') {
		dom.style = styleMap
		return
	}
	for (let style in styleMap) {
		dom.style[style] = styleMap[style]
	}
}
function _setRefs(dom, refs) {
	if (!refs) return
	for (let ref in refs) {
		dom.dataset[ref] = refs[ref]
	}
}