<template>
  <div class="indicatorPop">
    <el-dialog title="编辑" class="addPop" center :close-on-click-modal="false" :visible.sync="indicatorVisible" @close="close">
      <el-form ref="dataObj" :model="dataObj" :rules="rules">
        <el-form-item
          label="所属公司："
          class="input_style_max"
          :label-width="formLabelWidth"
          prop="orgCode"
        >
          <el-dropdown placement="bottom-start">
            <el-input
              v-model="dataObj.orgName"
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
        <el-form-item class="input_style_max" label="所属板块：" :label-width="formLabelWidth" prop="businessBlockId">
          <el-select
            v-model="dataObj.businessBlockId"
            default-first-option=""
            placeholder="请选择所属板块"
          >
            <el-option
              v-for="i in typeList"
              :key="i.id"
              :label="i.name"
              :value="i.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="input_style_max" label="上报周期：" :label-width="formLabelWidth" prop="cycle">
          <el-select
            v-model="dataObj.cycle"
            default-first-option=""
            placeholder="请选择上报周期"
          >
            <el-option
              v-for="i in reportList"
              :key="i.id"
              :label="i.text"
              :value="i.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="input_style_max" label="上报时间：" :label-width="formLabelWidth" prop="reported">
          <el-date-picker
            v-model="dataObj.reported"
            type="date"
            placeholder="上报周期"
          />
        </el-form-item>
        <el-form-item label="上传excel：" class="input_style_max" :label-width="formLabelWidth" prop="attachmentId">
          <el-upload
            style="display:inline-block;"
            :action="fileUrl"
            :file-list="fileList"
            :limit="1"
            :on-success="handleAvatarSuccess"
            :headers="headers"
            :data="dataObj"
            :name="multipartFile"
            :disabled="!(dataObj.businessBlockId&&dataObj.orgCode&&(dataObj.cycle!==null))"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <div style="display:inline-block;cursor:pointer;" @click="downLoadTemplate">下载模板</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="" type="primary" @click="onSubmit"><i class="iconfont .icon-yes" />确 认</el-button>
        <el-button class="cancel_btn" @click="close"><i class="iconfont .icon-cancel" />取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { clearObject } from '@/utils/tool'
export default {
  name: 'AcquireData',
  props: ['indicatorLineShow', 'types', 'id'],
  data() {
    return {
      formLabelWidth: '120px',
      indicatorVisible: this.indicatorLineShow,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      multipartFile: 'multipartFile',
      treeData: [],
      orgCodeList: [],
      fileList: [],
      fileUrl: process.env.VUE_APP_BASE_API + '/api/Management/DataAcquisition/import',
      reportList: [
        { id: 0, text: '日' },
        { id: 1, text: '月' },
        { id: 2, text: '年' },
        { id: 3, text: '季度' }
      ],
      dataObj: {
        attachmentId: '', // 文件ID
        businessBlockId: '', // 所属板块code
	      cycle: null, // 上报周期
	      id: '',
	      orgCode: '', // 所属公司
        orgName: '',
	      reported: '' // 上报时间
      },
      options: [],
      typeList: [],
      rules: {
        attachmentId: [{ required: true, message: '请上传excel', trigger: 'change' }],
        orgCode: [{ required: true, message: '请选择所属公司', trigger: 'change' }],
        reported: [{ required: true, message: '请选择上报日期', trigger: 'change' }],
        cycle: [{ required: true, message: '请选择上报周期', trigger: 'change' }],
        businessBlockId: [{ required: true, message: '请选择所属板块', trigger: 'change' }]
      },
      // 文件上传请求头信息
      headers: {}
    }
  },
  mounted() {
    // 设置图片上传控件请求头
    this.headers.Authorization = 'Bearer ' + sessionStorage.getItem('Authorization')
    // 获取公司树列表
    this.$store.dispatch('center/getDepartmentData').then((res) => {
      console.log('111111')
      console.log(res)
      this.treeData = res.data
    })
    if (this.id) {
      this.$store.dispatch('center/getIndicator', { method: 'get', id: this.id, type: 'msg' }).then((res) => {
        console.log('222222')
        console.log(res)
        this.dataObj = res.data
      })
    }
    // 获取板块列表
    this.$store.dispatch('center/getbusinessOption', { pageIndex: 1, pageSize: 99999 }).then((res) => {
      console.log('333333')
      console.log(res)
      this.typeList = res.data.list
    })
  },
  methods: {
    onSubmit() {
      this.$refs.dataObj.validate(valid => {
        console.log(valid)
        if (valid) {
          if (this.types === 'add') {
            this.$store.dispatch('center/getIndicator', { method: 'post', data: this.dataObj, type: 'list' }).then((res) => {
              this.$message.success('新增成功')
              this.$emit('changeState', { state: false, step: 1 })
            })
          } else {
            this.$store.dispatch('center/getIndicator', { method: 'put', data: this.dataObj, id: this.dataObj.id, type: 'edit' }).then((res) => {
              this.$message.success('编辑成功')
              this.$emit('changeState', { state: false, step: 1 })
            })
          }
        }
      })
    },
    close(type) {
      this.$emit('changeState', { state: false, step: -3, type })
    },
    handleCheckChange(data, checked, tree) {
      if (checked) {
        this.$refs.tree.setCheckedNodes([data])
      }
    },
    handleNodeClick() {
      this.orgCodeList = this.$refs.tree.getCheckedNodes().map((i) => ({ code: i.extra, name: i.label }))
      this.dataObj.orgName = this.orgCodeList.map(i => i.name).toString()
      this.dataObj.orgCode = this.orgCodeList.map(i => i.code).toString()
    },
    handleAvatarSuccess(res, file) {
      console.log(res)
      console.log(file)
      // this.dataObj.attachmentId = res.data.id
    },
    fileUpBefore(res, file) {
      console.log(res, file)
    },
    downLoadTemplate() {
      if (!this.dataObj.orgCode) {
        return this.$message('请选择所属公司')
      }
      if (this.dataObj.cycle === null) {
        return this.$message('请选择上报周期')
      }
      if (!this.dataObj.businessBlockId) {
        return this.$message('请选择所属板块')
      }
      this.$store
        .dispatch('center/getAcquireData', {
          method: 'post',
          data: {
            organizationCode: this.dataObj.orgCode,
            cycle: this.dataObj.cycle,
            blockCode: this.dataObj.businessBlockId
          },
          type: 'download',
          container: {}
        })
        .then(res => {
          const URL = window.URL || window.webkitURL
          this.downloadUrl && URL.revokeObjectURL(this.downloadUrl)
          this.downloadUrl = URL.createObjectURL(res)
          let a = document.createElement('a')
          a.download = '数据模板-' + (new Date().getTime()) + '.xlsx'
          a.href = this.downloadUrl
          a.click()
          a = null
        })
    }

  }
}
</script>
<style lang="scss" scoped>
@import "../../../assets/icon/iconfont.css";
@import "../../../assets/icon_01/iconfont.css";
.indicatorPop{
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
