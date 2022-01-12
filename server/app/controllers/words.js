const _ = require('lodash');
const assert = require('assert');
const axios = require('axios');
const Words = require('../models/words.js');
const deleteWordToken = require.main.require('./config/config.js').deleteWordToken;
const collins = require('../../tools/collins.json')

// search: 会从本地库查找, 如果找不到, 会从远程金山词霸的库查找
exports.search = async function (req, res) {
  let word = req.params.word;

  let searchRes = {
    wordInfo: null,	// 单词信息
    status: 'old',	// 单词状态: 可取值: new | old, 如果是新添加的, 则状态为new, 默认old
  };

  // 查询的单词必须是字符串
  if (!_.isString(word)) {
    let warnMsg = {
      msg: '/words/search, 传入的word不是String' + word,
      warn: true
    };
    console.warn(warnMsg);
    res.status(500).send(warnMsg);
  } else {
    searchRes.wordInfo = await Words.findOne({ word });
  }

  // 本地数据查询并返回
  if (searchRes && searchRes.wordInfo) {
    searchRes.wordInfo._doc.collins = collins[word.toLowerCase()]
    res.send(searchRes);
  }

  // 本地数据库查询不到时, 调用从远程api加载信息
  else {
    let ifFetchSuccess = false;
    await Words.fecth(word)
      .then(res => {
        console.log('word/search 创建单词成功', word);
        ifFetchSuccess = true;
      })
      .catch(err => {
        let errInfo = {
          msg: 'Words, fetch: create创建单词失败',
          err
        };
        console.error(errInfo);
        res.status(500).send(errInfo);
      });
    if (ifFetchSuccess) {
      searchRes.wordInfo = await Words.findOne({ word });
      searchRes.status = 'new';
      searchRes.wordInfo._doc.collins = collins[word.toLowerCase()]
      res.send(searchRes);
    }
  }
}

// find: 只会从本地数据库查找, 默认会把传入的内容转换为正则, 不区分大小写, 返回最多100条
exports.find = async function (req, res) {
  let searchRes;
  let query;
  try {
    query = JSON.parse(req.query.query);
  } catch (err) {
    let errMsg = {
      msg: '/words/find, 传入的query无法转换为对象',
      query,
      err,
    };
    console.error(errMsg);
    res.status(500).send(errMsg);
    return;
  }
  if (!query || !query.dsl) {
    let errMsg = {
      msg: '/words/find, 传入的query不是对象, 或缺少dsl查询语句',
      query
    };
    console.error(errMsg);
    res.status(500).send(errMsg);
    return;
  }
  if (query.exact === true) {	// 是否精确查找

  } else {
    for (let p in query.dsl) {	//转换为正则
      query.dsl[p] = new RegExp(query.dsl[p], 'i');
    }
  }

  // 查找
  searchRes = await Words.find(query.dsl, null, { limit: 100 });
  searchRes.forEach(doc => {
    doc._doc.collins = collins[doc._doc.word.toLowerCase()]
  })
  res.send(searchRes);
}

// update
exports.update = async function (req, res) {
  // if exist
  let word = req.params.word;
  let wordInfo = await Words.findOne({ 'word': word });
  if (!wordInfo) {
    res.status(500).send({ msg: '不存在要查找的单词', err: true, word })
    return;
  }

  // update
  let updateContent = req.body;
  let ifUpdateSuccess = false;
  await Words.update({ 'word': word }, updateContent)
    .then(updateRes => {
      if (updateRes && (updateRes.ok <= 0 || updateRes.nModified <= 0)) {
        let errInfo = {
          msg: 'Words update, 未更新',
          err: true,
        }
        console.error(errInfo);
        res.status(500).send(errInfo);
        return;
      } else {
        ifUpdateSuccess = true;
      }
    })
    .catch(err => {
      let errInfo = {
        msg: 'Words update, 更新失败',
        err: true,
      }
      console.error(errInfo);
      res.status(500).send(errInfo);
      return;
    })
  if (ifUpdateSuccess) {
    wordInfo = await Words.findOne({ 'word': word });
    res.send(wordInfo);
  }
}

