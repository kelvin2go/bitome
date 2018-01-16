<template>
  <div class="container">

    <el-tabs tab-position="right">
      <div v-show="cryptos == {}">
        <font-awesome-icon icon="spinner"/>
      </div>
      <el-tab-pane><span slot="label"><font-awesome-icon id="page-price" icon="chart-line"/> </span>
        <AllDropDown
          :cryptos="allCryptos"
          placeholder="Search symbol"
          v-on:selectedCrypto="addUserCrypto"
        />
        <ul>
          <CryptoCard
            v-for="(crypto,index) in userCryptos"
            :key="crypto.id"
            :useUSD="useUSD"
            :useRedUp="useRedUp"
            :symbol="crypto.symbol"
            :name="crypto.name"
            :price_btc="crypto.price_btc"
            :price_usd="crypto.price_usd"
            :percent_change_1h="crypto.percent_change_1h"
            :percent_change_24h="crypto.percent_change_24h"
            :detail_show="showlist[index]"
            haveRemove="true"
            v-on:show="showCrypto(index)"
            v-on:removeMyCrypto="removeUserCrypto(index)"
          >
          </CryptoCard>
          <li></li>
          <CryptoCard
            v-for="(crypto,index) in cryptos"
            :key="crypto.id"
            :useUSD="useUSD"
            :useRedUp="useRedUp"
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
            placeholder="Crypto Symbol"
          />
        </br>
          <Alert
            :alertCrypto="selectedCrypto"
            :useUSD="useUSD"
          ></Alert>
      </el-tab-pane>
      <el-tab-pane label="Config"><span slot="label"><font-awesome-icon id="page-config" icon="cog"/></span>
        <div class="action">
          <el-row>
            <el-col :xs="24">
              <el-switch
                v-model="useUSD"
                active-text="USD"
                inactive-text="BTC"
              >
              </el-switch>
            </el-col>
            <el-col :xs="24">
              Raise color
              <el-switch
                v-model="useRedUp"
                active-color="#ff4949"
                inactive-color="#13ce66"
              >
              </el-switch>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="chatroom" ><span slot="label" @click="showChat=true"><font-awesome-icon id="page-chatroom" icon="comments"/></span>
        <div v-if="showChat" class="chatContainer">
          <iframe src="https://titanembeds.com/embed/399447374294024202?theme=DiscordDark" height="600" width="400" frameborder="0"></iframe>
        </div>
      </el-tab-pane>
    </el-tab-pane>
    </el-tabs>

  </div>
</template>
<script>
  import Vue from 'vue'
  import _ from 'lodash'
  import API from '../api'
  import CryptoCard from '../crypto/cryptoCard.vue'
  import AllDropDown from '../crypto/allDropDown.vue'
  import Alert from '../crypto/alert.vue'
  import store from '../ext/storage'
  const CRYPTO_DB_NAME = 'mycrypto'

  export default {
    data: () => ({
      cryptos: [],
      userCryptos: [],
      allCryptos: [],
      useUSD: true,
      useRedUp: false,
      selectedCrypto: '',
      showChat: false
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
    beforeCreated () {
      this.getTop10()
    },
    created () {
      const that = this
      setInterval(this.getTop10(), 60 * 1000)

      API.Crypto.getAllCryptoPrice().then(response => {
        that.allCryptos = _.forEach(response.data, (value, key) => {
          value['value'] = value.symbol
        })
      }).catch(e => {
        this.error = e
      })

      store.get(CRYPTO_DB_NAME)
        .then((db) => {
          if (!_.isEmpty(db[CRYPTO_DB_NAME])) {
            that.userCryptos = db[CRYPTO_DB_NAME]
          }
        })
    },
    mounted () {
      this.$gtm.trackView('popup', '/popup.html')
    },
    methods: {
      getTop10 () {
        const that = this
        API.Crypto.getCryptoPrice().then(response => {
          that.cryptos = response.data
        }).catch(e => {
          this.error = e
        })
      },
      addUserCrypto (crypto) {
        this.userCryptos.push(crypto)
        store.set(CRYPTO_DB_NAME, this.userCryptos)
      },
      removeUserCrypto (cryptoID) {
        Vue.delete(this.userCryptos, cryptoID)
        store.set(CRYPTO_DB_NAME, this.userCryptos)
      },
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
  .chatContainer{
    height: auto;
  }
</style>
<style lang="scss">
  .container{
    font-size: 14px;
    height: auto;
    width: auto;
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
        margin-right: 3px;
        margin-left: 2px
      }
      .el-tabs__content{
        height: 100%;
      }
    }
  }
  #pane-3{
    padding-right: 28px;
  }
</style>
