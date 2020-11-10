<template>
  <div id="words-book">
    <!-- 顶栏 -->
    <div id="top-bar">
      <!-- 添加单词 -->
      <el-input
        class="add-new-word"
        placeholder="添加新单词"
        suffix-icon="el-icon-edit"
        size="small"
        v-model="newWord"
        @keydown.native="addWord($event)"
        clearable
      ></el-input>
      <!-- 查找单词 -->
      <el-input
        class="find-word"
        placeholder="查找单词"
        size="small"
        suffix-icon="el-icon-search"
        v-model="findQuery"
        @keydown.native="findWords($event)"
        clearable
      ></el-input>
      <!-- 刷新 -->
      <el-button
        class="refresh-button"
        icon="el-icon-refresh"
        circle
        size="small"
        @dblclick="updatePage(curPage)"
      ></el-button>
      <!-- 翻页 -->
      <el-pagination
        class="pagination"
        background
        size="small"
        layout="prev, pager, next, jumper"
        :current-page="curPage"
        :page-count="Number.parseInt(allWordsNum / pageWordsNum + 1)"
        @current-change="changePage"
      ></el-pagination>
      <!-- 单词总数 -->
      <div class="words-num">num: {{allWordsNum}}</div>
      <!-- 进度条 -->
      <div class="progress">today: +{{allWordsNum - lastWordsNum}}</div>
      <!-- 显隐列 -->
      <div class="show-columns">
        <el-checkbox-button class="show-column show-left" border v-model="showColumns.left">左侧</el-checkbox-button>
        <el-checkbox-button class="show-column show-word" border v-model="showColumns.word">单词</el-checkbox-button>
        <el-checkbox-button class="show-column show-meaning" border v-model="showColumns.meaning">含义</el-checkbox-button>
        <el-checkbox-button class="show-column show-meaning" border v-model="showColumns.rem">记忆</el-checkbox-button>
        <el-checkbox-button class="show-column show-img" border v-model="showColumns.img">图片</el-checkbox-button>
      </div>

      <!-- 随机背诵 -->
      <el-button class="recitation" size="small" @click="gotoRecitation">随机背诵</el-button>
    </div>

    <!-- 侧边栏信息 -->
    <div id="side-bar-info-container" v-show="showColumns.left">
      <div class="side-bar-info" id="side-bar-info-1" v-html="sideBarInfo1"></div>
      <div class="side-bar-info" id="side-bar-info-2" v-html="sideBarInfo2"></div>
    </div>

    <!-- 单词本 -->
    <el-table
      v-if="curWordsInfo.length > 0"
      :data="curWordsInfo"
      @row-click="onTableRowClick"
      @row-contextmenu="onTableRowRightClick"
      id="words"
      border
      :style="{left: showColumns.left ? '33%': '0.5%', width: showColumns.left ? '66.5%' : '99%'}"
    >
      <el-table-column label="单词" width="120px">
        <template slot-scope="scope">
          <span v-show="showColumns.word">
            {{scope.row.word}}
          </span>
          <el-input v-show="!showColumns.word" size="small" @input="(e) => checkWord(e, scope.row.word)" :placeholder="scope.row.word.slice(0,1)"></el-input>
        </template>
      </el-table-column>

      <el-table-column label="音标" width="140px">
        <template slot-scope="scope">
          <div
            v-for="(item, index) of scope.row.ps"
            :key="index"
            class="word-ps"
            @mouseover="playAudio(scope.row.pron[index])"
            @click="playAudio(scope.row.pron[index])"
          >{{'[' + item + ']' }}</div>
        </template>
      </el-table-column>

      <el-table-column label="含义" width="160px">
        <template slot-scope="scope">
          <div v-show="showColumns.meaning">
            <div
              v-for="(item, index) of scope.row.pos"
              :key="'acceptation' + index"
              class="word-acceptation"
            >
              <span class="pos">{{item}}</span>
              {{' ' + scope.row.acceptation[index]}}
            </div>
          </div>
          <el-input v-show="!showColumns.meaning" size="small" @input="(e) => checkMeaning(e, scope.row.acceptation)" :placeholder="scope.row.acceptation[0].slice(0,1)"></el-input>

        </template>
      </el-table-column>

      <el-table-column label="记忆">
        <template slot-scope="scope">
          <el-input
            v-show="showColumns.rem"
            v-model="scope.row.rem"
            type="textarea"
            :autosize="{minRows: 3, maxRows: 20}"
            resize="none"
            @keydown.native="updateRem($event, scope.row.word, scope.row.rem)"
          ></el-input>
          <audio
            :src="`${audiosServerUrl}/${scope.row.word}.m4a`"
            @loadeddata="$set(curWordsAudios, scope.row.word, true)"
          ></audio>
          <div
            class="word-rem-audio"
            v-if="curWordsAudios[scope.row.word]"
            @mouseover="playAudio(`${audiosServerUrl}/${scope.row.word}.m4a`, 1.5)"
            @click="playAudio(`${audiosServerUrl}/${scope.row.word}.m4a`, 2.0)"
          >音 频</div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100px">
        <template slot-scope="scope">
          <div class="handle-bar">
            <div class="delete" @click="delWord(scope.row.word, scope.row._id)">delete</div>
            <div class="bing">
              <a
                :href="'https://cn.bing.com/images/search?q=' + scope.row.word + '&go=Search&qs=n&form=QBILPG&sp=-1&pq=multitude&sc=0-0'"
                target="blank"
              >bing</a>
            </div>
            <div class="youtube">
              <a
                :href="'https://www.youtube.com/results?search_query=' + scope.row.word"
                target="blank"
              >youtube</a>
            </div>
            <div class="morpheme" @click="analyzeMorpheme($event, scope.row.word)">morpheme</div>
            <div class="syllable" @click="analyzeSyllables($event, scope.row.ps)">syllable</div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="img" label="图片" :width="showColumns.img ? 'auto' : '0'">
        <template slot-scope="scope">
          <div class="word-img-container">
            <img
              src
              @error="loadWordImg($event.target, scope.row.word)"
              @click="showImageModal(curWordsImgs[scope.row.word])"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 图片遮罩 -->
    <el-dialog title="查看图片" :visible.sync="isShowImageModal" width="800px">
      <img :src="imageModalSrc" style="width: 100%" />
    </el-dialog>

    <!-- 音效 -->
    <audio ref="audio-player"></audio>
  </div>
