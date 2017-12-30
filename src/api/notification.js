
export default {
  send (options) {
    chrome.notifications.create(
      'name-for-notification',
      {
        type: 'basic',
        iconUrl: '/icons/48.png',
        title: 'This is a notification',
        message: 'hello there!'
      }
    )
  }
}
