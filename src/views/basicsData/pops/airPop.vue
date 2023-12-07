<template>
  <div class="air">
    <el-dialog :title="changeTitle" class="addPop" center :close-on-click-modal="false" :visible.sync="airVisible" @close="close">
      <el-form ref="dataList" :model="dataList" :rules="rules">
        <el-form-item label="航线编码：" class="input_style_max" :label-width="formLabelWidth" prop="code">
          <el-input v-model="dataList.code" maxlength="30" placeholder="请输入航线编码" />
        </el-form-item>
        <el-form-item class="input_style_max" label="始发港：" :label-width="formLabelWidth" prop="beginDockCode">
          <el-select v-model="dataList.beginDockCode" placeholder="请选择始发港">
            <el-option v-for="i in typeList" :key="i.id" :label="i.name" :value="i.code" />
          </el-select>
        </el-form-item>
        <el-form-item class="input_style_max" label="目的港：" :label-width="formLabelWidth" prop="endDockCode">
          <el-select v-model="dataList.endDockCode" placeholder="请选择目的港">
            <el-option v-for="i in typeList" :key="i.id" :label="i.name" :value="i.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序：" class="input_style_max" :label-width="formLabelWidth" prop="sort">
          <el-input v-model.number="dataList.sort" maxlength="10" placeholder="请输入序号" @input="(v)=>this.dataList.sort = v.replace(/[^\d.]/g,'')" />
        </el-form-item>
        <el-form-item label="所属公司：" class="input_style_max" :label-width="formLabelWidth" prop="orgCode">
          <el-dropdown placement="bottom-start">
            <el-input
              v-model="dataList.orgName"
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
              <!-- :default-checked-keys="[extra]" -->
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <el-form-item label="类型：" class="input_style_max" :label-width="formLabelWidth" prop="berthNumber">
          <!-- <el-input v-model="dataList.optionValue" placeholder="请输入泊位数"></el-input> -->
          <el-select v-model="dataList.optionValue" placeholder="请选择类型">
            <el-option v-for="i in optionList" :key="i.id" :label="i.optionText" :value="i.optionValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="座位数：" class="input_style_max" :label-width="formLabelWidth" prop="coastlineLength">
          <el-input v-model="dataList.seating" maxlength="10" placeholder="请输入座位数" @input="(v)=>this.dataList.seating = v.replace(/[^\d.]/g,'')" />
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
  name: 'Air',
  props: ['airLineShow', 'dataList', 'types', 'id'],
  data() {
    return {
      changeTitle: (this.types === 'msg' ? '查看' : (this.types === 'edit' ? '编辑' : '创建')),
      formLabelWidth: '120px',
      airVisible: this.airLineShow,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData: [],
      orgCodeList: [],
      form: {
        id: '',
        orgName: '',
        code: null,
        beginDockCode: '',
        endDockCode: '',
        optionValue: '',
        seating: '',
        endDockCode: '',
        orgCode: '',
        sort: '',
        updated: ''
      },
      options: [],
      typeList: [],
      optionList: [],
      rules: {
        name: [{ required: true, message: '请输入码头港口名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入码头编号', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入序号', trigger: 'blur' }],
        orgCode: [{ required: true, message: '请输入所属公司', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.$store.dispatch('center/getDepartmentData').then((res) => {
      this.treeData = res.data
    })
    this.$store.dispatch('center/getWharfOption', { pageIndex: 1, pageSize: 99999 }).then((res) => {
      this.typeList = res.data.list
    })
    this.$store.dispatch('center/getAirOption', { dictionaryCode: 'airline_type', pageIndex: 1, pageSize: 99999 }).then((res) => {
      this.optionList = res.data.list
    })
  },
  methods: {
    onSubmit() {
      console.log(this.dataList, 'list')
      // return
      this.$refs.dataList.validate(valid => {
        if (valid) {
          if (this.types == 'add') {
            this.$store.dispatch('center/getAirLine', { method: 'post', data: this.dataList, type: 'list' }).then((res) => {
              this.$message.success('新增成功')
              this.$emit('changeState', { state: false, step: 1 })
            })
          } else {
            this.$store.dispatch('center/getAirLine', { method: 'put', data: this.dataList, id: this.dataList.id, type: 'edit' }).then((res) => {
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
      this.dataList.orgName = this.orgCodeList.map(i => i.name).toString()
      this.dataList.orgCode = this.orgCodeList.map(i => i.code).toString()
    }

  }
}
</script>
<style lang="scss" scoped>
@import "../../../assets/icon/iconfont.css";
@import "../../../assets/icon_01/iconfont.css";
.air{
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
