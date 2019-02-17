<template>
  <div class="wrapper">
    <template v-if="$root.showType===1">
    <a @click="setEnabled(item,index)" :title="item.name" v-for="(item,index) in $root.list" :key="item.id" class="ext-item" :class="{disable:!item.enabled}">
      <img :src="getIcon(item)">
    </a>
    </template>
    <template v-else-if="$root.showType===2">
    <ul>
      <li v-for="(item,index) in $root.list" :key="item.id" class="ext-item" :class="{disable:!item.enabled}">
        <a @click="setEnabled(item,index)" :title="item.name">
          <img :src="getIcon(item)">&nbsp;&nbsp;{{item.name}}
        </a>
      </li>
    </ul>
    </template>
    <p v-if="$root.list.length==0" style="padding:0 20px;">{{ $i18n('emptyText') }}</p>
  </div>
</template>
<script>
import { getIcon } from './utils'
export default {
  name: 'PopupPage',
  methods: {
    getIcon,
    setEnabled (item, index) {
      chrome.management.setEnabled(item.id, !item.enabled, () => {
        item.enabled = !item.enabled
        this.$set(this.$root.list, index, item)
        setTimeout(() => {
          window.close()
        }, 200)
      })
    },
  },
}
</script>
<style>
html,
body {
  width: max-content;
}
.wrapper{
  flex-wrap:wrap;
  display:flex;
  max-width:320px;
  padding:5px;
}
.wrapper ul{
  list-style-type: none;
  margin: 0;
  padding: 0;
}
.wrapper li{
  width: 200px;
  padding: 5px 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ext-item {
  margin: 6px;
  cursor: pointer;
}
.ext-item img {
  width: 20px;
  vertical-align: middle;
}
.disable {
  opacity: 0.5;
  filter: grayscale(1);
}
</style>
