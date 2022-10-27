import fastDiff from 'fast-diff'

function encodeHtml(str: string): string {
	return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

addEventListener('message', (event) => {
	const { before, after, id } = event.data

	let renderedDiff = ''
	const diff = fastDiff(before, after)
	for (const [type, difference] of diff) {
		switch (type) {
			case 0:
				renderedDiff += encodeHtml(difference)
				break
			case 1:
				renderedDiff += `<span class="diff-added">${encodeHtml(difference)}</span>`
				break
			case -1:
				renderedDiff += `<span class="diff-removed">${encodeHtml(difference)}</span>`
				break
		}
	}

	postMessage({ diff: renderedDiff, id })
})

export {}
