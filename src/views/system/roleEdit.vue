<template>
  <div class="role_edit">
    <el-row>
      <el-col :span="4">
        <div v-if="this.$route.query.type === 'msg'" class="grid-content title bg-purple">查看角色</div>
        <div v-else-if="this.$route.query.type === 'edit'" class="grid-content title bg-purple">编辑角色</div>
        <div v-else class="grid-content title bg-purple">新增角色</div>
        <!-- <div class="grid-content title bg-purple">{{ (this.$route.query.type==='edit'?'编辑':'新增')+'角色' }}</div> -->
      </el-col>
      <el-col :span="20">
        <div class="grid-content title bg-purple-light">
          <el-button v-if="this.$route.query.type !== 'msg'" class="commit_btn" @click="onSubmit">提交</el-button>
          <el-button class="cancel_btn" @click="()=>this.$router.back()">返回</el-button>
        </div>
      </el-col>
    </el-row>
    <div class="role_edit_data">
      <el-form ref="form" :label-position="labelPosition" class="" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="角色名称：" class="input_style_max" prop="name">
          <div v-if="this.$route.query.type === 'msg'">{{ form.name }}</div>
          <el-input v-else v-model="form.name" class="mr" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="所属板块：" class="input_style_max">
          <div v-if="this.$route.query.type === 'msg'">{{ form.businessBlockName }}</div>
          <el-input v-else v-model="form.businessBlockName" class="mr" placeholder="请输入所属板块" />
        </el-form-item>
        <el-form-item label="所属公司：" class="input_style_max">
          <div v-if="this.$route.query.type === 'msg'">{{ form.orgName }}</div>
          <el-input v-else v-model="form.orgName" class="mr" placeholder="请输入所属公司" />
        </el-form-item>
        <el-form-item class="input_style_max" label="描述">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      labelPosition: 'left',
      form: {
        id: '',
        type: '',
        name: '',
        remark: '',
        created: '',
        updated: '',
        status: 1,
        businessBlockName: '',
        orgName: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称' }
        ]
      }
    }
  },
  mounted() {
    console.log(this.$route.query.type, 'type')
    this.$route.query.id && (this.form.id = this.$route.query.id)

    if (this.$route.query.id) {
      this.$store.dispatch('center/getRoleDetail', { id: this.$route.query.id }).then(res => {
        this.form = res.data
      }
      )
    }
  },
  methods: {
    onSubmit() {
      if (!this.$route.query.type) {
        this.$refs.form.validate(
          valid =>
            valid && this.$store.dispatch('center/addRoles', this.form).then(res => {
              if (res.status === 0) {
                this.$message.success('新建成功')
                this.$router.back()
              }
            })
        )
      } else if (this.$route.query.type === 'edit') {
        console.log(this.form)
        this.$store.dispatch('center/getRoleEdit', { id: this.$route.query.id, data: this.form }).then(res => {
          if (res.status === 0) {
            this.$message.success('编辑成功')
            this.$router.back()
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.role_edit {
  /* deep*/
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-width: 1200px;
  overflow: auto;
  overflow: hidden;
  // background-color: #f0f3f5;
  .title {
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 30px;
    color: #2f3541;
    margin-top: 2px;
    margin-bottom: 15px;

  }
  .mr{
    margin-right: 20px;
  }
  .role_edit_data{
    // width: 1200px;
    width: 100%;
    // height: 657px;
    height: 100%;
    background-color: #fff;
    padding: 20px 20px;
    box-sizing: border-box;
  }
}
</style>
