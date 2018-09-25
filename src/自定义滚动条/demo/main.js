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

for (let i = 1; i <= 10; i++) {
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

let btn = document.getElementById('btn')

btn.addEventListener('click', e => {
	let value = +document.getElementById('input').value
	if (!value && value !== 0) {
		return
	}
	zs.scrollTo(-value)
})