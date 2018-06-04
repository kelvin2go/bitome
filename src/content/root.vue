<template>
  <div class="top-bar" :class="[{'active': settings.marquee, 'hidebar': hide}]" v-if="settings.marquee">
    <Marquee
      :cryptos="joinCryptos"
      :useUSD="settings.useUSD"
      :useRedUp="settings.useRedUp"
      :currencyDisplay="currencyDisplay"
      :currencyLowerCase="currencyLowerCase"
      @cancelMarquee="cancelMarquee"
      @collapseContainer="collapseContainer"
    />
  </div>
</template>
<script>
import _isEmpty from 'lodash/isEmpty'
import _forEach from 'lodash/forEach'
import _intersectionBy from 'lodash/intersectionBy'

import API from '../api'
import CONFIG from '../utils/config'
import store from '../ext/storage'
import Marquee from './marquee.vue'
const CRYPTO_DB_NAME = 'mycrypto'
const SETTING_DB_NAME = 'settings'

export default {
  data: () => ({
    cryptos: [],
    userCryptos: [],
    allCryptos: [],
    hide: false,
    settings: {
      currentCurrency: {
        value: 'USD'
      },
      marquee: true,
      useRedUp: false,
      useUSD: true
    },
    currencys: CONFIG.currencys
  }),
  computed: {
    joinCryptos () {
      const ary = []
      this.userCryptos.forEach((element) => {
        ary.push(element)
      })
      this.cryptos.forEach((element) => {
        ary.push(element)
      })
      return ary
    },
    currencyLowerCase () {
      return this.settings.currentCurrency.value.toLowerCase()
    },
    currencyDisplay () {
      return this.settings.currentCurrency.value
    }
  },
  created () {
    const that = this
    this.getTop10()
    this.getAllCrypto()
    setInterval(this.loadSettings, 5 * 1000)
    setInterval(this.getTop10, 30 * 1000)
    store.get(CRYPTO_DB_NAME)
      .then((db) => {
        if (!_isEmpty(db[CRYPTO_DB_NAME])) {
          that.userCryptos = db[CRYPTO_DB_NAME]
        }
      })
  },
  mounted () { },
  methods: {
    collapseContainer (collapse) {
      this.hide = collapse
    },
    cancelMarquee () {
      this.settings.marquee = false
      this.saveSettings()
    },
    loadSettings () {
      const that = this
      store.get(SETTING_DB_NAME)
        .then((db) => {
          if (JSON.stringify(this.settings) === JSON.stringify(db[SETTING_DB_NAME])) {
            return
          }
          const settings = db[SETTING_DB_NAME] || {}
          return settings
        }).then((savedSettings) => {
          if (savedSettings) {
            that.settings = savedSettings
          }
        })
    },
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
    }
  },
  components: {
    Marquee
  }
}
</script>
<style lang="scss">
  .top-bar {
    &.active {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      min-height: 18px;
      height: 18px;
      background: white;
      z-index: 999999999;
      border: none;
    }
    &.hidebar {
      background: none;
    }
  }
</style>
