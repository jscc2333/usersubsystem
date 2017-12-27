const express = require('express');
const mysql = require('mysql')
const router = express.Router();
const connection = require('../public/javascripts/db')
const utils = require('../public/javascripts/utils')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.post('/vertification', (req, res, next) => {
  const data = req.body
  connection.query('SELECT consumer_email FROM consumer WHERE consumer_name = ?', data.username, (err, results) => {
    if (err) {
      throw err
    }
    console.log(data.email === results[0].consumer_email)
    if (data.email === results[0].consumer_email) {
      const sendEmail = require('../public/javascripts/email')
      const code = sendEmail(data.email)
      res.send({
        status: 1,
        message: '匹配',
        code: code
      })
    } else {
      res.send({
        status: 0,
        message: '用户名与邮箱不匹配'
      })
    }
  })
})

router.post('/changePassword', (req, res, next) => {
  const data = utils.convertToArray(req.body)
  connection.query('UPDATE consumer SET consumer_password = ? WHERE consumer_name = ?', data, (err, results) => {
    if (err) {
      throw err
    }
    if (results.changedRows === 1) {
      res.send({
        status: 1,
        message: '修改成功'
      })
    } else { 
      res.send({
        status: 0,
        message:'失败'
      })
    }
  })
})

module.exports = router;