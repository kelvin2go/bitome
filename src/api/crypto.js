import axios from 'axios'
import store from '../ext/storage'
import config from '../utils/config'
import debug from '../utils/debug'

const API_URL = {
  top10: {limit: '10'},
  all: {limit: '0'},
  coinMarket: `https://api.coinmarketcap.com/v1/ticker/?`
}

const checkCache = (key) => {
  debug.log('checkCache')
  return store.get(key)
    ? new Promise((resolve, reject) => {
      debug.log('cached')
      resolve(store.get(key))
    })
    : null
}

const cacheAPI = {
  call (path) {
    setTimeout(() => {
      debug.log('clearCache')
      store.clear()
    }, config.CACHE_TIME)
    const api = axios.get(path).then(response => {
      store.set(path, response)
      debug.log(response)
      return new Promise((resolve, reject) => {
        resolve(response)
      })
    })
    const cache = checkCache(path) || api
    debug.log(cache)
    return cache
  }
}

const paramsStr = (data) => {
  return Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&')
}

export default {
  getAllCryptoPrice () {
    const param = API_URL.all
    return cacheAPI.call(API_URL.coinMarket + paramsStr(param))
  },
  getCryptoPrice () {
    const param = API_URL.top10
    return cacheAPI.call(API_URL.coinMarket + paramsStr(param))
  }
}
