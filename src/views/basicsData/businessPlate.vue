<template>
  <div class="businessPlate">
    <div class="title">业务板块管理</div>
    <div class="businessPlate_table">
      <el-form
        ref="plateForm"
        :inline="true"
        label-width="90px"
        :label-position="labelPosition"
        :model="plateForm"
        class="top_form demo-form-inline"
      >
        <el-form-item
          class="input_style_max"
          label="板块名称："
          prop="loginName"
        >
          <el-input
            v-model="plateForm.name"
            placeholder="请输入板块名称"
          />
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
          <el-button type="primary" size="mini" icon="el-icon-search" @click="onSubmit">查询</el-button>
          <el-button size="mini" icon="el-icon-refresh-left" @click="resetForm('plateForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="businessPlate_table_btn">
        <el-button
          type="primary"
          size="mini"
          @click="handleDispatch('add')"
        ><i class="iconfont icon-addfirm-btn" />创建</el-button>
        <el-button
          plain
          size="mini"
          icon="el-icon-delete"
          @click="deleteBusiness('delete')"
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
    <dispatch v-if="dispatchShow" :dispatch-show="dispatchShow" :types="isType" :data-list="dispatchData" @changeState="changeDispatch" />
  </div>
</template>
<script>
import { pickerOptions } from '@/static/data'
import pageTable from '@/views/table/index'
import { getPagePromise } from '@/utils/auth'
import dispatch from '@/views/basicsData/pops/dispatch'
import { clearObject } from '@/utils/tool'
export default {
  components: {
    dispatch,
    pageTable
  },
  data() {
    return {
      plateForm: {
        name: '',
        updated: null,
        pageIndex: 1,
        pageSize: 10
      },
      isTime: null,
      dispatchShow: false,
      dispatchData: {},
      labelPosition: 'left',
      pickerOptions,
      isType: '',
      table: {
        flag: true,
        selection: true,
        column: [
          { prop: 'code', label: '板块编码' },
          { prop: 'name', label: '板块名称' },
          { prop: 'description', label: '描述' },
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
    if (this.table.current !== this.plateForm.pageIndex) {
      this.plateForm.pageIndex = this.table.current
      this.getItemList(this.plateForm)
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
          click: (data) => this.deleteBusiness('deleteOne', data),
          type: 'text'
        })
      })
    }, 200)
    this.getItemList(this.plateForm)
  },
  methods: {
    tp(k) {
      return this.pagePromise.indexOf(k) > -1
    },
    onSubmit() {
      if (this.isTime) {
        this.plateForm.updated = this.isTime.toString()
      } else {
        this.plateForm.updated = null
      }
      this.getItemList(this.plateForm)
    },
    resetForm(formName) {
      this.isTime = null
      clearObject(this.plateForm)
      this.plateForm.updated = null
      // this.$refs[formName].resetFields();
      this.getItemList()
    },
    getItemList(condition) {
      this.$store.dispatch('center/getBusiness', { method: 'get', data: this.plateForm, type: 'list', container: this.table }).then()
    },
    getSelectData(list) {
      this.multipleSelection = list.map(i => i.id)
    },
    changeDispatch(s) {
      this.dispatchShow = s.state
      if (s.step == 1) {
        this.getItemList()
      }
    },
    deleteBusiness(type, data) {
      console.log(type, data)
      if (data) {
        this.multipleSelection = []
        this.multipleSelection.push(data.row.id)
      }
      this.$store.dispatch('center/deleteOneItems', {
        id: this.multipleSelection,
        t: this
      })
    },
    handleDispatch(type, data) {
      this.dispatchShow = true
      this.isType = type
      if (type === 'edit') {
        this.$store.dispatch('center/getBusiness', { method: 'get', id: data.row.id, type: 'msg' }).then((res) => {
          this.dispatchData = res.data
        })
      } else {
        this.dispatchData = {
          sort: null,
          description: '',
          name: '',
          code: '',
          biUrlBigScreen: '',
          biUrlMobile: '',
          biUrlPcWeb: ''
        }
      }
    }
  }
}
</script>
<style lang="scss">
@import "../../assets/icon/iconfont.css";
@import "../../assets/icon_01/iconfont.css";
.businessPlate {
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
  .businessPlate_table_btn{
     margin-bottom: 10px;
  }
  .businessPlate_table {
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
