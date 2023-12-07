<template>
  <div class="role">
    <div class="title">角色管理</div>
    <div class="role_table">
      <el-form
        ref="roleForm"
        :inline="true"
        :model="roleForm"
        label-width="90px"
        :label-position="labelPosition"
        class="demo-form-inline top_form"
      >
        <el-form-item class="input_style_max" label="角色名称：" prop="name">
          <el-input v-model="roleForm.name" placeholder="请选择角色名称" />
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
        <!-- <el-form-item label="状态：" prop="status">
          <el-select
            class="input_style_max"
            v-model="roleForm.status"
            placeholder="请选择状态"
            default-first-option=""
          >
            <el-option label="全部" value="" />
            <el-option label="启用" value="1" />
            <el-option label="停用" value="0" />
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-search"
            @click="onSubmit"
          >查询</el-button>
          <el-button
            icon="el-icon-refresh-left"
            @click="resetForm('roleForm')"
          >重置</el-button>
        </el-form-item>
      </el-form>
      <div class="role_table_btn">
        <el-button
          v-if="tp('system:role:add')"
          type="primary"
          size="mini"
          @click="roleEdit('new')"
        ><i class="iconfont icon-addfirm-btn" />创建</el-button>
        <!-- <el-button
          v-if="tp('system:role:enable')"
          size="mini"
          icon="el-icon-circle-check"
          @click="changeRolesStatus(1)"
          >启用</el-button
        >
        <el-button
          v-if="tp('system:role:disable')"
          size="mini"
          @click="changeRolesStatus(0)"
          ><i class="iconfont icon-tingyong_line"></i>停用</el-button
        > -->
        <el-button
          v-if="tp('system:role:delete')"
          size="mini"
          icon="el-icon-delete"
          @click="deleteRoles('any')"
        >删除</el-button>
      </div>
      <page-table
        v-if="table.flag"
        :column="table.column"
        :source="table.data"
        :selection="table.selection"
        :total="table.total"
        :current="table.current"
        @selectData="(l) => getSelectData('role', l)"
        @currentChange="(v) => (this.table.current = v)"
      />

      <!-- table -->
      <el-dialog
        title="配置账户"
        width="80%"
        class="setRole"
        :show-close="false"
        :close-on-click-modal="false"
        :visible.sync="dialogSetTableVisible"
        center
        :destroy-on-close="true"
      >
        <el-form ref="accountForm" :inline="true" :model="accountForm">
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="账户名称："
                class="input_style"
                prop="loginName"
              >
                <el-input v-model="accountForm.loginName" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="姓名：" class="input_style" prop="name">
                <el-input v-model="accountForm.name" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-button
                type="primary"
                class="commit_btn"
                @click="() => getRoleAccountList(this.accountForm)"
              >查询</el-button>
            </el-col>
            <el-col :span="2">
              <el-button
                type="primary"
                class="cancel_btn"
                @click="clearAccountForm"
              >清空</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          ref="accountTableNew"
          height="350"
          row-key="id"
          :data="accountTableNew.list"
          @select="handleSelect"
          @selection-change="handleSelectionChange"
        >
          <el-table-column :reserve-selection="true" type="selection" />
          <el-table-column prop="loginName" label="账户名称" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="organizationName" label="所属机构" />
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next, total"
          :page-size="accountSourceForm.pageSize"
          :total="accountSourceForm.totalCount"
          :current-page.sync="accountSourceForm.pageIndex"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
        <div slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            class="commit_btn"
            @click="setRoleAccount"
          >配 置</el-button>
          <el-button
            class="cancel_btn"
            @click="closeSetTableVisible()"
          >取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="配置权限"
        width="30%"
        :visible.sync="dialogRoleTableVisible"
        center
      >
        <!-- <el-form :label-position="labelPosition" ref="form" class="" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="角色名称：" class="input_style" prop="name">
          <div v-if="this.$route.query.type === 'msg'">{{form.name}}</div>
          <el-input v-else class="mr" v-model="form.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="所属板块：" class="input_style">
          <div v-if="this.$route.query.type === 'msg'">{{form.businessBlockName}}</div>
          <el-input v-else class="mr" v-model="form.businessBlockName" placeholder="请输入所属板块"></el-input>
        </el-form-item>
        <el-form-item label="所属公司：" class="input_style">
          <div v-if="this.$route.query.type === 'msg'">{{form.orgName}}</div>
          <el-input v-else class="mr" v-model="form.orgName" placeholder="请输入所属公司"></el-input>
        </el-form-item>
        <el-form-item class="input_style" label="描述">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form> -->

        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <el-tree
                ref="systemTree"
                :props="defaultProps"
                :data="treeData"
                node-key="id"
                accordion
                show-checkbox
                :expand-on-click-node="false"
                @check-change="handleCheckChange"
              />
              <el-tree
                ref="systemTree"
                :props="defaultProps"
                :data="treeDataCategory"
                node-key="id"
                accordion
                show-checkbox
                :expand-on-click-node="false"
                @check-change="handleCheckChange"
              />
            </div>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            class="commit_btn"
            @click="setRoleSystemTree"
          >配 置</el-button>
          <el-button
            class="cancel_btn"
            @click="dialogRoleTableVisible = false"
          >取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <role-edit
      v-if="roleShow"
      :id="id"
      :role-edit-show="roleShow"
      :types="isType"
      @changeState="changeDispatch"
    />
    <add-account v-if="showAddAccount" :role-id="id" :is-show="showAddAccount" @changeState="updateState" />

  </div>
