<template>
  <div class="businessData">
    <div class="title">经营数据查询</div>
    <div class="businessData_table">
      <el-form
        ref="businessDataForm"
        :inline="true"
        label-width="90px"
        :label-position="labelPosition"
        :model="businessDataForm"
        class="top_form demo-form-inline"
      >
        <el-form-item class="input_style_max" label="指标名称：" prop="name">
          <el-input
            v-model="businessDataForm.name"
            placeholder="请输入指标名称"
          />
        </el-form-item>
        <!-- <el-form-item class="input_style_max" label="所属板块：" prop="name">
          <el-select
            v-model="businessDataForm.businessBlockCode"
            default-first-option=""
            placeholder="请选择所属板块"
          >
            <el-option
              v-for="i in typeList"
              :label="i.name"
              :value="i.code"
              :key="i.id"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item class="input_style_max" label="所属板块：" prop="name">
          <el-select
            v-model="businessDataForm.organizationCode"
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
            @click="resetForm('businessDataForm')"
          >重置</el-button>
        </el-form-item>
      </el-form>
      <div class="businessData_table_btn">
        <el-button type="success" plain size="mini" @click="exportList"><i class="iconfont icon-daochu" />导出</el-button>
        <!-- <el-button type="primary" size="mini" @click="handleDispatch('add')"
          ><i class="iconfont icon-addfirm-btn"></i>创建</el-button
        >
        <el-button
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
  </div>
</template>
<script>
import { pickerOptions } from '@/static/data'
import pageTable from '@/views/table/index'
// import { getPagePromise } from '@/utils/auth'
import { clearObject } from '@/utils/tool'
export default {
  name: 'BusinessData',
  components: {
    pageTable
  },
  data() {
    return {
      labelPosition: 'left',
      table: {
        flag: true,
        selection: true,
        column: [
          { prop: 'name', label: '指标名称' },
          { prop: 'indicatorValue', label: '指标值' },
          { prop: 'indicatorUnit', label: '单位' },
          { prop: 'description', label: '描述' },
          { prop: 'cycle', label: '上报周期' },
          //   { prop: "", label: "所属板块" },
          { prop: 'organizationName', label: '所属公司' },
          { prop: 'created', label: '创建时间' }
        ],
        data: [],
        total: 0,
        current: 1
      },
      businessDataForm: {
        organizationCode: '',
        updated: null,
        name: '',
        pageIndex: 1,
        pageSize: 10
      },
      isTime: null,
      businessDataShow: false,
      businessDataData: {},
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
    if (this.table.current !== this.businessDataForm.pageIndex) {
      this.businessDataForm.pageIndex = this.table.current
      this.getItemList(this.businessDataForm)
    }
  },
  mounted() {
    this.getItemList(this.businessDataForm)
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
        this.businessDataForm.created = this.isTime.toString()
      } else {
        this.businessDataForm.created = null
      }
      this.getItemList(this.businessDataForm)
    },
    resetForm(formName) {
      this.isTime = null
      clearObject(this.businessDataForm)
      this.businessDataForm.created = null
      this.getItemList()
    },
    getItemList(condition) {
      this.$store
        .dispatch('center/getbusinessData', {
          method: 'get',
          data: this.businessDataForm,
          type: 'list',
          container: this.table
        })
        .then()
    },
    getSelectData(list) {
      this.multipleSelection = list.map((i) => i.id)
    },
    exportList() {
    //   this.businessDataForm.ids = this.multipleSelection.join(',');
      const exportObj = {}
      for (const key in this.businessDataForm) {
        this.businessDataForm[key] && this.businessDataForm[key] !== 0 ? (exportObj[key] = this.businessDataForm[key]) : false
      }
      console.log(exportObj)
      this.$store.dispatch('center/getbusinessData', { method: 'get', data: exportObj, type: 'export' }).then(res => {
        const URL = window.URL || window.webkitURL
        this.downloadUrl && URL.revokeObjectURL(this.downloadUrl)
        this.downloadUrl = URL.createObjectURL(res)
        let a = document.createElement('a')
        a.download = '经营数据查询-' + (new Date().getTime()) + '.xlsx'
        a.href = this.downloadUrl
        a.click()
        a = null
      }).catch()
    },
    changeDispatch(s) {
      this.businessDataShow = s.state
      if (s.step === 1) {
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
      this.businessDataShow = true
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
<style lang="scss" scoped>
@import "../../assets/icon/iconfont.css";
@import "../../assets/icon_01/iconfont.css";
.businessData {
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
  .businessData_table_btn {
    margin-bottom: 10px;
  }
  .businessData_table {
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
