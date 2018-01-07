<template>
  <div class="container">

    <el-tabs tab-position="right">
      <el-tab-pane><span slot="label"><font-awesome-icon id="page-price" icon="chart-line"/> </span>
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
      <el-tab-pane><span slot="label"><font-awesome-icon id="page-alert" icon="bell"/></span>
          <AllDropDown
            :cryptos="allCryptos"
            v-on:selectedCrypto="setAlert"
          />
        </br>
          <Alert
            :alertCrypto="selectedCrypto"
            :useUSD="useUSD"
          ></Alert>
      </el-tab-pane>
      <el-tab-pane label="Config"><span slot="label"><font-awesome-icon id="page-config" icon="cog"/></span>

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
  import _ from 'lodash'
  import API from '../api'
  import CryptoCard from '../crypto/cryptoCard.vue'
  import AllDropDown from '../crypto/allDropDown.vue'
  import Alert from '../crypto/alert.vue'
  export default {
    data: () => ({
      cryptos: {},
      allCryptos: {},
      useUSD: true,
      selectedCrypto: ''
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
      Alert,
      AllDropDown
    },
    created () {
      const that = this
      const getTop10 = () => {
        API.Crypto.getCryptoPrice().then(response => {
          that.cryptos = response.data
        }).catch(e => {
          this.error = e
        })
      }
      getTop10()
      setInterval(getTop10, 60 * 1000)

      API.Crypto.getAllCryptoPrice().then(response => {
        that.allCryptos = _.forEach(response.data, (value, key) => {
          value['value'] = value.symbol
        })
      }).catch(e => {
        this.error = e
      })
    },
    mounted () {
      this.$gtm.trackView('popup', '/popup.html')
    },
    methods: {
      showCrypto (index) {
        if (index in this.showlist) {
          this.showlist[index] = !this.showlist[index]
        } else {
          this.showlist[index] = true
        }
      },
      setAlert (selectedAlert) {
        if (selectedAlert) {
          this.selectedCrypto = selectedAlert
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
<style lang="scss">
  .container{
    font-size: 14px;
    height: auto;
    width: 250px;
    min-height: 300px;
    min-width: 250px;
  }
  .el-tabs__item{
    padding: 0 0 0 7px;
  }
  .el-tabs {
    &.el-tabs--right{
      height: 100%;
      .el-tabs__header{
        margin-right: 4px;
      }
      .el-tabs__content{
        height: 100%;
      }
    }
  }
</style>
