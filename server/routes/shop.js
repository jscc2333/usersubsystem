const express = require('express');
const mysql = require('mysql')
const router = express.Router();
const connection = require('../public/javascripts/db')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

module.exports = router;