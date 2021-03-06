const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs')
const moment = require('moment')
const mysql = require('mysql')
const connection = require('../public/javascripts/db')
const utils = require('../public/javascripts/utils')
const upload = require('../public/javascripts/upload')('avatars')

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.post('/signin', (req, res, next) => {
  const data = req.body
  if (req.body.type === 'consumer') {
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
  } else {
    connection.query('SELECT * FROM seller WHERE seller_name = ?', data.username, (err, results) => {
      if (err) {
        throw err
      }
      if (results.length === 0) {
        res.send({
          status: 1,
          message: '账户不存在'
        })
      } else if (results[0].seller_password !== data.password) {
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
  }
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
    const selectStr = 'SELECT * FROM seller WHERE seller_name = ?'
    const insertStr = 'INSERT INTO seller(seller_id,seller_name,seller_password,seller_email,seller_phone,seller_realname,seller_idnumber,seller_grade)' +
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
  } else {
    const selectStr = 'SELECT * FROM seller WHERE seller_name = ?'
    connection.query(selectStr, data.username, (err, results) => {
      if (err) {
        throw err
      }
      const briefInfo = {
        avatar: results[0].seller_avatar,
        username: results[0].seller_name,
        grade: results[0].seller_grade
      }
      const detailInfo = {
        username: results[0].seller_name,
        email: results[0].seller_email,
        phone: results[0].seller_phone,
        realname: results[0].seller_realname,
        idNumber: results[0].seller_idnumber,
        signature: results[0].seller_signature
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
    const updateStr = 'UPDATE consumer SET consumer_email = ?,consumer_phone = ?, consumer_signature = ? WHERE consumer_name = ?'
    connection.query(updateStr, params, (err, results) => {
      console.log('run to here')
      if (err) {
        console.log(err)
        throw err
      }
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
  } else {
    let params = []
    for (key in data) {
      if (key !== 'type') {
        params.push(data[key])
      }
    }
    const updateStr = 'UPDATE seller SET seller_email = ?,seller_phone = ?, seller_signature = ? WHERE seller_name = ?'
    connection.query(updateStr, params, (err, results) => {
      console.log('run to here')
      if (err) {
        console.log(err)
        throw err
      }
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
    const data = [results[0].consumer_gold + 5, date, username]
    if (!results[0].consumer_signinTime) {
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
          message: '请明天再来签到'
        })
      }
    }

  })

})
router.post('/changeAvatar', upload.single('avatar'), (req, res, next) => {
  const username = req.body.username
  const filename = `http://localhost:3000/${req.file.originalname}`
  const data = [filename, username]
  if (req.body.type === 'consumer') {
    const updateStr = 'UPDATE consumer SET consumer_avatar = ? WHERE consumer_name = ?'
    connection.query(updateStr, data, (err, results) => {
      if (err) {
        throw err
      }
      if (results.changedRows === 1) {
        res.send({
          status: 1,
          message: '头像修改成功'
        })
      } else {
        res.send({
          status: 0,
          message: '修改失败'
        })
      }
    })
  } else {
    const updateStr = 'UPDATE seller SET seller_avatar = ? WHERE seller_name = ?'

    connection.query(updateStr, data, (err, results) => { 
      if (err) { 
        throw err
      }
      if (results.changedRows === 1) {
        res.send({
          status: 1,
          message: '头像修改成功'
        })
      } else {
        res.send({
          status: 0,
          message: '修改失败'
        })
      }
    })
  }
})
module.exports = router;