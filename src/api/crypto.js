import axios from 'axios'
import store from '../ext/storage'
import config from '../utils/config'
import debug from '../utils/debug'

const API_URL = {
  default: (limit = 10) => {
    return { limit }
  },
  all: {limit: '100'},
  coinMarket: `https://api.coinmarketcap.com/v1/ticker/?`
}

const checkCache = (key) => {
  let date2 = new Date()
  const cached = store.lget(key)
  if (cached && cached.createdAt && Math.abs(date2.getTime() - new Date(cached.createdAt).getTime()) < config.CACHE_TIME) {
    return new Promise((resolve, reject) => {
      debug.log('Cached')
      resolve(cached)
    })
  } else {
    debug.log('NON cached')
    return null
  }
}

const cacheAPI = {
  call (path) {
    const cache = checkCache(path)
    if (cache) {
      return cache
    } else {
      return axios.get(path).then(response => {
        response['createdAt'] = new Date()
        store.lset(path, response)
        return new Promise((resolve, reject) => {
          resolve(response)
        })
      })
    }
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
    const param = API_URL.default()
    return cacheAPI.call(API_URL.coinMarket + paramsStr(param))
  }
}
