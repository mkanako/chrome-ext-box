import 'normalize.css/normalize.css'
import Vue from 'vue'
import i18n from 'vue-plugin-webextension-i18n'
import App from './popup.vue'

Vue.use(i18n)

Vue.config.productionTip = false

const getExtension = id =>
  new Promise((resolve, reject) => {
    chrome.management.get(id, result => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(result)
      }
    })
  })

chrome.storage.sync.get(['list'], result => {
  new Vue({
    created () {
      if (this.list.length) {
        Promise.all(this.list.map(item => getExtension(item.id))).then(
          results => {
            this.list = this.list.map((item, index) => {
              item.enabled = results[index].enabled
              item.name = results[index].name
              item.icons = results[index].icons
              return item
            })
          },
        )
      }
    },
    watch: {
      list (val) {
        const enabledTotal = val.reduce((sum, item) => {
          item.enabled && sum++
          return sum
        }, 0)
        if (enabledTotal) {
          chrome.browserAction.setBadgeText({
            text: enabledTotal + '',
          })
        } else {
          chrome.browserAction.setBadgeText({ text: '' })
        }
      },
    },
    data: {
      list: result.list || [],
    },
    render: h => h(App),
  }).$mount('#app')
})
