<template>
  <div id="list">
    <div id="top-bar">
      <el-input v-model="wordFromNum"></el-input>
      <el-input v-model="wordToNum"></el-input>
      <el-button @click="getWords">获取</el-button>
    </div>

    <div class="word-card" v-for="(v, k) of wordInfoList" :key="k">
      <h1 class="word">{{ v.num + '. ' + v.word }}</h1>

      <div class="word-pron">
        <div v-for="(item, index) of v.ps" :key="index" class="word-ps">
          {{ '[' + item + ']' }}
        </div>
      </div>

      <div class="word-acceptation">
        <div
          v-for="(item, index) of v.pos"
          :key="'acceptation' + index"
          class="word-acceptation"
        >
          <span class="pos">{{ item }}</span> {{ ' ' + v.acceptation[index] }}
        </div>
      </div>

      <pre class="word-rem">{{ v.rem }}</pre>

      <div class="word-img-container">
        <img src="" @error="loadWordImg($event.target, k)" />
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import config from '@/config/config.js'
import * as wordsModel from '@/models/words.ts'

export default {
  name: 'list',
  data () {
    return {
      wordInfoList: [], // 单词含义
      wordFromNum: 1,
      wordToNum: 100,
      onceGetThreshold: 300, // 一次最多拉取单词数
      allWordsNum: 0, // 单词总数
      imgsServerUrl: config.imgsServerUrl, // 图片服务器地址
      supportedWordImgFormats: ['png', 'jpg', 'gif'] // 单词图片支持的格式
    }
  },
  methods: {
    // 获取单词
    async getWords () {
      this.wordInfoList = {}
      let from = parseInt(this.wordFromNum)
      let to = parseInt(this.wordToNum)
      let size = to - from + 1

      if (from > to) {
        this.$message({
          message: `form > to, form: ${from}, to: ${to}`,
          type: 'error'
        })
        return
      }
      if (size > this.onceGetThreshold) {
        this.$message({
          message: `拉取数据过多, 拒绝执行: threshold: ${this.onceGetThreshold}, curSize: ${size}`,
          type: 'error'
        })
        return
      }

      if (!this.allWordsNum) {
        await wordsModel.list(1, 1).then((res) => {
          this.allWordsNum = res.data.count
        })
      }

      let oldFrom = from
      from = this.allWordsNum - from - size

      let wordList = []
      await wordsModel
        .list(from, size)
        .then((res) => {
          wordList = res.data.words.reverse()
        })
        .catch((err) => {
          throw new Error('words.vue 获取单词列表失败' + from + size)
        })

      let wordInfoList = {}
      let i = 0
      for (let word of wordList) {
        await wordsModel
          .search(word)
          .then((res) => {
            wordInfoList[word] = res.data.wordInfo
            wordInfoList[word].num = oldFrom + i
          })
          .catch((err) => {
            throw new Error('words.vue, 获取单词信息失败' + word + err)
          })
        i++
      }

      this.wordInfoList = wordInfoList
    },

    // 获取单词图片
    async loadWordImg (img, word) {
      let imgTester = new Image()
      let ifFinded = false

      for (let f of this.supportedWordImgFormats) {
        await new Promise((resolve, reject) => {
          imgTester.src = `${this.imgsServerUrl}/${word}.${f}`
          imgTester.onerror = function (e) {
            reject(f)
          }
          imgTester.onload = function (e) {
            resolve(f)
          }
        })
          .then((f) => {
            img.src = `${this.imgsServerUrl}/${word}.${f}`
            ifFinded = true
          })
          .catch((e) => {})
        if (ifFinded) {
          break
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#top-bar {
  display: flex;
}

.word-card {
  background: #fff;
  margin: 4px 4px 10px 4px;
  padding: 4px;
  border-radius: 10px;
  text-align: center;
  line-height: 2;
  .word-pron {
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
    }
  }
  .word-rem {
    white-space: pre-wrap;
    font-size: 14px;
    color: #888;
  }
  .word-img-container {
    width: 100%;
    img {
      width: 100%;
      border-radius: 10px;
    }
  }
}
</style>
