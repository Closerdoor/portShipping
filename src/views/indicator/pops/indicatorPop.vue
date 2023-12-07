<template>
  <div class="indicatorPop">
    <el-dialog title="编辑" class="addPop" center :close-on-click-modal="false" :visible.sync="indicatorVisible" @close="close">
      <el-form ref="dataList" :model="dataList" :rules="rules">
        <el-form-item label="指标名称：" class="input_style_max" :label-width="formLabelWidth" prop="name">
          <el-input v-model="dataList.name" maxlength="30" placeholder="请输入指标名称" />
        </el-form-item>
        <el-form-item label="排序：" class="input_style_max" :label-width="formLabelWidth" prop="sort">
          <el-input v-model="dataList.sort" maxlength="10" placeholder="请输入序号" @input="(v)=>this.dataList.sort = v.replace(/[^\d.]/g,'')" />
        </el-form-item>
        <el-form-item label="父指标：" class="input_style_max" :label-width="formLabelWidth" prop="parentId">
          <el-select v-model="dataList.parentId" placeholder="请选择父指标">
            <el-option v-for="i in indicatorList" :key="i.id" :label="i.label" :value="i.id" />
          </el-select>
        </el-form-item>
        <el-form-item class="input_style_max" label="所属板块：" :label-width="formLabelWidth" prop="businessBlockCode">
          <el-select
            v-model="dataList.businessBlockCode"
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
        <el-form-item label="描述：" class="input_style_max" :label-width="formLabelWidth">
          <el-input v-model="dataList.description" type="textarea" placeholder="请输入描述说明" :max="200" />
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
import { clearObject } from '@/utils/tool'
export default {
  name: 'IndicatorPop',
  props: ['indicatorLineShow', 'types', 'id'],
  data() {
    return {
      formLabelWidth: '120px',
      indicatorVisible: this.indicatorLineShow,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData: [],
      orgCodeList: [],
      dataList: {
        id: '',
        name: '',
        optionValue: '',
        businessBlockCode: '',
        description: '',
        sort: ''
      },
      options: [],
      typeList: [],
      indicatorList: [],
      rules: {
        name: [{ required: true, message: '请输入指标名称', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入序号', trigger: 'blur' }],
        businessBlockCode: [{ required: true, message: '请输入所属板块', trigger: 'change' }]
      }
    }
  },
  mounted() {
    if (this.id) {
      this.$store.dispatch('center/getIndicator', { method: 'get', id: this.id, type: 'msg' }).then((res) => {
        this.dataList = res.data
      })
    }
    this.$store.dispatch('center/getbusinessOption', { pageIndex: 1, pageSize: 99999 }).then((res) => {
      this.typeList = res.data.list
    })
    this.$store.dispatch('center/getIndicatorOption', { pageIndex: 1, pageSize: 99999 }).then((res) => {
      this.indicatorList = res.data
    })
  },
  methods: {
    onSubmit() {
      this.$refs.dataList.validate(valid => {
        if (valid) {
          if (this.types == 'add') {
            this.$store.dispatch('center/getIndicator', { method: 'post', data: this.dataList, type: 'list' }).then((res) => {
              this.$message.success('新增成功')
              this.$emit('changeState', { state: false, step: 1 })
            })
          } else {
            this.$store.dispatch('center/getIndicator', { method: 'put', data: this.dataList, id: this.dataList.id, type: 'edit' }).then((res) => {
              this.$message.success('编辑成功')
              this.$emit('changeState', { state: false, step: 1 })
            })
          }
        }
      })
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
