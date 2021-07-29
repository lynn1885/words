<template>
  <div id="recitation">
    <!-- 顶栏 -->
    <div id="top-bar">
      <!-- 按钮 -->
      <div @click="gotoWordsBook" class="top-bar-btn back">
        <i class="el-icon-back"></i>  单词本
      </div>
      <div @click="changeReciteMode" class="top-bar-btn mode">
        <i class="el-icon-sort"></i> 模式 {{reciteMode}}
      </div>
      <div @click="toggleAutoRecite" :class="{
        'top-bar-btn': true,
        'active': autoReciteTimer
      }">
        <i class="el-icon-time"></i> 自动背诵 {{autoReciteTimer ? '开' : '关'}}
      </div>
      <div @click="toggleWebImg" :class="{
        'top-bar-btn': true,
        'active': isShowWebImg
      }">
        <i class="el-icon-time"></i> 图片 {{isShowWebImg ? '开' : '关'}}
      </div>
      <div>
        <el-input v-model.number="perUnitWordsNum" class="top-bar-input" size="small">
          <el-button slot="append" icon="el-icon-more-outline"  @click="changeWordUnitNum">每组个数</el-button>
        </el-input>
        <el-input v-model="reciteInterval" class="top-bar-input" size="small">
          <el-button slot="append" icon="el-icon-time" @click="resetAutoReciteTimer">背诵定时</el-button>
        </el-input>
      </div>

       <!-- 计数 -->
      <div class="word-count">
        <div>单元词数: {{ wordCount }}/{{ curWordUnit.length }}</div>
        <div>背诵时间: {{Math.floor((reciteTime / 60)) }} m {{reciteTime % 60}} s</div>
        <el-progress :percentage="recitePercentage" :text-inside="true" :stroke-width="14"></el-progress>
      </div>

      <!-- 单元 -->
      <div
        class="word-unit"
        v-for="(unit, index) of wordUnits"
        :key="unit[0]"
        @click="setCurWordUnit(index)"
        :class="{ active: unit === curWordUnit }"
      >
        {{ index + 1 }}
      </div>

      <!-- 固定单元 -->
      <div
        class="word-unit master-reading"
        @click="setCurWordUnit('master-all')"
        :class="{ active: curWordUnit === masterAllUnit}"
      >
        考研5500词
      </div>
      <div
        class="word-unit master-core"
        @click="setCurWordUnit('master-core')"
        :class="{ active: curWordUnit === masterCoreWordUnit}"
      >
        考研核心词
      </div>

      <div
        class="word-unit master-reading"
        @click="setCurWordUnit('master-reading')"
        :class="{ active: curWordUnit === masterReadingWordUnit}"
      >
        考研阅读词
      </div>
       <div
        class="word-unit master-reading"
        @click="setCurWordUnit('master-synonym')"
        :class="{ active: curWordUnit === masterSynonymUnit}"
      >
        考研形近词辨析
      </div>
    </div>

    <!-- 图片 -->
    <div id="related-images" v-if="curWordInfo && isShowWebImg">
      <iframe
        v-show="isShowAnswer"
        :src="
          'https://cn.bing.com/images/search?q=' +
          curWordInfo.word +
          '&go=Search&qs=n&form=QBILPG&sp=-1&pq=multitude&sc=0-0'
        "
        frameborder="0"
      ></iframe>
    </div>

    <!-- 单词卡 -->
    <div id="word-card" v-if="curWordInfo">
      <h1 id="word" class="word-info-item" v-if="reciteMode === 'word' && !autoReciteTimer" style="font-size: 80px">{{ curWordInfo.word }}</h1>
      <h1 id="word" class="word-info-item" v-if="reciteMode === 'acceptation'" style="font-size: 20px">{{ curWordInfo.acceptation.join(' ') }}</h1>
      <h1 id="word" class="word-info-item" v-if="isShowAnswer && autoReciteTimer" style="font-size: 80px">
        {{ curWordInfo.word }}
        <!-- {{ curWordInfo.acceptation.join(' ').split(/；|，/)[0].replace(/(（.+）)|(\[.+\])|(\<.+\>)/, '') }} -->
      </h1>

      <div style="font-size: 40px">
        <!-- <div id="word-word" v-show="isShowAnswer">{{ curWordInfo.word }}</div> -->
        <div id="word-pron" class="word-info-item" v-show="isShowAnswer">
          <div
            v-for="(item, index) of curWordInfo.ps"
            :key="index"
            class="word-ps"
            @mouseover="playWordPron($event)"
          >
            {{ '[' + item + ']' }}
            <audio
              :src="curWordInfo.pron[index]"
              controls
              @click="playWordPron"
            ></audio>
          </div>
        </div>

        <div id="word-acceptation" class="word-info-item" v-show="isShowAnswer">
          <div
            v-for="(item, index) of curWordInfo.pos"
            :key="'acceptation' + index"
            class="word-acceptation"
          >
            <span class="pos">{{ item }}</span>
            {{ ' ' + curWordInfo.acceptation[index] }}
          </div>
        </div>

        <div v-show="isShowAnswer" style="color: #888; letter-spacing: 2px;">
          {{ curWordInfo.word }}
          <!-- <span style="font-size: 30px; color: green">{{ curWordInfo.pos[0] }}  {{ curWordInfo.acceptation.join(' ').split(/；|，/)[0].replace(/(（.+）)|(\[.+\])|(\<.+\>)/, '') }}</span> -->
        </div>

        <pre id="word-rem" class="word-info-item" v-show="isShowAnswer">{{
          curWordInfo.rem
        }}</pre>

        <div id="word-img" class="word-info-item" v-show="isShowAnswer">
          <div class="word-img-container">
            <img
              :src="`${imgsServerUrl}/${curWordInfo.word}.png`"
              @load="showImage($event)"
              @error="hideImageIcon($event)"
            />
            <img
              :src="`${imgsServerUrl}/${curWordInfo.word}.jpg`"
              @load="showImage($event)"
              @error="hideImageIcon($event)"
            />
            <img
              :src="`${imgsServerUrl}/${curWordInfo.word}.gif`"
              @load="showImage($event)"
              @error="hideImageIcon($event)"
            />
          </div>
        </div>
      </div>

    </div>

    <!-- 下一个 -->
    <div id="next-word" @click="randomWord" ref="next-word">下一个</div>
  </div>
