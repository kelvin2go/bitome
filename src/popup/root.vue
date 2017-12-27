<template>
  <div class="container">
    <div class="action">
      <el-switch
        v-model="useUSD"
        active-text="USD"
        inactive-text="BTC">
      </el-switch>
    </div>
    <ul>
      <CryptoCard
        v-for="(crypto,index) in cryptos"
        :key="crypto.id"
        :useUSD="useUSD"
        :symbol="crypto.symbol"
        :name="crypto.name"
        :price_btc="crypto.price_btc"
        :price_usd="crypto.price_usd"
        :percent_change_1h="crypto.percent_change_1h"
        :percent_change_24h="crypto.percent_change_24h"
        :detail_show="showlist[index]"
        v-on:show="showCrypto(index)"
      >
      </CryptoCard>
    </ul>
  </div>
</template>
<script>
  import API from '../api'
  import CryptoCard from '../crypto/cryptoCard.vue'
  export default {
    data: () => ({
      cryptos: {},
      useUSD: true
    }),
    computed: {
      showlist () {
        return Object.keys(this.cryptos).reduce((pre, current) => {
          pre[current] = false
          return pre
        }, {})
      }
    },
    components: {
      CryptoCard
    },
    created () {
      const that = this
      API.CRYPTO.getCryptoPrice().then(response => {
        that.cryptos = response.data
        console.log(that.cryptos)
      }).catch(e => {
        this.error = e
      })
    },
    mounted () { },
    methods: {
      showCrypto (index) {
        console.log(this.showlist)
        if (index in this.showlist) {
          this.showlist[index] = !this.showlist[index]
        } else {
          this.showlist[index] = true
        }
      }
    },
    filters: {
      pretty: (value) => {
        return value ? JSON.stringify(value, null, 2) : ''
      }
    }
  }
</script>
<style lang="scss" scoped>
  .container{
    width: 180px;
    height: 300px;
  }
  .action{
    height: auto;
    text-align: right;
  }
  ul {
    list-style: none;
    padding:0;
  }
</style>
