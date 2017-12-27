<template>
  <div class="passport">
    <div class="content-wrapper">
      <div class="username input" v-if="inputIndex === 0">
        <p class="desc">为了修改您的密码，请先输入你要更改密码的用户名</p>
        <div class="input-wrapper">
          <span class="title">用户名</span>
          <input type="text" v-model="username">
        </div>
        <span class="next" @click="goNext()">下一步</span>
      </div>
      <div class="email input" v-else-if="inputIndex === 1">
        <p class="desc">我们需要对你的用户名和邮箱进行匹配，请输入该用户名所绑定的邮箱账号</p>
        <div class="input-wrapper">
          <span class="title">邮箱</span>
          <input type="email" v-model="email">
        </div>
        <span class="next" @click="goNext()">下一步</span>
      </div>
      <div class="vertification input" v-else-if="inputIndex === 2">
        <p class="desc">我们已将验证码发送至你的邮箱，请将其中的代码输入到下面</p>
        <div class="input-wrapper">
          <span class="title">验证码</span>
          <input type="text" v-model="code" max-length="6">
        </div>
        <span class="next" @click="goNext()">下一步</span>
      </div>
      <div class="vertification input" v-else>
        <p class="desc">请输入你的新密码</p>
        <div class="input-wrapper">
          <span class="title">密码</span>
          <input type="password" v-model="password">
        </div>
        <span class="next" @click="goNext()">下一步</span>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    checkValue,
  } from '@/assets/js/utils'
  import axios from 'axios'
  import router from '@/router'

  export default {
    name: 'passport',
    data() {
      return {
        inputIndex: 0,
        username: '',
        email: '',
        code: '',
        verification: '',
        password: '',
      }
    },
    methods: {
      goNext() {
        switch (this.inputIndex) {
          case 0:
            {
              if (this.username !== '') {
                this.inputIndex = 1
              }
              break
            }
          case 1:
            {
              if (checkValue('email', this.email) !== true) {
                this.email = '请输入正确的邮箱格式'
              } else {
                axios.post('/api/passport/vertification', {
                  username: this.username,
                  email: this.email,
                }).then((res) => {
                  if (res.data.status === 1) {
                    this.inputIndex = 2
                    this.verification = res.data.code
                  } else {
                    this.email = res.data.message
                  }
                })
              }
              break
            }
          case 2:
            {
              if (this.code.length === 6) {
                if (this.code === this.verification) {
                  this.inputIndex = 3
                } else {
                  this.code = '验证码错误'
                }
              } else {
                break
              }
              break
            }
          case 3:
            {
              if (checkValue('password', this.password) !== true) {
                this.password = '请输入长度大于8的密码'
              } else {
                axios.post('/api/passport/changePassword', {
                  password: this.password,
                  username: this.username,
                }).then((res) => {
                  if (res.data.status === 1) {
                    router.push('/login')
                  }
                }).catch((err) => {
                  throw err
                })
              }
              break
            }
          default:
            return false
        }
        return false
      },
    },
  }

</script>
<style lang="less">
  .passport {
    display: flex;
    width: 100%;
    height: 80%;
    align-items: center;
    justify-content: center;
    .content-wrapper {
      padding: 20px;
      border-radius: 10px;
      background: rgba(147, 153, 159, 0.3);
      box-shadow: 0 0 3px rgb(0, 160, 220);
      .input {
        position: relative;
        box-shadow: 0 0 3px #fff;
        border-radius: 5px;
        padding: 10px;
        .desc {
          margin-bottom: 30px;
        }
        .input-wrapper {
          text-align: center;
          margin-bottom: 20px;
        }
        .next {
          position: absolute;
          right: 4px;
          bottom: 4px;
          display: inline-block;
          padding: 3px;
          border-radius: 3px;
          box-shadow: 0 0 3px #fff;
          cursor: pointer;
        }
      }
    }
  }

</style>
