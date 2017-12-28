<template>
  <div class="consumer">
    <v-header></v-header>
    <div class="sidebar">
      <ul class="sidebar-list">
        <li class="sidebar-item">
          <router-link :to="{name:'information',params:{username:username}}" class="link">个人资料</router-link>
        </li>
        <li class="sidebar-item">
          <router-link :to="{name:'collection',params:{username:username}}" class="link">我的收藏</router-link>
        </li>
        <li class="sidebar-item">
          <router-link :to="{name:'order',params:{username:username}}" class="link">我的订单</router-link>
        </li>
        <li class="sidebar-item">
          <router-link :to="{name:'address',params:{username:username}}" class="link">地址管理</router-link>
        </li>
        <li class="sidebar-item">
          <router-link :to="{name:'evaluation',params:{username:username}}" class="link">评价管理</router-link>
        </li>
      </ul>
    </div>
    <div class="content">
      <div class="bg"></div>
      <router-view></router-view>
    </div>
    <v-footer></v-footer>
  </div>
</template>
<script>
  import router from '@/router'
  import vHeader from '@/components/universal/header'
  import vFooter from '@/components/universal/footer'
  import information from '@/components/consumer/information'
  import vAddress from '@/components/consumer/address'
  import evaluation from '@/components/consumer/evaluation'
  import order from '@/components/consumer/order'
  import collection from '@/components/consumer/collection'

  export default {
    name: 'consumer',
    data() {
      return {
        username: '',
      }
    },
    components: {
      vHeader,
      vFooter,
      information,
      vAddress,
      evaluation,
      order,
      collection,
    },
    created() {
      this.username = this.$route.params.username
      this.$nextTick(() => {
        router.push({
          name: 'information',
          params: {
            username: this.username,
          },
        })
      })
    },
  }

</script>
<style lang="less">
  .consumer {
    position: relative; // height:100%;
    min-height: 100%;
    .sidebar {
      position: absolute;
      width: 30px;
      top: 106px;
      bottom: 0;
      transition: all .3s linear;
      border-right: 1px solid rgba(147, 153, 159, 0.6);
      box-shadow: 1px 1px 2px #000;
      font-size: 0;
      &:hover {
        width: 100px;
        box-shadow: 1px 1px 3px rgba(0, 160, 220, 0.8);
      }
      .sidebar-list {
        padding: 2px;
        border-radius: 5px;
        .sidebar-item {
          margin-bottom: 10px;
          padding: 5px;
          border: 1px solid #f3f5f7;
          border-radius: 5px;
          background: rgba(147, 153, 159, 0.3);
          overflow: hidden;
          height: 20px;
          font-size: 0;
          line-height: 20px;
          transition: all .3s ease-in-out;
          &:hover {
            border: 1px inset rgba(0, 160, 220, 0.8);
            background: linear-gradient(left, #fff, #f3f5f7);
            width: auto;
          }
          .link {
            font-size: 16px;
            color: #000;
          }
        }
      }
    }
    .content {
      position: relative;
      width: 90%;
      margin: 0 auto;
      padding-bottom: 30px;
      .bg {
        z-index: -1;
        position: absolute;
        left: -10%;
        width: 115.51%;
        height: 60px;
        background: linear-gradient(to left, rgba(147, 153, 159, 0.2), rgba(0, 160, 220, 0.8));
      }
    }
  }

</style>
