<template>
	<div id="recitation">
		<!-- 顶栏 -->
		<div id="top-bar">
      <span class="word-count">
        {{wordCount}}/{{curWordUnit.length}}
      </span>
      <div class="word-unit" v-for="(unit, index) of wordUnits" :key="unit[0]" @click="setCurWordUnit(index)" :class="{'active': unit === curWordUnit}">
        {{index + 1}}
      </div>
		</div>

    <!-- 图片 -->
    <div id="related-images" v-if="curWordInfo">
      <iframe v-show="isShowAnswer" :src="'https://cn.bing.com/images/search?q=' + curWordInfo.word + '&go=Search&qs=n&form=QBILPG&sp=-1&pq=multitude&sc=0-0'" frameborder="0"></iframe>
    </div>

		<!-- 单词卡 -->
		<div id="word-card" v-if="curWordInfo">

			<h1 id="word" class="word-info-item">{{curWordInfo.word}}</h1>
			
			<div id="word-pron" class="word-info-item" v-show="isShowAnswer">
				<div v-for="(item, index) of curWordInfo.ps" :key="index" class="word-ps" @mouseover="playWordPron($event)">
					{{'[' + item + ']' }}
					<audio :src="curWordInfo.pron[index]" controls @click="playWordPron"></audio>
				</div>
			</div>
			
			<div id="word-acceptation" class="word-info-item" v-show="isShowAnswer">
				<div 
					v-for="(item, index) of curWordInfo.pos" 
					:key="'acceptation' + index"
					class="word-acceptation"
					>
					<span class="pos">{{item}}</span> {{' ' + curWordInfo.acceptation[index]}}
				</div>
			</div>
			
			<pre id="word-rem" class="word-info-item" v-show="isShowAnswer">{{curWordInfo.rem}}</pre>
			
			<div id="word-img" class="word-info-item" v-show="isShowAnswer">
				<div class="word-img-container">
					<img :src="`${imgsServerUrl}/${curWordInfo.word}.png`" @load="showImage($event)" @error="hideImageIcon($event)">
					<img :src="`${imgsServerUrl}/${curWordInfo.word}.jpg`" @load="showImage($event)" @error="hideImageIcon($event)">
					<img :src="`${imgsServerUrl}/${curWordInfo.word}.gif`" @load="showImage($event)" @error="hideImageIcon($event)">
				</div>
			</div>
      
		</div>

    <!-- 下一个 -->
		<div id="next-word" @click="randomWord" ref="next-word">下一个</div>
	</div>
</template>

<script>
import $ from "jquery";
import _ from "lodash";
import config from "@/config/config.js";
import * as wordsModel from "@/models/words.ts";

export default {
  name: "recitation",
  data() {
    return {
      wordList: [], // 所有单词
			curWordInfo: null, // 当前单词
      wordCount: 1, // 单词计数
      perUnitWordsNum: 100, // 每个单元的词汇量
      wordUnits: [],  // 单元信息
      imgsServerUrl: config.imgsServerUrl,  // 图片服务器地址
      curWordUnit: [], // 当前单词单元
      curWordUnitCache: [], // 当前单词单元副本, 供randomWord消费
      isShowAnswer: false,  // 是否展示答案
      isNewWordUnitSetted: false, // 是否新设置了单词单元
    };
  },
  watch: {
    curWordUnit () {
      this.wordCount = 0;
      this.curWordUnitCache = this.curWordUnit.slice();
      this.randomWord();
    }
  },
  methods: {
    // 随机获取单词
    async randomWord() {
      if (this.isNewWordUnitSetted) {
        this.isNewWordUnitSetted = false;
        this.isShowAnswer = false;
      } else if (!this.isShowAnswer) {
        this.isShowAnswer = true;
        $("audio")[0].play();
        return;
      } else {
        this.isShowAnswer = false;
      }
      
      if (this.curWordUnitCache.length > 0) {
        this.wordCount++;
        let wordIndex = _.random(0, this.curWordUnitCache.length - 1);
        let word = this.curWordUnitCache[wordIndex];
        this.curWordUnitCache = this.curWordUnitCache.filter(
          (item, index) => index !== wordIndex
        );
        await this.getWordInfo(word);
      } else {
          this.$message({ 
            message: '背完了呀~',
            type: 'success'
          });
      }
    },

    // 获取单词列表
    async getWordList(from, size) {
      await wordsModel
        .list(from, size)
        .then(res => {
          this.wordList = res.data.words.reverse();
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

    // 计算单词单元
    calWordUnits (wordList) {
      let unitsNum = Math.ceil(wordList.length / this.perUnitWordsNum)
      let lastStopIndex = 0;
      for (let i=0; i < unitsNum; i++) {
        let curUnit = wordList.slice(lastStopIndex, this.perUnitWordsNum + lastStopIndex);
        lastStopIndex = lastStopIndex + this.perUnitWordsNum;
        this.wordUnits.push(curUnit);
        
      }
    },

    // 设置当前背诵单元
    setCurWordUnit (index) {
      this.isNewWordUnitSetted = true;
      if (!index) {
        this.curWordUnit = this.wordList;
      }
      if (typeof index === 'number') {
        this.curWordUnit = this.wordUnits[index]
      }
    },

    // 播放单词读音
    playWordPron(e) {
      $("audio", e.currentTarget)[0].play();
    },

    // 跳转到单词本页面
    gotoWordsBook() {
      this.$router.push("/");
    },

    // 隐藏图片破损图标
    hideImageIcon (e) {
      e.target.style.display = 'none';
    },

    // 显示图片
    showImage (e) {
      e.target.style.display = 'block';
    },

    // 快捷键
    setShortcut () {
      $(document.body).on('keydown', e => {
        if (e.keyCode === 32) {
          $(this.$refs['next-word']).trigger('click')
        }
      })
    }
  },
  async mounted() {
    this.setShortcut();
    await this.getWordList(0, 20000);
    this.calWordUnits(this.wordList);
    this.setCurWordUnit();  // 不传参, 则默认设置所有单词为当前unit
  }
};
</script>

<style lang="scss" scoped>
#top-bar {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  padding: 0px 60px;
  box-sizing: border-box;
  background: rgba(256, 256, 256, 0.94);
  box-shadow: 0px 0px 10px #ddd;
  z-index: 100;
  text-align: center;
  overflow-y: auto;
  .word-unit {
    display: inline-block;
    width: 30px;
    height: 30px;
    margin: 0px 4px;
    line-height: 30px;
    box-sizing: border-box;
    text-align: center;
    border-radius: 100px;
    background: #f4f4f5;
    color: #606266;
    font-weight: bold;
    font-size: 12px;
    cursor: pointer;
    &:hover {
      background: #4599f9;
      color: #fff;
    }
    &.active {
      background: #4599f9;
      color: #fff;
    }
  }
  .word-count {
    position: fixed;
    right: 10px;
    top: 0;
    color: #ddd;
  }
  #gotoWordsBook {
    height: 40px;
    margin-right: 10px;
  }
}

// 相关图片
#related-images {
  position: fixed;
  left: 2%;
  bottom: 50px;
  width: 47%;
  top: 80px;
  overflow: hidden;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0px 0px 10px #eee;
  box-sizing: border-box;
  iframe {
    width: 100%;
    height: 100%;
    
  }
}

// 单词卡
#word-card {
  float: right;
  width: 47%;
  margin-top: 80px;
  margin-right: 2%;
  margin-bottom: 50px;
  padding: 20px;
  box-sizing: border-box;
  background: #fff;
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
        display: none;
        width: 100%;
        height: 100%;
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
