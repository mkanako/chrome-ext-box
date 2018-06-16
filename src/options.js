import Vue from 'vue'
import 'normalize.css/normalize.css'
import { Table, Button, TableColumn, Tooltip, Input } from 'element-ui'
import App from './options.vue'
import i18n from 'vue-plugin-webextension-i18n'

Vue.use(i18n)
Vue.use(Table)
Vue.use(Button)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Input)

Vue.config.productionTip = false

chrome.storage.sync.get(['list'], result => {
  let list = result.list || []
  let listID = list.reduce((accumulator, currentValue) => {
    accumulator[currentValue.id] = true
    return accumulator
  }, {})
  chrome.management.getAll(result => {
    new Vue({
      created() {
        document.title = this.$i18n('extName')
      },
      data: {
        ExtList: result.filter(item => {
          if (listID[item.id]) {
            item.isAdd = true
          }
          return (
            item.type === 'extension' &&
            item.id !== chrome.i18n.getMessage('@@extension_id')
          )
        }),
        list: list,
        searchKey: '',
      },
      computed: {
        CurExtList() {
          if (this.searchKey.trim() !== '') {
            return this.ExtList.filter(item => {
              // if (item.isAdd) {
              //   return false
              // }
              return (
                item.name.toLowerCase().indexOf(this.searchKey.toLowerCase()) >=
                0
              )
            })
          } else {
            return this.ExtList
            // .filter(item => {
            //   return !item.isAdd
            // })
          }
        },
      },
      render: h => h(App),
    }).$mount('#app')
  })
})
