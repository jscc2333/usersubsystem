const express = require('express');
const mysql = require('mysql')
const router = express.Router();
const order  = require('../public/mockdata/sOrder/sOrder.json')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.post('/fetchOrders', (req, res, next) => { 
  const data = order.sOrders
  const page = req.body.page
  res.send(data.slice(page*8,page*8+8))
})
module.exports = router;