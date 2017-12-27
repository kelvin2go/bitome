import axios from 'axios'
import store from '../ext/storage'

const API_URL = {
  coinMarket: `https://api.coinmarketcap.com/v1/ticker/?limit=10`
}

const checkCache = (key) => {
  console.log('checkCache')
  return store.get(key)
    ? new Promise((resolve, reject) => {
      console.log('cached')
      resolve(store.get(key))
    })
    : null
}

const cacheAPI = {
  call (path) {
    setTimeout(() => {
      store.clear()
    }, 3000)
    const api = axios.get(path).then(response => {
      store.set(path, response)
      console.log(response)
      return new Promise((resolve, reject) => {
        resolve(response)
      })
    })
    const cache = checkCache(path) || api
    console.log(cache)
    return cache
  }
}

export default {
  getCryptoPrice () {
    return cacheAPI.call(API_URL.coinMarket)
  }
}
