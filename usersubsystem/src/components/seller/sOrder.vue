<template>
  <div class='seller-order'>
    <div class="nav-wrapper">
      <v-nav :title="'店铺订单'" :options="options"></v-nav>
    </div>
    <div class="content-wrapper">
      <ul class="orders">
        <li class="item" v-for="(order,orderIndex) in orders" :key="orderIndex">
          <div class="goods-wrapper">
            <div class="goods" v-for="(goods,goodsIndex) in order.goods" :key="goodsIndex">
              <img :src="goods.image" alt="" class="goods-image">
              <span class="goods-name">{{goods.name}}</span>
            </div>
          </div>
          <div class="user-wrapper">
            <span class="goods-user">{{order.username}}</span>
            <span class="goods-price">￥{{getTotalPrice(orderIndex)}}</span>
            <span class="goods-time">{{order.time}}</span>
          </div>
        </li>
      </ul>
      <div class="choose-page">
        <span class="pre" @click="goPrePage">上一页</span>
        <span class="next" @click="goNextPage">下一页</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  import vNav from '@/components/universal/nav'

  export default {
    name: 'sOrder',
    data() {
      return {
        username: '',
        options: [{
          text: '所有订单',
        }],
        orders: [],
        page: 0,
        max: false,
      }
    },
    components: {
      vNav,
    },
    created() {
      this.username = this.$route.params.username
      axios.post('/api/sOrders/fetchOrders', {
        page: 0,
      }).then((res) => {
        this.orders = res.data
        if (this.orders.length < 8) {
          this.max = true
        }
      }).catch((err) => {
        throw err
      })
    },
    methods: {
      getTotalPrice(index) {
        let price = 0
        for (let i = 0; i < this.orders[index].goods.length; i += 1) {
          price += this.orders[index].goods[i].price * this.orders[index].goods[i].count
        }
        return price.toFixed(2)
      },
      goPrePage() {
        if (this.page === 0) {
          return false
        }
        this.page -= 1
        if (this.max) {
          this.max = false
        }
        axios
          .post('/api/sOrders/fetchOrders', {
            page: this.page,
          })
          .then((res) => {
            this.orders = res.data
          })
          .catch((err) => {
            if (err) {
              throw err
            }
          })
        return true
      },
      goNextPage() {
        if (this.max) {
          return false
        }
        this.page += 1
        axios
          .post('/api/sOrders/fetchOrders', {
            page: this.page,
          })
          .then((res) => {
            this.orders = res.data
            if (this.orders.length < 8) {
              this.max = true
            }
          })
          .catch((err) => {
            throw err
          })
        return true
      },
    },
  }

</script>

<style lang="less">
  .seller-order {
    padding: 0 30px;
    .content-wrapper {
      position: relative;
      width: 70%;
      margin: 0 auto;
      .orders {
        margin-top: 20px;
        width: 100%;
        .item {
          position: relative;
          padding: 20px;
          border: 1px solid rgba(147, 153, 159, 0.8);
          border-radius: 10px;
          box-shadow: 0 0 5px #000;
          margin-bottom: 20px;
          transition: all 0.3s ease-out;
          font-size: 0;
          &:hover {
            background: rgba(147, 153, 159, 0.1);
            box-shadow: 0 0 5px #fff;
          }
          .goods-wrapper {
            display: inline-block;
            width: 80%;
            font-size: 14px;
            .goods{
              width:150px;
              height:100px;
              display: inline-block;
              vertical-align: top;
              border:1px solid rgba(0, 160, 220, 0.1);
              border-radius: 5px;
              margin-right: 10px;
              .goods-image{
                display: block;
                width:80px;
                margin:0 auto;
              }
              .goods-name{
                display: block;
              }
            }
          }
          .user-wrapper {
            width: 20%;
            display: inline-block;
            font-size: 16px;
            vertical-align: top;
            .goods-user,.goods-price,.goods-time{
              display: block;
              margin: 5px 0 10px 0;
            }
            .goods-price{
              color:rgb(255,0,0);
            }
          }
        }
      }
      .choose-page {
        text-align: right;
        .pre,
        .next {
          display: inline-block;
          padding: 4px 10px;
          transition: all .3s ease;
          box-shadow: 0 0 5px rgba(0, 160, 220, 0.3);
          border-radius: 5px;
          background: #e6e9ec;
          cursor: pointer;
          &:hover {
            background: rgba(0, 160, 220, 0.6);
            color: #fff;
          }
        }
      }
    }
  }

</style>
