const express = require('express');
const mysql = require('mysql')
const router = express.Router();
const evaluation  = require('../public/mockdata/sEvaluation/sEvaluation.json')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.post('/fetchEvaluations', (req, res, next) => { 
  const data = evaluation.sEvaluation
  const page = req.body.page
  res.send(data.slice(page*8,page*8+8))
})

module.exports = router;