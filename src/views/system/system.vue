<template>
  <div class="system">
    <div class="title">权限管理</div>
    <div class="system_data">
      <div class="system_tree">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          accordion
          highlight-current
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        />
      </div>
      <div class="system_detail">
        <div class="system_detail_btn">
          <el-button v-if="tp('system:authority:add')" type="primary" plain size="mini" icon="el-icon-plus" @click="handleOpen">新增</el-button>
          <el-button v-if="tp('system:authority:edit')" type="primary" plain size="mini" icon="el-icon-edit-outline" @click="editNode">编辑</el-button>
          <el-button v-if="tp('system:authority:delete')" type="danger" plain size="mini" icon="el-icon-delete" @click="deleteNode">删除</el-button>
        </div>
        <ul class="detail_list">
          <li>
            <span>所属系统：</span>
            <span>{{ details.appName }}</span>
          </li>
          <li>
            <span>名称：</span>
            <span>{{ details.name }}</span>
          </li>
          <li>
            <span>权限类别：</span>
            <span>{{ transformType(details.type) }}</span>
          </li>
          <li>
            <span>权限标识：</span>
            <span>{{ details.permission }}</span>
          </li>
          <li>
            <span>访问路径：</span>
            <span>{{ details.path }}</span>
          </li>
          <li>
            <span>功能模块描述：</span>
            <span>{{ details.remark }}</span>
          </li>
          <li>
            <span>是否可用：</span>
            <el-switch v-model="details.isEnable" disabled />
          </li>
          <!--<li>
            <el-checkbox v-model="checked">是否显示</el-checkbox>
          </li>-->
        </ul>
      </div>
    </div>
    <!-- 弹窗 -->
    <el-dialog class="addPop" :title="(this.state==='new'?'新增':'编辑')+'权限'" :visible.sync="dialogFormVisible" @close="handleClose">
      <el-form ref="form" :label-position="labelPosition" :model="form" :rules="rules">
        <el-form-item v-if="this.state==='new'" class="input_style" label="上级模块" :label-width="formLabelWidth" prop="parentId">
          <el-select v-model="form.parentId" placeholder="请选择上级模块">
            <el-option v-if="targetNode.id" :label="targetNode.label" :value="targetNode.id" />
            <el-option label="新系统" value="root" />
          </el-select>
        </el-form-item>
        <el-form-item class="input_style" label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="this.state==='new'" class="input_style" label="权限类别" :label-width="formLabelWidth" prop="type">
          <el-select v-model="form.type" placeholder="请选择权限类别">
            <el-option v-if="targetNode.type===1&&form.parentId!=='root'" label="模块" value="1" />
            <el-option
              v-for="i in 3"
              v-if="((typeof targetNode.type==='number'&&form.parentId!=='root')?targetNode.type+1:0)===(i-1)"
              :key="i"
              :label="transformType(i-1)"
              :value="i-1"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="input_style" label="权限标识" :label-width="formLabelWidth" prop="permission">
          <el-input v-model="form.permission" placeholder="" autocomplete="off" />
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
          <el-input-number v-model="form.sort" size="small" style="width: 160px" :min="0" :max="10" label="排序" />
        </el-form-item>
        <el-form-item class="input_style" label="访问路径" :label-width="formLabelWidth" prop="path">
          <el-input v-model="form.path" autocomplete="off" />
        </el-form-item>
        <el-form-item class="input_style" label="功能模块描述" :label-width="formLabelWidth" prop="remark">
          <el-input v-model="form.remark" type="textarea" resize="none" autocomplete="off" />
        </el-form-item>
        <el-form-item class="multiple" label="是否可用" prop="isEnable">
          <el-switch v-model="form.isEnable" />
        </el-form-item>
        <!--<el-form-item class="multiple">
          <el-checkbox-group v-model="form.type">
            <el-checkbox label="是否显示" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="cancel_btn" @click="handleClose">返回</el-button>
        <el-button class="commit_btn" type="primary" @click="()=>onSubmit(this.state==='new'?'post':'put')">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { clearObject } from '@/utils/tool'
import { getPagePromise } from '@/utils/auth'
import { set } from 'js-cookie'

