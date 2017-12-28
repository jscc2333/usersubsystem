const express = require('express');
const router = express.Router();
const mysql = require('mysql')
const connection = require('../public/javascripts/db')
const utils = require('../public/javascripts/utils')

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/fetchAddress', (req, res, next) => {
  const data = req.body
  const queryStr = 'SELECT * FROM address WHERE consumer_name = ?'
  connection.query(queryStr, data.username, (err, results) => {
    if (err) {
      throw err
    }
    res.send(JSON.stringify(results))
  })
})

router.post('/addAddress', (req, res, next) => {
  const data = utils.convertToArray(req.body)
  const isDefault = req.body.isDefault
  const username = req.body.username
  data.unshift(null)
  if (isDefault) {
    const updateStr = 'UPDATE address SET address_isDefault = 0 WHERE consumer_name = ?'
    connection.query(updateStr, username, (err, results) => {
      if (err) {
        throw err
      }
    })
  }
  const insertStr = 'INSERT INTO address(address_id,address_address,address_consignee,address_phone,address_zipCode,address_isDefault,consumer_name) VALUES (?,?,?,?,?,?,?)'

  connection.query(insertStr, data, (err, results) => {
    if (err) {
      throw err
    }
    if (results.affectedRows > 0) {
      res.send({
        status: 1,
        'message': '添加地址成功'
      })
    } else {
      res.send({
        status: 0,
        'message': '添加失败，请稍后重试'
      })
    }
  })
})

router.post('/updateAddress', (req, res, next) => {
  const username = req.body.username
  delete req.body.username
  const data = utils.convertToArray(req.body)
  const id = req.body.id
  const isDefault = req.body.isDefault
  if (isDefault) {
    const updateStr = 'UPDATE address SET address_isDefault = 0 WHERE consumer_name = ?'
    connection.query(updateStr, username, (err, results) => {
      if (err) {
        throw err
      }
    })
  }
  const updateStr = 'UPDATE address SET address_address = ?,address_consignee = ?,address_phone = ?,address_zipCode = ?,address_isDefault = ? WHERE address_id = ?'
  connection.query(updateStr, data, (err, results) => {
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
        message: '修改失败'
      })
    }
  })
})

router.post('/deleteAddress', (req, res, next) => {
  const data = utils.convertToArray(req.body)
  const deleteStr = 'DELETE FROM address WHERE address_id = ?'
  connection.query(deleteStr, data, (err, results) => { 
    if (err) { 
      throw err
    }
    if (results.affectedRows === 1) {
      res.send({
        status: 1,
        message: '删除成功'
      })
    } else { 
      res.send({
        status: 0,
        message:'删除失败'
      })
    }
  })
})

module.exports = router