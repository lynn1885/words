<template>
	<div id="words-book">
		<div id="top-area">
			<!-- 标题 -->
			<div id="words-title">单词本 <span class="tips">{{lastWordsNum}} + {{allWordsNum - lastWordsNum}} TO12.31: 2060</span></div>
			
			<!-- 顶栏 -->
			<div id="top-bar">
				<el-input 
					class="input" 
					placeholder="添加新单词" 
					suffix-icon="el-icon-edit" 
					v-model="newWord" 
					@keydown.native="addWord($event)"
					clearable
				></el-input>
				<el-input 
					class="input" 
					placeholder="查找单词" 
					suffix-icon="el-icon-search" 
					v-model="findQuery" 
					@keydown.native="findWords($event)"
					clearable			
				></el-input>
				<el-button 
					class="button"
					icon="el-icon-refresh" 
					circle
					size="small"
					@click="updatePage(curPage)"
				></el-button>
				<!-- 翻页 -->
				<el-pagination
					id="pagination"
					background
					layout="prev, pager, next"
					:current-page="curPage"
					:page-count="Number.parseInt(allWordsNum / pageWordsNum + 1)"
					@current-change="changePage"
				>
				</el-pagination>
				<el-button
					id="recitation"
					@click="gotoRecitation"
				>
					随机背诵
				</el-button>
			</div>
		</div>

		<!-- 侧边栏信息 -->
		<div id="side-bar-info" v-html="sideBarInfo">
		</div>

		<!-- 单词本 -->
		<el-table 
			v-if="curWordsInfo.length>0" 
			:data="curWordsInfo" 
			id="words"
			border
			>
			
			<el-table-column label="单词" width="140">
				<template slot-scope="scope">
					{{scope.row.word}}
				</template>
			</el-table-column>
			
			<el-table-column label="音标" width="140">
				<template slot-scope="scope">
					<div v-for="(item, index) of scope.row.ps" :key="index" class="word-ps" @mouseover="playWordPron($event)">
						{{'[' + item + ']' }}
						<audio :src="scope.row.pron[index]" controls></audio>
					</div>
				</template>
			</el-table-column>
			
			<el-table-column label="含义">
				<template slot-scope="scope">
					<div 
						v-for="(item, index) of scope.row.pos" 
						:key="'acceptation' + index"
						class="word-acceptation"
						>
						<span class="pos">{{item}}</span> {{' ' + scope.row.acceptation[index]}}
					</div>
				</template>
			</el-table-column>

			<el-table-column label="记忆">
				<template slot-scope="scope">
					<el-input 
						v-model="scope.row.rem" 
						type="textarea" 
						:autosize="{minRows: 3, maxRows: 20}" 
						resize="none"
						@keydown.native="updateRem($event, scope.row.word, scope.row.rem)"
						>
					</el-input>
				</template>
			</el-table-column>

			<el-table-column label="操作"  width="100">
				<template slot-scope="scope">
					<div class="handle-bar">
						<div class="delete" @click="delWord(scope.row.word, scope.row._id)">delete</div>
						<div class="bing">
							<a :href="'https://cn.bing.com/images/search?q=' + scope.row.word + '&go=Search&qs=n&form=QBILPG&sp=-1&pq=multitude&sc=0-0'" target="blank">bing</a>			
						</div>
						<div class="youtube">
							<a :href="'https://www.youtube.com/results?search_query=' + scope.row.word" target="blank">youtube</a>		
						</div>
						<div class="morpheme" @click="analyzeMorpheme(scope.row.word)">morpheme</div>
						<div class="syllable" @click="analyzeSyllables(scope.row.ps)">syllable</div>
					</div>
				</template>
			</el-table-column>

			<el-table-column prop="img" label="图片">
				<template slot-scope="scope">
					<div class="word-img-container" @click="showImageModal(`./static/imgs/words/${scope.row.word}.png`)">
						<img :src="`./static/imgs/words/${scope.row.word}.png`">
					</div>
				</template>
			</el-table-column>
		</el-table>

		<!-- 图片遮罩 -->
		<el-dialog
			title="查看图片"
			:visible.sync="isShowImageModal"
			width="800px"
			>
			<img :src="imageModalSrc" style="width: 100%">
		</el-dialog>
		
	</div>
