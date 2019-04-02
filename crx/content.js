$(function () {
	// config
	const minWordLength = 3;
	const maxHandleWordsNum = 5000;
	const matchWordsClass = 'word-match';	// remeber to modify the classname in css, if you modify this.
	const wordPopupClass = 'word-popup'
	const listUrl = 'http://localhost:9000/words/list';
	const findUrl = 'http://localhost:9000/words/find?query={"dsl": {"word": "$WORD"}, "exact": true}';
	const imgUrl = 'http://localhost:9999';
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
	async function run (words) {
		let wordsNum = 0;
		// find words and wrap
		let allEls = $('*');
		for (let i=0; i<allEls.length && wordsNum<=maxHandleWordsNum; i++) {
			let curEl = allEls[i];
			if (curEl.childNodes.length > 0 &&
				curEl.nodeName !== 'SCRIPT' &&
				curEl.nodeName !== 'STYLE' &&
				curEl.nodeName !== 'NOSCRIPT'	&&
				curEl.nodeName !== 'SVG'
			) {
				for (let j=0; j<curEl.childNodes.length && wordsNum<=maxHandleWordsNum; j++) {
					let curNode = curEl.childNodes[j];
					if (curNode.nodeType === Node.TEXT_NODE && curNode.nodeValue.length >= minWordLength) {
						splitTextNode(curNode);
						// await sleep(5);
						function splitTextNode (textNode) {
							wordsNum ++;
							if (wordsNum >= maxHandleWordsNum) return;
							let index = textNode.nodeValue.search(/[a-zA-Z](,|\.|\s+)/);
							if (index > 0) {
								let restTextNode = textNode.splitText(index+1);
								let curTextNodeStartIndex = restTextNode.previousSibling.nodeValue.search(/[a-zA-Z]/);
								let curTextNode = restTextNode.previousSibling.splitText(curTextNodeStartIndex);
								wrapWord(curNode, words);								
								if (restTextNode.nodeValue && restTextNode.nodeValue.length >= minWordLength) {
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
		if (word.length >= minWordLength) {
			if (words.includes(word.toLowerCase())) {
				$(textNode).wrap(`<i class="${matchWordsClass}"></i>`)
			}
		}
	}

	// sleep
  async function sleep (ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    })
  }
})
