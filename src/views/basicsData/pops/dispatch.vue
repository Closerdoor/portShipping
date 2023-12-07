<template>
  <div class="dispatch">
    <el-dialog :title="changeTitle" class="addPop" center :close-on-click-modal="false" :visible.sync="dispatchVisible" @close="close">
      <el-form ref="dataList" :model="dataList" :rules="rules">
        <el-form-item label="板块名称：" class="input_style_max" :label-width="formLabelWidth" prop="name">
          <el-input v-model="dataList.name" maxlength="30" placeholder="请输入板块名称" />
        </el-form-item>
        <el-form-item label="板块编码：" class="input_style_max" :label-width="formLabelWidth" prop="code">
          <el-input v-model="dataList.code" maxlength="30" placeholder="请输入板块编码" />
        </el-form-item>
        <el-form-item label="Bi大屏端地址：" class="input_style_max" :label-width="formLabelWidth" prop="biUrlBigScreen">
          <el-input v-model="dataList.biUrlBigScreen" maxlength="200" placeholder="请输入Bi大屏端地址" />
        </el-form-item>
        <el-form-item label="Bi移动端地址：" class="input_style_max" :label-width="formLabelWidth" prop="biUrlMobile">
          <el-input v-model="dataList.biUrlMobile" maxlength="200" placeholder="请输入Bi移动端地址" />
        </el-form-item>
        <el-form-item label="BiPCweb端地址：" class="input_style_max" :label-width="formLabelWidth" prop="biUrlPcWeb">
          <el-input v-model="dataList.biUrlPcWeb" maxlength="200" placeholder="请输入BiPCweb端地址" />
        </el-form-item>
        <el-form-item label="排序：" class="input_style_max" :label-width="formLabelWidth" prop="sort">
          <el-input v-model.number="dataList.sort" maxlength="10" placeholder="请输入序号" @input="(v)=>this.dataList.sort = v.replace(/[^\d.]/g,'')" />
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
export default {
  name: 'Dispatch',
  props: ['dispatchShow', 'dataList', 'types'],
  data() {
    return {
      changeTitle: (this.types === 'msg' ? '查看' : (this.types === 'edit' ? '编辑' : '创建')),
      formLabelWidth: '120px',
      dispatchVisible: this.dispatchShow,
      form: {
        sort: null,
        description: '',
        name: '',
        code: ''
      },
      options: [],
      rules: {
        name: [{ required: true, message: '请输入板块名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入板块编码', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入序号', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    // this.$store.dispatch('center/getBusiness', {method:'get', data:this.form, type:'list', container:this.table}).then((res)=>{
    //   console.log(res);
    // })
  },
  methods: {
    onSubmit() {
      console.log(this.dataList, 'list')
      // return
      this.$refs.dataList.validate(valid => {
        if (valid) {
          if (this.types === 'add') {
            this.$store.dispatch('center/getBusiness', { method: 'post', data: this.dataList, type: 'list' }).then((res) => {
              this.$message.success('新增成功')
              this.$emit('changeState', { state: false, step: 1 })
            })
          } else {
            this.$store.dispatch('center/getBusiness', { method: 'put', data: this.dataList, id: this.dataList.id, type: 'edit' }).then((res) => {
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
.dispatch{
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
