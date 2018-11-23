const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const MorphemeSchema = new Schema ({
	type: Number,			// 1 前缀, 2 词根, 3 后缀
	ele: [String],			// 元素, 包括词根词缀及其变体
	acceptation: [String],	// 含义
	ps: [String],			// 音标
});


module.exports = mongoose.model('morpheme', MorphemeSchema);