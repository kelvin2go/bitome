<template>
  <div>
    <el-button @click="pushMsg"> click me </el-button>
  </div>
</template>
<script>
  import API from '../api'
  export default {
    data: () => ({

    }),

    computed: {
    },
    props: ['symbol', 'name', 'price_usd', 'price_btc', 'detail_show', 'useUSD', 'percent_change_24h', 'percent_change_1h'],
    methods: {
      pushMsg () {
        API.Notify.send()
      }
    }
  }
</script>
<style lang="scss">

</style>