export default {
  name: 'System',
  data() {
    return {
      checked: true,
      labelPosition: 'left',
      treeData: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      currentNode: {},
      form: {
        name: '',
        parentId: '',
        permission: '',
        sort: 0,
        isEnable: false,
        type: null,
        path: '',
        remark: ''
      },
      rules: {
        parentId: [{ required: true, message: '请选择上级模块', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择权限类别', trigger: 'blur' }],
        permission: [{ required: true, message: '请输入权限标识', trigger: 'blur' }],
        path: [{ required: true, message: '请输入访问路径', trigger: 'blur' }]
      },
      formLabelWidth: '120px',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      targetNode: {},
      details: {
        appName: null,
        path: '',
        id: '',
        moduleName: null,
        name: '',
        permission: '',
        remark: null,
        sort: 0,
        isEnable: false,
        type: null
      },
      state: '',
      pagePromise: []
    }
  },
  mounted() {
    setTimeout(() => {
      getPagePromise().then(res => this.pagePromise = res)
    }, 200)
    this.getSystemTree()
  },
  methods: {
    /** transformPromise*/
    tp(k) {
      return this.pagePromise.indexOf(k) > -1
    },
    transformType(type) {
      switch (type) {
        case 0:
          return '应用'
        case 1:
          return '模块'
        case 2:
          return '操作'
        default:
          return '-'
      }
    },
    handleNodeClick(data) {
      this.targetNode = data
      this.$store.dispatch('center/getSystemTreeDetails', data.id).then(res =>
        this.details = { ...res.data, isEnable: !!(res.data.isEnable) }
      )
    },
    editNode() {
      if (!this.targetNode.id) { return this.$message.warning('请选择需要编辑的权限') }
      this.state = 'edit'
      for (const k in this.form) {
        this.form[k] = this.details[k]
      }
      this.dialogFormVisible = true
    },
    handleOpen() {
      this.dialogFormVisible = true
      this.state = 'new'
      // this.$refs.form.resetFields();
    },
    handleClose() {
      clearObject(this.form)
      this.$refs.form.resetFields()
      this.dialogFormVisible = false
    },
    onSubmit(method) {
      this.$refs.form.validate(valid => {
        if (valid) {
          const d = { method, data: { ...this.form, isEnable: this.form.isEnable ? 1 : 0 }}
          method === 'put' && (d['id'] = this.targetNode.id)
          this.$store.dispatch('center/setSystemTreeDetails', d).then(res => {
            this.$message.success(method === 'put' ? '修改成功' : '新建成功')
            this.handleClose()
            this.getSystemTree()
            clearObject(this.details)
          })
        }
      })
    },
    deleteNode() {
      if (!this.targetNode.id) { return this.$message.warning('请选择需要删除的权限') }
      this.$confirm('确认删除？', '警告').then(() => {
        this.$store.dispatch('center/deleteSystemTreeNode', this.targetNode.id).then(res => {
          this.$message.success(res.message)
          this.getSystemTree()
        })
        clearObject(this.details)
      }
      )
    },
    getSystemTree() {
      this.$store.dispatch('center/getSystemTree').then(res =>
        this.treeData = res.data
      )
    }
  }
}
</script>

<style lang="scss">
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
  background-color: #20a0ff;
  color: #fff;
  .el-tree-node__expand-icon{
    color: #fff;
    &.is-leaf{
      color: transparent;
    }
  }
}
.addPop{
  .input_style{
    .el-textarea{
      width: 160px;
      textarea{
        height: 30px;
        width: 160px;
        &::placeholder{
          font-size: 13px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #ABAEB3;
        }
      }
    }
  }
  .multiple{
    >.el-form-item__label{
      width: 120px;
    }
  }
}
</style>

<style lang="scss" scoped>
.system{
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
  .system_data{
    width: 1200px;
    height: 657px;
    background-color: #fff;
    display: flex;
    padding: 20px 10px;
    box-sizing: border-box;
    box-shadow: -1px 0px 4px rgba(217, 217, 217, 0.5);
    .system_tree{
      width: 326px;
      height: 100%;
      background-color: #f7f9fa;
      padding-left: 20px;
      padding-top: 20px;
      box-sizing: border-box;
      .el-tree{
        background-color: #f7f9fa;
      }
    }
    .system_detail{
      padding-left: 20px;
      box-sizing: border-box;
      flex:1;
      .detail_list{
        margin-top: 30px;
        li{
          display: flex;
          margin-top: 10px;
          height: 30px;
          align-items: center;
          // justify-content: space-between;
          >span{
            display: block;
            height: 30px;
            line-height: 30px;
            font-size: 13px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #2F3541;
          }
          >span:nth-of-type(1){
            max-width: 145px;
            width: 145px;
          }
        }
      }
    }
  }
}
</style>
