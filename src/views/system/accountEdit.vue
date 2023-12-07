<template>
  <div class="account_edit">
    <el-row>
      <el-col :span="4">
        <div class="grid-content title bg-purple">{{ (this.type==='msg'?'查看':(this.type==='edit'?'编辑':'新建'))+'用户' }}</div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content title bg-purple-light">
          <el-button v-if="this.type!=='msg'" type="primary" size="mini" @click="onSubmit">提交</el-button>
          <el-button class="cancel_btn" @click="()=>this.$router.back()">返回</el-button>
        </div>
      </el-col>
    </el-row>
    <div class="account_edit_data">
      <el-form ref="form" :label-position="labelPosition" :rules="rules" class="form_class" :model="form" label-width="150px">
        <el-form-item label="头像：" prop="avatar">
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
        <!--<el-form-item v-if="form.id" label="用户ID：">
          <div>{{form.id}}</div>
        </el-form-item>-->
        <el-form-item label="创建方式：">
          <div>{{ form.createdType === 0?"手动创建":"同步创建" }}</div>
        </el-form-item>
        <!-- <el-form-item label="已修改默认密码：">
          <div>{{form.passwordModificationStatus === 1?"是":"否"}}</div>
        </el-form-item> -->
        <el-form-item label="用户名称：" class="input_style" prop="loginName">

          <el-input v-if="this.type !='edit'" v-model="form.loginName" class="mr" maxlength="20" placeholder="请输入用户名称" />
          <div v-if="this.type ==='edit'">{{ form.loginName }}</div>
        </el-form-item>
        <!--<el-form-item label="状态：">
          <el-checkbox-group v-model="form.type">
            <el-checkbox label="启用" name="type"></el-checkbox>
            <el-checkbox label="停用" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>-->
        <el-form-item label="用户类型：" prop="userType">
          <el-select v-model="form.userType" placeholder="请选择用户类型">
            <el-option label="超级管理员" :value="0" disabled />
            <el-option label="普通管理员" :value="1" />
            <el-option label="普通用户" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="姓名：" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="手机号：" prop="mobile">
          <el-input v-model="form.mobile" />
        </el-form-item>
        <!--<el-form-item label="所属机构：" prop="region">
          <el-select v-model="form.region" placeholder="请选择所属机构">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="所属公司：" prop="organizationsName">
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
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="密码：" prop="loginPassword" :required="this.type==='new'">
          <el-input v-model="form.loginPassword" type="password" />
        </el-form-item>
        <el-form-item label="确认密码：" prop="checkPass" :required="this.type==='new'">
          <el-input v-model="form.checkPass" type="password" />
        </el-form-item>
        <el-form-item label="离岗代理人：" prop="resignAgent">
          <el-input v-model="form.resignAgent" />
        </el-form-item>
        <el-form-item class="input_style" label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      imageUrl: '',
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
          required: !this.$route.query.type,
          validator: (rule, value, callback) => {
            if (!this.$route.query.type && !value) {
              callback(new Error('请输入密码'))
            }

            const passwordValidate = /^(?![A-Za-z]+$)(?![A-Z\d]+$)(?![A-Z\W]+$)(?![a-z\d]+$)(?![a-z\W]+$)(?![\d\W]+$)\S{8,}$/
            if (value && !passwordValidate.test(value)) {
              callback(new Error('密码至少包含大小写字母、数字、特殊字符，不少于8个字符'))
            }

            if (this.form.checkPass) {
              this.$refs.form.validateField('checkPass')
            }

            callback()
          },
          trigger: ['blur', 'change']
        }],
        checkPass: [{
          validator: (rule, value, callback) => {
            if (!this.$route.query.type && !value) {
              callback(new Error('请再次输入密码'))
            } else if (this.form.loginPassword && (value !== this.form.loginPassword)) {
              callback(new Error('两次输入密码不一致!'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
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
    if (this.$route.query.id) {
      this.$route.query.type && (this.type = this.$route.query.type)
      this.$store.dispatch('center/getAccountDetails', this.$route.query.id).then(res => {
        this.form = { ...this.form, ...res.data }
        this.form.organizationsName = this.form.organizations.map(i => i.name).join('，')
        this.$refs.tree.setCheckedKeys(this.form.organizations.map(i => i.code))
        this.imageUrl = res.data.avatarUrl
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
    onSubmit() {
      // console.log(this.form);
      // return
      let method = 'post'
      this.type === 'edit' && (method = 'put')
      this.$refs.form.validate(valid => {
        valid && this.$store.dispatch('center/setAccount', {
          method,
          data: this.form,
          id: this.$route.query.id
        }).then(res => {
          if (res.status === 0) {
            this.$message.success(this.type === 'edit' ? '编辑成功' : '新建成功')
            this.$router.back()
          }
        })
      })
    }
  }
}
</script>
<style lang="scss">
.account_edit{
  .el-tree-node__label{
    padding-right: 20px !important;
  }
}
</style>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
$imgSize: 128px;
.account_edit{
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
  .mr{
    margin-right: 20px;
  }

  .account_edit_data{
    width: 100%;
    //height: 657px;
    background-color: #fff;
    padding: 20px 20px;
    box-sizing: border-box;
  }

  ::v-deep .el-form-item{
    min-height: 30px;
    height: auto;
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
</style>
