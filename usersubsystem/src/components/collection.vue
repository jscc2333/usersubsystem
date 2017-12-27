<template>
  <div class='collection'>
    <div class="nav-wrapper">
      <v-nav :title="'我的收藏'" :options="options"></v-nav>
    </div>
    <div class="content-wrapper">
      <ul class="collections">
        <li v-for="(collection,collectionIndex) in collections" :key="collectionIndex" class="item">
          <img class="image" :src="collection.url" :alt="collection.desc">
          <span class="price" v-if="collection.price">￥{{collection.price}}</span>
          <span class="name">{{collection.name}}</span>
          <span class="shop" v-if="collection.shop">{{collection.shop}}</span>
          <span class="quantity">收藏人气：{{collection.colQuantity}}</span>
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
  import {
    mapGetters,
  } from 'vuex'
  import axios from 'axios'
  import vNav from '@/components/nav'

  export default {
    name: 'collection',
    data() {
      return {
        username: '',
        options: [{
          text: '我的商品',
        },
        {
          text: '我的店铺',
        },
        ],
        collections: [],
        api: '',
        page: 0,
        max: false,
      }
    },
    components: {
      vNav,
    },
    watch: {
      switch() {
        if (this.$store.state.switch === 0) {
          this.api = '/api/collections/fetchGoods'
          axios.post(this.api, {
            page: 0,
          }).then((res) => {
            this.collections = res.data
          }).catch((err) => {
            throw err
          })
        } else {
          this.api = '/api/collections/fetchShops'
          axios.get(this.api).then((res) => {
            this.collections = res.data
          }).catch((err) => {
            throw err
          })
        }
      },
    },
    created() {
      this.username = this.$route.params.username
      this.api = '/api/collections/fetchGoods'
      axios.post(this.api, {
        page: this.page,
      }).then((res) => {
        this.collections = res.data
        if (this.collections.length < 4) {
          this.max = true
        }
      }).catch((err) => {
        if (err) {
          throw err
        }
      })
    },
    computed: {
      ...mapGetters({
        switch: 'getSwitch',
      }),
    },
    methods: {
      changeContent(index) {
        this.$store.commit('changeSwitch', index)
      },
      goPrePage() {
        if (this.page === 0) {
          return false
        }
        this.page -= 1
        if (this.max) {
          this.max = false
        }
        axios.post(this.api, {
          page: this.page,
        }).then((res) => {
          this.collections = res.data
        }).catch((err) => {
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
        axios.post(this.api, {
          page: this.page,
        }).then((res) => {
          this.collections = res.data
          if (this.collections.length < 8) {
            this.max = true
          }
        }).catch((err) => {
          throw err
        })
        return true
      },
    },
    beforeRouteEnter(to, from, next) {
      if (to.params.index) {
        const index = to.params.index
        next((vm) => {
          vm.changeContent(index)
        })
      }
      next()
    },
  }

</script>

<style lang="less">
  .collection {
    padding: 0 30px;
    .content-wrapper {
      position: relative;
      width: 90%;
      margin: 0 auto;
      .collections {
        margin-top: 20px;
        min-width: 900px;
        &:after{
          content:'';
          display: table;
          clear:both;
        }
        .item {
          position: relative;
          width: 23%;
          margin: 0 2% 50px 0;
          padding: 20px;
          box-sizing: border-box;
          background: #e6e9ec;
          text-align: center;
          border-radius: 10px;
          transition: all .5s ease;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
          float: left;
          &:hover {
            background: #fff;
            border: 1px solid rgb(0, 160, 220);
            box-shadow: none;
            .name {
              color: rgb(0, 160, 220);
            }
          }
          &:nth-child(4n) {
            margin-right: 0;
          }
          &:nth-child(5),&:nth-child(6),&:nth-child(7),&:nth-child(8){
            margin-bottom: 30px;
          }
          .image,
          .price,
          .name,
          .quantity,
          .shop {
            display: block;
          }
          .image {
            width: 100%;
            height: 100%;
            border-radius: 10px;
          }
          .price {
            position: absolute;
            left: 5px;
            bottom: 26px;
            font-size: 24px;
            text-align: left;
            color: rgb(240, 60, 0);
            margin-top: 10px;
          }
          .name {
            width: 100%;
            margin-top: 10px;
            font-size: 18px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .shop {
            margin-top: 10px;
            font-size: 16px;
            color: rgb(147, 153, 159);
          }
          .quantity {
            width: 100%;
            margin-top: 10px;
            text-align: right;
          }
        }
      }
      .choose-page{
        text-align: right;
        .pre,.next{
          display: inline-block;
          padding: 4px 10px;
          transition: all .3s ease;
          box-shadow: 0 0 5px rgba(0, 160, 220,0.3);
          border-radius: 5px;
          background: #e6e9ec;
          cursor: pointer;
          &:hover{
            background: rgba(0, 160, 220,0.6);
            color:#fff;
          }
        }
      }
    }
  }

</style>
