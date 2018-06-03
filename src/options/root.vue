<template>
  <div class="action">
    <h3>Bitome Settings</h3>
    <el-form ref="form" label-width="120px" size="mini">
      <el-form-item label="Currenys count">
        <el-switch
          v-model="useUSD"
          :active-text="currencyDisplay"
          inactive-text="BTC"
        >
        </el-switch>
      </el-form-item>

      <el-form-item label="Raise color">
        <el-switch
          v-model="useRedUp"
          active-color="#ff4949"
          inactive-color="#13ce66"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="Marquee">
        <el-switch
          v-model="marquee"
          active-color="#13ce66"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="Currencys">
        <el-select class="select":xs="7" v-model="currentCurrency.value">
          <el-option
            v-for="item in currencys"
            :key="`currencys-${item.value}`"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import _isEmpty from 'lodash/isEmpty'
  import CONFIG from '../utils/config'
  import store from '../ext/storage'

  const SETTING_DB_NAME = 'settings'
  export default {
    data: () => ({
      useUSD: true,
      useRedUp: false,
      marquee: true,
      currentCurrency: {
        value: 'USD'
      },
      inited: false,
      currencys: CONFIG.currencys
    }),
    computed: {
      currencyDisplay () {
        return this.currentCurrency.value
      },
      settings () {
        console.log('HIa')
        let setting = {
          useRedUp: this.useRedUp,
          useUSD: this.useUSD,
          currentCurrency: this.currentCurrency,
          marquee: this.marquee
        }
        if (this.inited) {
          store.set(SETTING_DB_NAME, setting)
        }
        console.log('HIv')
        return setting
      }
    },
    created () {
      const that = this
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
            if ('marquee' in db[SETTING_DB_NAME]) {
              that.marquee = db[SETTING_DB_NAME].marquee
            }
          }
        }).then(() => {
          that.inited = true
        })
      this.$gtm.trackView('options', '/options.html')
    },
    mounted () { },
    methods: { }
  }
</script>
<style>
</style>
