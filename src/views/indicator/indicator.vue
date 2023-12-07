<template>
  <div class="indicatorManagement">
    <div class="title">指标管理</div>
    <div class="indicatorManagement_table">
      <el-form
        ref="indicatorForm"
        :inline="true"
        label-width="90px"
        :label-position="labelPosition"
        :model="indicatorForm"
        class="top_form demo-form-inline"
      >
        <el-form-item class="input_style_max" label="指标名称：" prop="name">
          <el-input
            v-model="indicatorForm.name"
            placeholder="请输入指标名称"
          />
        </el-form-item>
        <el-form-item class="input_style_max" label="所属板块：" prop="name">
          <el-select
            v-model="indicatorForm.businessBlockCode"
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
            @click="resetForm('indicatorForm')"
          >重置</el-button>
        </el-form-item>
      </el-form>
      <div class="indicatorManagement_table_btn">
        <el-button
          type="primary"
          size="mini"
          @click="handleDispatch('add')"
        ><i class="iconfont icon-addfirm-btn" />创建</el-button>
        <el-button
          plain
          size="mini"
          icon="el-icon-delete"
          @click="deleteIndicator('delete')"
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
    <indicatorPop
      v-if="indicatorShow"
      :id="id"
      :indicator-line-show="indicatorShow"
      :types="isType"
      @changeState="changeDispatch"
    />
  </div>
</template>
<script>
import { pickerOptions } from '@/static/data'
import pageTable from '@/views/table/index'
import { getPagePromise } from '@/utils/auth'
import indicatorPop from '@/views/indicator/pops/indicatorPop'
import { clearObject } from '@/utils/tool'
export default {
  name: 'Indicator',
  components: {
    indicatorPop,
    pageTable
  },
  data() {
    return {
      labelPosition: 'left',
      table: {
        flag: true,
        selection: true,
        column: [
          { prop: 'businessBlockName', label: '所属板块' },
          { prop: 'parentName', label: '父指标' },
          { prop: 'name', label: '指标名称' },
          { prop: 'id', label: '指标ID', width: 320 },
          { prop: 'indicatorUnit', label: '单位', width: 100 },
          // { prop: 'description', label: '描述' },
          { prop: 'cycle', label: '上报周期', width: 100 },
          { prop: 'sort', label: '排序', width: 60 },
          // { prop: 'level', label: '分类层级' },
          // { prop: 'earlyWarning', label: '预警状态' },
          { prop: 'updated', label: '时间', width: 160 },
          { label: '操作', button: true, actions: [] }
        ],
        data: [],
        total: 0,
        current: 1
      },
      indicatorForm: {
        businessBlockName: '',
        updated: null,
        name: '',
        pageIndex: 1,
        pageSize: 10
      },
      isTime: null,
      indicatorShow: false,
      indicatorData: {},
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
    if (this.table.current !== this.indicatorForm.pageIndex) {
      this.indicatorForm.pageIndex = this.table.current
      this.getItemList(this.indicatorForm)
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
          click: (data) => this.deleteIndicator('deleteOne', data),
          type: 'text'
        })
      })
    }, 200)
    this.getItemList(this.indicatorForm)
    this.$store.dispatch('center/getbusinessOption', { pageIndex: 1, pageSize: 99999 }).then((res) => {
      this.typeList = res.data.list
    })
  },
  methods: {
    tp(k) {
      return this.pagePromise.indexOf(k) > -1
    },
    onSubmit() {
      if (this.isTime) {
        this.indicatorForm.updated = this.isTime.toString()
      } else {
        this.indicatorForm.updated = null
      }
      this.getItemList(this.indicatorForm)
    },
    resetForm(formName) {
      this.isTime = null
      clearObject(this.indicatorForm)
      this.indicatorForm.updated = null
      this.getItemList()
    },
    getItemList(condition) {
      this.$store
        .dispatch('center/getIndicator', {
          method: 'get',
          data: this.indicatorForm,
          type: 'list',
          container: this.table
        })
        .then()
    },
    getSelectData(list) {
      this.multipleSelection = list.map((i) => i.id)
    },
    changeDispatch(s) {
      this.indicatorShow = s.state
      if (s.step == 1) {
        this.getItemList()
      }
    },
    deleteIndicator(type, data) {
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
      this.indicatorShow = true
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
.indicatorManagement {
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
  .indicatorManagement_table_btn {
    margin-bottom: 10px;
  }
  .indicatorManagement_table {
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
