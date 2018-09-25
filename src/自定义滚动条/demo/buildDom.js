function buildDom(config, parentNode) {
	parentNode = parentNode ? parentNode : document.body
	if (typeof config === 'string') {
		parentNode.innerHTML += config
		return parentNode
	}
	let dom = document.createElement(config.tag || 'div')
	if (config.id) {
		dom.id = config.id
	}
	if (config.class) {
		_setClass(dom, config.class)
	}
	if (config.style) {
		_setStyle(dom, config.style)
	}
	if (config.refs) {
		// 没有完成
		_setRefs(dom, config.refs)
	}
	if (config.children) {
		_createdChildren(dom, config.children)
	}
	parentNode.appendChild(dom)
	return dom
}

function _setRefs(dom, refs) {
	for (let ref in refs) {
		dom.dataset[ref] = refs[ref]
	}
}

function _setClass(dom, className) {
	let classList = []
	if (typeof className === 'string') {
		if (className.indexOf(' ') > -1) {
			classList = className.split(' ')
		} else {
			dom.classList.add(className)
			return
		}
	} else if (Array.isArray(className)) {
		classList = className
	} else {
		return
	}
	classList.forEach(classItem => {
		dom.classList.add(classItem)
	})
}

function _setStyle(dom, style) {
	if (typeof style === 'string') {
		dom.style = style
	} else if (typeof style === 'object') {
		for (item in style) {
			dom.style[item] = style[item]
		}
	}
}

function _createdChildren(dom, children) {
	if (typeof children === 'string') {
		dom.innerHTML += children
	} else if (Array.isArray(children)) {
		children.forEach(item => {
			buildDom(item, dom)
		})
	} else if (typeof children === 'object') {
		buildDom(children, dom)
	}
}
