import axios from 'axios'
import store from '../ext/storage'
import config from '../utils/config'
import debug from '../utils/debug'

const API_URL = {
  coinMarket: `https://api.coinmarketcap.com/v1/ticker/?limit=10`
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

export default {
  getCryptoPrice () {
    return cacheAPI.call(API_URL.coinMarket)
  }
}
