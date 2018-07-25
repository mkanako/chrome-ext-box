<template>
  <div :style="pageStyle">
    <!-- <div class="sticky"> -->
      <draggable  @start="dragStart" @end="dragEnd" id="list" v-model="list" :options="{draggable:'.item',forceFallback:true}">
        <div v-for="(element,index) in list" :key="element.id" class="item">
          <el-tooltip :open-delay="300" :disabled="tooltipDisabled" :content="element.name" placement="bottom">
            <div>
              <img class="ext-list-icon" :src="getIcon(element)" alt="">
              <i @click="remove(index)" class="el-icon-circle-close"></i>
            </div>
          </el-tooltip>
        </div>
        <div class="usage" v-if="list.length==0">{{ $i18n('usage') }}</div>
      </draggable>
      <el-input clearable :placeholder="$i18n('searchPlaceholder')" prefix-icon="el-icon-search"  v-model="searchKey"></el-input>
    <!-- </div> -->
    <el-table :empty-text="$i18n('emptyText')" row-key="id" :data="this.$root.CurExtList" highlight-current-row stripe style="width: 100%">
      <el-table-column prop="name" :label="$i18n('table1stCol')">
        <template slot-scope="scope">
          <el-tooltip placement="right">
            <div slot="content" class="tip-content">{{ scope.row.description }}</div>
            <img class="ext-list-icon" :src="getIcon(scope.row)" alt="">
          </el-tooltip>
          <a v-if="scope.row.installType!='development'" target="_blank" :href="'https://chrome.google.com/webstore/detail/extension-manager/'+scope.row.id">{{ scope.row.name }}</a>
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$i18n('table2ndCol')" width="150">
        <template slot-scope="scope">
          <el-button @click="add(scope.row)" :disabled="!!scope.row.isAdd" type="primary" icon="el-icon-circle-plus-outline">{{ $i18n('addBtn') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <vm-back-top></vm-back-top>
  </div>
</template>
<script>
import { debounce, findIndex } from 'lodash-es'
import { getIcon } from './utils'
import draggable from 'vuedraggable'
import VmBackTop from 'vue-multiple-back-top'
export default {
  name: 'OptionsPage',
  methods: {
    remove(index) {
      let rowIndex = findIndex(this.$root.ExtList, [
        'id',
        this.list.splice(index, 1)[0].id,
      ])
      if (rowIndex >= 0) {
        let row = this.$root.ExtList[rowIndex]
        row.isAdd = false
        this.$set(this.$root.ExtList, rowIndex, row)
      }
    },
    dragStart() {
      this.tooltipDisabled = true
    },
    dragEnd(e) {
      setTimeout(() => {
        this.tooltipDisabled = false
      }, 500)
    },
    add(row) {
      let index = findIndex(this.$root.ExtList, ['id', row.id])
      if (index >= 0) {
        row.isAdd = true
        this.$set(this.$root.ExtList, index, row)
        this.list.push({ id: row.id, name: row.name, icons: row.icons })
      }
    },
    getIcon,
  },
  created() {
    this.debounceSearch = debounce(() => {
      this.$root.searchKey = this.searchKey
    }, 300)
  },
  watch: {
    searchKey(newVal, oldVal) {
      this.debounceSearch()
    },
    list(newVal) {
      chrome.storage.sync.set({
        list: newVal.map(item => {
          return { id: item.id }
        }),
      })
    },
  },
  data() {
    return {
      tooltipDisabled: false,
      pageStyle: {
        width: window.innerWidth * 0.6 + 'px',
        margin: '0 auto',
        minWidth: '640px',
      },
      searchKey: '',
      list: this.$root.list,
    }
  },
  components: {
    draggable,
    VmBackTop,
  },
}
</script>
<style>
.tip-content {
  max-width: 520px;
}
/* .sticky {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 1;
} */
.el-table {
  border-right: 1px solid #ebeef5;
  border-left: 1px solid #ebeef5;
}
.el-table a {
  color: #606266;
  text-decoration: none;
}
#list {
  margin: 10px 0;
  border: 2px dashed #909399;
  display: flex;
  flex-wrap: wrap;
  min-height: 84px;
}
#list .item {
  margin: 10px;
  position: relative;
}
#list .item i {
  position: absolute;
  top: -5px;
  right: -5px;
  cursor: pointer;
  font-size: 24px;
  background: #fff;
  color: #f56c6c;
  border-radius: 12px;
}
#list .ext-list-icon {
  margin: 0;
}
.usage {
  text-align: center;
  color: #909399;
  flex: 1;
  line-height: 84px;
  font-size: 16px;
}
.ext-list-icon {
  width: 64px;
  vertical-align: middle;
  margin: 0 10px;
}
</style>
