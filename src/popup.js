import 'normalize.css/normalize.css'
import Vue from 'vue'
import i18n from 'vue-plugin-webextension-i18n'
import App from './popup.vue'

Vue.use(i18n)

Vue.config.productionTip = false

const getExtension = id =>
  new Promise(resolve => {
    chrome.management.get(id, result => {
      resolve(result)
    })
  })

chrome.storage.sync.get(['list'], result => {
  new Vue({
    created () {
      if (result.list && result.list.length) {
        Promise.all(result.list.map(item => getExtension(item.id))).then(
          results => {
            this.list = result.list
              .filter((item, index) => !!results[index])
              .map((item, index) => {
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
      list: [],
    },
    render: h => h(App),
  }).$mount('#app')
})
