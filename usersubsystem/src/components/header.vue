<template>
  <div class='header'>
    <ul class="header-left">
      <li class="left-item">
        <span class="logo">M</span>
      </li>
      <li class="left-item">
        <router-link :to="username" class="link"> {{ username }}
        </router-link>
      </li>
    </ul>
    <ul class="header-right">
      <li class="right-item">
        <router-link to="/login">退出登陆</router-link>
      </li>
      <li class="right-item">
        <router-link to="#">联系客服</router-link>
      </li>
      <li class="right-item collection" @mouseleave="hideDetails" @mouseenter="showDetails($event,2)">
        <span class="more">收藏夹</span>
        <transition name="slide" mode="out-in">
          <div v-show="showIndex === 2" class="details">
            <router-link :to="{name:'collection',params:{username:this.username,index:0}}" class="link">我的商品</router-link>
            <router-link :to="{name:'collection',params:{username:this.username,index:1}}" class="link">我的店铺</router-link>
          </div>
        </transition>
      </li>
      <li class="right-item shopcart" @mouseleave="hideDetails" @mouseenter="showDetails($event,1)">
        <span class="more">购物车</span>
        <transition name="slide" mode="out-in">
          <div v-show="showIndex === 1" class="details shopcart">
            测试使用！！！！！！！！！！
          </div>
        </transition>
      </li>
      <li class="right-item">
        <router-link to="#">首页</router-link>
      </li>
    </ul>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'header',
    data() {
      return {
        username: '',
        goodsCollection: '',
        shopsCollection: '',
        showIndex: 0,
      }
    },
    created() {
      this.username = this.$route.params.username
    },
    methods: {
      showDetails(e, index) {
        this.showIndex = index
      },
      hideDetails() {
        this.showIndex = 0
      },
      test() {
        return false
      },
    },
  }

</script>
<style lang="less">
  .header {
    padding: 10px 80px;
    background: rgba(147, 153, 159, 0.2);
    .left-item {
      float: left;
      margin-right: 50px;
      &:last-child {
        margin: 0;
      }
      .logo {
        padding: 0 5px;
        display: inline-block;
        color: rgb(0, 160, 220);
        font-size: 24px;
        text-shadow: 1px 3px 4px rgb(0, 0, 0);
      }
      .link {
        display: inline-block;
        padding: 5px 5px;
        color: rgba(0, 0, 0, 0.8);
      }
    }
    .right-item {
      position: relative;
      float: right;
      padding-right: 20px;
      z-index: 999;
      &:first-child {
        padding: 0;
      }
      &.collection {
        z-index: 1000;
      }
      .more {
        cursor: pointer;
      }
      a,
      .more {
        display: inline-block;
        padding: 5px 5px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.8);
      }
      .details {
        position: absolute;
        top: 20px;
        left: 5px;
        padding-top: 15px;
        background: linear-gradient(to bottom, rgba(147, 153, 159, 0), rgb(255, 255, 255));
        z-index: 998;
        border-radius: 0 10px 10px 0;
        &.slide-enter,
        &.slide-leave-active {
          transform: translateY(-100%)
        }
        &.slide-enter-active,
        &.slide-leave-active {
          transition: all .3s linear
        }
        .link {
          display: block;
          padding: 5px 5px;
          font-size: 14px;
          &:first-child {
            border-bottom: 1px solid rgba(147, 153, 159, 0.5);
          }
        }
        &.shopcart{
          width:200px;
        }
      }
    }
    &:after {
      display: table;
      content: "";
      clear: both;
    }
  }

</style>
