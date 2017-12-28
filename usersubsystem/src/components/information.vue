<template>
  <div class='information'>
    <div class="nav-wrapper">
      <v-nav :title="'我的信息'" :options="options"></v-nav>
    </div>
    <div class="content-wrapper">
      <div class="left-content">
        <h1 class="username">{{briefInfo.username}}</h1>
        <div class="avatar">
          <img :src="getAvatarSrc" alt="avatar">
          <input type="file" accept="image/*" class="upload" @change="onFileChange($event)">
        </div>
        <div class="grade">
          <img class="logo" src="../../static/images/information/level.png" alt="">
          <span class="desc">等级</span>
          <span class="value grade-value">{{briefInfo.grade}}</span>
        </div>
        <div class="integral">
          <img class="logo" src="../../static/images/information/integral.png" alt="">
          <span class="desc">积分</span>
          <span class="value integral-value">{{briefInfo.integral}}</span>
        </div>
        <div class="gold">
          <img class="logo" src="../../static/images/information/gold.png" alt="">
          <span class="desc">金币</span>
          <span class="value gold-value">{{briefInfo.gold}}</span>
        </div>
        <span class="click" @click="addGold">{{signin}}</span>
      </div>
      <div class="right-content">
        <h1 class="title">详细资料</h1>
        <ul class="details">
          <li v-for="(info,infoIndex) in detailInfo" :key="infoIndex" class="info-detail">
            <span class="info-type">{{detailType[infoIndex]}}</span>
            <span class="info-text" v-if="!editMode || !changedType.includes(detailTypeUs[infoIndex])">{{info}}</span>
            <input type="text" class="info-update" :value="info" v-if="editMode && changedType.includes(detailTypeUs[infoIndex])">
          </li>
        </ul>
        <div class="edit">
          <span class="edit-button password" v-if="editMode" @click="goPassport">修改密码</span>
          <span class="edit-button" @click="switchEditMode($event)">{{getEditText}}</span>
        </div>
      </div>
    </div>
    <div class="advertisement">用户推荐位置招租</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import axios from 'axios'
  import router from '@/router'
  import vNav from '@/components/nav'

  export default {
    name: 'information',
    data() {
      return {
        username: '',
        options: [{
          text: '账户设置',
        }],
        signin: '签',
        editMode: false,
        editOption: true,
        avatarSrc: '',
        briefInfo: {},
        detailInfo: [],
        detailType: ['用户名', '邮箱', '手机号码', '真实姓名', '身份证', '签名'],
        detailTypeUs: [],
        changedType: ['email', 'phone', 'signature'],
      }
    },
    computed: {
      getAvatarSrc() {
        return this.briefInfo.avatar === null ? 'http://localhost:3000/defaultAvatar.jpg' : this.briefInfo.avatar
      },
      getEditText() {
        return this.editOption === true ? '编辑资料' : '保存更改'
      },
    },
    components: {
      vNav,
    },
    created() {
      this.username = this.$route.params.username
      axios.post('/api/users/fetchInfo', {
        username: this.username,
        type: 'consumer',
      }).then((res) => {
        this.briefInfo = res.data[0]
        for (const key in res.data[1]) {
          this.detailInfo.push(res.data[1][key])
          this.detailTypeUs.push(key)
        }
      }).catch((err) => {
        throw err
      })
    },
    methods: {
      switchEditMode(e) {
        if (this.editMode === true) {
          this.updateInformation(e)
        }
        this.editMode = !this.editMode
        this.editOption = !this.editOption
      },
      updateInformation(e) {
        const listArray = e.target.parentNode.parentNode.querySelectorAll('.info-update')
        const data = {
          type: 'consumer',
        }
        Array.prototype.forEach.call(listArray, (element, index) => {
          const key = this.changedType[index]
          const value = element.value
          data[key] = value
        })
        data.username = this.username
        axios.post('/api/users/updateInfo', data)
          .then((res) => {
            if (res.data.status === 1) {
              axios.post('/api/users/fetchInfo', {
                username: this.username,
                type: 'consumer',
              }).then((resInner) => {
                this.detailInfo = []
                for (const key in resInner.data[1]) {
                  this.detailInfo.push(resInner.data[1][key])
                }
              }).catch((err) => {
                throw err
              })
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
        data.append('avatar', file)
        data.append('username', this.username)
        const reader = new FileReader()
        reader.onload = () => {
          this.avatarSrc = e.target.result
        }
        axios.post('/api/users/changeAvatar', data, {
          header: {
            'Content-Type': 'multipart/form-data',
          },
        }).then((res) => {
          if (res.data.status === 1) {
            axios.post('/api/users/fetchInfo', {
              username: this.username,
              type: 'consumer',
            }).then((resInner) => {
              this.briefInfo.avatar = resInner.data[0].avatar
            }).catch((err) => {
              throw err
            })
          } else {
            throw Error(res.data.message)
          }
          reader.readAsDataURL(file)
        }).catch((err) => {
          throw err
        })
      },
      addGold() {
        const date = new Date().getTime()
        axios.post('/api/users/addGold', {
          username: this.username,
          date: date,
        }).then((res) => {
          if (res.status === 1) {
            this.briefInfo.gold += 5
          }
        }).catch((err) => {
          throw err
        })
      },
      goPassport() {
        router.push('/passport')
      },
    },
  }

</script>

<style lang="less">
  .information {
    padding: 0 30px;
    .content-wrapper {
      position: relative;
      display: flex;
      .left-content {
        position: relative;
        flex: 0 0 400px;
        transition: all .3s ease-out;
        border-radius: 10px;
        background: #f3f5f7;
        box-shadow: 0px 0px 3px #000;
        &:hover {
          background: rgba(147, 153, 159, 0.1);
          box-shadow: 1px 1px 3px rgb(0, 160, 220);
        }
        .avatar {
          position: relative;
          width: 100%;
          margin-top: 20px;
          text-align: center;
          img {
            width: 120px;
            height: 120px;
            border-radius: 50%;
          }
          .upload {
            position: absolute;
            width: 30%;
            height: 100%;
            left: 35%;
            z-index: 1000;
            cursor: pointer;
            opacity: 0;
          }
        }
        .username {
          text-align: center;
          font-size: 26px;
          font-family: '楷体';
          text-shadow: 1px 2px 2px rgb(0, 0, 0);
        }
        .grade,
        .integral,
        .gold {
          margin: 10px auto 0;
          width: 40%;
          padding-left: 40px;
          font-size: 0;
          .logo {
            width: 24px;
            height: 24px;
            margin-right: 5px;
          }
          .desc {
            margin-right: 20px;
            font-weight: 700;
          }
          .desc,
          .value {
            display: inline-block;
            vertical-align: top;
            line-height: 24px;
            height: 24px;
            font-size: 16px;
            &.grade-value {
              padding: 0 6px;
              border-radius: 50%;
              background: rgba(0, 0, 0, 0.5);
              color: #fff;
            }
            &.integral-value {
              padding: 0 6px;
              border-radius: 50%;
              background: rgba(0, 160, 220, 0.8);
              color: #fff;
            }
            &.gold-value {
              padding: 0 6px;
              border-radius: 50%;
              background: rgb(253, 208, 101);
              color: #fff;
            }
          }
        }
        .click {
          position: absolute;
          display: block;
          top: 0;
          right: 0;
          padding: 5px;
          cursor: pointer;
          font-size: 14px;
          border-radius: 50%;
          background: rgba(147, 153, 159, 0.6);
          z-index: 1000;
          &:hover {
            background: rgb(0, 160, 220);
            color: #f3f5f7;
          }
        }
      }
      .right-content {
        position: relative;
        flex: 1;
        padding: 10px 20px 20px 20px;
        .title {
          font-size: 22px;
          font-weight: 700;
          text-indent: 20px;
          margin-bottom: 20px;
        }
        .details {
          padding-left: 20px;
          .info-detail {
            padding: 10px 0;
            border-bottom: 1px solid rgba(147, 153, 159, 0.2);
            &:last-child {
              border: none;
            }
            .info-type {
              display: inline-block;
              width: 64px;
              padding: 2px;
              margin-right: 30px;
              font-weight: 700;
            }
            .info-update {
              display: inline-block;
              vertical-align: top;
              padding: 2px;
              font-size: 14px;
            }
          }
        }
        .edit {
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
    .advertisement {
      margin-top: 200px;
      text-align: center;
      font-size: 40px;
      color: rgba(147, 153, 159, 0.6)
    }
  }

</style>
