const express = require('express');
const mysql = require('mysql')
const router = express.Router();
const connection = require('../public/javascripts/db')
const order = require('../public/mockdata/order/order.json')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.post('/fetchOrders', (req, res, next) => { 
  const data = order.orders
  const page = req.body.page
  res.send(data.slice(page*4,page*4+4))
})

module.exports = router;