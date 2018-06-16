import Vue from 'vue'
import 'normalize.css/normalize.css'
import App from './popup.vue'
import i18n from 'vue-plugin-webextension-i18n'

Vue.use(i18n)

Vue.config.productionTip = false

let getExtension = id =>
  new Promise((resolve, reject) => {
    chrome.management.get(id, result => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(result.enabled)
      }
    })
  })

chrome.storage.sync.get(['list'], result => {
  new Vue({
    created() {
      if (this.list.length) {
        Promise.all(this.list.map(item => getExtension(item.id))).then(
          results => {
            this.list = this.list.map((item, index) => {
              item.enabled = results[index]
              return item
            })
          },
        )
      }
    },
    data: {
      list: result.list || [],
    },
    render: h => h(App),
  }).$mount('#app')
})