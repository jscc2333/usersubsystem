<template>
  <div class='seller-evaluation'>
    <div class="nav-wrapper">
      <v-nav :title="'店铺评价'" :options="options"></v-nav>
    </div>
    <div class="content-wrapper">
      <ul class="evaluations">
        <li v-for="(evaluation,evaluationIndex) in evaluations" :key="evaluationIndex" class="item">
          <div class="good">
            <img :src="evaluation.img" alt="" class="good-image">
          </div>
          <div class="judge" v-if="evaluation.evaluation">
            <div class="star-wrapper">
              <star :size="24" :score="evaluation.star"></star>
            </div>
             <span class="good-name">[{{evaluation.good}}]</span>
            <span class="name">{{evaluation.username}}:</span>
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
  import vNav from '@/components/universal/nav'
  import star from '@/components/star/star'

  export default {
    name: 'sEvaluation',
    data() {
      return {
        username: '',
        options: [{
          text: '所有评价',
        }],
        evaluations: [],
        page: 0,
        max: false,
      }
    },
    components: {
      vNav,
      star,
    },
    created() {
      axios.post('/api/sEvaluations/fetchEvaluations', {
        page: this.page,
      }).then((res) => {
        this.evaluations = res.data
        if (this.evaluations.length < 8) {
          this.max = true
        }
      }).catch((err) => {
        throw err
      })
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
        axios.post('/api/sEvaluations/fetchEvaluations', {
          page: this.page,
        }).then((res) => {
          this.evaluations = res.data
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
        axios.post('/api/sEvaluations/fetchEvaluations', {
          page: this.page,
        }).then((res) => {
          this.evaluations = res.data
          if (this.evaluations.length < 8) {
            this.max = true
          }
        }).catch((err) => {
          throw err
        })
        return true
      },
    },
  }

</script>

<style lang="less">
.seller-evaluation {
    padding: 0 30px;
    .content-wrapper {
      position: relative;
      width: 70%;
      margin: 0 auto;
      .evaluations {
        width: 100%;
        .item {
          position: relative;
          padding: 10px;
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
            margin-right: 30px;
            .good-image {
              display: block;
              width: 40px;
              height: 40px;
              border-radius: 5px;
            }
          }
          .judge {
            font-size: 14px;
            .star-wrapper {
              margin-bottom: 30px;
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
