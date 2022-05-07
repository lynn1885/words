const fs = require('fs');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const router = require('./router/router.js');
const bodyParser = require('body-parser');

const app = express();
const dbUrl = 'mongodb://localhost:27017/words';
const port = 9000;

mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connect db-words success');
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");  // 允许跨域
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");   // 允许的方法
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");   // 允许接收这些头
    next();
  });
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use('/', router);
  app.listen(port);
  console.log('server listen at port : ' + port);
});
