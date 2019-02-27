$(function () {
	// config
	const wordLength = 4;
	const matchWordsClass = 'word-match';	// remeber to modify the classname in css, if you modify this.
	const wordPopupClass = 'word-popup'
	const listUrl = 'http://localhost:9000/words/list';
	const findUrl = 'http://localhost:9000/words/find?query={"dsl": {"word": "$WORD"}, "exact": true}';
	const imgUrl = 'http://localhost:9001/static/imgs/words';
	const errorToastCfg = {
		loader: false,
		showHideTransition: 'slide',
		heading: 'error',
		icon: 'error'
	}
	
	// get all words
	$.ajax({
		type: 'get',
		url: listUrl,
		data: {
			from: 0,
			size: 50000
		},
		success(data) {
			let words = data.words;
			if (!words || !Array.isArray(words || words.length === 0)) {
				console.error('获取单词list失败', data);
				$.toast({
					...errorToastCfg,
					text: '获取单词list失败',
				})
				return;
			} else {
				run(words);
			}
		},
		error(err) {
			console.error(err);
		}
	})
	
	// run: render page
	function run (words) {
		// find words and wrap
		let allEls = $('*');
		for (let i=0; i<allEls.length; i++) {
			let curEl = allEls[i];
			if (curEl.childNodes.length > 0 &&
				curEl.nodeName !== 'SCRIPT' &&
				curEl.nodeName !== 'STYLE' &&
				curEl.nodeName !== 'NOSCRIPT'	
			) {
				for (let j=0; j<curEl.childNodes.length; j++) {
					let curNode = curEl.childNodes[j];
					if (curNode.nodeType === Node.TEXT_NODE && curNode.nodeValue.length >= wordLength) {
						splitTextNode(curNode);
						function splitTextNode (textNode) {
							let index = textNode.nodeValue.search(/[a-zA-Z](,|\.|\s+)/);
							if (index > 0) {
								let restTextNode = textNode.splitText(index+1);
								let curTextNodeStartIndex = restTextNode.previousSibling.nodeValue.search(/[a-zA-Z]/);
								let curTextNode = restTextNode.previousSibling.splitText(curTextNodeStartIndex);
								wrapWord(curNode, words);								
								if (restTextNode.nodeValue && restTextNode.nodeValue.length >= wordLength) {
									splitTextNode(restTextNode);
								}
							} else {
								wrapWord(textNode, words);
							}
						}
					}
				}
			}
		}

		// hover word
		let matchWords = $('.' + matchWordsClass);
		for (let i=0; i<matchWords.length; i++) {
			let popup;
			$(matchWords[i]).hover( e => {
				let elRect = e.currentTarget.getBoundingClientRect();
				$.ajax({
					type: 'get',
					url: findUrl.replace('$WORD', e.currentTarget.innerText).toLowerCase(),
					success (data) {
						let wordInfo = data[0];
						popup = $(`
						<div class="${wordPopupClass}" style="position: fixed; left: ${Number.parseInt(elRect.left)}px; top: ${Number.parseInt(elRect.top - 200)}px">
							<ul>
								<li><a href="">${wordInfo.word}</a></li>
								<li>${wordInfo.pos.join(' ')}</li>
								<li>${wordInfo.acceptation.join(' ')}</li>
								<li><br><pre>${wordInfo.rem || ''}<pre></li>
							</ul>
							<audio src="${wordInfo.pron[0]}" autoplay></audio>
							<img src="${imgUrl}/${wordInfo.word}.png">
							<img src="${imgUrl}/${wordInfo.word}.jpg">
							<img src="${imgUrl}/${wordInfo.word}.gif">
						</div>
						`);
						e.currentTarget.appendChild(popup[0]);
					},
					error (err) {
						console.log(err);
					}
				})
			}, e => {
				e.currentTarget.removeChild(popup[0]);
			})
		}
	}

	// wrap Word
	function wrapWord (textNode, words) {
		let word = textNode.nodeValue;
		if (word.length >= wordLength) {
			if (words.includes(word.toLowerCase())) {
				$(textNode).wrap(`<div class="${matchWordsClass}"></div>`)
			}
		}
	}
})
