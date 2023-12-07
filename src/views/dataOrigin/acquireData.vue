<template>
  <div class="acquireData">
    <div class="title">数据获取</div>
    <div class="acquireData_table">
      <el-form
        ref="acquireDataForm"
        :inline="true"
        label-width="90px"
        :label-position="labelPosition"
        :model="acquireDataForm"
        class="top_form demo-form-inline"
      >
        <el-form-item class="input_style_max" label="数据标题：" prop="title">
          <el-input
            v-model="acquireDataForm.title"
            placeholder="请输入数据标题"
          />
        </el-form-item>
        <el-form-item class="input_style_max" label="所属板块：" prop="name">
          <el-select
            v-model="acquireDataForm.businessBlockId"
            default-first-option=""
            placeholder="请选择所属板块"
          >
            <el-option
              v-for="i in typeList"
              :key="i.id"
              :label="i.name"
              :value="i.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="input_style_max" label="所属公司：">
          <el-dropdown placement="bottom-start">
            <el-input
              v-model="acquireDataForm.orgCodeName"
              placeholder="请选择所属公司"
              class="el-dropdown-link"
              readonly="readonly"
            />
            <el-dropdown-menu slot="dropdown">
              <el-tree
                ref="tree"
                style="padding-right: 20px; max-height: 300px; overflow: auto"
                :data="treeData"
                :props="defaultProps"
                node-key="extra"
                accordion
                highlight-current
                :show-checkbox="true"
                :check-strictly="true"
                @check-change="handleCheckChange"
                @check="handleNodeClick"
              />
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <el-form-item label="日期：" class="input_style_max">
          <el-date-picker
            v-model="isTime"
            class="date"
            type="daterange"
            align="right"
            unlink-panels
            size="mini"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-search"
            @click="onSubmit"
          >查询</el-button>
          <el-button
            size="mini"
            icon="el-icon-refresh-left"
            @click="resetForm('acquireDataForm')"
          >重置</el-button>
        </el-form-item>
      </el-form>
      <div class="acquireData_table_btn">
        <!-- <el-button type="success" plain size="mini" @click="exportList"><i class="iconfont icon-daochu"></i>导出</el-button> -->
        <el-button
          type="primary"
          size="mini"
          @click="handleDispatch('add')"
        ><i class="iconfont icon-addfirm-btn" />导入</el-button>
        <!-- <el-button
          plain
          size="mini"
          icon="el-icon-delete"
          @click="deleteIndicator('delete')"
          >删除</el-button
        > -->
      </div>
      <page-table
        v-if="table.flag"
        :column="table.column"
        :source="table.data"
        :selection="table.selection"
        :total="table.total"
        :current="table.current"
        @selectData="getSelectData"
        @currentChange="(v) => (this.table.current = v)"
      />
    </div>
    <acquireData
      v-if="acquireDataShow"
      :id="id"
      :indicator-line-show="acquireDataShow"
      :types="isType"
      @changeState="changeDispatch"
    />
  </div>
</template>
<script>
import { pickerOptions } from '@/static/data'
import pageTable from '@/views/table/index'
import { getPagePromise } from '@/utils/auth'
import { clearObject } from '@/utils/tool'
import acquireData from '@/views/dataOrigin/pops/acquireData'

