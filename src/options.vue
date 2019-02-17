<template>
  <div style="width:844px;margin:0 auto;">
      <draggable  @start="dragStart" @end="dragEnd" id="list" v-model="$root.list" :options="{draggable:'.item',forceFallback:true}">
        <div v-for="(element,index) in $root.list" :key="element.id" class="item">
          <el-tooltip :open-delay="300" :disabled="tooltipDisabled" :content="element.name" placement="bottom">
            <div>
              <img class="ext-list-icon" :src="getIcon(element)" alt="">
              <i @click="remove(index)" class="el-icon-circle-close"></i>
            </div>
          </el-tooltip>
        </div>
        <div class="usage" v-if="$root.list.length==0">{{ $i18n('usage') }}</div>
      </draggable>
      <el-input clearable :placeholder="$i18n('searchPlaceholder')" prefix-icon="el-icon-search"  v-model="searchKey"></el-input>
    <el-table :empty-text="$i18n('emptyText')" row-key="id" :data="$root.CurExtList" highlight-current-row stripe style="width: 100%">
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
    <vm-back-top />
    <el-dialog :visible.sync="dialogVisible" width="400px" label-position="right">
      <el-form>
        <el-form-item :label="$i18n('showText')" label-width="80px">
          <el-radio v-model="$root.showType" :label="1">{{$i18n('showType1')}}</el-radio>
          <el-radio v-model="$root.showType" :label="2">{{$i18n('showType2')}}</el-radio>
      </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="small" @click="settingConfirm">{{$i18n('settingConfirmBtn')}}</el-button>
      </div>
    </el-dialog>
    <el-button class="btn-setting" type="primary" icon="el-icon-setting" circle @click="dialogVisible=true"></el-button>
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
    add (row) {
      let index = findIndex(this.$root.ExtList, ['id', row.id])
      if (index >= 0) {
        row.isAdd = true
        this.$set(this.$root.ExtList, index, row)
        this.$root.list.push({ id: row.id, name: row.name, icons: row.icons })
      }
    },
    remove (index) {
      let rowIndex = findIndex(this.$root.ExtList, [
        'id',
        this.$root.list.splice(index, 1)[0].id,
      ])
      if (rowIndex >= 0) {
        const row = this.$root.ExtList[rowIndex]
        row.isAdd = false
        this.$set(this.$root.ExtList, rowIndex, row)
      }
    },
    dragStart () {
      this.tooltipDisabled = true
    },
    dragEnd () {
      setTimeout(() => {
        this.tooltipDisabled = false
      }, 500)
    },
    getIcon,
    settingConfirm () {
      this.dialogVisible = false
      chrome.storage.sync.set({
        setting: { showType: this.$root.showType },
      })
    }
  },
  created () {
    this.search = debounce(() => {
      this.$root.searchKey = this.searchKey
    }, 300)
  },
  watch: {
    searchKey () {
      this.search()
    },
  },
  data () {
    return {
      tooltipDisabled: false,
      searchKey: '',
      dialogVisible: false,
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
.btn-setting{
  position: fixed;
  left: 10px;
  top: 10px;
  z-index: 1;
}
.el-dialog__body{
  padding: 10px 20px 1px;
}
</style>
