<template>
  <div class='evaluation'>
    <div class="nav-wrapper">
      <v-nav :title="'我的评价'" :options="options"></v-nav>
    </div>
    <div class="content-wrapper">
      <ul class="evaluations">
        <li v-for="(evaluation,evaluationIndex) in evaluations" :key="evaluationIndex" class="item">
          <div class="good">
            <img :src="evaluation.img" alt="" class="good-image">
            <span class="good-name">{{evaluation.good}}</span>
          </div>
          <div class="judge" v-if="evaluation.evaluation">
            <div class="star-wrapper">
              <star :size="24" :score="evaluation.star"></star>
            </div>
            <span class="text">{{evaluation.evaluation}}</span>
          </div>
          <span class="time" v-if="evaluation.time">{{evaluation.time}}</span>
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
  import {
    mapGetters,
  } from 'vuex'
  import vNav from '@/components/nav'
  import star from '@/components/star/star'

  export default {
    name: 'order',
    data() {
      return {
        username: '',
        options: [{
          text: '已评价',
        },
        {
          text: '待评价',
        },
        ],
        evaluations: [],
        api: '',
        page: 0,
        max: false,
      }
    },
    components: {
      vNav,
      star,
    },
    watch: {
      switch() {
        if (this.$store.state.switch === 0) {
          this.api = '/api/evaluations/fetchEvaluated'
          axios.post(this.api, {
            page: 0,
          }).then((res) => {
            this.evaluations = res.data
          }).catch((err) => {
            throw err
          })
        } else {
          this.api = '/api/evaluations/fetchToevaluate'
          axios.post(this.api, {
            page: 0,
          }).then((res) => {
            this.evaluations = res.data
          }).catch((err) => {
            throw err
          })
        }
      },
    },
    created() {
      this.username = this.$route.params.username
      this.api = '/api/evaluations/fetchEvaluated'
      axios
        .post(this.api, {
          page: this.page,
        })
        .then((res) => {
          this.evaluations = res.data
          if (this.evaluations.length < 4) {
            this.max = true
          }
        })
        .catch((err) => {
          throw err
        })
    },
    computed: {
      ...mapGetters({
        switch: 'getSwitch',
      }),
    },
    methods: {
      goPrePage() {
        if (this.page === 0) {
          return false
        }
        this.page -= 1
        if (this.max) {
          this.max = false
        }
        axios
          .post(this.api, {
            page: this.page,
          })
          .then((res) => {
            this.evaluations = res.data
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
          .post(this.api, {
            page: this.page,
          })
          .then((res) => {
            this.evaluations = res.data
            if (this.evaluations.length < 4) {
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
  .evaluation {
    padding: 0 30px;
    .content-wrapper {
      position: relative;
      width: 80%;
      margin: 0 auto;
      .evaluations {
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
          &:last-child {
            margin-bottom: 0;
          }
          &:hover {
            background: rgba(147, 153, 159, 0.1);
            box-shadow: 0 0 5px #fff;
          }
          .good,
          .judge {
            display: inline-block;
            vertical-align: top;
          }
          .good {
            width: 13%;
            margin-right: 30px;
            .good-image {
              display: block;
              width: 100%;
              height: 100%;
              border-radius: 5px;
            }
            .good-name {
              display: inline-block;
              width: 100%;
              padding: 10px;
            }
          }
          .judge {
            .star-wrapper {
              margin-bottom: 30px;
            }
            .text {
              font-size: 16px;
            }
          }
          .time {
            position: absolute;
            right: 20px;
            top: 20px;
          }
        }
      }
      .choose-page {
        width: 100%;
        margin-top: 20px;
        text-align: right;
        .pre,
        .next {
          display: inline-block;
          padding: 4px 10px;
          transition: all 0.3s ease;
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
