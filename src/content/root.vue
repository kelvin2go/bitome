<template>
  <div class="top-bar" :class="[{'active': marquee, hide: hide}]" v-if="marquee">
    <Marquee
      :cryptos="joinCryptos"
      :useUSD="useUSD"
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
    useUSD: true,
    useRedUp: false,
    marquee: false,
    hide: false,
    currentCurrency: {
      value: 'USD'
    },
    currencys: CONFIG.currencys
  }),
  computed: {
    joinCryptos () {
      return {
        ...this.userCryptos,
        ...this.cryptos
      }
    },
    settings () {
      const setting = {
        useRedUp: this.useRedUp,
        useUSD: this.useUSD,
        currentCurrency: this.currentCurrency,
        marquee: this.marquee
      }
      return setting
    },
    currencyLowerCase () {
      return this.currentCurrency.value.toLowerCase()
    },
    currencyDisplay () {
      return this.currentCurrency.value
    }
  },
  created () {
    const that = this
    this.getTop10()
    setInterval(this.loadSettings, 5 * 1000)
    setInterval(this.getTop10, 60 * 1000)
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
    saveSettings () {
      const setting = {
        useRedUp: this.useRedUp,
        useUSD: this.useUSD,
        currentCurrency: this.currentCurrency,
        marquee: this.marquee
      }
      store.set(SETTING_DB_NAME, setting)
    },
    cancelMarquee () {
      this.marquee = false
      this.saveSettings()
    },
    loadSettings () {
      const that = this
      store.get(SETTING_DB_NAME)
        .then((db) => {
          if (JSON.stringify(this.settings) === JSON.stringify(db[SETTING_DB_NAME])) {
            return
          }
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
            if ('marquee' in db[SETTING_DB_NAME]) {
              that.marquee = db[SETTING_DB_NAME].marquee
            }
          }
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
    &.hide {
      background: none;
    }
  }
</style>
