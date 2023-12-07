<template>
  <div class="shipIndex">
    <div class="title">船舶管理</div>
    <div class="shipIndex_table">
      <el-form
        ref="shipIndexForm"
        :inline="true"
        label-width="90px"
        :label-position="labelPosition"
        :model="shipIndexForm"
        class="top_form demo-form-inline"
      >
        <el-form-item class="input_style_max" label="船舶名称：" prop="shipName">
          <el-input v-model="shipIndexForm.shipName" placeholder="请输入船舶名称" />
        </el-form-item>
        <el-form-item class="input_style_max" label="船舶类型：" prop="shipType">
          <el-select v-model="shipIndexForm.shipType" default-first-option="" placeholder="请选择船舶类型">
            <el-option label="全部" value="" />
            <el-option label="货船" :value="1" />
            <el-option label="客船" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item class="input_style_max" :label="isPassenger" prop="passengerVolume">
          <el-input v-model="shipIndexForm.passengerVolume" type="number" placeholder="请输入客（货）运量" />
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
            @click="resetForm('shipIndexForm')"
          >重置</el-button>
        </el-form-item>
      </el-form>
      <div class="shipIndex_table_btn">
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
    <shipPop v-if="shipIndexShow" :id="id" :ship-index-show="shipIndexShow" :types="isType" @changeState="changeDispatch" />
  </div>
</template>
<script>
import { pickerOptions } from '@/static/data'
import pageTable from '@/views/table/index'
import { getPagePromise } from '@/utils/auth'
import shipPop from '@/views/ships/pops/shipPop'
import { clearObject } from '@/utils/tool'
export default {
  components: {
    shipPop,
    pageTable
  },
  data() {
    return {
      id: '',
      typeList: [],
      labelName: '',
      shipIndexForm: {
        shipName: '',
        shipType: '',
        passengerVolume: '',
        pageIndex: 1,
        pageSize: 10
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData: [],
      orgCodeList: [],
      shipIndexShow: false,
      shipIndexData: {},
      labelPosition: 'left',
      pickerOptions,
      isType: '',
      table: {
        flag: true,
        selection: true,
        column: [
          { prop: 'shipCode', label: '船舶编码' },
          { prop: 'shipName', label: '船舶名称' },
          { prop: 'shipType', label: '船舶类型', symbol: true,
            formatter: (row) => {
              return row.shipType === null ? '-' : (row.shipType === 1 ? '货船' : '客船')
            }
          },
          { prop: 'passengerVolume', label: '载客（载重）' },
          { label: '操作', button: true, actions: [] }
        ],
        data: [],
        total: 0,
        current: 1
      },
      multipleSelection: []
    }
  },
  computed: {
    isPassenger() {
      if (this.shipIndexForm.shipType === 1) {
        return '货运：'
      } else if (this.shipIndexForm.shipType === 0) {
        return '客运：'
      } else if (this.shipIndexForm.shipType === '') {
        return '客(货)运：'
      }
    }
  },
  updated() {
    if (this.table.current !== this.shipIndexForm.pageIndex) {
      this.shipIndexForm.pageIndex = this.table.current
      this.getItemList(this.shipIndexForm)
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
    this.getItemList(this.shipIndexForm)
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
      this.getItemList(this.shipIndexForm)
    },
    resetForm(formName) {
      clearObject(this.shipIndexForm)
      this.getItemList()
    },
    getItemList(condition) {
      this.$store
        .dispatch('center/getShipIndex', {
          method: 'get',
          data: this.shipIndexForm,
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
      this.shipIndexForm.orgCodeName = this.orgCodeList.map(i => i.name).toString()
      this.shipIndexForm.orgCode = this.orgCodeList.map(i => i.code).toString()
    },
    changeDispatch(s) {
      this.shipIndexShow = s.state
      if (s.step === 1) {
        this.getItemList()
      }
    },
    deleteWharf(type, data) {
      if (data) {
        this.multipleSelection = []
        this.multipleSelection.push(data.row.id)
      }
      this.$store.dispatch('center/deleteShipIndexItems', {
        id: this.multipleSelection,
        t: this
      })
    },
    handleDispatch(type, data) {
      this.shipIndexShow = true
      console.log(this.shipIndexShow, data)
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
.shipIndex {
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
  .shipIndex_table_btn {
    margin-bottom: 10px;
  }
  .shipIndex_table {
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
