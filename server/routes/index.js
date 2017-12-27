const express = require('express');
const mysql = require('mysql')
const router = express.Router();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '302434',
  database: 'usersubsystem'
})
connection.connect()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

module.exports = router;