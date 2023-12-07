<template>
  <div class="accountPop">
    <el-dialog :title="changeTitle" :close-on-click-modal="false" :visible.sync="accountVisible" width="60%" class="addPop" @close="close">
      <el-form ref="form" :label-position="labelPosition" :rules="rules" :inline="true" :model="form" size="mini">
        <el-form-item v-show="false" label="头像：" :label-width="formLabelWidth" prop="avatar">
          <el-upload
            class="avatar-uploader"
            :action="imgAction"
            :headers="imgUploadHeader"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" alt="">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="创建方式：" :label-width="formLabelWidth">
          <div class="form_box">{{ form.createdType === 0?"手动创建":"同步创建" }}</div>
        </el-form-item>
        <el-form-item label="用户名称：" :label-width="formLabelWidth" prop="loginName">
          <el-input v-if="this.types !='edit'" v-model="form.loginName" maxlength="20" placeholder="请输入用户名称" />
          <div v-if="this.types ==='edit'" class="form_box">{{ form.loginName }}</div>
        </el-form-item>
        <el-form-item label="用户类型：" :label-width="formLabelWidth" prop="userType">
          <el-select v-model="form.userType" placeholder="请选择用户类型">
            <el-option label="超级管理员" :value="0" disabled />
            <el-option label="普通管理员" :value="1" />
            <el-option label="普通用户" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="姓名：" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="手机号：" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="form.mobile" />
        </el-form-item>
        <el-form-item label="所属公司：" :label-width="formLabelWidth" prop="organizationsName">
          <el-dropdown placement="bottom-start">
            <el-input v-model="form.organizationsName" placeholder="所属公司" class="el-dropdown-link" readonly="readonly" />
            <el-dropdown-menu slot="dropdown">
              <el-tree
                ref="tree"
                style="padding-right: 20px;max-height: 300px;overflow: auto"
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
        <el-form-item label="邮箱：" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="密码：" :label-width="formLabelWidth" prop="loginPassword">
          <el-input v-model="form.loginPassword" type="password" />
        </el-form-item>
        <el-form-item label="确认密码：" :label-width="formLabelWidth" prop="checkPass">
          <el-input v-model="form.checkPass" type="password" />
        </el-form-item>
        <el-form-item label="离岗代理人：" :label-width="formLabelWidth" prop="resignAgent">
          <el-input v-model="form.resignAgent" />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="this.types!=='msg'" type="primary" @click="onSubmit">确 定</el-button>
        <el-button @click="close">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'AccountPop',
  props: ['accountShow', 'types', 'id'],
  data() {
    return {
      formLabelWidth: '120px',
      accountVisible: this.accountShow,
      imageUrl: '',
      changeTitle: (this.types === 'msg' ? '查看' : (this.types === 'edit' ? '编辑' : '创建')) + '用户',
      imgAction: process.env.VUE_APP_BASE_API + '/api/Basic/File/Safe/Upload',
      imgUploadHeader: {
        Authorization: 'Bearer ' + getToken()
      },
      labelPosition: 'left',
      form: {
        avatar: '',
        isSyncOa: '',
        name: '',
        userType: '',
        loginName: '',
        loginPassword: '',
        checkPass: '',
        id: null,
        mobile: '',
        resignAgent: '',
        remark: '',
        passwordModificationStatus: null,
        createdType: null,
        organizations: [],
        organizationsName: ''
      },
      rules: {
        loginName: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
        userType: [{ required: true, message: '请选择用户类型', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
        organizationsName: [{ required: true, message: '请选择组织架构', trigger: 'change' }],
        loginPassword: [{
          required: !this.types,
          validator: (rule, value, callback) => {
            console.log(this.types)
            if (!this.types && !value) {
              callback(new Error('请输入密码'))
            }
            // if (!value) {
            //   callback(new Error('请输入密码'))
            // }

            const passwordValidate = /^(?![A-Za-z]+$)(?![A-Z\d]+$)(?![A-Z\W]+$)(?![a-z\d]+$)(?![a-z\W]+$)(?![\d\W]+$)\S{8,}$/
            if (value && !passwordValidate.test(value)) {
              callback(new Error('密码至少包含大小写字母、数字、特殊字符，不少于8个字符'))
            }

            if (this.form.checkPass) {
              console.log('tttt')
              this.$refs.form.validateField('checkPass')
            }

            callback()
          },
          trigger: ['blur', 'change']
        }],
        checkPass: [{
          validator: (rule, value, callback) => {
            if (!this.types && !value) {
              callback(new Error('请再次输入密码'))
            } else if (this.form.loginPassword && (value !== this.form.loginPassword)) {
              callback(new Error('两次输入密码不一致!'))
            } else if (this.form.loginPassword === '' && (value !== this.form.loginPassword)) {
              callback(new Error('两次输入密码不一致!'))
            } else {
              callback()
            }
          },
          trigger: ['blur', 'change']
        }],
        mobile: [{
          required: true,
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('请填写手机号码'))
            }

            const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if (value !== '') {
              if (regMobile.test(value)) {
                callback()
              }
              callback(new Error('手机号码格式不正确'))
            } else { callback() }
          },
          trigger: 'blur'
        }]
      },
      type: 'new',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData: []
    }
  },
  mounted() {
    if (this.id) {
      this.$store.dispatch('center/getAccountDetails', this.id).then(res => {
        this.form = { ...this.form, ...res.data }
        this.form.organizationsName = this.form.organizations.map(i => i.name).join('，')
        this.$refs.tree.setCheckedKeys(this.form.organizations.map(i => i.code))
        console.log(res.data.avatarUrl, '-----头像')
        this.imageUrl = res.data.avatar
      })
    }
    this.$store.dispatch('center/getDepartmentData').then(res => {
      this.treeData = res.data
    })
  },
  methods: {
    // handleNodeClick(checkedNodes, checkedKeys, halfCheckedNodes, halfCheckedKeys){
    //   this.form.organizations = this.$refs.tree.getCheckedNodes().map(i=>({code:i.extra, name:i.label}));
    //   this.form.organizationsName = (this.form.organizations.map(i=>i.name)).join('，');
    // },
    handleCheckChange(data, checked, tree) {
      if (checked) {
        this.$refs.tree.setCheckedNodes([data])
      }
    },
    handleNodeClick() {
      this.form.organizations = this.$refs.tree.getCheckedNodes().map((i) => ({ code: i.extra, name: i.label }))
      this.form.organizationsName = this.form.organizations.map(i => i.name).toString()
      // this.dataList.orgCode = this.orgCodeList.map(i=>i.code).toString();
    },
    handleAvatarSuccess(res, file) {
      this.form.avatar = res.data.id
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png')
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是JPG或PNG格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    close(type) {
      this.$emit('changeState', { state: false, step: -3, type })
    },
    onSubmit() {
      // console.log(this.form);
      // console.log(this.imgAction);
      // return
      let method = 'post'
      this.types === 'edit' && (method = 'put')
      this.$refs.form.validate(valid => {
        valid && this.$store.dispatch('center/setAccount', {
          method,
          data: this.form,
          id: this.id
        }).then(res => {
          if (res.status === 0) {
            this.$message.success(this.types === 'edit' ? '编辑成功' : '新建成功')
            this.$emit('changeState', { state: false, step: 1 })
          }
        })
      })
    }
  }
}
</script>
<style lang="scss">
@import "~@/styles/mixin.scss";
$imgSize: 128px;
.accountPop{
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: auto;
  // background-color: #f0f3f5;
  .title {
    font-size: 20px;
    font-family: Microsoft YaHei serif;
    font-weight: bold;
    line-height: 30px;
    color: #2f3541;
    margin-top: 2px;
    margin-bottom: 15px;

  }
  .el-tree-node__label{
    padding-right: 20px !important;
  }

  .mr{
    margin-right: 20px;
  }

  .addPop{
    .el-dialog{
    width: 1000px;
    .el-dialog__body {
        // padding: 0 20px;

        .el-form {
            margin-left: 30px;
        }
        .form_box{
          min-width: 300px;
        }
    }
    .el-form-item{
    min-height: 30px;
    height: auto;
    .el-input,
  .el-select {
    width: 300px;
    height: 30px;

    input {
      height: 30px;
      width: 300px;
      background-color: #fff;
      border: 1px solid #EAEAEA;

      &::placeholder {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #C3C8CC;
      }

    }
    .el-textarea {
      textarea {
        width: 300px;
        height: 81px;
        // background-color: #F5F8FA;
        border: 1px solid #EAEAEA;
      }
    }

    .el-input__suffix {
      height: auto;
    }
  }
    .avatar-uploader{
      margin-right: 170px;
    }

    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: $imgSize;
      height: $imgSize;
      line-height: $imgSize;
      text-align: center;
    }
    .avatar {
      width: $imgSize;
      height: $imgSize;
      display: block;
    }
  }
        }
    }

}
</style>
