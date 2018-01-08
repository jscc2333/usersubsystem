<template>
  <div class='shop'>
    <div class="nav-wrapper">
      <v-nav :title="'我的店铺'" :options="options"></v-nav>
    </div>
    <div class="content-wrapper">
      <div class="create-wrapper" v-if="shopId === 0">
        <div class="input-wrapper">
          <ul class="input-infos">
            <li class="input-info">
              <label for="shopName">店铺名</label>
              <input type="text" id="shopName" v-model="shopName">
            </li>
            <li class="input-info">
              <label for="shopDesc">店铺描述</label>
              <textarea name="" id="shopDesc" cols="30" rows="2" v-model="shopDesc"></textarea>
            </li>
            <li class="input-info">
              <label for="shopAddress">所在地</label>
              <input type="text" id="shopAddress" v-model="shopAddress">
            </li>
            <li class="input-info">
              <label for="shopPhone">服务电话</label>
              <input type="text" maxlength="11" id="shopPhone" v-model="shopPhone">
            </li>
            <li class="input-info">
              <label for="shopImage">店铺缩略图</label>
              <input type="file" id="shopImage" accept="image/*">
            </li>
          </ul>
        </div>
        <div class="submit">
          <span class="button" @click="createShop">确认</span>
        </div>
      </div>
      <div class="shop-wrapper" v-else>
        <div class="shop-information">
          <div class="shop-image">
            <img :src="shopImage" alt="">
            <input type="file" accept="image/*" class="upload" @change="onFileChange($event)">
          </div>
          <div class="shop-info">
            <ul class="infos">
              <li class="info-item">
                <label for="" class="title">商铺名:</label>
                <span class="text" v-if="!editMode">{{shopName}}</span>
                <input class="input" type="text" v-model="shopName" v-else>
              </li>
              <li class="info-item">
                <label for="" class="title">店铺描述:</label>
                <span class="text" v-if="!editMode">{{shopDesc}}</span>
                <input class="input" type="text" v-model="shopDesc" v-else>
              </li>
              <li class="info-item">
                <label for="" class="title">店铺地址:</label>
                <span class="text" v-if="!editMode">{{shopAddress}}</span>
                <input class="input" type="text" v-model="shopAddress" v-else>
              </li>
              <li class="info-item">
                <label for="" class="title">店铺电话:</label>
                <span class="text" v-if="!editMode">{{shopPhone}}</span>
                <input class="input" type="text" v-model="shopPhone" v-else>
              </li>
            </ul>
            <div class="edit-info">
              <span class="edit-button" @click="switchEditMode($event)">{{getEditText}}</span>
            </div>
          </div>
        </div>
        <div class="shop-goods">
          <div class="goods-wrapper">
            <ul class="goods-list">
              <li class="goods-item" v-for="(goods,goodsIndex) in goodsList" :key="goodsIndex">
                <img :src="goods.goods_image" alt="">
                <span class="goods-name">{{goods.goods_name}}</span>
                <span class="goods-price">￥{{goods.goods_price}}</span>
                <span class="delete-goods" @click="deleteGoods(goods,goodsIndex)">下架</span>
                <span class="update-goods" @click="openUPanel(goods,goodsIndex)">更新</span>
              </li>
            </ul>
          </div>
          <div class="goods-operation">
            <span class="add-goods" @click="openPanel">+</span>
          </div>
          <transition name="slide">
            <div class="add-goods-panel" v-if="addMode || updateMode">
              <ul class="items">
                <li class="item">
                  <label for="goodsName" class="title">商品名</label>
                  <input type="text" id="goodsName" v-model="goodsName">
                </li>
                <li class="item">
                  <label for="goodsPrice" class="title">商品价格</label>
                  <input type="text" id="goodsPrice" v-model="goodsPrice">
                </li>
                <li class="item">
                  <label for="goodsDesc" class="title">商品描述</label>
                  <input type="text" id="goodsDesc" v-model="goodsDesc" accept="">
                </li>
                <li class="item">
                  <label for="goodsImage" class="title">缩略图</label>
                  <input type="file" id="goodsImage" accept="image/*">
                </li>
              </ul>
              <div class="submit">
                <span class="button" @click="switchOperation()">{{getOperation}}</span>
              </div>
              <span class="close" @click="closePanel">X</span>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  import vNav from '@/components/universal/nav'

  export default {
    name: 'shop',
    data() {
      return {
        username: '',
        options: [{
          text: '店铺管理',
        }],
        editMode: false,
        shopId: 0,
        shopName: '',
        shopDesc: '',
        shopAddress: '',
        shopPhone: '',
        shopImage: '',
        addMode: false,
        updateMode: false,
        goodsId: '',
        goodsName: '',
        goodsPrice: '',
        goodsDesc: '',
        goodsImage: '',
        goodsList: [],
      }
    },
    components: {
      vNav,
    },
    created() {
      this.username = this.$route.params.username
      axios.post('/api/shop/fetchInformation', {
        username: this.username,
      }).then((res) => {
        if (res.data.status === 1) {
          this.shopId = res.data.information.shop_id
          this.shopName = res.data.information.shop_name
          this.shopDesc = res.data.information.shop_desc
          this.shopAddress = res.data.information.shop_address
          this.shopPhone = res.data.information.shop_phone
          this.shopImage = res.data.information.shop_image
          axios.post('/api/shop/fetchGoods', {
            shopId: this.shopId,
          }).then((resInner) => {
            if (resInner.data.status === 1) {
              this.goodsList = resInner.data.goodsList
            }
          }).catch((err) => {
            throw err
          })
        }
      }).catch((err) => {
        throw err
      })
    },
    computed: {
      getEditText() {
        return !this.editMode === true ? '更改店铺信息' : '保存更改'
      },
      getOperation() {
        return this.updateMode ? '更新' : '上架'
      },
    },
    methods: {
      createShop() {
        const data = new FormData()
        const file = document.querySelector('#shopImage').files[0]
        data.append('shopId', this.shopId)
        data.append('shopName', this.shopName)
        data.append('shopDesc', this.shopDesc)
        data.append('shopAddress', this.shopAddress)
        data.append('shopPhone', this.shopPhone)
        data.append('username', this.username)
        data.append('shopImage', file)
        axios.post('/api/shop/createShop', data)
          .then((res) => {
            if (res.data.status === 1) {
              this.shopId = res.data.information[0]
              this.shopName = res.data.information[1]
              this.shopDesc = res.data.information[2]
              this.shopAddress = res.data.information[3]
              this.shopImage = res.data.information[5]
            }
          }).catch((err) => {
            throw err
          })
      },
      onFileChange(e) {
        const file = e.target.files[0] || e.dataTransfer.files[0]
        if (!file) {
          return
        }
        const data = new FormData()
        data.append('shopImage', file)
        data.append('shopId', this.shopId)
        axios.post('/api/shop/changeImage', data, {
          header: {
            'Content-Type': 'multipart/form-data',
          },
        }).then((res) => {
          if (res.data.status === 1) {
            this.shopImage = res.data.shopImage
          } else {
            throw Error(res.data.message)
          }
        }).catch((err) => {
          throw err
        })
      },
      switchEditMode() {
        if (this.editMode === true) {
          axios.post('/api/shop/changeInformation', {
            shopName: this.shopName,
            shopDesc: this.shopDesc,
            shopAddress: this.shopAddress,
            shopPhone: this.shopPhone,
            shopId: this.shopId,
          }).then((res) => {
            console.log(res)
          }).catch((err) => {
            throw err
          })
        }
        this.editMode = !this.editMode
      },
      openPanel() {
        this.addMode = true
      },
      openUPanel(goods) {
        this.updateMode = true
        this.goodsId = goods.goods_id
        this.goodsName = goods.goods_name
        this.goodsPrice = goods.goods_price
        this.goodsDesc = goods.goods_desc
      },
      closePanel() {
        this.addMode = false
        this.updateMode = false
      },
      switchOperation() {
        if (this.addMode) {
          this.addGoods()
        } else {
          this.updateGoods()
        }
      },
      addGoods() {
        const data = new FormData()
        const file = document.querySelector('#goodsImage').files[0]
        data.append('goodsId', 0)
        data.append('goodsName', this.goodsName)
        data.append('goodsPrice', this.goodsPrice)
        data.append('goodsDesc', this.goodsDesc)
        data.append('shopId', this.shopId)
        data.append('goodsImage', file)
        axios.post('/api/shop/addGoods', data)
          .then((res) => {
            if (res.data.status === 1) {
              this.addMode = false
              axios.post('/api/shop/fetchGoods', {
                shopId: this.shopId,
              }).then((resInner) => {
                if (resInner.data.status === 1) {
                  this.goodsList = resInner.data.goodsList
                  this.goodsName = ''
                  this.goodsPrice = ''
                  this.goodsDesc = ''
                }
              }).catch((err) => {
                throw err
              })
            }
          }).catch((err) => {
            throw err
          })
      },
      deleteGoods(goods, index) {
        axios.post('/api/shop/deleteGoods', {
          goodsId: goods.goods_id,
        }).then((res) => {
          if (res.data.status === 1) {
            this.goodsList.splice(index, 1)
          }
        }).catch((err) => {
          throw err
        })
      },
      updateGoods() {
        const file = document.querySelector('#goodsImage').files[0]
        let data = {}
        if (!file) {
          data = {
            goodsName: this.goodsName,
            goodsPrice: this.goodsPrice,
            goodsDesc: this.goodsDesc,
            goodsId: this.goodsId,
            shopId: this.shopId,
          }
        } else {
          data = new FormData()
          data.append('goodsName', this.goodsName)
          data.append('goodsPrice', this.goodsPrice)
          data.append('goodsDesc', this.goodsDesc)
          data.append('goodsImage', file)
          data.append('goodsId', this.goodsId)
          data.append('shopId', this.shopId)
        }
        axios.post('/api/shop/updateGoods', data)
          .then((res) => {
            if (res.data.status === 1) {
              this.updateMode = false
              this.goodsList = res.data.goodsList
            }
          }).catch((err) => {
            throw err
          })
      },
    },
  }

