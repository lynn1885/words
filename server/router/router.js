const express = require('express');
const router = express.Router();
const Words = require('../app/controllers/words');
const bodyParser = require('body-parser');

// Index
router.get('/', (req, res) => {
	res.send('hello world');
})

// Words
router.get('/words/search/:word', Words.search);
router.get('/words/find/', Words.find);
router.post('/words/update/:word', Words.update);
router.delete('/words/delete/:id', Words.delete);
router.get('/words/list', Words.list);

module.exports = router;