</template>

<script>
import $ from 'jquery'
import _ from 'lodash'
import config from '@/config/config.js'
import * as wordsModel from '@/models/words.ts'
import masterCoreWordUnit from '@/utils/words/master-core.js'
import masterReadingWordUnit from '@/utils/words/master-reading.js'
import masterAllUnit from '@/utils/words/master-all.js'
import masterSynonymUnit from '@/utils/words/master-synonym.js'

export default {
  name: 'recitation',
  data () {
    return {
      reciteMode: 'word', // 背诵方式 word || acceptation
      wordList: [], // 所有单词
      curWordInfo: null, // 当前单词
      wordCount: 1, // 单词计数
      perUnitWordsNum: 1000, // 每个单元的词汇量
      wordUnits: [], // 单元信息
      imgsServerUrl: config.imgsServerUrl, // 图片服务器地址
      curWordUnit: [], // 当前单词单元
      curWordUnitCache: [], // 当前单词单元副本, 供randomWord消费
      isShowWebImg: true, // 是否显示网络图片
      isShowAnswer: false, // 是否展示答案
      isNewWordUnitSetted: false, // 是否新设置了单词单元
      reciteTime: 0, // 背诵了多长时间了
      reciteTimer: null, // 背诵时间计时器,
      reciteInterval: 1500, // 背诵倒计时
      autoReciteTimer: null, // 自动背诵时钟,
      masterCoreWordUnit,
      masterReadingWordUnit,
      masterAllUnit,
      masterSynonymUnit
    }
  },
  watch: {
    curWordUnit () {
      this.wordCount = 0
      this.curWordUnitCache = this.curWordUnit.slice()
      this.randomWord()
    }
  },
  computed: {
    recitePercentage () {
      let res = Number((this.wordCount / this.curWordUnit.length * 100).toFixed(2))
      if (res < 0 || res > 100) return 0
      else return res
    }
  },
  methods: {
    // 随机获取单词
    async randomWord () {
      if (this.isNewWordUnitSetted) {
        this.isNewWordUnitSetted = false
        this.isShowAnswer = false
      } else if (!this.isShowAnswer) {
        this.isShowAnswer = true
        let audio = $('audio')[0]
        if (this.autoReciteTimer) audio.playbackRate = 1.2
        else audio.playbackRate = 1
        audio.play()
        return
      } else {
        this.isShowAnswer = false
      }

      if (this.curWordUnitCache.length > 0) {
        let wordIndex = this.wordCount // get next word by index
        this.wordCount++
        // let wordIndex = _.random(0, this.curWordUnitCache.length - 1) // get next word by random
        let word = this.curWordUnitCache[wordIndex]
        // this.curWordUnitCache = this.curWordUnitCache.filter(
        //   (item, index) => index !== wordIndex
        // )
        await this.getWordInfo(word)
      } else {
        this.$message({
          message: '背完了呀~',
          type: 'success'
        })
      }
    },

    // 获取单词列表
    async getWordList (from, size) {
      await wordsModel
        .listrem(from, size)
        .then(res => {
          this.wordList = res.data.words.reverse()
        })
        .catch(() => {
          throw new Error('words.vue 获取单词列表失败' + from + size)
        })
    },

    // 获取单词信息
    async getWordInfo (word) {
      await wordsModel
        .search(word)
        .then(res => {
          this.curWordInfo = res.data.wordInfo
        })
        .catch(err => {
          throw new Error('words.vue, 获取单词信息失败' + word + err)
        })
    },

    // 计算单词单元
    calWordUnits (wordList) {
      let unitsNum = Math.ceil(wordList.length / this.perUnitWordsNum)
      let lastStopIndex = 0
      for (let i = 0; i < unitsNum; i++) {
        let curUnit = wordList.slice(lastStopIndex, this.perUnitWordsNum + lastStopIndex)
        lastStopIndex = lastStopIndex + this.perUnitWordsNum
        this.wordUnits.push(curUnit)
      }
    },

    // 设置当前背诵单元
    setCurWordUnit (wordUnit) {
      this.isNewWordUnitSetted = true

      if (!wordUnit) {
        this.curWordUnit = this.wordList
      } else if (typeof wordUnit === 'number') { // 单元词: 1, 2, 3
        this.curWordUnit = this.wordUnits[wordUnit]
      } else if (wordUnit === 'master-core') {
        this.curWordUnit = masterCoreWordUnit
      } else if (wordUnit === 'master-reading') {
        this.curWordUnit = masterReadingWordUnit
      } else if (wordUnit === 'master-all') {
        this.curWordUnit = masterAllUnit
      } else if (wordUnit === 'master-synonym') {
        this.curWordUnit = masterSynonymUnit
      }

      // 考研核心词
    },

    // 播放单词读音
    playWordPron (e) {
      let audio = $('audio', e.currentTarget)[0]
      audio.play()
    },

    // 跳转到单词本页面
    gotoWordsBook () {
      this.$router.push('/')
    },

    // 隐藏图片破损图标
    hideImageIcon (e) {
      e.target.style.display = 'none'
    },

    // 显示图片
    showImage (e) {
      e.target.style.display = 'block'
    },

    // 快捷键
    setShortcut () {
      $(document.body).on('keydown', e => {
        if (e.keyCode === 32) {
          $(this.$refs['next-word']).trigger('click')
        }
      })
    },

    // 改变背诵模式
    changeReciteMode () {
      if (this.reciteMode === 'word') this.reciteMode = 'acceptation'
      else this.reciteMode = 'word'
    },

    // 切换自动背诵
    toggleAutoRecite () {
      let interval = this.reciteInterval
      if (interval < 500) interval = 500
      if (!this.autoReciteTimer) {
        this.autoReciteTimer = setInterval(() => {
          $(this.$refs['next-word']).trigger('click')
          setTimeout(() => {
            $(this.$refs['next-word']).trigger('click')
          }, 200)
        }, interval)
      } else {
        clearInterval(this.autoReciteTimer)
        this.autoReciteTimer = null
      }
    },

    // 重新设置背诵计时
    resetAutoReciteTimer () {
      clearInterval(this.autoReciteTimer)
      this.autoReciteTimer = null
      setTimeout(() => {
        this.toggleAutoRecite()
      }, 400)
    },

    // 切换网络图片显示
    toggleWebImg () {
      this.isShowWebImg = !this.isShowWebImg
    },

    // 改变单词单元个数
    changeWordUnitNum () {
      this.wordUnits = []
      this.calWordUnits(this.wordList)
      this.setCurWordUnit()
    }
  },
  async mounted () {
    this.setShortcut()
    await this.getWordList(0, 20000)
    this.calWordUnits(this.wordList)
    this.setCurWordUnit() // 不传参, 则默认设置所有单词为当前unit
    this.reciteTimer = setInterval(() => {
      this.reciteTime += 1
    }, 1000)
  },

  beforeDestroy () {
    clearInterval(this.reciteTimer)
  }
}
</script>

