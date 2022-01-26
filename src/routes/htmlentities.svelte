<script lang="ts">
	import ClickableUrlsTextArea from '$lib/ClickableUrlsTextArea.svelte'
	import TextArea from '$lib/TextArea/index.svelte'
	import Toggle from '$lib/Toggle.svelte'

	let decoded: string
	let encoded: string

	let encodeAll = false

    const escapeChars: Record<string, string> = {
        '¢' : 'cent',
        '£' : 'pound',
        '¥' : 'yen',
        '€': 'euro',
        '©' :'copy',
        '®' : 'reg',
        '<' : 'lt',
        '>' : 'gt',
        '"' : 'quot',
        '&' : 'amp'
    }

    function encodeHTMLEntities(str: string, opts: { encodeAll?: boolean }={}): string {
        if (opts.encodeAll) {
            let result = ''
            for (const char of str) {
                if (char in escapeChars)
                    result += '&' + escapeChars[char]! + ';'
                else
                    result += '&#' + char.charCodeAt(0) + ';'
            }
            return result
        } else {
            const el = document.createElement('p')
            el.textContent = str
            return el.innerHTML
        }
    }

    function decodeHTMLEntities(str: string): string {
        const el = document.createElement('p')
        el.innerHTML = str
        return el.textContent ?? ''
    }

	function updateEncoded() {
		if (encodeHTMLEntities(decoded, { encodeAll }) !== encoded) encoded = encodeHTMLEntities(decoded, { encodeAll })
	}

	function updateDecoded() {
		if (decodeHTMLEntities(encoded) !== decoded) decoded = decodeHTMLEntities(encoded)
	}

    function updateEncodeAll(e: Event) {
		encodeAll = (e.target as HTMLInputElement).checked
		updateEncoded()
    }
</script>

<div class="container">
	<div class="decoded-container">
        <div class="options">
			<Toggle bind:value={encodeAll} on:input={updateEncodeAll} id="html-encode-all">Encode everything</Toggle>
		</div>

		<ClickableUrlsTextArea
			bind:value={decoded}
			id="html-decoded"
			on:input={updateEncoded}
			label="Plaintext"
		/>
	</div>
	<div class="encoded-container">
		<TextArea bind:value={encoded} id="html-encoded" on:input={updateDecoded} label="HTML encoded" />
	</div>
</div>

<style>
	/* stack the containers on top of each other */
	.container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100%;
	}

	@media (max-width: 440px) {
		.container {
			grid-template-columns: 1fr;
			grid-template-rows: 1fr 1fr;
		}
	}

	.decoded-container,
	.encoded-container {
		margin: 0.5em;
		position: relative;
	}

	.options {
		right: 0;
		position: absolute;
	}
</style>
