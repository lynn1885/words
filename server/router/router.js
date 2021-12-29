const express = require('express');
const router = express.Router();
const Words = require('../app/controllers/words');
const Books = require('../app/controllers/books');
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
router.get('/words/listrem', Words.listrem);

// Books
router.get('/books/list', Books.list)
router.get('/books/list/:name', Books.listOne)
router.put('/books', Books.add)
router.post('/books', Books.update)
router.delete('/books/:name', Books.delete)

module.exports = router;