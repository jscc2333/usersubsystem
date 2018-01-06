const express = require('express');
const mysql = require('mysql')
const router = express.Router();
const connection = require('../public/javascripts/db')
const upload = require('../public/javascripts/upload')('shopImages')
const utils = require('../public/javascripts/utils')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.post('/fetchInformation', (req, res, next) => {
  const data = req.body;
  console.log(data)
  connection.query("SELECT * FROM shop WHERE seller_name = ?", data.username, (err, results) => {
    if (err) {
      throw err
    }
    if (results.length === 0) {
      res.send({
        status: 0,
        message: '该账户下不存在店铺'
      })
    } else {
      res.send({
        status: 1,
        message: '存在店铺',
        information: results[0]
      })
    }
  })
})

router.post('/createShop', upload.single('shopImage'), (req, res, next) => {
  const username = req.body.username;
  const filename = `http://localhost:3000/${req.file.originalname}`
  const data = utils.convertToArray(req.body)
  data.push(filename)

  connection.query('INSERT INTO shop(shop_id,shop_name,shop_desc,shop_address,shop_phone,seller_name,shop_image) VALUES (?,?,?,?,?,?,?)', data, (err, results) => {
    if (err) {
      res.send({
        status: 0,
        message: '注册失败'
      })
      throw err
    }
    connection.query('SELECT shop_id from shop WHERE seller_name = ? ', username, (err, results) => {
      if (results.length !== 0) {
        console.log(results[0])
        data[0] = results[0].shop_id
      }
      res.send({
        status: 1,
        message: '注册成功',
        information: data,
      })
    })
  })
})
router.post('/changeImage', upload.single('shopImage'), (req, res, next) => {
  const shopId = req.body.shopId
  const filename = `http://localhost:3000/${req.file.originalname}`
  const data = [filename, shopId]
  connection.query("UPDATE shop SET shop_image = ? WHERE shop_id = ?", data, (err, results) => {
    if (err) {
      throw err
    }
    if (results.changedRows === 1) {
      res.send({
        status: 1,
        message: '图片修改成功',
        shopImage: filename
      })
    } else {
      res.send({
        status: 0,
        message: '修改失败'
      })
    }
  })
})
router.post('/changeInformation', (req, res, next) => {
  const data = utils.convertToArray(req.body)
  connection.query("UPDATE shop SET shop_name = ?, shop_desc = ?, shop_address = ?, shop_phone = ? WHERE shop_id = ?", data, (err, results) => {
    if (err) {
      throw err
    }
    if (results.changedRows === 1) {
      res.send({
        status: 1,
        message: '更新成功',
      })
    } else {
      res.send({
        status: 0,
        message: '更新失败',
      })
    }
  })
})

router.post('/addGoods', upload.single('goodsImage'), (req, res, next) => {
  const filename = `http://localhost:3000/${req.file.originalname}`
  const data = utils.convertToArray(req.body)
  data.push(filename)
  connection.query('INSERT INTO goods(goods_id,goods_name,goods_price,goods_desc,shop_id,goods_image) VALUES(?,?,?,?,?,?)', data, (err, results) => {
    if (err) {
      res.send({
        status: 0,
        message: '上架商品失败'
      })
      throw err
    }
    connection.query('SELECT * FROM goods WHERE shop_id = ?', req.body.shopId, (err, results) => {
      if (err) {
        throw err
      }
      if (results.length !== 0) {
        res.send({
          status: 1,
          message: '添加成功',
          goodsList: results
        })
      }
    })
  })
})
router.post('/fetchGoods', (req, res, next) => {
  const shopId = req.body.shopId
  connection.query('SELECT * FROM goods WHERE shop_id = ?', shopId, (err, results) => {
    if (err) {
      throw err
    }
    if (results.length !== 0) {
      res.send({
        status: 1,
        message: '获取商品成功',
        goodsList: results
      })
    } else {
      res.send({
        status: 0,
        message: '无商品'
      })
    }
  })
})
router.post('/deleteGoods', (req, res, next) => {
  const goodsId = req.body.goodsId
  connection.query('DELETE  FROM goods WHERE goods_id = ?', goodsId, (err, results) => {
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
        message: '删除失败'
      })
    }
  })
})
router.post('/updateGoods', upload.single('goodsImage'), (req, res, next) => {
  let updateStr = '',
    filename = ''
  const data = utils.convertToArray(req.body)
  const shopId = data.splice(data.length - 1)
  console.log(shopId)
  if (!req.file) {
    updateStr = 'UPDATE goods SET goods_name = ?,goods_price = ?,goods_desc = ? WHERE goods_id = ?'
  } else {
    filename = `http://localhost:3000/${req.file.originalname}`
    data.splice(3, 0, filename)
    updateStr = 'UPDATE goods SET goods_name = ?,goods_price = ?,goods_desc = ?,goods_image = ? WHERE goods_id = ?'
  }
  connection.query(updateStr, data, (err, results) => {
    if (err) {
      throw err
    }
    if (results.changedRows === 1) {
      connection.query('SELECT * FROM goods WHERE shop_id = ?', shopId, (err, results) => {
        if (err) {
          throw err
        }
        res.send({
          status: 1,
          message: '更新成功',
          goodsList: results
        })
      })
    } else { 
      res.send({
        status: 0,
        message:'更新失败'
      })
    }
  })
})
module.exports = router;