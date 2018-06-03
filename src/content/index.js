import Vue from 'vue'
import root from './root.vue'
import VueGtm from 'vue-gtm'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@fortawesome/fontawesome/styles.css'
import 'cryptocoins-icons/webfont/cryptocoins.css'

import fontawesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { faFrown } from '@fortawesome/fontawesome-free-solid'
import CONFIG from '../utils/config'

fontawesome.library.add(faFrown)

Vue.component(FontAwesomeIcon.name, FontAwesomeIcon)

var bitome = document.createElement('div')
bitome.setAttribute('id', 'root')

document.body.appendChild(bitome)

Vue.config.productionTip = CONFIG.debug
Vue.use(ElementUI)
Vue.use(VueGtm, {
  debug: CONFIG.debug // Whether or not display console logs debugs (optional)
})
/* eslint-disable no-new */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('sent from tab.id=', sender.tab.id)
})

new Vue({
  el: '#root',
  render: h => h(root)
})
