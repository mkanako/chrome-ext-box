import 'normalize.css/normalize.css'
import Vue from 'vue'
import i18n from 'vue-plugin-webextension-i18n'
import {
  Table,
  Button,
  TableColumn,
  Tooltip,
  Input,
  Dialog,
  Form,
  FormItem,
  Radio,
} from 'element-ui'
import App from './options.vue'

Vue.use(i18n)
Vue.use(Table)
Vue.use(Button)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Input)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Radio)

Vue.config.productionTip = false

Promise.all([
  new Promise((resolve, reject) => {
    chrome.storage.sync.get(['list', 'setting'], result => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(result)
      }
    })
  }),
  new Promise((resolve, reject) => {
    chrome.management.getAll(result => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(result)
      }
    })
  })
]).then(result => {
  const list = result[0].list || []
  const listID = {}
  for (let i = 0; i < list.length; i++) {
    listID[list[i].id] = i
  }
  const EXTENSION_ID = chrome.i18n.getMessage('@@extension_id')
  const ExtList = result[1].filter(item => {
    if (listID[item.id] !== undefined) {
      item.isAdd = true
      list[listID[item.id]].name = item.name
      list[listID[item.id]].icons = item.icons
    }
    return item.type === 'extension' && item.id !== EXTENSION_ID
  })
  app.list = list.filter(item => !!item.name)
  app.ExtList = ExtList
  if (result[0].setting && result[0].setting.showType) app.showType = result[0].setting.showType
  app.$watch('list', val => {
    chrome.storage.sync.set({
      list: val.map(item => {
        return { id: item.id }
      }),
    })
  })
}).catch(err => alert(err))

const app = new Vue({
  created () {
    document.title = this.$i18n('extName')
  },
  data: {
    ExtList: [],
    list: [],
    searchKey: '',
    showType: 1,
  },
  computed: {
    CurExtList () {
      if (this.searchKey.trim() !== '') {
        return this.ExtList.filter(item => {
          return item.name.toLowerCase().indexOf(this.searchKey.toLowerCase()) >= 0
        })
      } else {
        return this.ExtList
      }
    },
  },
  render: h => h(App),
}).$mount('#app')
