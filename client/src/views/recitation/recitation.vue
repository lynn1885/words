<template>
	<div id="recitation">
		<!-- 顶栏 -->
		<div id="top-bar">
			<div style="width: 100%; text-align: center;">
				{{count}}
			</div>
			<el-button
				id="gotoWordsBook"
				style="float: right"
				@click="gotoWordsBook"
				>
				单词本
			</el-button>
		</div>

		<!-- 单词卡 -->
		<div id="word-card" v-if="curWordInfo">

			<h1 id="word" class="word-info-item">{{curWordInfo.word}}</h1>
			
			<div id="word-pron" class="word-info-item">
				<div v-for="(item, index) of curWordInfo.ps" :key="index" class="word-ps" @mouseover="playWordPron($event)">
					{{'[' + item + ']' }}
					<audio :src="curWordInfo.pron[index]" controls @click="playWordPron"></audio>
				</div>
			</div>
			
			<div id="word-acceptation" class="word-info-item">
				<div 
					v-for="(item, index) of curWordInfo.pos" 
					:key="'acceptation' + index"
					class="word-acceptation"
					>
					<span class="pos">{{item}}</span> {{' ' + curWordInfo.acceptation[index]}}
				</div>
			</div>
			
			<pre id="word-rem" class="word-info-item">{{curWordInfo.rem}}</pre>
			
			<div id="word-img" class="word-info-item">
				<div class="word-img-container">
					<img :src="`./static/imgs/words/${curWordInfo.word}.png`">
				</div>
			</div>
		</div>

		<div id="next-word" @click="randomWord">下一个</div>

		
	
	</div>
</template>

<script>
import $ from "jquery";
import _ from "lodash";
import * as wordsModel from "@/models/words.ts";

export default {
  name: "recitation",
  data() {
    return {
      wordList: [], // 所有单词
			curWordInfo: null, // 当前单词
			count: 1
    };
  },
  methods: {
    // 随机获取单词
    async randomWord() {
			this.count++;
      let wordIndex = _.random(0, this.wordList.length - 1);
      let word = this.wordList[wordIndex];
      this.wordList = this.wordList.filter(
        (item, index) => index !== wordIndex
      );
      await this.getWordInfo(word);
      $("audio")[0].play();
    },

    // 获取单词列表
    async getWordList(from, size) {
      await wordsModel
        .list(from, size)
        .then(res => {
          this.wordList = res.data.words;
        })
        .catch(err => {
          throw new Error("words.vue 获取单词列表失败" + from + size);
        });
    },

    // 获取单词信息
    async getWordInfo(word) {
      await wordsModel
        .search(word)
        .then(res => {
          this.curWordInfo = res.data.wordInfo;
        })
        .catch(err => {
          throw new Error("words.vue, 获取单词信息失败" + word + err);
        });
    },

    // 播放单词读音
    playWordPron(e) {
      $("audio", e.currentTarget)[0].play();
    },

    // 跳转到单词本页面
    gotoWordsBook() {
      this.$router.push("/");
    }
  },
  async mounted() {
    await this.getWordList(0, 20000);
    await this.randomWord();
  }
};
</script>

<style lang="scss" scoped>
#top-bar {
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 50px;
  background: rgba(256, 256, 256, 0.94);
  box-shadow: 0px 0px 10px #ddd;
  z-index: 100;
  #gotoWordsBook {
    height: 40px;
    margin-right: 10px;
  }
}

#word-card {
  width: 400px;
  background: #fff;
  margin: 0 auto;
  margin-top: 100px;
  margin-bottom: 50px;
  padding: 20px;
  box-shadow: 0px 0px 10px #eee;
  border-radius: 10px;
  .word-info-item {
    margin: 20px 0px;
  }
  #word-pron {
    text-align: center;
    .word-ps {
      display: inline-block;
      background: #f4f4f4;
      border-radius: 4px;
      padding: 2px 4px;
      margin: 0 4px;
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
  }
  #word-img {
    position: relative;
    .word-img-container {
      width: 100%;
      img {
        width: 100%;
        height: 100%;
      }
      img:after {
        /* hide image broken icon */
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #fff; /* cover the broken icon with a #fff block*/
        content: attr(alt);
      }
    }
  }

  #word-rem {
    white-space: pre-wrap;
    font-size: 14px;
    color: #888;
  }
}

#next-word {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: #4599f9;
  color: #fff;
  box-shadow: 0px 0px 8px #4599f9;
  border-radius: 100px;
  transition: 0.4s all;
  &:hover {
    box-shadow: 0px 0px 14px #4599f9;
    background: rgb(64, 149, 245);
  }
}

audio {
  display: none;
}
</style>
