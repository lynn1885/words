// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import bookRem1 from './utils/book-rems/蒋争词根.json'
import bookRem2 from './utils/book-rems/蒋争词缀.json'
import bookRem3 from './utils/book-rems/李平武.json'
import bookRem4 from './utils/book-rems/词源故事.json'
import bookRem4Text from './utils/book-rems/词源故事text.json'
import coca from './utils/coca.json'
import * as wordsModel from '@/models/words.ts'

for (const word in bookRem4) {
  bookRem4[word] = {
    meaning: bookRem4Text[bookRem4[word]].join('\n')
  }
}

// coca词频
Vue.prototype.coca = coca
Vue.prototype.cocaArr = Object.keys(coca)

// 已有记忆
const bookRems = {
  '蒋争词根': bookRem1,
  '蒋争词缀': bookRem2,
  '李平武': bookRem3,
  '词源故事': bookRem4
}
Vue.prototype.bookRems = bookRems

// 获取单词的记忆
Vue.prototype.getWordBookRem = word => {
  word = word.toLowerCase()
  let res = null
  for (const remName in bookRems) {
    if (bookRems[remName][word]) {
      if (res === null) res = {}
      res[remName] = bookRems[remName][word]
    }
  }
  return res
}

Vue.use(ElementUI);

(async function () {
  await wordsModel
    .list(1, 30000)
    .then(res => {
      Vue.prototype.allWords = res.data.words
    })
    // eslint-disable-next-line handle-callback-err
    .catch(err => {
      throw new Error('获取所有单词失败')
    })
})()

// /* eslint-disable no-new */
// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
