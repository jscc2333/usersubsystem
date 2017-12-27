<template>
  <div class='nav'>
    <h1 class="title">{{title}}</h1>
    <div class="options-wrapper">
      <ul class="options">
        <li class="option" v-for="(option,optionIndex) in options" :key="optionIndex" @click="changeContent(optionIndex)">
          {{option.text}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'nav',
    data() {
      return {}
    },
    props: {
      title: {
        type: String,
        default: '',
      },
      options: {
        type: Array,
        default: [],
      },
    },
    methods: {
      changeContent(index) {
        this.$store.commit('changeSwitch', index)
      },
    },
  }

</script>

<style lang="less">
  .nav {
    padding: 20px 0;
    color: #fff;
    font-size: 24px;
    .title {
      float: left;
      margin-right: 60px;
      font-family: '楷体'
    }
    .options-wrapper {
      float: left;
      .option {
        float: left;
        margin-right: 20px;
        cursor: pointer;
        &:last-child {
          margin: 0;
        }
      }
    }
    &:after {
      display: table;
      content: '';
      clear: both;
    }
  }

</style>
