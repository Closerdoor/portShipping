<template>
  <div class="wharfManagement">
    <div class="title">码头港口管理</div>
    <div class="wharfManagement_table">
      <el-form
        ref="wharfForm"
        :inline="true"
        label-width="90px"
        :label-position="labelPosition"
        :model="wharfForm"
        class="top_form demo-form-inline"
      >
        <el-form-item
          class="input_style_max"
          label="码头名称："
          prop="loginName"
        >
          <el-input
            v-model="wharfForm.name"
            placeholder="请输入码头名称"
          />
        </el-form-item>
        <el-form-item
          class="input_style_max"
          label="所属公司："
        >
          <el-dropdown placement="bottom-start">
            <el-input
              v-model="wharfForm.orgCodeName"
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
          <el-button type="primary" size="mini" icon="el-icon-search" @click="onSubmit">查询</el-button>
          <el-button size="mini" icon="el-icon-refresh-left" @click="resetForm('wharfForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="wharfManagement_table_btn">
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
    <wharf v-if="wharfShow" :id="id" :wharf-show="wharfShow" :types="isType" @changeState="changeDispatch" />
  </div>
</template>
<script>
import { pickerOptions } from '@/static/data'
import pageTable from '@/views/table/index'
import { getPagePromise } from '@/utils/auth'
import wharf from '@/views/basicsData/pops/wharfPop'
import { clearObject } from '@/utils/tool'
export default {
  components: {
    wharf,
    pageTable
  },
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      wharfForm: {
        name: '',
        updated: null,
        orgCode: '',
        orgCodeName: '',
        pageIndex: 1,
        pageSize: 10
      },
      isTime: null,
      wharfShow: false,
      wharfData: {},
      labelPosition: 'left',
      pickerOptions,
      isType: '',
      id: '',
      table: {
        flag: true,
        selection: true,
        column: [
          { prop: 'code', label: '码头编码' },
          { prop: 'name', label: '码头港口名称' },
          { prop: 'orgName', label: '所属公司' },
          { prop: 'address', label: '地址' },
          { prop: 'berthNumber', label: '泊位数量' },
          { prop: 'coastlineLength', label: '岸线长度' },
          { prop: 'sort', label: '排序' },
          { prop: 'coordinate', label: '经纬度' },
          { prop: 'updated', label: '时间' },
          { label: '操作', button: true, actions: [] }
        ],
        data: [],
        total: 0,
        current: 1
      },
      multipleSelection: [],
      orgCodeList: []
    }
  },
  updated() {
    if (this.table.current !== this.wharfForm.pageIndex) {
      this.wharfForm.pageIndex = this.table.current
      this.getItemList(this.wharfForm)
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
    this.getItemList(this.wharfForm)
    this.$store.dispatch('center/getDepartmentData').then((res) => {
      this.treeData = res.data
    })
  },
  methods: {
    tp(k) {
      return this.pagePromise.indexOf(k) > -1
    },
    onSubmit() {
      if (this.isTime) {
        this.wharfForm.updated = this.isTime.toString()
      } else {
        this.wharfForm.updated = null
      }
      this.getItemList(this.wharfForm)
    },
    resetForm(formName) {
      this.isTime = null
      clearObject(this.wharfForm)
      this.$refs.tree.setCheckedKeys([])
      this.wharfForm.updated = null
      this.getItemList()
    },
    getItemList(condition) {
      this.$store.dispatch('center/getWharf', { method: 'get', data: this.wharfForm, type: 'list', container: this.table }).then()
    },
    getSelectData(list) {
      this.multipleSelection = list.map(i => i.id)
    },
    handleCheckChange(data, checked, tree) {
      if (checked) {
        this.$refs.tree.setCheckedNodes([data])
      }
    },
    handleNodeClick() {
      this.orgCodeList = this.$refs.tree.getCheckedNodes().map((i) => ({ code: i.extra, name: i.label }))
      this.wharfForm.orgCodeName = this.orgCodeList.map(i => i.name).toString()
      this.wharfForm.orgCode = this.orgCodeList.map(i => i.code).toString()
    },
    changeDispatch(s) {
      this.wharfShow = s.state
      if (s.step === 1) {
        this.getItemList()
      }
    },
    deleteWharf(type, data) {
      if (data) {
        this.multipleSelection = []
        this.multipleSelection.push(data.row.id)
      }
      this.$store.dispatch('center/deleteWharfItems', {
        id: this.multipleSelection,
        t: this
      })
    },
    handleDispatch(type, data) {
      this.wharfShow = true
      this.isType = type
      if (data) {
        this.id = data.row.id
      } else {
        this.id = ''
      }
      //   if(type == 'edit'){
      //     this.$store.dispatch('center/getWharf', {method:'get',id:data.row.id, type:'msg'}).then((res)=>{
      //       this.wharfData = res.data

    //     })
    //   }else{
    //     this.wharfData =  {
    //         name:null,
    //         orgCode:'',
    //         orgCodeName:'',
    //         address:'',
    //         berthNumber:'',
    //         coastlineLength:'',
    //         sort:'',
    //         coordinate:'',
    //         updated:'',
    //         code:''
    //      }
    //   }
    }
  }
}
</script>
<style lang="scss">
    @import "../../assets/icon/iconfont.css";
@import "../../assets/icon_01/iconfont.css";
.wharfManagement {
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
  .wharfManagement_table_btn{
     margin-bottom: 10px;
  }
  .wharfManagement_table {
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
