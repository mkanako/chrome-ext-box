import 'normalize.css/normalize.css'
import Vue from 'vue'
import i18n from 'vue-plugin-webextension-i18n'
import {
  Table,
  Button,
  TableColumn,
  Tooltip,
  Input,
} from 'element-ui'
import App from './options.vue'

Vue.use(i18n)
Vue.use(Table)
Vue.use(Button)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Input)

Vue.config.productionTip = false

chrome.storage.sync.get(['list'], result => {
  const list = result.list || []
  const listID = {}
  for (let i = 0; i < list.length; i++) {
    listID[list[i].id] = i
  }
  chrome.management.getAll(result => {
    new Vue({
      created () {
        document.title = this.$i18n('extName')
      },
      data: {
        ExtList: result.filter(item => {
          if (listID[item.id] !== undefined) {
            item.isAdd = true
            list[listID[item.id]].name = item.name
            list[listID[item.id]].icons = item.icons
          }
          return (
            item.type === 'extension' &&
            item.id !== chrome.i18n.getMessage('@@extension_id')
          )
        }),
        list,
        searchKey: '',
      },
      computed: {
        CurExtList () {
          if (this.searchKey.trim() !== '') {
            return this.ExtList.filter(item => {
              return (
                item.name.toLowerCase().indexOf(this.searchKey.toLowerCase()) >=
                0
              )
            })
          } else {
            return this.ExtList
          }
        },
      },
      watch: {
        list (val) {
          chrome.storage.sync.set({
            list: val.map(item => {
              return { id: item.id }
            }),
          })
        },
      },
      render: h => h(App),
    }).$mount('#app')
  })
})