// 删除
exports.delete = async function (req, res) {
  let _id = req.params.id;
  let word = req.query.word;
  let token = req.query.token;

  if (token !== deleteWordToken) {
    let warnInfo = {
      msg: 'words delete, token错误',
      token,
      warn: true
    };
    console.warn(warnInfo);
    res.status(500).send(warnInfo);
    return;
  }

  await Words.deleteOne({ _id })
    .then(deleteRes => {
      let successInfo = {
        msg: 'words delete, 删除成功',
        success: deleteRes,
        _id,
        word
      };
      console.log(successInfo);
      res.send(successInfo);
    })
    .catch(err => {
      let errInfo = {
        msg: 'words delete, 删除失败',
        err
      };
      console.error(errInfo);
      res.status(500).send(errInfo);
    })
}

// list
exports.list = async function (req, res) {
  let listRes = {
    count: 0,
    words: []
  };

  // count
  await Words.count({}, (err, count) => {
    if (err) {
      let errInfo = {
        msg: 'Words list, 获取count失败',
        err
      }
      console.error(errInfo);
      res.status(500).send(errInfo);
    } else {
      listRes.count = count;
    }
  });

  // words
  let from = Number(req.query.from);
  let size = Number(req.query.size);
  let bookName = req.query.bookName
  let order = req.query.order || 'desc';
  let sortBy = req.query.sortBy || 'meta.createAt';
  let orderSupport = ['desc', 'asc'];
  let sortBySupport = ['meta.createAt', 'meta.updateAt'];
  if (!_.isNumber(from) || _.isNaN(from) || !_.isNumber(size) && _.isNaN(size)) {
    res.status(500).send({ msg: 'Words list, from 或 size无法被转化为数字', error: 'error', from, size });
    return;
  }
  if (!orderSupport.includes(order) || !sortBySupport.includes(sortBy)) {
    res.status(500).send({ msg: 'Words list, 不支持的order或sortBy', order, sortBy, orderSupport, sortBySupport });
    return;
  }

  await Words.list({ from, size, bookName, order, sortBy })
    .then(res => {
      for (let wordObj of res) {
        listRes.words.push(wordObj.word);
      }
    })
    .catch(err => {
      let errInfo = {
        msg: 'Words list, 获取words list失败',
        err
      }
      console.error(errInfo);
      res.status(500).send(errInfo);
    })

  res.send(listRes);
}

// listrem, 复制的list
exports.listrem = async function (req, res) {
  let listRes = {
    count: 0,
    words: []
  };

  // count
  await Words.count({}, (err, count) => {
    if (err) {
      let errInfo = {
        msg: 'Words list, 获取count失败',
        err
      }
      console.error(errInfo);
      res.status(500).send(errInfo);
    } else {
      listRes.count = count;
    }
  });

  // words
  let from = Number(req.query.from);
  let size = Number(req.query.size);
  let order = req.query.order || 'desc';
  let sortBy = req.query.sortBy || 'meta.createAt';
  let orderSupport = ['desc', 'asc'];
  let sortBySupport = ['meta.createAt', 'meta.updateAt'];
  if (!_.isNumber(from) || _.isNaN(from) || !_.isNumber(size) && _.isNaN(size)) {
    res.status(500).send({ msg: 'Words list, from 或 size无法被转化为数字', error: 'error', from, size });
    return;
  }
  if (!orderSupport.includes(order) || !sortBySupport.includes(sortBy)) {
    res.status(500).send({ msg: 'Words list, 不支持的order或sortBy', order, sortBy, orderSupport, sortBySupport });
    return;
  }

  await Words.listrem({ from, size, order, sortBy })
    .then(res => {
      for (let wordObj of res) {
        listRes.words.push(wordObj.word);
      }
    })
    .catch(err => {
      let errInfo = {
        msg: 'Words list, 获取words list失败',
        err
      }
      console.error(errInfo);
      res.status(500).send(errInfo);
    })

  res.send(listRes);
}
