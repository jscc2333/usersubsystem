<template>
  <div class="login">
    <div class="login-header">
      <span class="logo">Mall</span>
    </div>
    <div class="login-wrapper">
      <div class="login-banner">
        广告位招租
      </div>
      <div class="login-form">
        <transition name="slide" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>
    </div>
    <div class="login-footer">
      <v-footer></v-footer>
    </div>
  </div>
</template>
<script>
import router from '@/router'
import login from '@/components/universal/login'
import register from '@/components/universal/registration'
import vFooter from '@/components/universal/footer'

export default {
  name: 'login',
  data() {
    return {}
  },
  created() {
    router.push('/login')
  },
  computed: {},
  methods: {},
  components: {
    login,
    register,
    vFooter,
  },
}
</script>
<style lang="less">
.login {
  font-size: 0;
  .login-header {
    margin: 20px 0;
    padding: 0 20px;
    .logo {
      color: rgba(0, 160, 220, 0.9);
      font-size: 50px;
    }
  }
  .login-wrapper {
    position: relative;
    width: 100%;
    height: 600px;
    .login-banner {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 100%;
      font-size: 60px;
      text-align: center;
      z-index: 999;
      background: url("../../static/images/login/banner.jpg");
      background-size: cover;
    }
    .login-form {
      position: absolute;
      left: 20px;
      top:160px;
      padding: 20px;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 20px;
    }
    
    .slide-enter {
      transform:translateX(100%);
    }
    .slide-leave-active {
      transform:translateX(-100%);
      opacity: 0;
    }
    .slide-enter-active,
    .slide-leave-active {
      transition: all 0.5s linear;
    }
  }
}
</style>
