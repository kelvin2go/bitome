<template>
  <div class="container">
    <el-tabs tab-position="right">
      <div v-show="cryptos == {}">
        <font-awesome-icon icon="spinner"/>
      </div>
      <el-tab-pane><span slot="label"><font-awesome-icon id="page-price" icon="chart-line"/> </span>
        <el-row class="header" :gutter="10">
          <el-col :xs="15">
            <AllDropDown
              :cryptos="allCryptos"
              placeholder="Search symbol"
              v-on:selectedCrypto="addUserCrypto"
            />
          </el-col>
          <el-select class="select":xs="7" v-model="currentCurrency.value">
            <el-option
              v-for="item in currencys"
              :key="`currencys-${item.value}`"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-row>
        <ul>
          <CryptoCard
            v-for="(crypto,index) in userCryptos"
            :key="crypto.id"
            :useUSD="settings.useUSD"
            :useRedUp="settings.useRedUp"
            :symbol="crypto.symbol"
            :name="crypto.name"
            :price_btc="crypto.price_btc"
            :price_usd="crypto.price_usd"
            :currency_price="crypto[`price_${currencyLowerCase}`]"
            :percent_change_1h="crypto.percent_change_1h"
            :percent_change_24h="crypto.percent_change_24h"
            :detail_show="showlist[index]"
            :currencyDisplay="currencyDisplay"
            haveRemove="true"
            v-on:show="showCrypto(index)"
            v-on:removeMyCrypto="removeUserCrypto(index)"
          >
          </CryptoCard>
          <li></li>
          <CryptoCard
            v-for="(crypto,index) in cryptos"
            :key="crypto.id"
            :useUSD="settings.useUSD"
            :useRedUp="settings.useRedUp"
            :symbol="crypto.symbol"
            :name="crypto.name"
            :price_btc="crypto.price_btc"
            :price_usd="crypto.price_usd"
            :currency_price="crypto[`price_${currencyLowerCase}`]"
            :percent_change_1h="crypto.percent_change_1h"
            :percent_change_24h="crypto.percent_change_24h"
            :detail_show="showlist[index]"
            :currencyDisplay="currencyDisplay"
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
            :useUSD="settings.useUSD"
            :useRedUp="settings.useRedUp"
            :currencyDisplay="currencyDisplay"
          ></Alert>
      </el-tab-pane>
      <el-tab-pane label="Config"><span slot="label"><font-awesome-icon id="page-config" icon="cog"/></span>
        <div class="action">
          <el-row :gutter="10">
            <el-col :xs="24">
              <el-switch
                v-model="useUSD"
                :active-text="currencyDisplay"
                inactive-text="BTC"
              >
              </el-switch>
            </el-col>
            <el-col :xs="24">
              Raise color:
              <el-switch
                v-model="useRedUp"
                active-color="#ff4949"
                inactive-color="#13ce66"
              >
              </el-switch>
            </el-col>
          </el-row :gutter="10">
            <el-col :xs="24" class="large">
              <el-col :xs="10">Currencys: </el-col>
              <el-select class="select":xs="7" v-model="currentCurrency.value">
                <el-option
                  v-for="item in currencys"
                  :key="`currencys-${item.value}`"
                  :value="item.value"
                >
                </el-option>
              </el-select>
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
  import _forEach from 'lodash/forEach'
  import _isEmpty from 'lodash/isEmpty'
  import _intersectionBy from 'lodash/intersectionBy'
  import API from '../api'
  import CryptoCard from '../crypto/cryptoCard.vue'
  import AllDropDown from '../crypto/allDropDown.vue'
  import CONFIG from '../utils/config'
  import Alert from '../crypto/alert.vue'
  import store from '../ext/storage'
  const CRYPTO_DB_NAME = 'mycrypto'
  const SETTING_DB_NAME = 'settings'

  export default {
    data: () => ({
      cryptos: [],
      userCryptos: [],
      allCryptos: [],
      useUSD: true,
      selectedCrypto: '',
      showChat: false,
      useRedUp: false,
      currentCurrency: {
        value: 'USD'
      },
      inited: false,
      currencys: CONFIG.currencys
    }),
    computed: {
      settings () {
        const setting = {
          useRedUp: this.useRedUp,
          useUSD: this.useUSD,
          currentCurrency: this.currentCurrency
        }
        if (this.inited) {
          store.set(SETTING_DB_NAME, setting)
        }
        return setting
      },
      currencyLowerCase () {
        return this.currentCurrency.value.toLowerCase()
      },
      currencyDisplay () {
        this.getTop10()
        this.getAllCrypto()
        return this.currentCurrency.value
      },
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
      this.getAllCrypto()
      store.get(CRYPTO_DB_NAME)
        .then((db) => {
          if (!_isEmpty(db[CRYPTO_DB_NAME])) {
            that.userCryptos = db[CRYPTO_DB_NAME]
          }
        })
      store.get(SETTING_DB_NAME)
        .then((db) => {
          if (!_isEmpty(db[SETTING_DB_NAME])) {
            if ('useRedup' in db[SETTING_DB_NAME]) {
              that.useRedUp = db[SETTING_DB_NAME].useRedUp
            }
            if ('currentCurrency' in db[SETTING_DB_NAME]) {
              that.currentCurrency = db[SETTING_DB_NAME].currentCurrency
            }
            if ('useUSD' in db[SETTING_DB_NAME]) {
              that.useUSD = db[SETTING_DB_NAME].useUSD
            }
          }
        }).then(() => {
          that.inited = true
        })
      this.$gtm.trackView('popup', '/popup.html')
    },
    methods: {
      getAllCrypto () {
        const that = this
        API.Crypto.getAllCryptoPrice().then(response => {
          that.allCryptos = _forEach(response.data, (value, key) => {
            value['value'] = value.symbol
          })
          that.userCryptos = _intersectionBy(response.data, that.userCryptos, 'id')
        }).catch(e => {
          this.error = e
        })
      },
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
    },
    watch: {}
  }
</script>
<style lang="scss" scoped>
  .el-switch{
    font-size: 20px;
  }
  .action{
    height: auto;
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
    .header{
      &.el-row{
        padding-bottom: 4px;
      }
      .el-col{
        height: 30px;
      }
      .select .el-input--suffix .el-input__inner {
        height: 32px;
      }
    }
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
        min-height: 300px;
      }
    }
  }
  .select{
    .el-input--suffix .el-input__inner{
      width: 80px;
      height: 26px;
    }
  }
  #pane-3{
    padding-right: 28px;
  }
</style>
