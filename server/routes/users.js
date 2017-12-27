const express = require('express');
const router = express.Router();
const moment = require('moment')
const mysql = require('mysql')
const connection = require('../public/javascripts/db')
const utils = require('../public/javascripts/utils')


router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.post('/signin', (req, res, next) => {
  const data = req.body
  const good = require('../public/mockdata/good/good.json')
  const integral = utils.convertToIntegral(0, good.goods)
  const grade = Math.floor(integral / 30) + 1
  const gradeData = [grade, integral, data.username]

  connection.query('UPDATE consumer SET consumer_grade = ?, consumer_integral = ? WHERE consumer_name = ?', gradeData, (err, results) => {
    if (err) {
      throw err
    }
  })

  connection.query('SELECT * FROM consumer WHERE consumer_name = ?', data.username, (err, results) => {
    if (err) {
      throw err
    }
    if (results.length === 0) {
      res.send({
        status: 1,
        message: '账户不存在'
      })
    } else if (results[0].consumer_password !== data.password) {
      res.send({
        status: 2,
        message: '密码错误'
      })
    } else {
      res.send({
        status: 0,
        message: '登陆成功'
      })
    }
  })
})
router.post('/signup', (req, res, next) => {
  const data = req.body
  let value = []
  value = utils.convertToArray(data)
  value.unshift(null)
  value.pop()
  value.push(1)
  if (data.picked === 'consumer') {
    const selectStr = 'SELECT * FROM consumer WHERE consumer_name = ?'
    const insertStr = 'INSERT INTO consumer(consumer_id,consumer_name,consumer_password,consumer_email,consumer_phone,consumer_realname,consumer_idnumber,consumer_grade)' +
      ' VALUES (?,?,?,?,?,?,?,?)'

    connection.query(selectStr, data.username, (err, results) => {
      if (err) {
        throw err
      }
      if (results.length === 0) {
        connection.query(insertStr, value, (err, result) => {
          if (err) {
            throw err
          }
          res.send({
            status: 0,
            message: '注册成功'
          })
        })
      } else {
        res.send({
          status: 1,
          message: '该用户名已被使用'
        })
      }
    })
  } else {

  }
})
router.post('/fetchInfo', (req, res, next) => {
  const data = req.body
  if (data.type === 'consumer') {
    const selectStr = 'SELECT * FROM consumer WHERE consumer_name = ?'
    connection.query(selectStr, data.username, (err, results) => {
      if (err) {
        throw err
      }
      const briefInfo = {
        avatar: results[0].consumer_avatar,
        username: results[0].consumer_name,
        grade: results[0].consumer_grade,
        gold: results[0].consumer_gold,
        integral: results[0].consumer_integral,
      }
      const detailInfo = {
        username: results[0].consumer_name,
        email: results[0].consumer_email,
        phone: results[0].consumer_phone,
        realname: results[0].consumer_realname,
        idNumber: results[0].consumer_idnumber,
        signature: results[0].consumer_signature
      }
      res.send([briefInfo, detailInfo])
    })
  }
})
router.post('/updateInfo', (req, res, next) => {
  const data = req.body
  if (data.type === 'consumer') {
    let params = []
    for (key in data) {
      if (key !== 'type') {
        params.push(data[key])
      }
    }
    console.log(params)
    const updateStr = 'UPDATE consumer SET consumer_email = ?,consumer_phone = ?, consumer_signature = ? WHERE consumer_name = ?'
    connection.query(updateStr, params, (err, results) => {
      console.log('run to here')
      if (err) {
        console.log(err)
        throw err
      }
      console.log(results)
      if (results.changedRows > 0) {
        res.send({
          status: 1,
          message: '更新成功'
        })
      } else {
        res.send({
          status: 0,
          message: '无更新内容'
        })
      }
    })
  }
})
router.post('/addGold', (req, res, next) => {
  const username = req.body.username
  const date = moment(req.body.date).format('YY-MM-DD')
  connection.query('SELECT consumer_signinTime,consumer_gold FROM consumer WHERE consumer_name = ?', username, (err, results) => {
    if (err) {
      throw err
    }
    const data = [results[0].consumer_gold+5,date,username]
    if (!results[0].consumer_signinTime) {
      connection.query('UPDATE  consumer SET consumer_gold = ? ,consumer_signinTime = ? WHERE consumer_name = ?', data, (err, results) => {
        if (err) {
          throw err
        }
        res.send({
          status: 1,
          message:'签到成功'
        })
      })
    } else { 
      const dbDate = moment(results[0].consumer_signinTime).format('YY-MM-DD')
      if (utils.compareTime(dbDate, date)) {
        connection.query('UPDATE  consumer SET consumer_gold = ? ,consumer_signinTime = ? WHERE consumer_name = ?', data, (err, results) => {
          if (err) {
            throw err
          }
          res.send({
            status: 1,
            message: '签到成功'
          })
        })
      } else { 
        res.send({
          status: 0,
          message:'请明天再来签到'
        })
      }
    }

  })

})
module.exports = router;