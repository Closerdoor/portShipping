<template>
  <div class="roleEdit">
    <el-dialog
      class="addPop"
      center
      :close-on-click-modal="false"
      :visible.sync="roleVisible"
      @close="close"
    >
      <el-form
        ref="form"
        :label-position="labelPosition"
        :model="form"
        :rules="rules"
        label-width="150px"
      >
        <el-form-item label="角色名称：" class="input_style_max" prop="name">
          <!-- <div v-if="this.types === "msg"">{{form.name}}</div> -->
          <el-input
            v-model="form.name"
            class="mr"
            placeholder="请输入角色名称"
          />
        </el-form-item>
        <el-form-item
          label="所属板块："
          class="input_style_max"
          prop="businessBlockCode"
        >
          <el-select
            v-model="form.businessBlockCode"
            default-first-option=""
            placeholder="请选择所属板块"
            @change="getCategoryTree(form.businessBlockCode)"
          >
            <el-option
              v-for="i in modelList"
              :key="i.id"
              :label="i.name"
              :value="i.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="input_style_max" label="所属公司：" prop="orgName">
          <el-dropdown placement="bottom-start">
            <el-input
              v-model="form.orgName"
              placeholder="请选择所属公司"
              class="el-dropdown-link"
              readonly="readonly"
            />
            <el-dropdown-menu slot="dropdown">
              <el-tree
                ref="tree"
                style="padding-right: 20px; max-height: 300px; overflow: auto"
                :data="orgCodeData"
                :props="defaultProps"
                node-key="extra"
                accordion
                highlight-current
                :show-checkbox="true"
                :check-strictly="true"
                @check-change="handleCheckRoleChange"
                @check="handleNodeClick"
              />
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <el-form-item class="input_style_max" label="描述">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <div class="function">
        <div class="function_role">
          <p>功能权限：</p>
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
        </div>
        <div class="indicator_role">
          <p>板块指标：</p>
          <el-tree
            ref="indicatorTree"
            :props="defaultProps"
            :data="treeDataCategory"
            node-key="id"
            accordion
            show-checkbox
            :expand-on-click-node="false"
            :render-content="renderContent"
            @check-change="handleCheckChange"
          />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">确 定</el-button>
        <el-button @click="close">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import { getIndicatorOption } from '@/api/center'
export default {
  name: 'RoleEdit',
  props: ['roleEditShow', 'types', 'id'],
  data() {
    return {
      defaultProps: {
        label: 'label',
        children: 'children'
      },
      orgCodeData: [],
      modelList: [],
      treeData: [],
      treeDataCategory: [],
      roleVisible: this.roleEditShow,
      labelPosition: 'left',
      form: {
        name: '',
        businessBlockCode: '',
        orgName: '',
        orgCode: '',
        remark: '',
        checkedIndicatorCategoryIds: [],
        checkedPermissionIds: [],
        id: '',
        created: '',
        updated: '',
        status: 1,
        businessBlockId: '',
        businessBlockName: ''
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        orgName: [
          { required: true, message: '请输入所属公司', trigger: 'change' }
        ],
        businessBlockCode: [
          { required: true, message: '请输入所属板块', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    //   权限树
    this.$store.dispatch('center/getSystemTree').then((res) => {
      this.treeData = res.data
    })
    this.getCompony()
    // 所属模块
    this.$store
      .dispatch('center/getbusinessOption', { pageIndex: 1, pageSize: 99999 })
      .then((res) => {
        this.modelList = res.data.list
        this.form.businessBlockCode = this.modelList[0].code
        // 指标树
        console.log(this.form.businessBlockCode, '----codes')
        this.getCategoryTree(this.form.businessBlockCode)
      })
    if (this.id) {
      this.$store
        .dispatch('center/getRoleDetail', { id: this.id })
        .then((res) => {
          this.form = res.data
          this.getCategoryTree(res.data.businessBlockCode)
        })
      this.getRoleSystemTree()
    }
  },
  methods: {
    getCompony() {
      // 所属公司
      this.$store.dispatch('center/getDepartmentData').then((res) => {
        this.orgCodeData = res.data
      })
    },
    onSubmit() {
      this.form.checkedPermissionIds = this.$refs.systemTree.getCheckedKeys()
      this.form.checkedIndicatorCategoryIds =
        this.$refs.indicatorTree.getCheckedKeys()
      console.log(this.form)
      // return
      if (this.types === 'new') {
        this.$refs.form.validate(
          (valid) =>
            valid &&
            this.$store.dispatch('center/addRoles', this.form).then((res) => {
              if (res.status === 0) {
                this.$message.success('新建成功')
                this.$emit('changeState', { state: false, step: 1 })
              }
            })
        )
      } else if (this.types === 'edit') {
        console.log(this.form)
        this.$store
          .dispatch('center/getRoleEdit', { id: this.id, data: this.form })
          .then((res) => {
            if (res.status === 0) {
              this.$message.success('编辑成功')
              this.$emit('changeState', { state: false, step: 1 })
            }
          })
      }
    },
    getRoleSystemTree() {
      console.log(this.id, 'id')
      this.$store
        .dispatch('center/roleSystemTree', { id: this.id, method: 'get' })
        .then((res) => {
          // console.log(res,'yyyyyyyyy');
          this.$refs.systemTree.setCheckedKeys(res.data.checkedPermissionIds)
          this.$refs.indicatorTree.setCheckedKeys(
            res.data.checkedIndicatorCategoryIds
          )
        })
    },
    setRoleSystemTree() {
      this.$store
        .dispatch('center/roleSystemTree', {
          id: this.id,
          method: 'put',
          data: this.$refs.systemTree.getCheckedKeys()
        })
        .then((res) => {
          this.$message.success('配置成功')
        })
    },
    getCategoryTree(id) {
      console.log(id, '----jjj')
      if (id) {
        this.$store
          .dispatch('center/getIndicatorOption', { businessBlockCode: id })
          .then((res) => {
            console.log(res, '指标树')
            this.treeDataCategory = res.data
            //   this.$refs.indicatorTree.setCheckedKeys(res.data.checkedIndicatorCategoryIds);
          })
      }
    },
    close(type) {
      this.$emit('changeState', { state: false, step: -3, type })
    },
    // 权限
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
    },

    handleCheckRoleChange(data, checked, tree) {
      if (checked) {
        this.$refs.tree.setCheckedNodes([data])
      }
    },
    handleNodeClick() {
      this.orgCodeList = this.$refs.tree.getCheckedNodes().map((i) => ({ code: i.extra, name: i.label }))
      this.form.orgName = this.orgCodeList.map((i) => i.name).toString()
      this.form.orgCode = this.orgCodeList.map((i) => i.code).toString()
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          <span>{data.label}</span>
          <span>{data.id}</span>
        </span>
      )
    }
  }
}
</script>
<style lang='scss'>
@import '../../../assets/icon/iconfont.css';
@import '../../../assets/icon_01/iconfont.css';
.roleEdit {
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
  .addPop {
    .el-dialog {
      width: 1200px;
      .el-dialog__body {
        // padding: 0 20px;

        .el-form {
          margin-left: 30px;
        }
      }
      .function {
        width: 1200px;
        height: 350px;
        // border: 1px solid red;
        display: flex;
        justify-content: space-between;
        padding: 0 30px;
        box-sizing: border-box;
        .indicator_role,
        .function_role {
          width: 48%;
          height: 100%;
          border: 1px solid #eaeaea;
          box-sizing: border-box;
          padding: 20px;
          overflow-y: auto;
          p {
            padding: 0;
            margin: 0;
          }
        }
      }
    }
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
}
</style>
