import CONFIG from './config'

const DEBUG = {
  log: (...data) => {
    if (CONFIG.debug) {
      console.log(...data)
    }
  }
}

export default DEBUG