</script>

<style lang="less">
  .shop {
    padding: 0 30px;
    .content-wrapper {
      position: relative;
      width: 80%;
      margin: 0 auto;
      padding-top: 40px;
      font-size: 0;
      .create-wrapper {
        width: 60%;
        margin: 60px auto 0;
        font-size: 18px;
        padding: 30px 10px;
        text-align: center;
        background: #f3f5f7;
        border: 1px solid rgba(237, 230, 230, 0.7);
        box-shadow: 1px 1px 3px #000;
        .input-info {
          position: relative;
          padding: 5px 10px;
          width: 80%;
          margin: 0 auto 20px;
          text-align: left;
          border: 1px inset rgba(147, 153, 159, 0.3);
          border-radius: 20px;
          label {
            display: inline-block;
            width: 100px;
            text-align: right;
            vertical-align: top;
            margin-right: 10px;
          }
          input {
            width: 60%;
            padding: 4px;
            font-size: 12px;
            border-radius: 20px;
          }
          textarea {
            resize: none;
            padding: 5px;
            border-radius: 10px;
          }
        }
        .submit {
          padding: 2px;
          .button {
            display: inline-block;
            padding: 5px 20px;
            border: 1px solid rgba(0, 160, 220, 0.3);
            border-radius: 20px;
            cursor: pointer;
          }
        }
      }
      .shop-information {
        box-sizing: border-box;
        display: inline-block;
        width: 37%;
        padding: 10px;
        font-size: 20px;
        .shop-image {
          position: relative;
          width: 100%;
          height: 300px;
          img {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 10px;
          }
          .upload {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 1000;
            cursor: pointer;
            opacity: 0;
          }
        }
        .shop-info {
          position: relative;
          margin-top: 20px;
          padding-bottom: 40px;
          .info-item {
            padding: 10px 0;
            margin-bottom: 10px;
            border-bottom: 1px solid rgba(237, 230, 230, 0.9);
            border-radius: 10px;
            background: rgba(147, 153, 159, 0.1);
            transition: all .3s linear;
            cursor: pointer;
            .title {
              font-size: 18px;
              color: rgba(0, 160, 220, 0.8);
            }
            .text {
              font-size: 16px;
            }
            .input {
              display: inline-block;
              box-sizing: border-box;
              padding: 2px 4px;
              font-size: 12px;
            }
            &:last-child {
              margin: 0;
            }
            &:hover {
              padding: 15px 10px;
            }
          }
          .edit-info {
            position: absolute;
            right: 0;
            bottom: 0;
            .edit-button {
              display: inline-block;
              padding: 5px;
              border-radius: 10px;
              cursor: pointer;
              font-size: 14px;
              background: rgba(0, 160, 220, 0.2);
              transition: all .3s ease-in;
              &:hover {
                color: #fff;
                background: rgb(0, 160, 220);
              }
            }
          }
        }
      }
      .shop-goods {
        position: relative;
        display: inline-block;
        box-sizing: border-box;
        vertical-align: top;
        width: 53%;
        font-size: 20px;
        margin-left: 10%;
        .goods-wrapper {
          width: 100%;
          max-height: 600px;
          border: 1px solid rgba(147, 153, 159, 0.5);
          border-radius: 10px;
          overflow: hidden;
          .goods-list {
            box-sizing: border-box;
            width: 105%;
            height: 601px;
            padding: 10px 20px 10px 10px;
            overflow: auto;
            font-size: 0;
            .goods-item {
              position: relative;
              display: inline-block;
              width: 50%;
              padding: 10px;
              box-sizing: border-box;
              font-size: 16px;
              text-align: center;
              img {
                display: block;
                width: 70%;
                margin: 0 auto;
                border-radius: 10px;
              }
              .goods-name,
              .goods-price {
                display: block;
                margin-top: 10px;
              }
              .goods-price {
                color: rgb(255, 0, 0);
              }
              .delete-goods,
              .update-goods {
                position: absolute;
                display: block;
                right: 3%;
                box-sizing: border-box;
                border: 1px solid rgba(0, 0, 0, 0.1);
                font-size: 14px;
                cursor: pointer;
                padding: 3px;
                transition: all .3s ease-in;
                &:hover {
                  background: rgba(147, 153, 159, 0.3);
                }
              }
              .delete-goods {
                top: 15px;
              }
              .update-goods {
                top: 45px;
              }
            }
          }
        }
        .goods-operation {
          position: absolute;
          left: 5px;
          top: 5px;
          padding: 0px 5px;
          background: rgba(0, 160, 220, 0.8);
          color: #fff;
          font-size: 30px;
          border-radius: 50%;
          cursor: pointer;
        }
        .add-goods-panel {
          position: absolute;
          width: 100%;
          height: 600px;
          display: flex;
          left: 0;
          top: 0;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 20px;
          background: rgba(239, 241, 242, 0.9);
          box-shadow: 1px 1px 3px rgba(147, 153, 159, 0.6);
          border-radius: 0 20px 20px 0;
          z-index: 100;
          &.slide-enter,
          &.slide-leave-active {
            transform: translateY(-100%);
          }
          &.slide-enter-active,
          &.slide-leave-active {
            transition: all .5s linear;
          }
          .items {
            margin-bottom: 20px;
            .item {
              padding: 4px;
              margin-bottom: 10px;
              border: 1px solid rgba(0, 160, 220, 0.5);
              border-radius: 10px;
              &:last-child {
                margin: 0;
              }
              .title {
                font-size: 16px;
              }
              input {
                display: inline-block;
                width: 80%;
                border-radius: 20px;
                padding: 4px 5px;
              }
            }
          }
          .submit {
            background: #fff;
            padding: 2px 30px;
            box-shadow: 0 0 1px rgb(0, 0, 0, 0.3);
            border-radius: 10px;
            cursor: pointer;
            transition: all .5s ease-in-out;
            &:hover {
              background: rgba(0, 160, 220, 0.7);
              color: #fff;
            }
          }
          .close {
            position: absolute;
            right: 10px;
            top: 10px;
            cursor: pointer;
            z-index: 200;
          }
        }
      }
    }
  }

</style>
