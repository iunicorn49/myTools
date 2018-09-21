let pWord = '	Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut eaque necessitatibus quia. Impedit necessitatibus recusandae laudantium, quidem, quasi qui hic sint numquam minima labore ex, ab totam ducimus? Repellendus, labore.'

let data = {
	class: 'wrapper',
	style: {
		margin: '30px',
		width: '340px',
		height: '500px',
		background: '#FFF',
		border: '1px solid #ccc',
		overflow: 'hidden'
	},
	children: {
		class: 'content',
		style: {
			padding: '15px',
		},
		children: []
	}
}

for (let i = 1; i <= 5; i++) {
	data.children.children.push({
		children: [
			{tag: 'h3', children: `title-${i}`},
			{tag: 'p', children: pWord}
		]
	})
}

buildDom(data)

let zs = new ZScroll({
	wrapper: document.querySelector('.wrapper'),
	content: document.querySelector('.content'),
})

setTimeout(() => {
	let w = document.querySelector('.wrapper')
	w.removeChild(document.querySelector('.content'))
	zs.resize()
}, 1000)


setTimeout(() => {
	let data = {class: 'content', children: [], style: {padding: '15px'}}
	for (let i = 1; i <= 10; i++) {
		data.children.push({
			children: [
				{tag: 'h3', children: `title-2-${i}`},
				{tag: 'p', children: pWord}
			]
		})
	}
	buildDom(data, document.querySelector('.wrapper'))
	zs.resize({content: document.querySelector('.content')})
}, 2000)