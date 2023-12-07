<template>
  <div class="wharf">
    <el-dialog :title="changeTitle" class="addPop" center :close-on-click-modal="false" :visible.sync="wharfVisible" @close="close">
      <el-form ref="dataList" :model="dataList" :rules="rules">
        <el-form-item label="码头编码：" class="input_style_max" :label-width="formLabelWidth" prop="code">
          <el-input v-model="dataList.code" maxlength="30" placeholder="请输入码头编码" />
        </el-form-item>
        <el-form-item label="码头港口名称：" class="input_style_max" :label-width="formLabelWidth" prop="name">
          <el-input v-model="dataList.name" maxlength="30" placeholder="请输入港口名称" />
        </el-form-item>
        <el-form-item label="排序：" class="input_style_max" :label-width="formLabelWidth" prop="sort">
          <el-input v-model.number="dataList.sort" maxlength="10" placeholder="请输入序号" @input="(v)=>this.dataList.sort = v.replace(/[^\d.]/g,'')" />
        </el-form-item>
        <el-form-item label="经纬度：" class="input_style_max" :label-width="formLabelWidth" prop="coordinate">
          <el-input v-model="dataList.coordinate" placeholder="请输入经纬度" />
        </el-form-item>
        <el-form-item label="所属公司：" class="input_style_max" :label-width="formLabelWidth" prop="orgName">
          <el-dropdown placement="bottom-start">
            <el-input
              v-model="dataList.orgName"
              placeholder="请选择所属公司"
              class="el-dropdown-link"
              readonly="readonly"
            />
            <el-dropdown-menu slot="dropdown" class="eltree-main">
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
        <el-form-item label="泊位数：" class="input_style_max" :label-width="formLabelWidth" prop="berthNumber">
          <el-input v-model="dataList.berthNumber" maxlength="10" placeholder="请输入泊位数" @input="(v)=>this.dataList.berthNumber = v.replace(/[^\d.]/g,'')" />
        </el-form-item>
        <el-form-item label="岸线长度：" class="input_style_max" :label-width="formLabelWidth" prop="coastlineLength">
          <el-input v-model="dataList.coastlineLength" maxlength="10" placeholder="请输入岸线长度" @input="(v)=>this.dataList.coastlineLength = v.replace(/[^\d.]/g,'')" />
        </el-form-item>
        <el-form-item label="地址：" class="input_style_max" :label-width="formLabelWidth">
          <el-input v-model="dataList.address" type="textarea" placeholder="请输入地址" :max="200" />
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
export default {
  name: 'Wharf',
  props: ['wharfShow', 'types', 'id'],
  data() {
    return {
      formLabelWidth: '120px',
      wharfVisible: this.wharfShow,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dataList: {
        id: '',
        name: null,
        orgCode: '',
        orgName: '',
        address: '',
        berthNumber: '',
        coastlineLength: '',
        sort: '',
        coordinate: '',
        updated: '',
        code: ''
      },
      changeTitle: (this.types === 'msg' ? '查看' : (this.types === 'edit' ? '编辑' : '创建')),
      treeData: [],
      options: [],
      orgCodeList: [],
      rules: {
        name: [{ required: true, message: '请输入码头港口名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入码头编号', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入序号', trigger: 'blur' }],
        orgName: [{ required: true, message: '请输入所属公司', trigger: 'change' }]
      }
    }
  },
  created() {

    // if(this.id){
    //   this.$nextTick(() => {
    //    this.$refs.tree.setCheckedKeys([])
    //  });
    // }
  },
  mounted() {
    this.$store.dispatch('center/getDepartmentData').then((res) => {
      this.treeData = res.data
    })
    if (this.id) {
      const that = this
      this.$store.dispatch('center/getWharf', { method: 'get', id: this.id, type: 'msg' }).then((res) => {
        that.dataList = res.data
        this.$refs.tree.setCheckedKeys([that.dataList.orgCode])
      })
    }
  },
  methods: {
    onSubmit() {
      this.$refs.dataList.validate(valid => {
        if (valid) {
          if (this.types === 'add') {
            this.$store.dispatch('center/getWharf', { method: 'post', data: this.dataList, type: 'list' }).then((res) => {
              this.$message.success('新增成功')
              this.$emit('changeState', { state: false, step: 1 })
            })
          } else {
            this.$store.dispatch('center/getWharf', { method: 'put', data: this.dataList, id: this.dataList.id, type: 'edit' }).then((res) => {
              this.$message.success('编辑成功')
              this.$emit('changeState', { state: false, step: 1 })
            })
          }
        }
      })
    },
    handleCheckChange(data, checked, tree) {
      if (checked) {
        this.$refs.tree.setCheckedNodes([data])
      }
    },
    handleNodeClick() {
      this.orgCodeList = this.$refs.tree.getCheckedNodes().map((i) => ({ code: i.extra, name: i.label }))
      this.dataList.orgName = this.orgCodeList.map(i => i.name).toString()
      this.dataList.orgCode = this.orgCodeList.map(i => i.code).toString()
    },
    close(type) {
      this.$emit('changeState', { state: false, step: -3, type })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../assets/icon/iconfont.css";
@import "../../../assets/icon_01/iconfont.css";
.wharf{
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
