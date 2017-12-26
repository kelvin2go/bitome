import axios from 'axios'
import store from '../ext/storage'

const API_URL = {
  coinMarket: `https://api.coinmarketcap.com/v1/ticker/?limit=10`
}

const cacheAPI = {
  call (path) {
    store.clear()
    const cache = store.get(path) || axios.get(path)
    store.set(path, cache)
    return cache
  }
}

export default {
  getCryptoPrice () {
    return cacheAPI.call(API_URL.coinMarket)
  }
}