</template>
<script>
import pageTable from '@/views/table/index'
import roleEdit from '@/views/system/prop/roleDialog'
import addAccount from '@/views/system/prop/addAccount'
import { getPagePromise } from '@/utils/auth'
import { pickerOptions } from '@/static/data'
import { clearObject } from '@/utils/tool'
export default {
  name: 'Role',
  components: {
    pageTable,
    roleEdit,
    addAccount
  },
  data() {
    return {
      roleShow: false,
      id: '',
      isType: '',
      labelPosition: 'left',
      table: {
        flag: false,
        selection: true,
        column: [
          { prop: 'name', label: '角色名称' },
          { prop: 'businessBlockName', label: '所属板块' },
          { prop: 'orgName', label: '所属公司' },
          { prop: 'remark', label: '描述' },
          { prop: 'updated', label: '更新时间' },
          { label: '操作', button: true, actions: [] }
        ],
        data: [],
        total: 0,
        current: 1
      },
      pickerOptions,
      isTime: null,
      treeData: [],
      treeDataCategory: [],
      roleForm: {
        name: '',
        updated: null,
        pageSize: 10,
        pageIndex: 1
      },
      multipleSelection: [],
      multipleSelectionAll: [],
      checkAll: [],
      idkey: 'id',
      accountForm: {
        loginName: '',
        name: '',
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0
      },
      accountSourceForm: {
        loginName: '',
        name: '',
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0
      },
      accountTableNew: {
        checkedIds: [],
        list: []
      },
      accountCheckedMap: {},
      checkedCount: 0,
      accountTable: {
        flag: false,
        selection: true,
        column: [
          { prop: 'loginName', label: '账户名称' },
          { prop: 'name', label: '姓名' },
          { prop: 'organizationName', label: '所属机构' }
        ],
        checkedIds: [],
        data: [],
        total: 0,
        current: 1
      },
      dialogSetTableVisible: false,
      dialogRoleTableVisible: false,
      formLabelWidth: '120px',
      defaultProps: {
        label: 'label',
        children: 'children'
      },
      count: 1,
      targetId: '',
      checkList: ['选中且禁用', '复选框 A'],
      currentType: 'role',
      pagePromise: [],
      selectData: [],
      selectDataLength: 0,
      showAddAccount: false
    }
  },
  created() {
    // this.getRoleList();
  },
  mounted() {
    console.log('ssssss')
    console.log(this.$store)
    setTimeout(() => {
      getPagePromise().then((res) => {
        console.log('--↓data↓--')
        console.log(res)
        this.pagePromise = res
        // this.tp("system:role:detail") &&
        //   this.table.column[this.table.column.length - 1].actions.push({
        //     label: "查看",
        //     click: (data) => this.roleEdit("msg", data),
        //     type: "text",
        //   });
        this.tp('system:role:edit') &&
          this.table.column[this.table.column.length - 1].actions.push({
            label: '编辑',
            click: (data) => this.roleEdit('edit', data),
            type: 'text'
          })
        this.tp('system:role:delete') &&
          this.table.column[this.table.column.length - 1].actions.push({
            label: '删除',
            click: (data) => this.deleteRoles('delete', data),
            type: 'text'
          })
        this.tp('system:role:add') &&
          this.table.column[this.table.column.length - 1].actions.push({
            label: '添加用户',
            click: (data) => this.addAccount('add', data),
            type: 'text'
          })
        // this.tp("system:role:user") &&
        //   this.table.column[this.table.column.length - 1].actions.push({
        //     label: "配置账户",
        //     click: (data) => this.getSetRole(data),
        //     type: "text",
        //   });
        // this.tp("system:role:authority") &&
        //   this.table.column[this.table.column.length - 1].actions.push({
        //     label: "配置权限",
        //     click: this.getRoleSystemTree,
        //     type: "text",
        //   });
      })
    }, 200)
    this.getRoleList()
  },
  updated() {
    if (this.table.current !== this.roleForm.pageIndex) {
      this.roleForm.pageIndex = this.table.current
      this.getRoleList(this.roleForm)
    }
  },
  methods: {
    /** transformPromise*/
    tp(k) {
      return this.pagePromise.indexOf(k) > -1
    },
    onSubmit() {
      if (this.isTime) {
        this.roleForm.updated = this.isTime.toString()
      } else {
        this.roleForm.updated = null
      }
      this.getRoleList(this.roleForm)
    },
    resetForm(formName) {
      this.isTime = null
      clearObject(this.roleForm)
      this.roleForm.updated = null
      this.getRoleList()
    },
    changeRolesStatus(status) {
      this.$store.dispatch('center/changeStatus', {
        status,
        list: this.multipleSelection,
        t: this
      })
    },
    deleteRoles(type, data) {
      if (data) {
        this.multipleSelection = []
        this.multipleSelection.push(data.row.id)
      }
      this.$store.dispatch('center/deleteItems', {
        list: this.multipleSelection,
        t: this
      })
    },
    getRoleList(condition) {
      this.$store.dispatch('center/getList', {
        condition,
        container: this.table,
        t: this
      })
    },
    getRoleAccountList(condition) {
      this.accountSourceForm = { ...this.accountSourceForm, ...condition }
      this.$store
        .dispatch('center/getRoleAccountList', {
          condition: this.accountSourceForm,
          container: this.accountTableNew,
          id: this.targetId,
          t: this
        })
        .then((res) => {
          this.accountTableNew = res.data
          this.accountTableNew.checkedIds = res.data.checkedIds
          this.accountSourceForm.pageSize = 10
          this.accountSourceForm.pageIndex = res.data.pageIndex
          this.accountSourceForm.totalCount = res.data.totalCount
          for (let j = 0; j < res.data.checkedIds.length; j++) {
            const element = res.data.checkedIds[j]
            if (typeof this.accountCheckedMap[element] === 'undefined') {
              this.checkedCount = this.checkedCount + 1
              this.accountCheckedMap[element] = true
            }
          }

          for (let index = 0; index < res.data.list.length; index++) {
            const row = res.data.list[index]
            if (this.accountCheckedMap[row.id]) {
              this.showChecked(row.id)
              this.accountCheckedMap[row.id] = true
            } else {
              this.accountCheckedMap[row.id] = false
            }
          }
        })
    },
    handleSelect(selection, row) {
      if (this.checkedCount == selection.length) {
        return
      }

      if (this.checkedCount < selection.length) {
        this.checkedCount = this.checkedCount + 1
        this.accountCheckedMap[row.id] = true
        this.$refs.accountTableNew.toggleRowSelection(row, true)
      } else {
        this.checkedCount = this.checkedCount - 1
        this.accountCheckedMap[row.id] = false
        this.$refs.accountTableNew.toggleRowSelection(row, false)
      }
    },
    showChecked(element) {
      this.$nextTick(() => {
        for (let i = 0; i < this.accountTableNew.list.length; i++) {
          const row = this.accountTableNew.list[i]

          if (row.id == element) {
            this.$refs.accountTableNew.toggleRowSelection(row, true)
            break
          }
        }
      })
    },
    setRoleAccount() {
      const pageAccounts = this.accountTableNew.list
      const accountCheckList = new Array()
      for (const key in this.accountCheckedMap) {
        accountCheckList.push({
          accountId: key,
          checked: this.accountCheckedMap[key]
        })
      }
      this.$store
        .dispatch('center/setRoleAccount', {
          list: accountCheckList,
          id: this.targetId,
          t: this
        })
        .then(() => {
          this.$message.success('配置成功')
          this.dialogSetTableVisible = false
        })
    },

    getAll(page) {
      this.accountTable.current = page
    },
    // 勾选复选框事件
    getSelectData(t, list) {
      if (t === 'role') {
        this.multipleSelection = list.map((i) => i.id)
      }
    },
    getRoleSystemTree(data) {
      this.targetId = data.row.id
      this.$store
        .dispatch('center/roleSystemTree', { id: this.targetId, method: 'get' })
        .then((res) => {
          this.treeData = res.data.permissionTrees
          this.$refs.systemTree.setCheckedKeys(res.data.checkedPermissionIds)
          this.treeDataCategory = res.data.indicatorCategoryTrees
          this.$refs.systemTree.setCheckedKeys(
            res.data.checkedIndicatorCategoryIds
          )
        })
      this.dialogRoleTableVisible = true
    },
    setRoleSystemTree() {
      this.$store
        .dispatch('center/roleSystemTree', {
          id: this.targetId,
          method: 'put',
          data: this.$refs.systemTree.getCheckedKeys()
        })
        .then((res) => {
          this.$message.success('配置成功')
          this.dialogRoleTableVisible = false
        })
    },
    //  编辑每一行数据
    roleEdit(type, data) {
      console.log(type, data)
      this.roleShow = true
      this.isType = type
      if (data) {
        this.id = data.row.id
      } else {
        this.id = ''
      }
      // let query = {};
      // type !== "new" && (query = { type, id: data.row.id });
      // this.$router.push({ path: "/roleEdit", query });
    },
    addAccount(type, data) {
      this.showAddAccount = true
      console.log(type, data)
      if (data) {
        this.id = data.row.id
      } else {
        this.id = ''
      }
    },
    // 权限
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
    },
    handleSelectionChange(val) {
      // console.log(val,"val");
      this.accountTableNew.checkedIds = val.map((i) => i.id)
      this.nowCheckedIds = val
    },
    clearAccountForm() {
      clearObject(this.accountForm)
      clearObject(this.accountSourceForm)
      this.getRoleAccountList()
    },
    closeSetTableVisible() {
      this.dialogSetTableVisible = false
      // this.nowCheckedIds = []
      this.accountCheckedMap = {}
      this.checkedCount = 0
    },
    getSetRole(data) {
      this.dialogSetTableVisible = true
      this.targetId = data.row.id
      this.accountSourceForm.pageIndex = 1
      this.accountSourceForm.pageSize = 10
      clearObject(this.accountForm)

      this.$nextTick(function() {
        // 初始化渲染
        this.getRoleAccountList(this.accountForm)
      })

      setTimeout(() => {
        if (this.accountTableNew.checkedIds.length > 0) {
          // this.$nextTick(()=>{
          for (
            let index = 0;
            index < this.accountTableNew.checkedIds.length;
            index++
          ) {
            for (let i = 0; i < this.accountTableNew.list.length; i++) {
              const row = this.accountTableNew.list[i]
              if (row.id === this.accountTableNew.checkedIds[index]) {
                // this.$refs.accountTableNew.toggleRowSelection(row)
              }
            }
          }
          // })
        }
      }, 200)
    },
    handleSizeChange(val) {
      this.accountSourceForm.pageSize = val
    },
    handleCurrentChange(val) {
      this.accountSourceForm.pageIndex = val
      this.getRoleAccountList()
    },
    changeDispatch(s) {
      this.roleShow = s.state
      if (s.step === 1) {
        this.getRoleList()
      }
    },
    updateState(res) {
      this.showAddAccount = res.state
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../assets/icon/iconfont.css";
@import "../../assets/icon_01/iconfont.css";
.role {
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
  .role_table_btn {
    margin-bottom: 10px;
  }
  .role_table {
    min-width: 1320px;
    height: calc(100% - 100px);
    background-color: #fff;
    padding: 0px 30px;
    box-sizing: border-box;
    box-shadow: -1px 0px 4px rgba(217, 217, 217, 0.5);
    .setRole {
      height: 100%;
      .el-dialog {
        height: 700px !important;
      }
    }
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
  .checkbox_style {
    display: flex;
    flex-direction: column;
  }
}
</style>
