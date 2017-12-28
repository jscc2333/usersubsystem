<template>
  <div class='order'>
    <div class="nav-wrapper">
      <v-nav :title="'我的订单'" :options="options"></v-nav>
    </div>
    <div class="content-wrapper">
      <ul class="orders">
        <li class="item" v-for="(order,orderIndex) in orders" :key="orderIndex">
          <div class="order-shop" v-for="(orderShop,orderShopIndex) in order.shops" :key="orderShopIndex">
            <h2 class="order-shop-title">{{orderShop.name}}</h2>
            <li class="order-good" v-for="(orderGood,orderGoodIndex) in orderShop.goods" :key="orderGoodIndex">
              <div class="image">
                <img :src="orderGood.image" alt="">
              </div>
              <div class="detail">
                <span class="name">
                  {{orderGood.name}}
                </span>
                <span class="price">
                  ￥{{orderGood.price}}
                </span>
                <span class="count">x{{ orderGood.count}}
                </span>
              </div>
            </li>
          </div>
          <p class="total">
            总价：
            <span class="total-price">￥{{getTotalPrice(orderIndex)}}</span>
          </p>
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
  import vNav from '@/components/nav'

  export default {
    name: 'order',
    data() {
      return {
        username: '',
        options: [{
          text: '所有订单',
        }],
        page: 0,
        orders: [],
      }
    },
    components: {
      vNav,
    },
    created() {
      this.username = this.$route.params.username
      axios.post('/api/orders/fetchOrders', {
        page: 0,
      }).then((res) => {
        this.orders = res.data
      }).catch((err) => {
        throw err
      })
    },
    methods: {
      getTotalPrice(index) {
        let price = 0
        for (let j = 0; j < this.orders[index].shops.length; j += 1) {
          for (let i = 0; i < this.orders[index].shops[j].goods.length; i += 1) {
            const good = this.orders[index].shops[j].goods[i]
            price += good.price * good.count
          }
        }
        return price
      },
      goPrePage() {},
      goNextPage() {},
    },
  }

</script>

<style lang="less">
  .order {
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
          &:hover {
            background: rgba(147, 153, 159, 0.1);
            box-shadow: 0 0 5px #fff;
          }
          .total {
            text-align: right;
            font-size: 16px;
            .total-price {
              color: rgb(255, 0, 0)
            }
          }
          .order-shop {
            margin-bottom: 30px;
            &:after {
              content: '';
              clear: both;
              display: table;
            }
            &:last-child {
              margin-bottom: 0;
            }
            .order-shop-title {
              font-size: 18px;
              font-weight: 500;
              margin-bottom: 20px;
            }
            .order-good {
              padding-left: 20px;
              margin-right: 10px;
              float: left;
              .image {
                display: inline-block;
                margin-right: 10px;
                img {
                  width: 80px;
                  height: 80px;
                }
              }
              .detail {
                display: inline-block;
                font-size: 14px;
                vertical-align: top;
                span {
                  display: block;
                  margin-bottom: 10px;
                  &.price,
                  &.count {
                    text-align: right;
                  }
                  &.price {
                    color: rgba(255, 0, 0, 0.8);
                  }
                  &.count {
                    color: rgba(147, 153, 159, 0.8)
                  }
                }
              }
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
