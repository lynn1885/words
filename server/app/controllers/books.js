const Books = require('../models/books.js');

// 列出所有词表
exports.list = async function (req, res) {
  try {
    const books = await Books.find()
    res.send(books)
  } catch (error) {
    const errMsg = {
      msg: '列出所有词表失败',
      error
    }
    console.warn(errMsg);
    res.status(500).send(errMsg);
  }
}

// 列出一个词表
exports.listOne = async function (req, res) {
  try {
    const book = await Books.findOne({ name: req.params.name })
    res.send(book)
  } catch (error) {
    const errMsg = {
      msg: '列出某个词表失败',
      error
    }
    console.warn(errMsg);
    res.status(500).send(errMsg);
  }
}

// 创建词表
exports.add = async function (req, res) {
  if (!req.body || !req.body.name || !Array.isArray(req.body.words)) {
    const errMsg = {
      msg: '创建词表时, 传入的参数错误',
      req: req.body
    }
    console.warn(errMsg);
    res.status(500).send(errMsg);
    return
  }
  try {
    const oldBook = await Books.findOne({ name: req.body.name })
    if (oldBook && oldBook._id) {
      res.status(400).send({
        msg: '该单词本已经存在, 请勿重复创建'
      })
      return
    }
    const book = await Books.add(req.body)
    res.send(book)
  } catch (error) {
    const errMsg = {
      msg: '创建词表失败',
      error
    }
    console.warn(errMsg);
    res.status(500).send(errMsg);
  }
}

// 更新词表
exports.update = async function (req, res) {
  try {
    await Books.update(req.body)
    const book = await Books.findOne({ name: req.body.name })
    res.send(book)
  } catch (error) {
    const errMsg = {
      msg: '更新词表失败',
      error
    }
    console.warn(errMsg);
    res.status(500).send(errMsg);
  }
}

// 删除词表
exports.delete = async function (req, res) {
  try {
    const result = await Books.delete(req.params.name)
    res.send(result)
  } catch (error) {
    const errMsg = {
      msg: '删除词表失败',
      error
    }
    console.warn(errMsg);
    res.status(500).send(errMsg);
  }
}