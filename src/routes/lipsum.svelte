<script lang="ts">
	import { onMount } from 'svelte'

	const WORDS = [
		'ad',
		'adipisicing',
		'aliqua',
		'aliquip',
		'amet',
		'anim',
		'aute',
		'cillum',
		'commodo',
		'consectetur',
		'consequat',
		'culpa',
		'cupidatat',
		'deserunt',
		'do',
		'dolor',
		'dolore',
		'duis',
		'ea',
		'eiusmod',
		'elit',
		'enim',
		'esse',
		'est',
		'et',
		'eu',
		'ex',
		'excepteur',
		'exercitation',
		'fugiat',
		'id',
		'in',
		'incididunt',
		'ipsum',
		'irure',
		'labore',
		'laboris',
		'laborum',
		'lorem',
		'magna',
		'minim',
		'mollit',
		'nisi',
		'non',
		'nostrud',
		'nulla',
		'occaecat',
		'officia',
		'pariatur',
		'proident',
		'qui',
		'quis',
		'reprehenderit',
		'sint',
		'sit',
		'sunt',
		'tempor',
		'ullamco',
		'ut',
		'velit',
		'veniam',
		'voluptate',
	]

	function lipsumSentence(min = 5, max = 20) {
		const length = Math.floor(Math.random() * (max - min)) + min
		const generated = Array.from(
			Array(length),
			(_) => WORDS[Math.floor(Math.random() * WORDS.length)]
		).join(' ')
		return generated.charAt(0).toUpperCase() + generated.slice(1)
	}
	function lipsumParagraph(min = 3, max = 6) {
		const length = Math.floor(Math.random() * (max - min)) + min
		return Array.from(Array(length), (_) => lipsumSentence() + '.').join(' ')
	}
	function lipsumArticle(min = 4, max = 4) {
		const length = Math.floor(Math.random() * (max - min)) + min
		return Array.from(Array(length), (_) => lipsumParagraph()).join('\n\n')
	}

	let title = ''
	let text = ''

	function generate() {
		title = lipsumSentence(2, 6)
			.split(' ')
			.map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
			.join(' ')
		text = lipsumArticle(4, 4)
	}
	onMount(generate)
</script>

<div>
	<button on:click={generate}>Generate</button>
	<article>
		<h2>{title}</h2>
		{#each text.split('\n') as p}
			<p>{p}</p>
		{/each}
	</article>
</div>
