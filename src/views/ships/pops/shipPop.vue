<template>
  <div class="shipPop">
    <el-dialog
      :title="changeTitle"
      class="addPop"
      center
      :close-on-click-modal="false"
      :visible.sync="shipPopVisible"
      @close="close"
    >
      <el-form ref="shipPopForm" :model="shipPopForm" :rules="rules">
        <el-form-item
          class="input_style_max"
          :label-width="formLabelWidth"
          label="船舶名称："
          prop="shipName"
        >
          <el-input
            v-model="shipPopForm.shipName"
            placeholder="请输入船舶名称"
          />
        </el-form-item>
        <el-form-item
          class="input_style_max"
          :label-width="formLabelWidth"
          label="船舶编码："
          prop="shipCode"
        >
          <el-input
            v-model="shipPopForm.shipCode"
            placeholder="请输入船舶编码"
          />
        </el-form-item>
        <el-form-item
          class="input_style_max"
          :label-width="formLabelWidth"
          label="船舶类型："
          prop="shipType"
        >
          <el-select
            v-model="shipPopForm.shipType"
            default-first-option=""
            placeholder="请选择船舶类型"
          >
            <!-- <el-option label='全部' value=''/> -->
            <el-option label="货船" :value="1" />
            <el-option label="客船" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item
          class="input_style_max"
          :label-width="formLabelWidth"
          :label="isPassenger"
          prop="passengerVolume"
        >
          <el-input
            v-model="shipPopForm.passengerVolume"
            type="number"
            placeholder="请输入客（货）运量"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">
          <i class="iconfont .icon-yes" />
          确 认
        </el-button>
        <el-button class="cancel_btn" @click="close">
          <i class="iconfont .icon-cancel" />
          取 消
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'ShipPop',
  props: ['shipIndexShow', 'types', 'id'],

  data() {
    return {
      formLabelWidth: '120px',
      shipPopVisible: this.shipIndexShow,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      shipPopForm: {
        shipName: '',
        shipCode: '',
        shipType: 1,
        passengerVolume: '',
        pageIndex: 1,
        pageSize: 10
      },
      changeTitle:
        this.types === 'msg' ? '查看' : this.types === 'edit' ? '编辑' : '创建',
      rules: {
        shipName: [
          { required: true, message: '请输入船舶名称', trigger: 'blur' },
          { min: 1, max: 50, message: '船舶名称长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        shipCode: [
          { required: true, message: '请输入船舶编码', trigger: 'blur' },
          { min: 1, max: 50, message: '船舶编码长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        shipType: [
          { required: true, message: '请输入船舶类型', trigger: 'blur' }
        ],
        passengerVolume: [
          { required: true, message: '请输入客（货）运量', trigger: 'blur' },
          { min: 1, max: 10, message: '客（货）运量长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    isPassenger() {
      if (this.shipPopForm.shipType === 1) {
        return '货运(吨位)：'
      } else if (this.shipPopForm.shipType === 0) {
        return '客运(人次)：'
      } else if (this.shipPopForm.shipType === '') {
        return '客(货)运：'
      }
    }
  },
  mounted() {
    console.log(this.shipPopForm, 'ttt')
    if (this.id) {
      const that = this
      this.$store
        .dispatch('center/getShipIndex', {
          method: 'get',
          id: this.id,
          type: 'msg'
        })
        .then((res) => {
          that.shipPopForm = res.data
        })
    }
  },
  methods: {
    onSubmit() {
      this.$refs.shipPopForm.validate((valid) => {
        if (valid) {
          if (this.types === 'add') {
            this.$store
              .dispatch('center/getShipIndex', {
                method: 'post',
                data: this.shipPopForm,
                type: 'list'
              })
              .then((res) => {
                this.$message.success('新增成功')
                this.$emit('changeState', { state: false, step: 1 })
              })
          } else {
            this.$store
              .dispatch('center/getShipIndex', {
                method: 'put',
                data: this.shipPopForm,
                id: this.shipPopForm.id,
                type: 'edit'
              })
              .then((res) => {
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
      this.orgCodeList = this.$refs.tree
        .getCheckedNodes()
        .map((i) => ({ code: i.extra, name: i.label }))
      this.shipPopForm.orgName = this.orgCodeList.map((i) => i.name).toString()
      this.shipPopForm.orgCode = this.orgCodeList.map((i) => i.code).toString()
    },
    close(type) {
      this.$emit('changeState', { state: false, step: -3, type })
    }
  }
}
</script>
<style lang='scss' scoped>
@import '../../../assets/icon/iconfont.css';
@import '../../../assets/icon_01/iconfont.css';
.shipPop {
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
