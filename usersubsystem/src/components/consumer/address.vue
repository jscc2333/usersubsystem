<template>
  <div class='address'>
    <div class="nav-wrapper">
      <v-nav :title="'我的地址'" :options="options"></v-nav>
    </div>
    <div class="content-wrapper">
      <div class="add-address content">
        <h1 class="title" @click="goBack">{{getOpeDescription}}</h1>
        <ul class="add-items">
          <li class="add-item">
            <span class="title">详细地址</span>
            <textarea name="" id="" cols="30" rows="2" style="resize: none;" class="input" placeholder="请输入详细地址" v-model="address" @blur="checkData('address',address)"
              @focus="clearTip('address')"> </textarea>
            <span class="address-tip" v-if="addressTip !== ''">{{addressTip}}</span>
          </li>
          <li class="add-item">
            <span class="title" maxLength="6">邮政编码</span>
            <input type="text" class="input" placeholder="请输入邮政编码" maxlength="6" v-model="zipCode" @blur="checkData('zipCode',zipCode)"
              @focus="clearTip('zipCode')">
            <span class="address-tip" v-if="zipCodeTip !== ''">{{zipCodeTip}}</span>
          </li>
          <li class="add-item">
            <span class="title">收货人姓名</span>
            <input type="text" class="input" placeholder="请输入收货人姓名" v-model="consignee" @blur="checkData('consignee',consignee)" @focus="clearTip('consignee')">
            <span class="address-tip" v-if="consigneeTip !== ''">{{consigneeTip}}</span>
          </li>
          <li class="add-item">
            <span class="title">手机号码</span>
            <input type="text" class="input" maxLength="11" placeholder="请输入手机号码" v-model="phone" @blur="checkData('phone',phone)" @focus="clearTip('phone')">
            <span class="address-tip" v-if="phoneTip !== ''">{{phoneTip}}</span>
          </li>
          <li class="add-item check">
            <input type="checkbox" class="checkbox" v-model="isDefault"> 设置为默认地址
          </li>
          <div class="submit">
            <span class="submit-button" @click="submitData">保存</span>
          </div>
        </ul>
      </div>
      <div class="existed-address content">
        <h1 class="title">已保存了{{addresses.length}}条地址</h1>
        <div class="addresses-wrapper">
          <ul class="addresses">
            <li class="head">
              <span class="item address-consignee">收货人</span>
              <span class="item address-detail">详细地址</span>
              <span class="item address-zipCode">邮编</span>
              <span class="item address-phone">手机</span>
              <span class="item address-operation">操作</span>
            </li>
            <li class="body" v-for="(addressObj,addressIndex) in addresses" :key="addressIndex">
              <span class="item address-info address-consignee">{{addressObj.address_consignee}}</span>
              <span class="item address-info address-detail">{{addressObj.address_address}}</span>
              <span class="item address-info address-zipCode">{{addressObj.address_zipCode}}</span>
              <span class="item address-info address-phone">{{addressObj.address_phone}}</span>
              <span class="item address-info update" @click="switchToUpdate(addressObj,addressIndex)">修改</span>
              <span class="item address-info delete" @click="deleteAddress(addressObj,addressIndex)">删除</span>
              <span class="item address-info default" v-if="addressObj.address_isDefault === 1">默认地址</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  import {
    checkValue,
  } from '@/assets/js/utils'
  import vNav from '@/components/universal/nav'
  import vFooter from '@/components/universal/footer'

  export default {
    name: 'address',
    data() {
      return {
        username: '',
        options: [{
          text: '地址管理',
        }],
        id: 0,
        address: '',
        zipCode: '',
        consignee: '',
        phone: '',
        isDefault: false,
        addressTip: '',
        zipCodeTip: '',
        consigneeTip: '',
        phoneTip: '',
        addresses: [],
        operation: 0,
      }
    },
    components: {
      vNav,
      vFooter,
    },
    created() {
      this.username = this.$route.params.username
      axios.post('/api/addresses/fetchAddress', {
        username: this.username,
      }).then((res) => {
        this.addresses = res.data
      }).catch((err) => {
        throw err
      })
    },
    computed: {
      getOpeDescription() {
        return this.operation === 0 ? '添加新地址' : '更新地址'
      },
    },
    methods: {
      isNull() {
        return this.address && this.zipCode && this.consignee && this.phone
      },
      goBack() {
        if (this.operation === 1) {
          this.operation = 0
          this.address = ''
          this.zipCode = ''
          this.consignee = ''
          this.phone = ''
        }
        return false
      },
      checkData(type, value) {
        const result = checkValue(type, value)
        if (result !== true && this.operation === 0) {
          this[`${type}Tip`] = result
        }
      },
      clearTip(type) {
        this[`${type}Tip`] = ''
      },
      submitData() {
        if (this.operation === 0) {
          this.addAddress()
        } else {
          this.updateAddress()
        }
        return false
      },
      addAddress() {
        if (this.isNull()) {
          const data = {
            address: this.address,
            consignee: this.consignee,
            phone: this.phone,
            zipCode: this.zipCode,
            isDefault: this.isDefault,
            username: this.username,
          }
          axios.post('/api/addresses/addAddress', data)
            .then((res) => {
              if (res.data.status === 1) {
                this.address = ''
                this.phone = ''
                this.zipCode = ''
                this.consignee = ''
                this.isDefault = false
                axios.post('/api/addresses/fetchAddress', {
                  username: this.username,
                }).then((resInner) => {
                  this.addresses = resInner.data
                }).catch((err) => {
                  throw err
                })
              } else {
                throw Error(res.data.message)
              }
            }).catch((err) => {
              throw err
            })
        }
        return false
      },
      switchToUpdate(address) {
        this.operation = 1
        this.id = address.address_id
        this.address = address.address_address
        this.zipCode = address.address_zipCode
        this.consignee = address.address_consignee
        this.phone = address.address_phone
      },
      updateAddress() {
        if (this.isNull()) {
          const data = {
            address: this.address,
            consignee: this.consignee,
            phone: this.phone,
            zipCode: this.zipCode,
            isDefault: this.isDefault,
            id: this.id,
            username: this.username,
          }
          axios.post('/api/addresses/updateAddress', data)
            .then((res) => {
              if (res.data.status === 1) {
                this.address = ''
                this.phone = ''
                this.zipCode = ''
                this.consignee = ''
                this.isDefault = false
                this.operation = 0
                axios.post('/api/addresses/fetchAddress', {
                  username: this.username,
                }).then((resInner) => {
                  this.addresses = resInner.data
                }).catch((err) => {
                  throw err
                })
              } else {
                throw Error(res.data.message)
              }
            }).catch((err) => {
              throw err
            })
        }
      },
      deleteAddress(address) {
        const data = {
          address_id: address.address_id,
        }
        axios.post('/api/addresses/deleteAddress', data)
          .then((res) => {
            if (res.data.status === 1) {
              axios.post('/api/addresses/fetchAddress', {
                username: this.username,
              }).then((resInner) => {
                this.addresses = resInner.data
              }).catch((err) => {
                throw err
              })
            } else {
              throw Error(res.data.message)
            }
          }).catch((err) => {
            throw err
          })
      },
    },
  }

