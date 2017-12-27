<template>
  <div class='order'>
    <div class="nav-wrapper">
      <div class="nav-wrapper">
      <v-nav :title="'我的订单'" :options="options"></v-nav>
    </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import vNav from '@/components/nav'

  export default {
    name: 'order',
    data() {
      return {
        username: '',
        options: [
          {
            text: '所有订单',
          },
        ],
      }
    },
    components: {
      vNav,
    },
    created() {
      this.username = this.$route.params.username
    },
  }

</script>

<style lang="less">
  .order{
    padding: 0 30px;
  }
</style>