</template>

<script>
import $ from 'jquery'
import _ from 'lodash'
import axios from 'axios'
import * as wordsModel from '@/models/words.ts'
import config from '@/config/config.js'
import morphemes from '@/utils/morphemes.js'
import syllables from '@/utils/syllables.js'

// const __words = [];

export default {
  name: 'words-book',
  data () {
    return {
      newWord: '', // 添加新单词
      findQuery: '', // 搜索的单词
      pageWordsNum: 30, // 每页多少个单词
      allWordsNum: 0, // 总共多少个单词
      lastWordsNum: 0, // 昨天背到多少单词
      curPage: 1, // 当前页码
      curWords: [], // 当前单词
      curWordsInfo: [], // 当前单词及详细注释
      curWordsImgs: {}, // 当前单词图片
      curWordsAudios: {},
      curSelectedRowWord: '', // 当前选中行对应的单词
      imgsServerUrl: config.imgsServerUrl, // 图片服务器地址
      audiosServerUrl: config.audiosServerUrl, // 音频服务器地址
      imageModalSrc: '', // 模态框显示图片的url
      isShowDelWord: false, // 是否显示删除单词
      isShowImageModal: false, // 是否显示图片模态框
      sideBarInfo1: '', // 侧边栏信息
      sideBarInfo2: '', // 侧边栏信息
      googleImagesClient: null, // google images client
      soundPickUp: './static/sounds/pick-up.mp3',
      soundClick: './static/sounds/click.wav',
      supportedWordImgFormats: ['png', 'jpg', 'gif'], // 单词图片支持的格式
      showColumns: { // 显示的列
        left: true,
        word: true,
        meaning: true,
        img: true,
        rem: true
      }
    }
  },
  methods: {
    // 获取单词列表
    async getWordList (from, size) {
      await wordsModel
        .list(from, size)
        .then(res => {
          this.allWordsNum = res.data.count
          this.curWords = res.data.words
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          throw new Error('words.vue 获取单词列表失败' + from + size)
        })
    },

    // 获取单词信息
    async getWordInfo (words) {
      const tempCurWordsInfo = []
      for (let word of words) {
        await wordsModel
          .search(word)
          .then(res => {
            let wordInfo = res.data.wordInfo
            tempCurWordsInfo.push(wordInfo)
          })
          .catch(err => {
            throw new Error('words.vue, 获取单词信息失败' + word + err)
          })
      }
      this.curWordsInfo = tempCurWordsInfo
    },

    // 添加单词
    async addWord (e) {
      if (e.keyCode === 13) {
        // 回车
        let word = _.trim(this.newWord)
        if (!word) {
          this.$message({
            message: '没有输入单词哦~',
            type: 'error'
          })
          return
        }

        await wordsModel
          .search(word)
          .then(async res => {
            console.log(res)
            if (res.data.status === 'new') {
              // this.$message({
              //   message: '添加单词成功',
              //   type: 'success'
              // })
              // this.playAudio(this.soundPickUp);
              this.newWord = ''
              await this.updatePage()
              this.playAudio(res.data.wordInfo.pron[0])
              this.analyzeWord(undefined, res.data.wordInfo)
            } else if (res.data.status === 'old') {
              this.$message({
                message: '单词已经存在了哦~',
                type: 'warning'
              })
              console.warn('words.vue, addWord, 添加的单词已经存在', res)
              this.newWord = ''
              this.findQuery = word
              this.findWords({ keyCode: 13 }) // 执行搜索. 这里传入keyCode: 13, 模拟按下了enter键
            } else {
              this.$message({
                message: '未知的返回值' + res.data,
                type: 'error'
              })
              console.error('words.vue, addWord, 未知的返回值', res)
            }
          })
          .catch(err => {
            this.$message({
              message: '添加失败',
              type: 'error'
            })
            console.error('words.vue, addWord, 添加失败', res)
          })
      }
    },

    // 播放声音
    playAudio (src, playbackRate) {
      if (!src) return
      if (!playbackRate) playbackRate = 1
      this.$refs['audio-player'].setAttribute('src', src)
      this.$refs['audio-player'].playbackRate = playbackRate
      this.$refs['audio-player'].play()
    },

    // 搜索单词
    async findWords (e) {
      if (e.keyCode === 13) {
        // 回车
        this.curWordsInfo = []
        this.curWordsImgs = {}

        let queryStr = _.trim(this.findQuery)
        let queryObj = {
          dsl: {}
        }
        if (!queryStr) {
          this.$message({
            message: '没有输入查询语句, 将刷新当前页',
            type: 'warning'
          })
          this.updatePage()
          return
        }
        // 支持   单词:意思  这种查询语法
        else if (queryStr.indexOf(':') >= 0) {
          let queryParts = queryStr.split(':')
          if (queryParts[0]) {
            queryObj.dsl.word = queryParts[0]
          }
          if (queryParts[1]) {
            queryObj.dsl.acceptation = queryParts[1]
          }
        } else {
          queryObj.dsl.word = queryStr
        }

        await wordsModel
          .find(queryObj)
          .then(res => {
            const tempCurWordsInfo = []
            for (let wordInfo of res.data) {
              tempCurWordsInfo.push(wordInfo)
            }
            this.curWordsInfo = tempCurWordsInfo
          })
          .catch(err => {
            this.$message({
              message: '查询失败' + err,
              type: 'warning'
            })
            console.warn('查询失败', err)
          })
      }
    },

    // 删除单词
    async delWord (word, _id) {
      let delWordToken
      await this.$prompt('请输入删除秘钥', '删除单词: ' + word, {
        confirmButtonText: '删除',
        cancelButtonText: '取消'
      })
        .then(value => {
          delWordToken = value
        })
        .catch(() => {})

      if (delWordToken && delWordToken.value) {
        await wordsModel
          .del(_id, delWordToken.value, word)
          .then(res => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            console.log('word.vue, 删除成功', word, _id, res)
            this.updatePage()
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '删除失败' + err
            })
            console.warn('word.vue, 删除失败', word, _id, err)
          })
      }
    },

    // 更新rem
    async updateRem (e, word, rem) {
      let remDiv = e.currentTarget.parentNode.parentNode
      remDiv.classList.add('unsaved-textarea') // 改变样式, 提示未保存, 注意保存
      if (e.ctrlKey && e.keyCode === 83) {
        // ctrl + s 保存
        e.preventDefault()
        await wordsModel
          .update(word, { rem })
          .then(res => {
            if (res.data.rem === rem) {
              remDiv.classList.remove('unsaved-textarea')
            } else {
              throw new Error(
                `updateRem() Error: 数据不一致. 后台数据: ${res.data.rem}, 前端数据: ${rem}`
              )
            }
          })
          .catch(err => {
            this.$message({
              message: err.message + JSON.stringify(err),
              type: 'error'
            })
            // this.updatePage();
          })
      }
    },

    // 翻页
    async changePage (pageNum) {
      this.curPage = pageNum
      await this.updatePage(pageNum)
    },

    // 更新页面 (★)
    async updatePage (pageNum = this.curPage) {
      this.curWords = []
      this.curWordsInfo = []
      this.curWordsImgs = {}
      this.curWordsAudios = {}

      pageNum--
      await this.getWordList(
        pageNum * this.pageWordsNum,
        this.pageWordsNum - 1
      )
      await this.getWordInfo(this.curWords)
    },

    // 加载单词图片
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
          .then(f => {
            img.src = `${this.imgsServerUrl}/${word}.${f}`
            this.curWordsImgs[word] = img.src
            ifFinded = true
          })
          .catch(e => {})
        if (ifFinded) {
          break
        }
      }
    },

    // 显示图片模态框
    showImageModal (imgSrc) {
      this.imageModalSrc = imgSrc
      this.isShowImageModal = true
    },

    // 检测音频是否存在
    async isAudioExists (src) {
      let flag = false
      const audio = $('audio')
      audio.attr('src', src)
      await new Promise((resolve, reject) => {
        audio.on('loadeddata', () => {
          resolve(true)
        })
        audio.on('error', () => {
          reject(new Error())
        })
      })
        .then(() => {
          flag = true
          console.log('有音频')
        })
        .catch(() => {
          console.log('没有音频')
        })
      return flag
    },

    // 跳转到背诵页面
    gotoRecitation () {
      this.$router.push('./recitation')
    },

    // 记录今天学习了多少个单词
    recordWordsNum () {
      if (!localStorage.getItem('lastOpenDate')) {
        let date = new Date()
        let dateInfo = [date.getFullYear(), date.getMonth(), date.getDate()]
        localStorage.setItem('lastOpenDate', dateInfo.join())
      }
      let lastOpenDateTag = localStorage.getItem('lastOpenDate')
      let curDate = new Date()
      let curDateInfo = [
        curDate.getFullYear(),
        curDate.getMonth(),
        curDate.getDate()
      ]
      let curDateTag = curDateInfo.join()
      if (curDateTag !== lastOpenDateTag) {
        // 更新已经背过的单词量
        this.lastWordsNum = this.allWordsNum
        localStorage.setItem('lastWordsNum', this.lastWordsNum)
        localStorage.setItem('lastOpenDate', curDateTag)
      } else {
        this.lastWordsNum = Number(localStorage.getItem('lastWordsNum'))
      }
    },

    // 分析单词
    analyzeWord (e, row) {
      if (e) {
        e.stopPropagation()
      }
      this.analyzeSyllables(e, row.ps)
      this.analyzeMorpheme(e, row.word)
    },

    // 分析词素, 获取相关图片
    async analyzeMorpheme (e, word) {
      if (e) {
        e.stopPropagation()
      }
      this.sideBarInfo1 = ''
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
        let index = word.lastIndexOf(postfix)
        if (index > -1 && index === word.length - postfix.length) {
          matchedPostfixes += `<span class="side-bar-info-item">${postfix}: ${morphemes.postfixes[postfix]}</span>`
        }
      }

      this.sideBarInfo1 = matchedRoots + matchedPrefixes + matchedPostfixes

      let imgs = ''

      let imgsCacheStr = localStorage.getItem('imgsCache')
      let imgsCache = JSON.parse(imgsCacheStr)

      if (imgsCacheStr && imgsCacheStr.length > 20000) {
        imgsCache = {}
      }
      if (!imgsCache) {
        imgsCache = {}
      }
      if (imgsCache[word]) {
        for (let i of imgsCache[word]) {
          imgs += `<img class="related-images" src="${i}">`
        }
        // console.log("使用图片地址缓存");
      } else {
        await axios
          .get(
            `https://www.googleapis.com/customsearch/v1/?q=${word}&searchType=image&cx=${encodeURI(
              config.googleSearchEngineId
            )}&key=${encodeURI(config.googleApiKey)}`,
            {
              timeout: 2000
            }
          )
          .then(res => {
            if (res.status === 200) {
              imgsCache[word] = []
              for (let i of res.data.items) {
                imgs += `<img class="related-images" src="${i.link}">`
                imgsCache[word].push(i.link)
              }
            }
          })
          .catch(e => {
            imgs = `<iframe class="related-images-iframe" src="https://cn.bing.com/images/search?q=${word}&go=Search&qs=n&form=QBILPG&sp=-1&pq=multitude&sc=0-0" frameborder="0"></iframe>`
            // console.warn("你今天的免费图片搜索次数可能已经用尽, 或请求超时: ", e);
          })
        localStorage.setItem('imgsCache', JSON.stringify(imgsCache))
      }

      this.sideBarInfo1 += imgs
    },

    // 分析音节
    analyzeSyllables (e, phoneticSymbols) {
      if (e) {
        e.stopPropagation()
      }
      this.sideBarInfo2 = ''
      let res = ''
      let syllable
      let findedSyllables = []
      for (let ps of phoneticSymbols) {
        for (let s in syllables) {
          if (!findedSyllables.includes(s) && ps.includes(s)) {
            findedSyllables.push(s)
            syllable = syllables[s]
            if (typeof syllable === 'string') {
              let matchRes = syllable.match(/^{(.+)}$/)
              if (matchRes && matchRes[1]) {
                syllable = syllables[matchRes[1]]
              }
            }

            if (typeof syllable === 'string') {
              res += `<span class="side-bar-info-item">[${s}]</span> ${syllable}`
            } else if (Array.isArray(syllable)) {
              res += `<span class="side-bar-info-item">[${s}]</span> ${syllable.join(
                '<br/>'
              )}`
            }

            res += '<br/><br/>'
          }
        }
      }
      this.sideBarInfo2 = res
    },

    // 当表格行被点击时
    onTableRowClick (row, e) {
      if (row.word !== this.curSelectedRowWord) {
        // this.copyWord(row.word)
        this.curSelectedRowWord = row.word
        // this.analyzeMorpheme(undefined, row.word);
        this.analyzeWord(undefined, row)
      }
    },

    // 当表格行被右击时
    async onTableRowRightClick (row, e) {
      e.preventDefault()
      await this.updatePage()
      $(`td:contains(${row.word})`)[0].scrollIntoView({
        behavior: 'instant',
        block: 'center',
        inline: 'center'
      }) // 模拟刷新当前行效果
    },

    // 拷贝单词
    copyWord (word) {
      const element = $(`<textarea>${word}</textarea>`) // This element cannot be display none or hidden
      $('body').append(element)
      element[0].select()
      document.execCommand('Copy')
      element.remove()
    },

    // 检查单词拼写
    checkWord (input, correct) {
      if (input === correct) {
        this.$message.success('答对了')
      }
    },

    // 检查含义
    checkMeaning (input, correct) {
      if (!input) {
        return
      }
      if (correct.join(',').includes(input)) {
        this.$message.success('答对了')
      }
    }
  },
  async mounted () {
    await this.updatePage()
    this.recordWordsNum()
    // let i = 0
    // for (let word of __words) {
    //   i++;
    //   await new Promise(resolve => {
    //     setTimeout(() => {
    //       this.newWord = word.toLowerCase();
    //       this.addWord({ keyCode: 13 })
    //       console.log(i, word);
    //       resolve()
    //     }, 1000);
    //   }).catch(err => {console.log(err)})
    // }
  }
}
</script>
<style lang="scss">
#words-book {
  margin-bottom: 50px;
  &:after {
    display: block;
    content: " ";
    clear: both;
  }

  // 顶栏
  #top-bar {
    position: fixed;
    display: flex;
    align-items: center;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 60px;
    padding: 0px 1%;
    box-sizing: border-box;
    z-index: 10;
    background: #fff;
    .add-new-word {
      width: 200px;
      margin-right: 6px;
    }
    .find-word {
      width: 200px;
      margin-right: 6px;
    }
    .refresh-button {
      margin-right: 6px;
    }
    .pagination {
      margin-right: 20px;
    }
    .words-num,
    .progress {
      margin-right: 10px;
      color: #aaa;
      background: #f4f4f4;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 14px;
      &:hover {
        background: #eee;
        cursor: default;
      }
    }
    .show-columns {
      display: flex;
      .show-column {
        border: none;
        flex-shrink: 0;
        .el-checkbox-button__inner {
          padding: 6px 4px;
          opacity: 0.5;
          filter: saturate(0.0);
        }
        &.is-checked {
          .el-checkbox-button__inner {
            /* background: #eee;
            color: #aaa;
            border-color: #eee; */
          }
        }
      }
    }

    .recitation {
      margin-left: auto;
    }
  }

  // 侧边栏信息
  #side-bar-info-container {
    position: fixed;
    display: flex;
    top: 68px;
    left: 0.5%;
    width: 32%;
    bottom: 10px;
    box-sizing: border-box;
    overflow: auto;
  }
  .side-bar-info {
    width: 50%;
    height: 100%;
    box-sizing: border-box;
    padding: 4px 10px;
    padding-bottom: 100px; // 抵消上面的top: 80px
    background: rgba(256, 256, 256, 0.94);
    color: #999;
    font-size: 13px;
    overflow-y: auto;
    z-index: 50;
    &::-webkit-scrollbar {
      width: 0px;
    }
    .side-bar-info-item {
      display: block;
      background: #f4f4f4;
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
    .related-images-iframe {
      width: 100%;
      height: 500px;
    }
  }
  #side-bar-info-1 {
    left: 0;
  }
  #side-bar-info-2 {
    left: 15%;
  }

  // 单词书
  #words {
    position: fixed;
    top: 68px;
    left: 33%;
    width: 66.5%;
    // font-size: 13.5px;
    bottom: 10px;
    overflow: auto;
    transition: all 0.2s;
  }

  .word-ps {
    display: inline-block;
    background: #f4f4f4;
    border-radius: 4px;
    padding: 1px 6px;
    margin: 2px 4px;
    transition: all 0.2s;
    color: #aaa;
    font-size: 12px;
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

  .el-textarea__inner {
    border: none !important;
    background: transparent;
    padding: 0 !important;
    margin: 0 !important;
  }

  .unsaved-textarea {
    background: rgb(255, 241, 241);
  }

  .word-rem-audio {
    display: inline-block;
    background: #faf3e6;
    border-radius: 4px;
    padding: 1px 14px;
    margin-top: 10px;
    transition: all 0.2s;
    color: #ddc497;
    font-size: 12px;
    cursor: pointer;
    &:hover {
      background: #f5ebdb;
      color: #ceb78d;
    }
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
    }
  }

  // 重置样式
  .el-table::before {
    height: 0px;
  }
  .el-pagination__jump {
    margin-left: 4px;
  }
  input {
    border-width: 1.5px !important;
  }
  button {
    border-width: 1.5px !important;
  }
  .el-table--border td,
  .el-table--border th {
    border-width: 1.5px !important;
    border-color: #f4f4f4;
  }
}
</style>
