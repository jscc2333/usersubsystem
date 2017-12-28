<template>
  <div class="registration">
    <div class="username registration-item">
      <span class="title">用户名</span>
      <input type="text" placeholder="请输入你的用户名" v-model="username" @blur="checkData('username',username)" @focus="clearTip('username')">
      <span class="registration-tip" v-if="usernameTip !== ''">{{usernameTip}}</span>
    </div>
    <div class="password registration-item">
      <span class="title">密码</span>
      <input type="password" placeholder="请输入你的密码" v-model="password" @blur="checkData('password',password)" @focus="clearTip('password')">
      <span class="registration-tip" v-if="passwordTip !== ''">{{passwordTip}}</span>
    </div>
    <div class="email registration-item">
      <span class="title">邮箱</span>
      <input type="email" placeholder="请输入你的邮箱" v-model="email" @blur="checkData('email',email)" @focus="clearTip('email')">
      <span class="registration-tip" v-if="emailTip !== ''">{{emailTip}}</span>
    </div>
    <div class="phone registration-item">
      <span class="title">手机</span>
      <input type="text" placeholder="请输入你的手机号码" maxlength="11" v-model="phone" @blur="checkData('phone',phone)" @focus="clearTip('phone')">
      <span class="registration-tip" v-if="phoneTip !== ''">{{phoneTip}}</span>
    </div>
    <div class="realname registration-item">
      <span class="title">真实姓名</span>
      <input type="text" placeholder="请输入你的真实姓名" v-model="realname" @blur="checkData('realname',realname)" @focus="clearTip('realname')">
      <span class="registration-tip" v-if="realnameTip !== ''">{{realnameTip}}</span>
    </div>
    <div class="id-number registration-item">
      <span class="title">身份证号</span>
      <input type="text" placeholder="请输入你的身份证号" maxlength="18" v-model="idNumber" @blur="checkData('idNumber',idNumber)" @focus="clearTip('idNumber')">
      <span class="registration-tip" v-if="idNumberTip !== ''">{{idNumberTip}}</span>
    </div>
    <div class="category registration-item">
      <span class="title">注册类型</span>
      <input type="radio" id="consumer" value="consumer" name="category" v-model="picked">
      <label for="consumer">用户</label>
      <input type="radio" id="business" value="business" name="category" v-model="picked">
      <label for="business">商家</label>
    </div>
    <div class="submit">
      <span class="signup" @click="signup()">完成注册</span>
    </div>
    <div class="close" @click="closeRegistration">
      <span class="icon">X</span>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import router from '@/router'
  import {
    checkValue,
  } from '@/assets/js/utils'

  export default {
    name: 'register',
    data() {
      return {
        username: '',
        password: '',
        email: '',
        phone: '',
        realname: '',
        idNumber: '',
        picked: '',
        usernameTip: '',
        passwordTip: '',
        emailTip: '',
        phoneTip: '',
        realnameTip: '',
        idNumberTip: '',
      }
    },
    computed: {
    },
    methods: {
      isNull() {
        return this.username && this.password && this.email && this.phone &&
          this.realname && this.idNumber && this.picked
      },
      closeRegistration() {
        this.$store.commit('changeRegisterState')
        router.push('/login')
      },
      checkData(type, value) {
        const result = checkValue(type, value)
        if (result !== true) {
          this[`${type}Tip`] = result
        }
      },
      clearTip(type) {
        this[`${type}Tip`] = ''
      },
      signup() {
        if (this.isNull()) {
          const data = {
            username: this.username,
            password: this.password,
            email: this.email,
            phone: this.phone,
            realname: this.realname,
            idNumber: this.idNumber,
            picked: this.picked,
          }
          axios.post('/api/users/signup', data)
            .then((res) => {
              if (res.data.status === 0) {
                this.closeRegistration()
              } else {
                this.emailTip = res.data.message
              }
            })
            .catch((err) => {
              throw err
            })
        }
        return false
      },
    },
  }

</script>
<style lang="less">
  .registration {
    position: relative;
    font-size: 20px;
    .registration-item {
      position: relative;
      margin: 20px 0;
      .title {
        display: inline-block;
        width: 80px;
        vertical-align: middle;
        text-align: right;
        font-size: 20px;
      }
      input {
        padding: 4px;
        font-size: 16px;
      }
      .registration-tip {
        position: absolute;
        top: 100%;
        left: 90px;
        font-size: 16px;
        color: rgb(240, 80, 0);
      }
    }
    .submit {
      margin: 10px 0 0 0;
      padding: 5px 0;
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 5px;
      font-size: 24px;
      .signup {
        display: inline-block;
        width: 100%;
        text-align: center;
        color: #fff;
      }
    }
    .close {
      position: absolute;
      right: -16px;
      top: -30px;
      .icon {
        display: inline-block;
        width: 20px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 60%;
        text-align: center;
        cursor: pointer;
        color: #fff;
      }
    }
  }

</style>