export default {
  name: 'AcquireData',
  components: {
    pageTable,
    acquireData
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      labelPosition: 'left',
      table: {
        flag: true,
        selection: true,
        column: [
          { prop: 'title', label: '数据标题' },
          { prop: 'dataAcquisitionType', label: '类型' },
          { prop: 'cycle', label: '上报周期' },
          // { prop: 'businessBlockId', label: '所属板块' },
          { prop: 'businessBlockName', label: '所属板块' },
          // { prop: 'orgCode', label: '所属公司' },
          { prop: 'orgName', label: '所属公司' },
          { prop: 'updated', label: '更新时间' },
          { label: '操作', button: true, actions: [] }
        ],
        data: [],
        total: 0,
        current: 1
      },
      acquireDataForm: {
        businessBlockId: '',
        updated: null,
        orgCode: '',
        orgCodeName: '',
        title: '',
        pageIndex: 1,
        pageSize: 10
      },
      isTime: null,
      acquireDataShow: false,
      labelPosition: 'left',
      pickerOptions,
      isType: '',
      id: '',
      multipleSelection: [],
      pagePromise: [],
      typeList: []
    }
  },
  updated() {
    if (this.table.current !== this.acquireDataForm.pageIndex) {
      this.acquireDataForm.pageIndex = this.table.current
      this.getItemList(this.acquireDataForm)
    }
  },
  mounted() {
    setTimeout(() => {
      getPagePromise().then((res) => {
        this.pagePromise = res
        this.table.column[this.table.column.length - 1].actions.push({
          label: '查看',
          click: (data) => this.handleDispatch('edit', data),
          type: 'text'
        })
        this.table.column[this.table.column.length - 1].actions.push({
          label: '删除',
          click: (data) => this.deleteIndicator('deleteOne', data),
          type: 'text'
        })
      })
    }, 200)
    this.loadData()
  },
  methods: {
    async loadData() {
      // 获取公司tree list
      const res = await this.$store.dispatch('center/getDepartmentData')
      this.treeData = res.data
      // 获取板块List
      const res1 = await this.$store.dispatch('center/getbusinessOption', { pageIndex: 1, pageSize: 99999 })
      this.typeList = res1.data.list

      this.getItemList(this.acquireDataForm)
    },
    tp(k) {
      return this.pagePromise.indexOf(k) > -1
    },
    onSubmit() {
      if (this.isTime) {
        this.acquireDataForm.updated = this.isTime.toString()
      } else {
        this.acquireDataForm.updated = null
      }
      this.getItemList(this.acquireDataForm)
    },
    resetForm(formName) {
      this.isTime = null
      clearObject(this.acquireDataForm)
      this.$refs.tree.setCheckedKeys([])
      this.acquireDataForm.updated = null
      this.getItemList()
    },
    getItemList(condition) {
      console.log('x3')
      this.$store
        .dispatch('center/getAcquireData', {
          method: 'get',
          data: this.acquireDataForm,
          type: 'list',
          container: this.table
        })
        .then(() => {
          console.log('aabb')
          console.log(this.table)
          this.table.data.forEach((item) => {
            // 把table中的板块code转换成name
            this.typeList.forEach(val => {
              if (item.businessBlockId === val.code) {
                item.businessBlockName = val.name
              }
            })
            // 把table中的公司code转换成名称
            this.treeData.forEach((val) => {
              if (val.extra === item.orgCode) {
                item.orgName = val.label
              } else {
                val.children.forEach(val1 => {
                  if (val1.extra === item.orgCode) {
                    item.orgName = val1.label
                  } else {
                    val1.children.forEach(val2 => {
                      if (val2.extra === item.orgCode) {
                        item.orgName = val2.label
                      }
                    })
                  }
                })
              }
            })
            // item.businessBlockName = t
            // item.orgName
          })
        })
    },
    getSelectData(list) {
      this.multipleSelection = list.map((i) => i.id)
    },
    handleCheckChange(data, checked, tree) {
      if (checked) {
        this.$refs.tree.setCheckedNodes([data])
      }
    },
    handleNodeClick() {
      this.orgCodeList = this.$refs.tree.getCheckedNodes().map((i) => ({ code: i.extra, name: i.label }))
      // console.log('ssss')
      // console.log(this.orgCodeList)
      this.acquireDataForm.orgCodeName = this.orgCodeList.map(i => i.name).toString()
      this.acquireDataForm.orgCode = this.orgCodeList.map(i => i.code).toString()
    },
    changeDispatch(s) {
      this.acquireDataShow = s.state
      if (s.step === 1) {
        this.getItemList()
      }
    },
    deleteIndicator(type, data) {
      // this.$message.error('待开发')
      // return
      if (data) {
        this.multipleSelection = []
        this.multipleSelection.push(data.row.id)
      }
      this.$store.dispatch('center/deleteIndicatorItems', {
        id: this.multipleSelection,
        t: this
      })
    },
    handleDispatch(type, data) {
      // this.$message.error('待开发')
      // return
      this.acquireDataShow = true
      this.isType = type
      if (data) {
        this.id = data.row.id
      } else {
        this.id = ''
      }
    }
  }
}
</script>
<style lang="scss">
@import "../../assets/icon/iconfont.css";
@import "../../assets/icon_01/iconfont.css";
.acquireData {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .title {
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 26px;
    color: #2f3541;
    margin-top: 18px;
    margin-bottom: 18px;
  }
  .el-form {
    background-color: #fff;
    box-sizing: border-box;
  }
  .acquireData_table_btn {
    margin-bottom: 10px;
  }
  .acquireData_table {
    min-width: 1320px;
    height: calc(100% - 100px);
    background-color: #fff;
    padding: 0px 30px;
    box-sizing: border-box;
    box-shadow: -1px 0px 4px rgba(217, 217, 217, 0.5);
  }
  .iconfont {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    vertical-align: baseline;
    margin-right: 5px;
  }
}
</style>
