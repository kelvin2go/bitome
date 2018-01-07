const store = chrome.storage.sync

export default {
  lget (key) {
    try {
      return JSON.parse(localStorage.getItem(key))
    } catch (e) {}
  },
  lset (key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val))
    } catch (e) {}
  },
  lremove (key) {
    try {
      localStorage.removeItem(key)
    } catch (e) {}
  },
  lclear () {
    try {
      localStorage.clear()
    } catch (e) {}
  },
  get (key) {
    try {
      let result = new Promise((resolve) => store.get(key, (value) => {
        resolve(value)
      }))
      return result
    } catch (e) {}
  },
  set (key, val) {
    try {
      store.set({[key]: val})
    } catch (e) {}
  },
  remove (key) {
    try {
      store.remove(key)
    } catch (e) {}
  },
  clear () {
    try {
      store.clear()
    } catch (e) {}
  }
}
