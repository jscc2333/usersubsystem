const express = require('express');
const router = express.Router();
const mysql = require('mysql')
const connection = require('../public/javascripts/db')
const utils = require('../public/javascripts/utils')
const collections = require('../public/mockdata/collection/collection.json')

router.get('/', function (req, res, next) {
});

router.post('/fetchGoods', (req, res, next) => { 
  const goods = collections.goods
  const page = req.body.page
  res.send(goods.slice(page*8,page*8+8))
})

router.get('/fetchShops', (req, res, next) => { 
  res.send(collections.shops)
})

module.exports = router