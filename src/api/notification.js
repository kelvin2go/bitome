
// options :
// {
//   type: 'basic',
//   iconUrl: '/icons/48.png',
//   title: 'This is a notification',
//   message: 'hello there!'
// }
import config from '../utils/config'

const set = (key, options) => {
  chrome.alarms.create(key, {
    delayInMinutes: config.ALERT_TIME, periodInMinutes: config.ALERT_TIME}
  )
}

const send = (key, options) => {
  chrome.notifications.getAll((notifications) => {
    const d = new Date()
    const opt = {
      ...options,
      message: `${options.message} (by ${d.toTimeString().split(' ')[0]})`
    }
    if (key in notifications) {
      chrome.notifications.update(key, opt)
    } else {
      chrome.notifications.create(key, opt)
    }
  })
}

const remove = (key) => {
  chrome.alarms.clear(key)
}

export default {
  set,
  send,
  remove
}
