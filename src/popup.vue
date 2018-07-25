<template>
  <div :style="pageStyle">
    <a @click="setEnabled(item,index)" :title="item.name" v-for="(item,index) in this.$root.list" :key="item.id" class="ext-item" :class="{disable:!item.enabled}">
      <img :src="getIcon(item)">
    </a>
    <p v-if="this.$root.list.length==0" style="padding:0 20px;">{{ $i18n('emptyText') }}</p>
  </div>
</template>
<script>
import { getIcon } from './utils'
export default {
  name: 'PopupPage',
  methods: {
    getIcon,
    setEnabled(item, index) {
      chrome.management.setEnabled(item.id, !item.enabled, () => {
        item.enabled = !item.enabled
        this.$set(this.$root.list, index, item)
        setTimeout(() => {
          window.close()
        }, 200)
      })
    },
  },
  data() {
    return {
      pageStyle: {
        flexWrap: 'wrap',
        display: 'flex',
        maxWidth: '320px',
        padding: '5px',
      },
    }
  },
}
</script>
<style>
html,
body {
  width: max-content;
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
