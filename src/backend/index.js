import _forEach from 'lodash/forEach'
import API from '../api'
import store from '../ext/storage'
import debug from '../utils/debug'

const ALERT_DB_NAME = 'alerts'
const onAlarm = (alarm) => {
  debug.log(`Got an alarm!`, alarm)
  if (alarm.name && alarm.name.startsWith('PA_')) {
    API.Crypto.getAllCryptoPrice().then(response => {
      let result = {}
      _forEach(response.data, (value, key) => {
        result[value.symbol] = value
      })
      return result
    }).then((cryptos) => {
      const [, name, condition, alertAmount] = alarm.name.split('_')
      if (condition === '>' && cryptos[name].price_usd >= alertAmount) {
        store.get(ALERT_DB_NAME)
          .then((value) => {
            value[ALERT_DB_NAME][alarm.name].message = value[ALERT_DB_NAME][alarm.name].message + `\nNow: ${cryptos[name].price_usd}`
            API.Notify.send(alarm.name, value[ALERT_DB_NAME][alarm.name])
          })
      }
      if (condition === '<' && cryptos[name].price_usd <= alertAmount) {
        store.get(ALERT_DB_NAME)
          .then((value) => {
            value[ALERT_DB_NAME][alarm.name].message = value[ALERT_DB_NAME][alarm.name].message + `\nNow: ${cryptos[name].price_usd}`
            API.Notify.send(alarm.name, value[ALERT_DB_NAME][alarm.name])
          })
      }
    }).catch(e => {
      this.error = e
    })
  }
}

const onPABtnClick = (notificationID, btnIndex) => {
  if (btnIndex === 0) {
    API.Notify.remove(notificationID)
    store.get(ALERT_DB_NAME)
      .then((alarmList) => {
        delete alarmList[notificationID]
        store.set(ALERT_DB_NAME, alarmList)
      })
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.onAlarm.addListener(onAlarm)
  chrome.notifications.onButtonClicked.addListener(onPABtnClick)
})

chrome.alarms.onAlarm.addListener(onAlarm)
chrome.notifications.onButtonClicked.addListener(onPABtnClick)
