<template>
  <div class="star" :class="starType">
    <span v-for="(itemClass,index) in itemClasses" :class="itemClass" class="star-item" :key="index"></span>
  </div>
</template>

<script type="text/ecmascript-6">
  const LENGTH = 5
  const CLS_ON = 'on'
  const CLS_HALF = 'half'
  const CLS_OFF = 'off'

  export default {
    props: {
      size: {
        type: Number,
      },
      score: {
        type: Number,
      },
    },
    computed: {
      starType() {
        return `star-${this.size}`
      },
      itemClasses() {
        const result = []
        const score = Math.floor(this.score * 2) / 2
        const hasDecimal = score % 1 !== 0
        const interger = Math.floor(score)
        for (let i = 0; i < interger; i += 1) {
          result.push(CLS_ON)
        }
        if (hasDecimal) {
          result.push(CLS_HALF)
        }
        while (result.length < LENGTH) {
          result.push(CLS_OFF)
        }
        return result
      },
    },
  }

</script>

<style lang="less">
  @import "../../assets/less/mixin.less";

  .star {
    font-size: 0;
    display: inline-block;
    .star-item {
      display: inline-block;
      background-repeat: no-repeat;
    }
    &.star-48 {
      .star-item {
        width: 20px;
        height: 20px;
        margin-right: 22px;
        background-size: 20px 20px;
        &:last-child {
          margin-right: 0;
        }
        &.on {
          .bg-image("star48_on", "star");
        }
        &.half {
          .bg-image("star48_half", "star");
        }
        &.off {
          .bg-image("star48_off", "star");
        }
      }
    }
    &.star-36 {
      .star-item {
        width: 15px;
        height: 15px;
        margin-right: 16px;
        background-size: 15px 15px;
        &:last-child {
          margin-right: 0;
        }
        &.on {
          .bg-image("star36_on", "star");
        }
        &.half {
          .bg-image("star36_half", "star");
        }
        &.off {
          .bg-image("star36_off", "star");
        }
      }
    }
    &.star-24 {
      .star-item {
        width: 10px;
        height: 10px;
        margin-right: 3px;
        background-size: 10px 10px;
        &:last-child {
          margin-right: 0;
        }
        &.on {
          .bg-image("star24_on", "star");
        }
        &.half {
          .bg-image("star24_half", "star");
        }
        &.off {
          .bg-image("star24_off", "star");
        }
      }
    }
  }

</style>
