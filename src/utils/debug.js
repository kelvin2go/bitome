import CONFIG from './config'

const DEBUG = {
  log: (data, ...opts) => {
    if (CONFIG.DEBUG) {
      console.log(data, opts)
    }
  }
}

export default DEBUG