</template>

<script>
	import $ from 'jquery';
	import _ from 'lodash';
	import axios from 'axios';
	import * as wordsModel from "@/models/words.ts";
	import config from '@/config/config.js';
	import morphemes from '@/utils/morphemes.js';
	import syllables from '@/utils/syllables.js';

	export default {
		name: "words-book",
		data () {
			return {
				newWord: '',					// 添加新单词
				findQuery: '',					// 搜索的单词
				pageWordsNum: 30, 				// 每页多少个单词
				allWordsNum: 0, 				// 总共多少个单词
				lastWordsNum: 0,				// 昨天背到多少单词
				curPage: 1, 					// 当前页码
				curWords: [], 					// 当前单词
				curWordsInfo: [], 				// 当前单词及详细注释
				imageModalSrc: '',				// 模态框显示图片的url
				selectedImageWord: '',	// 选中的, 要显示图片的单词
				isShowDelWord: false,			// 是否显示删除单词
				isShowImageModal: false,		// 是否显示图片模态框
				sideBarInfo: '',		// 侧边栏信息
				googleImagesClient: null,	// google images client
			};
		},
		watch: {
			curWords: {
				deep: true,
				handler (words) {
					this.analyzeMorpheme(words[0]);
				}
			}
		},
		methods: {
			// 获取单词列表
			async getWordList(from, size) {
				await wordsModel
					.list(from, size)
					.then(res => {
						this.allWordsNum = res.data.count;
						this.curWords = res.data.words;
						this.selectedImageWord = this.curWords[0];
					})
					.catch(err => {
						throw new Error("words.vue 获取单词列表失败" + from + size);
					});
			},

			// 获取单词信息
			async getWordInfo(words) {
				this.curWordsInfo = [];
				for (let word of words) {
					await wordsModel.search(word)
						.then(res => {
							let wordInfo = res.data.wordInfo;
							this.curWordsInfo.push(wordInfo);
						})
						.catch(err => {
							throw new Error("words.vue, 获取单词信息失败" + word + err);
						});
				}
			},

			// 添加单词
			async addWord (e) {
				if (e.keyCode === 13) {	// 回车
					let word = _.trim(this.newWord);
					if (!word) {
						this.$message({
							message: '没有输入单词哦~',
							type: 'error'
						});
						return;
					}
					await wordsModel.search(word)
						.then(res => {
							if (res.data.status === 'new') {
								this.$message({
									message: '添加单词成功',
									type: 'success'
								});
								this.newWord = '';
								this.updatePage();
							}
							else if (res.data.status === 'old') {
								this.$message({
									message: '单词已经存在了哦~',
									type: 'warning'
								});
								console.warn('words.vue, addWord, 添加的单词已经存在', res);
								this.newWord = '';
								this.findQuery = word;
								this.findWords({keyCode: 13});	// 执行搜索. 这里传入keyCode: 13, 模拟按下了enter键
							} else {
								this.$message({
									message: '未知的返回值' + res.data,
									type: 'error'
								});
								console.error('words.vue, addWord, 未知的返回值', res);								
							}
						})
						.catch (err => {
							this.$message({
								message: '添加失败',
								type: 'error'
							});
							console.error('words.vue, addWord, 添加失败', res);		
						})
				}
			},

			// 搜索单词
			async findWords (e) {
				if (e.keyCode === 13) {	// 回车
					let queryStr = _.trim(this.findQuery);
					let queryObj = {
						dsl: {}
					};
					if (!queryStr) {
						this.$message({
							message: '没有输入查询语句, 将刷新当前页',
							type: 'warning'
						});
						this.updatePage();
						return;
					}

					// 支持   单词:意思  这种查询语法
					else if (queryStr.indexOf(':') >= 0) {
						let queryParts = queryStr.split(':');
						console.log(queryParts);
						if (queryParts[0]) {
							queryObj.dsl.word = queryParts[0]
						}
						if (queryParts[1]) {
							queryObj.dsl.acceptation = queryParts[1];
						}
					}
					else {
						queryObj.dsl.word = queryStr;
					}

					await wordsModel.find(queryObj)
						.then(res => {
							console.log(res);
							this.curWordsInfo = [];
							for (let wordInfo of res.data) {
								this.curWordsInfo.push(wordInfo);
							}
						})
						.catch(err => {
							this.$message({
								message: '查询失败' + err,
								type: 'warning'
							});
							console.log('查询失败', err);
						})
				}
			},

			// 删除单词
			async delWord (word, _id) {
				let delWordToken;
				await this.$prompt('请输入删除秘钥', '删除单词: '+word, {
					confirmButtonText: '删除',
					cancelButtonText: '取消',
				}).then(value => {
					delWordToken = value;
				}).catch(() => {
					          
				});

				if (delWordToken && delWordToken.value) {
					await wordsModel.del(_id, delWordToken.value, word)
						.then(res => {
							this.$message({
								type: 'success',
								message: '删除成功'
							});
							console.log('word.vue, 删除成功', word, _id, res);
							this.updatePage();
						})
						.catch (err => {
							this.$message({
								type: 'error',
								message: '删除失败' + err
							}); 
							console.log('word.vue, 删除失败', word, _id, err);
						});
				}
			},
			
			// 更新rem
			async updateRem (e, word, rem) {
				e.currentTarget.parentNode.parentNode.classList.add('unsaved-textarea');	// 改变样式, 提示未保存, 注意保存
				if (e.ctrlKey && e.keyCode === 83) {	// ctrl + s 保存
					e.currentTarget.parentNode.parentNode.classList.remove('unsaved-textarea');
					e.preventDefault();
					await wordsModel.update(word, {rem})
						.then(res => {
							this.$message('更新中...');
							for (let i=0; i<this.curWordsInfo.length; i++) {
								if (this.curWordsInfo[i].word === word) {
									this.curWordsInfo[i].rem = rem;
								}
							}
							this.$message({
								message: '更新成功',
								type: 'success'
							});
							this.updatePage();
						})
						.catch (err => {
							this.$message({
								message: '更新失败\n' + JSON.stringify(err, null, 2),
								type: 'error'
							});
						})
				}
			},

			// 翻页
			async changePage (pageNum) {
				this.curPage = pageNum;
				await this.updatePage(pageNum);
			},

			// 更新页面
			async updatePage (pageNum = this.curPage) {
				pageNum--;
				await this.getWordList(pageNum * this.pageWordsNum, this.pageWordsNum - 1);
				await this.getWordInfo(this.curWords);
				this.playWordPronTr();
			},

			// 播放单词读音-悬浮
			playWordPron (e) {
				$('audio', e.currentTarget)[0].play();
			},

			// 播放单词读音-点击此行
			playWordPronTr () {
				setTimeout(() => {
					$('tr.el-table__row', '#words-table').off('click');
					$('tr.el-table__row', '#words-table').click(e => {
						if (e.target.parentNode.classList.contains('handle-bar') ||  // 点击操作按钮或文本框, 不发音
							e.target.parentNode.parentNode.classList.contains('handle-bar')||
							e.target.tagName === 'TEXTAREA'
							) {
								return;
						}
						try {
							$('audio', e.currentTarget)[0].play();
						} catch (e) {
							console.warn('words.vue, playWordPronTr(), 点击的这一行可能没有发音');
						}
					});
				}, 0)
			},

			// 显示图片模态框
			showImageModal (imgSrc) {
				this.isShowImageModal = true;
				this.imageModalSrc = imgSrc;
			},

			// 跳转到背诵页面
			gotoRecitation () {
				this.$router.push('./recitation');
			},

			// 记录今天学习了多少个单词
			recordWordsNum () {
				if (!localStorage.getItem('lastOpenDate')) {
					let date = new Date();
					let dateInfo = [date.getFullYear(), date.getMonth(), date.getDate()];
					localStorage.setItem('lastOpenDate', dateInfo.join());
				}
				let lastOpenDateTag = localStorage.getItem('lastOpenDate');
				let curDate = new Date();
				let curDateInfo = [curDate.getFullYear(), curDate.getMonth(), curDate.getDate()];
				let curDateTag = curDateInfo.join();
				if (curDateTag !== lastOpenDateTag) {	// 更新已经背过的单词量
					this.lastWordsNum = this.allWordsNum;
					localStorage.setItem('lastWordsNum', this.lastWordsNum);
					localStorage.setItem('lastOpenDate', curDateTag);
				} else {
					this.lastWordsNum = Number(localStorage.getItem('lastWordsNum'));
				}
			},

			// 分析词素, 获取图片
			analyzeMorpheme (word) {
				this.sideBarInfo = '';
				let matchedRoots = '<br/>词根<br/>'
				for (let root in morphemes.roots) {
					if (word.includes(root)) {
						matchedRoots += `<span class="side-bar-info-item">${root}: ${morphemes.roots[root]}</span>`
					}
				}
				let matchedPrefixes = '<br/>前缀<br/>'
				for (let prefix in morphemes.prefixes) {
					if (word.indexOf(prefix) === 0) {
						matchedPrefixes += `<span class="side-bar-info-item">${prefix}: ${morphemes.prefixes[prefix]}</span>`
					}
				}
				let matchedPostfixes = '<br/>后缀<br/>'
				for (let postfix in morphemes.postfixes) {
					let index = word.lastIndexOf(postfix);
					if (index > -1 && index === word.length - postfix.length) {
						matchedPostfixes += `<span class="side-bar-info-item">${postfix}: ${morphemes.postfixes[postfix]}</span>`
					}
				}

				this.sideBarInfo = matchedRoots + matchedPrefixes + matchedPostfixes;

				let imgs = '';
				axios.get(`https://www.googleapis.com/customsearch/v1?q=${word}&searchType=image&cx=${encodeURI(config.googleSearchEngineId)}&key=${encodeURI(config.googleApiKey)}`)
					.then(res => {
						if (res.status === 200) {
							for (let i of res.data.items) {
								imgs += `<img class="related-images" src="${i.link}">`
							}
						}
						this.sideBarInfo += imgs;
					})
		
			},

			// 分析音节
			analyzeSyllables (phoneticSymbols) {
				this.sideBarInfo = '';
				let res = '';
				let syllable;
				let findedSyllables = [];
				for (let ps of phoneticSymbols) {
					for (let s in syllables) {
						if (!findedSyllables.includes(s) && ps.includes(s)) {
							findedSyllables.push(s);
							syllable = syllables[s];
							if (typeof syllable === 'string') {
								let matchRes = syllable.match(/^{(.+)}$/);
								if (matchRes && matchRes[1]) {
									syllable = syllables[matchRes[1]]
								}
							}

							if (typeof syllable === 'string') {
								res += `<span class="side-bar-info-item">[${s}]</span> ${syllable}`
							} else if (Array.isArray(syllable)) {
								res += `<span class="side-bar-info-item">[${s}]</span> ${syllable.join('<br/>')}`;
							}

							res += '<br/><br/>'
						}
					}
				}

				this.sideBarInfo = res;
			},

		},
		async mounted() {
			await this.updatePage();
			this.recordWordsNum();
		}
		
	};
