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

fontawesome.library.add(faFrown)

Vue.component(FontAwesomeIcon.name, FontAwesomeIcon)

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueGtm, {
  debug: true // Whether or not display console logs debugs (optional)
})
/* eslint-disable no-new */

new Vue({
  el: '#root',
  render: h => h(root)
})
