import axios from 'axios'
import _ from 'lodash'
import store from '../ext/storage'
import config from '../utils/config'
import debug from '../utils/debug'

const SETTING_DB_NAME = 'settings'
const API_URL = {
  default: (limit = 10) => {
    return { limit }
  },
  all: {limit: '500'},
  coinMarket: `https://api.coinmarketcap.com/v1/ticker/?`,
  convert: ''
}

const checkCache = (key) => {
  let date2 = new Date()
  const cached = store.lget(key)
  if (cached && cached.createdAt && Math.abs(date2.getTime() - new Date(cached.createdAt).getTime()) < config.CACHE_TIME) {
    return new Promise((resolve, reject) => {
      debug.log(`Cached : ${key}`)
      resolve(cached)
    })
  } else {
    debug.log('NON cached')
    return null
  }
}

const cacheAPI = {
  paramsStr (data) {
    let result = data
    let currentCurrency = API_URL.convert
    if (currentCurrency !== '') {
      result = {
        ...result,
        currentCurrency
      }
    }
    return new Promise((resolve, reject) => {
      store.get(SETTING_DB_NAME)
        .then((db) => {
          if (!_.isEmpty(db[SETTING_DB_NAME])) {
            if (db[SETTING_DB_NAME].currentCurrency && db[SETTING_DB_NAME].currentCurrency.value !== 'USD') {
              result.convert = db[SETTING_DB_NAME].currentCurrency.value
            }
          }
          resolve(Object.keys(result).map(key => `${key}=${encodeURIComponent(result[key])}`).join('&'))
        })
    })
  },
  async call (path, param) {
    let paramPath = path + await this.paramsStr(param)
    const cache = checkCache(paramPath)
    if (cache) {
      return cache
    } else {
      return axios.get(paramPath).then(response => {
        response['createdAt'] = new Date()
        store.lset(paramPath, response)
        return new Promise((resolve, reject) => {
          resolve(response)
        })
      })
    }
  }
}

export default {
  getAllCryptoPrice () {
    const param = API_URL.all
    return cacheAPI.call(API_URL.coinMarket, param)
  },
  getCryptoPrice () {
    const param = API_URL.default()
    return cacheAPI.call(API_URL.coinMarket, param)
  }
}
