<template>
  <div class="container">

    <el-tabs tab-position="right">
      <el-tab-pane><span slot="label"><font-awesome-icon icon="chart-line"/> </span>
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
      </el-tab-pane>
      <el-tab-pane><span slot="label"><font-awesome-icon icon="bell"/></span>
          <Alert></Alert>
      </el-tab-pane>
      <el-tab-pane label="Config"><span slot="label"><font-awesome-icon icon="cog"/></span>

        <div class="action">
          <el-switch
            v-model="useUSD"
            active-text="USD"
            inactive-text="BTC"
          >
          </el-switch>
        </div>

      </el-tab-pane>
    </el-tab-pane>
    </el-tabs>

  </div>
</template>
<script>
  import API from '../api'
  import CryptoCard from '../crypto/cryptoCard.vue'
  import Alert from '../crypto/alert.vue'
  import debug from '../utils/debug'
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
      CryptoCard,
      Alert
    },
    created () {
      const that = this
      API.Crypto.getCryptoPrice().then(response => {
        that.cryptos = response.data
        debug.log(that.cryptos)
      }).catch(e => {
        this.error = e
      })
    },
    mounted () {
      this.$gtm.trackView('popup', '/popup.html')
    },
    methods: {
      showCrypto (index) {
        debug.log(this.showlist)
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
    width: 250px;
    height: 300px;
  }
  .el-switch{
    font-size: 20px;
  }
  .action{
    height: auto;
    text-align: right;
  }
  ul {
    list-style: none;
    padding:0;
    margin-top: 0px;
  }

</style>
<style>
.el-tabs__item{
  padding: 0 0 0 7px;
}
.el-tabs--right .el-tabs__header{
  maring-right: 4px;
}
</style>
