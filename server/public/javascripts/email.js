module.exports = function sendEmail(receiver) {

  const nodemailer = require('nodemailer')

  const transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    secureConnection: true,
    port: 465,
    secure: true,
    auth: {
      user: 'jscc2333@163.com',
      pass: 'c0000000'
    }
  })

  const code = `${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}${Math.floor(Math.random()*10)}`
  const mailOptions = {
    from: 'jscc2333@163.com',
    to: receiver,
    subject: 'vertification code',
    html: `你的验证码为<b>${code}</b>`
  }
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err)
    } 
  })
  return code
}