</script>

<style lang="less">
  .address {
    padding: 0 30px;
    .content-wrapper {
      position: relative;
      width: 80%;
      margin: 0 auto;
      .add-address {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        border-bottom: 1px dashed rgb(0, 0, 0);
        .title {
          margin-bottom: 10px;
          font-size: 20px;
          cursor: pointer;
        }
        .add-items {
          padding: 20px 10px;
          border: 1px solid rgba(147, 153, 159, 0.5);
          border-radius: 10px;
          margin-bottom: 20px;
          .add-item {
            position: relative;
            margin-bottom: 15px;
            .title {
              display: inline-block;
              margin-right: 10px;
              width: 120px;
              vertical-align: top;
              text-align: right;
              font-size: 18px;
            }
            .input {
              padding: 2px;
              font-size: 14px;
            }
            .address-tip {
              display: block;
              padding-left: 132px;
              font-size: 12px;
              color: rgba(255, 0, 0, 0.8)
            }
            &.check {
              margin-top: 20px;
              text-align: center;
              font-size: 14px;
            }
          }
          .submit {
            text-align: center;
            margin-top: 20px;
            .submit-button {
              padding: 3px 15px;
              transition: all ease-in .3s;
              cursor: pointer;
              background: rgba(0, 160, 220, 0.2);
              border-radius: 5px;
              &:hover {
                background: rgb(0, 160, 200);
                color: #fff;
              }
            }
          }
        }
      }
      .existed-address {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .title {
          margin: 20px 0;
          color: #f30;
        }
        .addresses-wrapper {
          width: 740px;
          max-height: 400px;
          border: 1px solid rgba(147, 153, 159, 0.5);
          border-radius: 10px;
          overflow: hidden;
          .addresses {
            width: 100%;
            height: 99%;
            overflow: auto;
            padding-right: 15px;
            .head {
              width: 100%;
              padding: 5px;
              .item {
                padding: 4px;
                color: #fff;
                background: rgba(147, 153, 159, 0.5);
                border-radius: 10px;
                text-align: center;
              }
            }
            .body {
              width: 100%;
              padding: 5px;
              border-bottom: 1px solid rgba(147, 153, 159, 0.5);
              &:last-child {
                border: none;
              }
              .item {
                padding: 4px;
                &.delete,
                &.update {
                  cursor: pointer;
                  color: rgb(0, 160, 220);
                }
                &.update {
                  margin-left: 6px;
                  padding-right: 6px;
                  border-right: 1px dashed rgba(147, 153, 159, 0.5);
                }
                &.default {
                  margin-left: 20px;
                  padding: 2px 5px;
                  border-color: #ff3800;
                  -webkit-border-radius: 3px;
                  -moz-border-radius: 3px;
                  border-radius: 3px;
                  background: #ffd6cc;
                  color: #f30
                }
              }
            }
            .item {
              display: inline-block;
              &.address-consignee {
                width: 60px;
              }
              &.address-detail {
                width: 260px;
              }
              &.address-zipCode {
                width: 60px;
              }
              &.address-phone {
                width: 100px;
              }
              &.address-operation {
                width: 90px;
              }
            }
          }
        }
      }
    }
  }

</style>
