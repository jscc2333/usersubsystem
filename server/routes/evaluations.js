const express = require('express');
const mysql = require('mysql')
const router = express.Router();
const evaluations = require('../public/mockdata/evaluation/evaluation')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '302434',
  database: 'usersubsystem'
})
connection.connect()

/* GET home page. */
router.get('/', function (req, res, next) {
 res.send('get connected')
});

router.post('/fetchEvaluated', (req, res, next) => { 
  const data = evaluations.evaluated
  const page = req.body.page
  res.send(data.slice(page*4,page*4+4))
})

router.post('/fetchToevaluate', (req, res, next) => { 
  const data = evaluations.toEvaluate
  const page = req.body.page
  res.send(data.slice(page*4,page*4+4))
})

module.exports = router;