</script>
<style lang="scss">
	#words-book {
		margin-bottom: 50px;
		&:after {
			display: block;
			content: " ";
			clear: both;
		}
		
		// 标题栏
		#words-title {
			text-align: center;
			padding: 4px 0px;
			font-size: 14px;
			.tips {
				color: #aaa;
			}
		}

		// 顶部区域
		#top-area {
			position:fixed;
			top: 0px;
			left: 0px;
			width: 90%;
			height: 80px;
			padding: 0 5%;
			z-index: 10;
			background: rgba(256, 256, 256, 0.94);
			box-shadow: 0px 0px 10px #ddd;
		}

		// 顶栏
		#top-bar {
			display: flex;
			.button {
				width: 40px;
			}
			.input {
				width: 200px;
				margin-right: 10px;
				flex-grow: 0;
			}
			#pagination {
				align-self: center;
				flex-grow: 999;
				margin-left: 20px;
			}
		}
		
		// 侧边栏信息
		#side-bar-info {
			position: fixed;
			width: 20%;
			height: 100%;
			top: 80px;
			left: 0px;
			box-sizing: border-box;
			padding: 4px 10px;
			padding-bottom: 100px;	// 抵消上面的top: 80px
			background: rgba(256, 256, 256, 0.94);
			color: #999;
			font-size: 13px;
			overflow-y: auto;
			box-shadow: 0px 10px 10px #ddd;
			z-index: 50;
			.side-bar-info-item {
				display: block;
				background: #f6f6f6;
				border-radius: 4px;
				margin: 4px 0px;
				padding: 4px;
				&:hover {
					background: #eee;
				}
			}
			.related-images {
				display: block;
				margin-top: 20px;
				width: 100%;
			}
		}

		// 单词书
		#words {
			float: right;
			width: 78%;
			margin-top: 90px;
			margin-right: 10px;
			border-radius: 4px;
		}

		.word {
			height: 100%;
			.el-icon-close {
				display: none;
			}
		}

		.word-ps {
			display: inline-block;
			background: #f4f4f4;
			border-radius: 4px;
			padding: 2px 4px;
			margin: 2px 4px;
			transition: all 0.2s;
			color: #aaa;
			font-size: 12px;
			audio {
				display: none;
			}
			&:hover {
				background: #eee;
			}
		}

		.word-acceptation {
			margin-bottom: 4px;
			.pos {
				background: #f4f4f4;
				padding: 2px;
				border-radius: 4px;
				color: #aaa;
			}
		}

		.el-textarea__inner{
			border: none!important;
			background: transparent;
			padding: 0!important;
			margin: 0!important;
		}

		.unsaved-textarea {
			background: rgb(255, 241, 241);
		}
		
		.handle-bar {
			div {
				display: inline-block;
				background: #f4f4f4;
				padding: 2px 4px;
				margin: 2px;
				border-radius: 4px;
				color: #aaa;
				font-size: 12px;
				transition: all 0.2s;
				cursor: pointer;
				a {
					display: inline-block;
					height: 100%;
					width: 100%;
				}
			}
			.delete:hover {
				background: rgb(241, 120, 99);	
				color: #fff;
			}
			.youtube:hover {
				background: rgb(241, 120, 99);					
				color: #fff;
			}
			.bing:hover {
				background: rgb(21, 158, 158);
				color: #fff;
			}
			.morpheme:hover {
				background: rgb(197, 192, 191);	
				color: #fff;
			}
			.syllable:hover {
				background: rgb(197, 192, 191);	
				color: #fff;
			}
		}

		.word-img-container {
			width: 100%;
			img {
				width: 100%;
				height: 100%;
			}
			img:after {  /* hide image broken icon */
				display: block;
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-color: #fff;	/* cover the broken icon with a #fff block*/
				content: attr(alt);
			}
		}
	}
</style>
