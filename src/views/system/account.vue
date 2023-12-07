<template>
  <div class="account">
    <div class="title">用户管理</div>
    <div class="account_table">
      <el-form
        ref="accountForm"
        :inline="true"
        label-width="90px"
        :label-position="labelPosition"
        :model="accountForm"
        class="top_form demo-form-inline"
      >
        <el-form-item class="input_style_max" label="用户名称：" prop="loginName">
          <el-input
            v-model="accountForm.loginName"
            placeholder="用户名称"
          />
        </el-form-item>
        <el-form-item class="input_style_max" label="姓名：" prop="name">
          <el-input v-model="accountForm.name" placeholder="姓名" />
        </el-form-item>
        <el-form-item class="input_style_max" label="角色：" prop="roleName">
          <el-input
            v-model="accountForm.roleName"
            placeholder="角色"
          />
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-select
            v-model="accountForm.status"
            class="input_style_max"
            placeholder="请选择状态"
            default-first-option=""
          >
            <el-option label="全部" value="" />
            <el-option label="启用" value="1" />
            <el-option label="停用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="组织架构："
          class="input_style_max"
        >
          <el-dropdown placement="bottom-start">
            <el-input
              v-model="orgCodeName"
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
        <el-form-item>
          <!-- <el-button type="primary" class="commit_btn" @click="onSubmit">查询</el-button> -->
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-search"
            @click="onSubmit"
          >查询</el-button>
          <el-button
            size="mini"
            icon="el-icon-refresh-left"
            @click="resetForm('accountForm')"
          >重置</el-button>
          <!-- <el-button type="primary" class="cancel_btn" @click="resetForm('accountForm')">清空</el-button> -->
        </el-form-item>
      </el-form>
      <div class="account_table_btn">
        <el-button v-if="tp('system:user:add')" type="primary" size="mini" @click="()=>accountEdit('new')"><i class="iconfont icon-adduser-btn" />创建</el-button>
        <el-button v-if="tp('system:user:enable')" plain size="mini" icon="el-icon-circle-check" @click="changeAccountsStatus(1)">启用</el-button>
        <el-button v-if="tp('system:user:disable')" plain size="mini" @click="changeAccountsStatus(0)"><i class="iconfont icon-tingyong_line" />停用</el-button>
        <el-button v-if="tp('system:user:delete')" plain size="mini" icon="el-icon-delete" @click="deleteAccounts">删除</el-button>
        <el-button plain size="mini" icon="el-icon-refresh" @click="getSynchronization">同步</el-button>
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
    <el-dialog
      title="配置角色"
      :visible.sync="DialogRoleSetVisible"
      width="60%"
      center
    >
      <el-form ref="checkForm" class="addPop" :model="checkForm" label-width="80px">
        <el-form-item>
          <!-- <el-checkbox-group>
          <el-checkbox :label="ri.id" name="">{{ri.name}}</el-checkbox>
        </el-checkbox-group> -->
          <el-checkbox-group v-model="checkForm.checkList">
            <el-checkbox v-for="(user) in checkForm.roleList" :key="user.id" :label="user.id">{{ user.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <!-- <el-checkbox-group v-model="checkList">
        <el-row :gutter="20">
          <el-col :span="8" v-for="ri in roleList" :key="ri.id">
            <el-checkbox :label="ri.id">{{ ri.name }}</el-checkbox>
          </el-col>
        </el-row>
      </el-checkbox-group> -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeAccountRoles">配 置</el-button>
        <el-button @click="DialogRoleSetVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <account-pop v-if="accountShow" :id="id" :account-show="accountShow" :types="isType" @changeState="changeDispatch" />
  </div>
</template>
<script>
import pageTable from '@/views/table/index'
import { getPagePromise } from '@/utils/auth'
import { getInfo } from '@/utils/auth'
import accountPop from '@/views/system/prop/accountDialog'
// import { login } from '@/api/user'
export default {
  name: 'Account',
  components: {
    pageTable,
    accountPop
  },
  data() {
    return {
      accountShow: false,
      id: '',
      isType: '',
      labelPosition: 'left',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      table: {
        flag: true,
        selection: true,
        column: [
          // { prop: 'id', label: '用户ID' },
          { prop: 'loginName', label: '用户名称', width: '120' },
          { prop: 'name', label: '姓名', width: '120' },
          {
            prop: 'status',
            label: '状态',
            symbol: true,
            formatter: (row) => {
              return row.status ? '启用' : '停用'
            },
            width: '100'
          },
          {
            prop: 'roleNames',
            label: '角色',
            symbol: true,
            formatter: (row) => {
              return row.roleNames.join('，')
            },
            width: '350'
          },
          { prop: 'organizationName', label: '所属机构' },
          { prop: 'created', label: '创建时间', width: '150' },
          { label: '操作', button: true, actions: [], width: '200' }
        ],
        data: [],
        total: 0,
        current: 1
      },
      accountForm: {
        name: '',
        loginName: '',
        roleName: '',
        status: '',
        pageSize: 10,
        pageIndex: 1,
        organizationCodes: ''
      },
      orgCodeName: '',
      multipleSelection: [],
      DialogRoleSetVisible: false,
      currentType: 'account',
      checkForm: {
        roleList: [],
        checkList: []
      },
      // checkList: [],
      targetRow: {},
      orgCodeList: [],
      pagePromise: []
    }
  },
  mounted() {
    console.log('account----mounted')
    console.log('oooooooooo222')
    this.$store.dispatch('center/getDepartmentData').then((res) => {
      // console.log('---treeData---')
      // console.log(res)
      this.treeData = res.data
    }).finally(() => {
      setTimeout(() => {
        getPagePromise().then((res) => {
          // console.log('--判断操作权限--')
          // console.log(res)
          this.pagePromise = res
          this.tp('system:user:detail') &&
          this.table.column[this.table.column.length - 1].actions.push({
            label: '查看',
            click: (data) => this.accountEdit('msg', data),
            type: 'text'
          //   icon:"el-icon-edit"
          })
          this.tp('system:user:edit') &&
          this.table.column[this.table.column.length - 1].actions.push({
            label: '编辑',
            click: (data) => this.accountEdit('edit', data),
            type: 'text'
          })
          this.tp('system:user:role') &&
          this.table.column[this.table.column.length - 1].actions.push({
            label: '配置角色',
            click: this.showModal,
            type: 'text'
          })
          // console.log('--↓data↓--')
          // console.log(this.table)
          // console.log(this.table.column[this.table.column.length - 1].actions.push(123))
        })
      }, 20)
    })

    this.getAccountList(this.accountForm)
  },
  updated() {
    if (this.table.current !== this.accountForm.pageIndex) {
      this.accountForm.pageIndex = this.table.current
      this.getAccountList(this.accountForm)
    }
  },
  activated() {
    this.getAccountList(this.accountForm)
  },
  methods: {
    /** transformPromise*/
    tp(k) {
      return this.pagePromise.indexOf(k) > -1
    },
    getRoleListById(condition) {
      this.$store.dispatch('center/getRoleListById', condition).then((res) => {
        this.checkForm.roleList = res.data.list
        this.checkForm.checkList = res.data.checkedIds
      })
    },
    showModal(data) {
      if (data.row.name === getInfo().userName) {
        this.$message.error('无法给自己配置角色')
        return
      } else {
        this.getRoleListById({ pageSize: 1000, pageIndex: 1, id: data.row.id })
        this.DialogRoleSetVisible = true
        this.targetRow = data.row
      }
    },
    onSubmit() {
      this.getAccountList(this.accountForm)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.getAccountList()
    },
    getAccountList(condition) {
      this.$store.dispatch('center/getList', {
        condition,
        container: this.table,
        t: this
      })
    },
    deleteAccounts() {
      this.$store.dispatch('center/deleteItems', {
        list: this.multipleSelection,
        t: this
      })
    },
    changeAccountsStatus(status) {
      this.$store.dispatch('center/changeStatus', {
        status,
        list: this.multipleSelection,
        t: this
      })
    },
    getSelectData(list) {
      this.multipleSelection = list.map((i) => i.id)
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    changeAccountRoles() {
      this.$store
        .dispatch('center/changeAccountRoles', {
          id: this.targetRow.id,
          ids: this.checkForm.checkList
        })
        .then((res) => {
          this.$message.success('配置角色成功')
          this.DialogRoleSetVisible = false
          this.getAccountList(this.accountForm)
        })
    },
    changeDispatch(s) {
      this.accountShow = s.state
      console.log(this.accountShow, 'hhhh')
      if (s.step === 1) {
        this.getAccountList()
      }
    },
    accountEdit(type, data) {
      this.accountShow = true
      console.log(this.accountShow)
      this.isType = type
      if (data) {
        this.id = data.row.id
      } else {
        this.id = ''
      }
      // let query = {};
      // type !== "new" && (query = { type, id: data.row.id });
      // this.$router.push({ path: "/accountEdit", query });
    },
    getSynchronization() {
      this.$confirm('确定同步？', '警告', { type: 'warning' })
        .then(() => {
          this.$store.dispatch('center/getSync').then((res) => {
            this.$message.success(res.message)
            this.getAccountList()
          })
        })
        .catch(() => {
          this.$message.error('取消同步')
        })
    },
    handleCheckChange(data, checked, tree) {
      console.log(data)
      // if (checked) {
      // this.$refs.tree.setCheckedNodes([data])
      // }
    },
    handleNodeClick() {
      this.orgCodeList = this.$refs.tree.getCheckedNodes().map((i) => ({ code: i.extra, name: i.label }))
      this.orgCodeName = this.orgCodeList.map(i => i.name).toString()
      this.accountForm.organizationCodes = this.orgCodeList.map(i => i.code).toString()
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../assets/icon/iconfont.css";
.account {
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
  .account_table_btn{
     margin-bottom: 10px;
  }
  .account_table {
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
