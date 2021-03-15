const axios = require('axios');
const dictUrl = require('../../config/config.js').dictUrl;
const dictKey = require('../../config/config.js').dictKey;
const parseString = require('xml2js').parseString;
const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const WordsSchema = new Schema ({
	word: String,
	ps: [String],  					// 音标
	pos: [String], 					// 词性
	acceptation: [String], 			// 含义
	pron: [String],  				// 发音网址
	sent: String,  					// 例句
	rem: String,  					// 记忆方法
	image: String, 					// 图片
	construct: [String],			// 词素构造
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
});

// hook: pre update
WordsSchema.pre('save', function (next) {
	this.meta.updateAt = Date.now();
	next();
})

// fetch
WordsSchema.static('fecth', async function (word) {
	// 从远程获取xml
	let result = {};
	let xmlStr;
	await axios.get(dictUrl + word + dictKey)
		.then(res => {
			if (res.status && res.status === 200) {
				xmlStr = res.data;
			}
		})
		.catch(err => {
			console.error('Words, fetch: 查询单词失败', word, err);
			result = {error: 'Words, fetch: 查询单词失败' + word + err};
		});
	if (result.error) {
		return result;
	}

	// 解析xml, 这个第三方库不支持promise, 自己封装一层
	let xmlObj;
	await function () {
		return new Promise((reslove, reject) => {
		parseString(xmlStr, {trim: true}, (err, res) => {
			if (err) {
				reject(err);
			} else {
				reslove(res);
			}
		});
	})}()
		.then(res => xmlObj = res.dict)
		.catch(err => {
			console.error('Words, fetch: 查询单词成功, 但解析xml失败', xmlStr, err);
			result = {error: 'Words, fetch: 查询单词成功, 但解析xml失败'+ xmlStr + err};
		});
	if (result.error) {
		return result;
	}
	
	// 从xml中提前信息并存储
	let wordObj = {};
	try {
		wordObj.word = word;
		wordObj.ps = xmlObj.ps;
		wordObj.pos = xmlObj.pos;
		wordObj.acceptation = xmlObj.acceptation;
		wordObj.pron = xmlObj.pron;
		wordObj.sent = xmlObj.sent;
	} catch (e) {
		console.error('Words, fetch: 已获取xml, 但转换xml失败', e);
		result = {error: 'Words, fetch: 已获取xml, 但转换xml失败'+ xmlStr + err}
	}
	if (result.error) {
		return result;
	}

	// 创建单词
	return await this.create(wordObj);
});

// list
// only return words that have the "rem" attribute
WordsSchema.static('list', async function ({from, size, order, sortBy}) {
	return await this.find(null, {'word': true})
		.sort({[sortBy]: order})
		.skip(from)
		.limit(size)
		.exec()
})

// listrem
// only return words that have the "rem" attribute
WordsSchema.static('listrem', async function ({from, size, order, sortBy}) {
	return await this.find({
		rem: {$exists:true}
	}, {'word': true})
		.sort({[sortBy]: order})
		.skip(from)
		.limit(size)
		.exec()
})

module.exports = mongoose.model('word', WordsSchema);