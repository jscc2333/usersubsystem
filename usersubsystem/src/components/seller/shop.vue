<template>
  <div class='shop'>
    <div class="nav-wrapper">
      <v-nav :title="'我的店铺'" :options="options"></v-nav>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import vNav from '@/components/universal/nav'

export default {
  name: 'shop',
  data() {
    return {
      username: '',
      options: [{
        text: '店铺管理',
      }],
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


</style>
