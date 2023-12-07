<template>
  <div class="airLine">
    <div class="title">航线管理</div>
    <div class="airLine_table">
      <el-form
        ref="airLineForm"
        :inline="true"
        label-width="90px"
        :label-position="labelPosition"
        :model="airLineForm"
        class="top_form demo-form-inline"
      >
        <el-form-item class="input_style_max" label="始发港：" prop="beginDockCode">
          <!-- <el-input v-model="airLineForm.beginDockCode" placeholder="请输入始发港"></el-input> -->
          <el-select v-model="airLineForm.beginDockCode" default-first-option="" placeholder="请选择始发港">
            <el-option v-for="i in typeList" :key="i.id" :label="i.name" :value="i.code" />
          </el-select>
        </el-form-item>
        <el-form-item class="input_style_max" label="目的港：" prop="endDockCode">
          <el-select v-model="airLineForm.endDockCode" default-first-option="" placeholder="请选择目的港">
            <el-option v-for="i in typeList" :key="i.id" :label="i.name" :value="i.code" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="所属公司："
          class="input_style_max"
        >
          <el-dropdown placement="bottom-start">
            <el-input
              v-model="airLineForm.orgCodeName"
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
            @click="resetForm('airLineForm')"
          >重置</el-button>
        </el-form-item>
      </el-form>
      <div class="airLine_table_btn">
        <el-button
          type="primary"
          size="mini"
          @click="handleDispatch('add')"
        ><i class="iconfont icon-addfirm-btn" />创建</el-button>
        <el-button
          plain
          size="mini"
          icon="el-icon-delete"
          @click="deleteWharf('delete')"
        >删除</el-button>
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
    <airLine v-if="airLineShow" :id="id" :air-line-show="airLineShow" :data-list="airLineData" :types="isType" @changeState="changeDispatch" />
  </div>
</template>
<script>
import { pickerOptions } from '@/static/data'
import pageTable from '@/views/table/index'
import { getPagePromise } from '@/utils/auth'
import airLine from '@/views/basicsData/pops/airPop'
import { clearObject } from '@/utils/tool'
export default {
  components: {
    airLine,
    pageTable
  },
  data() {
    return {
      id: '',
      typeList: [],
      airLineForm: {
        beginDockCode: '',
        endDockCode: '',
        updated: null,
        orgCode: '',
        orgCodeName: '',
        pageIndex: 1,
        pageSize: 10
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData: [],
      orgCodeList: [],
      isTime: null,
      airLineShow: false,
      airLineData: {},
      labelPosition: 'left',
      pickerOptions,
      isType: '',
      table: {
        flag: true,
        selection: true,
        column: [
          { prop: 'code', label: '航线编码' },
          { prop: 'beginDockName', label: '始发港' },
          { prop: 'endDockName', label: '目的港' },
          { prop: 'optionText', label: '类型' },
          { prop: 'seating', label: '座位数' },
          //   { prop: "endDockCode", label: "目的港" },
          { prop: 'orgName', label: '所属公司' },
          { prop: 'sort', label: '排序' },
          { prop: 'updated', label: '时间' },
          { label: '操作', button: true, actions: [] }
        ],
        data: [],
        total: 0,
        current: 1
      },
      multipleSelection: []
    }
  },
  updated() {
    if (this.table.current !== this.airLineForm.pageIndex) {
      this.airLineForm.pageIndex = this.table.current
      this.getItemList(this.airLineForm)
    }
  },
  mounted() {
    setTimeout(() => {
      getPagePromise().then((res) => {
        this.pagePromise = res
        this.table.column[this.table.column.length - 1].actions.push({
          label: '编辑',
          click: (data) => this.handleDispatch('edit', data),
          type: 'text'
        })
        this.table.column[this.table.column.length - 1].actions.push({
          label: '删除',
          click: (data) => this.deleteWharf('deleteOne', data),
          type: 'text'
        })
      })
    }, 200)
    this.getItemList(this.airLineForm)
    this.$store.dispatch('center/getDepartmentData').then((res) => {
      this.treeData = res.data
    })
    this.$store.dispatch('center/getWharfOption', { pageIndex: 1, pageSize: 99999 }).then((res) => {
      this.typeList = res.data.list
    })
  },
  methods: {
    tp(k) {
      return this.pagePromise.indexOf(k) > -1
    },
    onSubmit() {
      if (this.isTime) {
        this.airLineForm.updated = this.isTime.toString()
      } else {
        this.airLineForm.updated = null
      }
      this.getItemList(this.airLineForm)
    },
    resetForm(formName) {
      this.isTime = null
      clearObject(this.airLineForm)
      this.airLineForm.updated = null
      this.$refs.tree.setCheckedKeys([])
      this.getItemList()
    },
    getItemList(condition) {
      this.$store
        .dispatch('center/getAirLine', {
          method: 'get',
          data: this.airLineForm,
          type: 'list',
          container: this.table
        })
        .then()
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
      this.airLineForm.orgCodeName = this.orgCodeList.map(i => i.name).toString()
      this.airLineForm.orgCode = this.orgCodeList.map(i => i.code).toString()
    },
    changeDispatch(s) {
      this.airLineShow = s.state
      if (s.step == 1) {
        this.getItemList()
      }
    },
    deleteWharf(type, data) {
      if (data) {
        this.multipleSelection = []
        this.multipleSelection.push(data.row.id)
      }
      this.$store.dispatch('center/deleteAirLineItems', {
        id: this.multipleSelection,
        t: this
      })
    },
    handleDispatch(type, data) {
      this.airLineShow = true
      this.isType = type
      if (data) {
        this.id = data.row.id
      }
      if (type == 'edit') {
        this.$store
          .dispatch('center/getAirLine', {
            method: 'get',
            id: data.row.id,
            type: 'msg'
          })
          .then((res) => {
            console.log(res)
            this.airLineData = res.data
          })
      } else {
        this.airLineData = {
          code: null,
          beginDockCode: '',
          endDockCode: '',
          optionValue: '',
          seating: '',
          endDockCode: '',
          orgCode: '',
          orgName: '',
          sort: '',
          updated: '',
          id: ''
        }
      }
    }
  }
}
</script>
<style lang="scss">
@import "../../assets/icon/iconfont.css";
@import "../../assets/icon_01/iconfont.css";
.airLine {
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
  .airLine_table_btn {
    margin-bottom: 10px;
  }
  .airLine_table {
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
  .el-tree .el-tree-node .is-leaf + .el-checkbox .el-checkbox__inner {
    display: inline-block;
  }
  .el-tree .el-tree-node .el-checkbox .el-checkbox__inner {
    display: none;
  }
}
</style>