<style lang="scss" scoped>
#recitation {
  display: flex;
  padding: 10px;
  height: 100%;
  box-sizing: border-box;

  /* 顶栏 */
  #top-bar {
    bottom: 10px;
    width: 200px;
    height: 100%;
    flex-shrink: 0;
    line-height: 40px;
    box-sizing: border-box;
    background: rgba(256, 256, 256, 0.9);
    backdrop-filter: blur(10px);
    padding: 10px;
    margin-right: 10px;
    border-radius: 2px;
    z-index: 100;
    overflow: auto;

    /* 按钮们 */
    .top-bar-btn {
      cursor: pointer;
      background: #f4f4f4;
      height: 30px;
      line-height: 30px;
      padding: 2px 6px;
      border-radius: 4px;
      color: #666;
      font-weight: bold;
      width: fit-content;
      margin-bottom: 6px;
      &:hover {
        background: #4599f9;
        color: #fff;
      }
    }

    /* 输入框 */
    /deep/ .top-bar-input {
      width: 100%;
      input {
        font-weight: bold;
      }
      .el-input-group__append {
        padding: 0 4px;
        margin: 0;
        background: #f4f4f4;
        width: 40px;
        text-align: center;
        transform: translateX(-4px);
        font-weight: normal;
        color: #666;
        &:hover {
          background: #ddd;
        }
      }
    }

    /* 开关开启 */
    .active {
      background: #4599f9!important;
      color: #fff!important;
      box-shadow: 0px 0px 10px #72b0f7!important;
      transition: all 0.2s;
    }

    /* 单词单元 */
    .word-unit {
      display: inline-block;
      height: 30px;
      line-height: 30px;
      padding: 0px 10px;
      margin: 0px 4px;
      box-sizing: border-box;
      text-align: center;
      border-radius: 4px;
      background: #f4f4f5;
      color: #606266;
      font-weight: bold;
      font-size: 12px;
      cursor: pointer;
      &:hover {
        background: #4599f9;
        color: #fff;
      }
    }

    .master-core, .master-reading {
      background: rgb(252, 247, 233);
      color: rgb(160, 144, 92);
    }

    /* 单词数量统计 */
    .word-count {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #ddd;
      font-size: 12px;
      line-height: 24px;
      padding: 10px 0;
      .el-progress {
        width: 140px;
      }
    }
  }

  // 相关图片
  #related-images {
    flex-shrink: 0;
    top: 10px;
    bottom: 10px;
    width: 40%;
    overflow: hidden;
    border-radius: 4px;
    background: #fff;
    box-shadow: 0px 0px 10px #eee;
    box-sizing: border-box;
    margin-right: 10px;
    iframe {
      width: 100%;
      height: 100%;
    }
  }

  // 单词卡
  #word-card {
    flex-shrink: 0;
    flex-grow: 0;
    width: calc(60% - 220px);
    padding: 10px 20px;
    margin: 0 auto;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0px 0px 10px #eee;
    border-radius: 4px;
    overflow: auto;
    .word-info-item {
      margin: 20px 0px;
      word-break: break-all;
      word-wrap: break-word;
    }
    #word-word {
      text-align: center;
      font-size: 18px;
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
      color: #888;
    }
  }

  /* 下一个单词 */
  #next-word {
    position: fixed;
    bottom: 40px;
    left: 54%;
    transform: translateX(-50%);
    width: 150px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    background: rgba(69, 153, 249, 0.3);
    backdrop-filter: blur(10px);
    color: #fff;
    box-shadow: 0px 0px 8px #8bbffc;
    border-radius: 100px;
    transition: 0.4s all;
    z-index: 1000;
    cursor: pointer;
    &:hover {
      box-shadow: 0px 0px 14px #72b0f7;
      background: rgba(69, 153, 249, 0.5);
    }
    &::selection {
      background: transparent;
    }
  }

  audio {
    display: none;
  }
}

</style>
