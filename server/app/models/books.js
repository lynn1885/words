const axios = require('axios')
const mongoose = require('mongoose')
const wordModel = require('../models/words')
const Schema = mongoose.Schema

const BooksSchema = new Schema({
  name: String, // 单词本的名称
  words: [String], // 单词本中的单词
  importantWords: [String], // 重点单词
  meta: {							// 元信息
    createAt: {
      type: Date,
      default: Date.now
    },
    updateAt: {
      type: Date,
      default: Date.now
    }
  }
})

// hook: 记录更新时间
BooksSchema.pre('save', function (next) {
  this.meta.updateAt = Date.now();
  next();
})

// 创建词表
BooksSchema.static('add', async function ({ name, words, importantWords }) {
  return await this.create({
    name,
    words,
    importantWords
  })
})

// 更新词表
BooksSchema.static('update', async function ({ name, words, importantWords }) {
  await this.findOneAndUpdate({
    name,
  }, {
    name,
    words,
    importantWords
  })
})

// 删除词表
BooksSchema.static('delete', async function (name) {
  return await this.findOneAndRemove({ name })
})

// 创建model, 在controller中, 都是通过model对象进行增删改查了
module.exports = mongoose.model('book', BooksSchema);

