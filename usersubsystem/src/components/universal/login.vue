<template>
  <div class="login">
    <div class="username">
      <label for="username">
        <i class="icon-user"></i>
      </label>
      <input type="text" id="username" placeholder="用户名" v-model="username" @focus="clearTip">
      <div class="login-tip" v-if="usernameTip!==''">
        <span class="text">{{usernameTip}}</span>
      </div>
    </div>
    <div class="password">
      <label for="password">
        <i class="icon-key"></i>
      </label>
      <input type="password" id="password" placeholder="密码" v-model="password" @focus="clearTip" @keyup="checkKey($event)">
      <div class="login-tip" v-if="passwordTip!==''">
        <span class="text">{{passwordTip}}</span>
      </div>
    </div>
    <div class="category">
      <input type="radio" id="consumer" value="consumer" name="category" v-model="picked">
      <label for="consumer">用户</label>
      <input type="radio" id="seller" value="seller" name="category" v-model="picked">
      <label for="seller">商家</label>
    </div>
    <div class="submit">
      <span class="signin" @click="goAccount">登录</span>
    </div>
    <div class="links">
      <span class="link" @click="goPassport">忘记密码</span>
      <span class="link" @click="goRegistration">注册账户</span>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import router from '@/router'

  export default {
    name: 'login',
    data() {
      return {
        username: '',
        password: '',
        usernameTip: '',
        passwordTip: '',
        picked: '',
      }
    },
    methods: {
      goAccount() {
        if (!this.username) {
          this.usernameTip = '请输入账号'
          return false
        } else if (!this.password) {
          this.passwordTip = '请输入密码'
          return false
        }
        const data = {
          username: this.username,
          password: this.password,
          type: this.picked,
        }
        axios.post('/api/users/signin', data)
          .then((res) => {
            if (res.data.status === 0) {
              if (this.picked === 'consumer') {
                router.push(`/consumer/${this.username}`)
              } else {
                router.push(`/seller/${this.username}`)
              }
            } else if (res.data.status === 1) {
              this.usernameTip = '账户不存在'
            } else {
              this.passwordTip = '密码错误'
            }
          })
          .catch((err) => {
            throw err
          })
        return true
      },
      goPassport() {
        router.push('/passport')
      },
      goRegistration() {
        this.$store.commit('changeRegisterState')
        router.push('/registration')
      },
      clearTip() {
        this.usernameTip = ''
        this.passwordTip = ''
        return true
      },
      checkKey(e) {
        if (e.which === 13) {
          this.goAccount()
        }
      },
    },
  }

</script>
<style lang="less">
  .login {
    .username,
    .password {
      position: relative;
      margin: 20px 0;
      font-size: 24px;
      input {
        vertical-align: top;
        padding: 4px;
        font-size: 16px;
      }
      .login-tip {
        position: absolute;
        top: -10px;
        left: 100%;
        padding: 0 10px;
        width: 200px;
        font-size: 0;
        &:before {
          position: relative;
          top: -5px;
          content: "";
          width: 0;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-right: 10px solid rgb(255, 255, 255);
        }
        .text {
          display: inline-block;
          padding: 5px;
          background: rgb(255, 255, 255);
          border-radius: 10px;
          font-size: 16px;
        }
      }
    }
    .submit {
      margin: 10px 0;
      padding: 5px 0;
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 5px;
      font-size: 24px;
      .signin {
        display: inline-block;
        width: 100%;
        text-align: center;
        color: #fff;
      }
    }
    .category {
      padding: 5px 10px;
      font-size: 16px;
      text-align: center;
      label {
        margin-right: 10px;
      }
      #seller {
        margin-left: 10px;
      }
    }
    .links {
      margin-top: 20px;
      font-size: 14px;
      text-align: right;
      .link {
        display: inline-block;
        margin-right: 10px;
        cursor: pointer;
        color: #fff;

        &:last-child {
          margin: 0;
        }
      }
    }
  }

</style>
