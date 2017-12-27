module.exports = (function () {
  const mysql = require('mysql')
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '302434',
    database: 'usersubsystem'
  })
  return connection
})()