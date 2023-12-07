<template>
  <div class="dictionaryEdit">
    <div class="title">系统字典</div>
    <div class="dictionaryEdit_data">
      <el-form
        ref="form"
        :inline="true"
        label-width="90px"
        :label-position="labelPosition"
        :model="form"
        class="top_form demo-form-inline"
      >
        <el-form-item label="字典名称：" class="input_style">
          <el-input v-model="form.name" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-search"
          >查询</el-button>
          <el-button
            size="mini"

            icon="el-icon-refresh-left"
          >重置</el-button>
        </el-form-item>
      </el-form>
      <div class="account_table_btn">
        <el-button type="primary" size="mini"><i class="iconfont icon-adduser-btn" />创建</el-button>
        <el-button plain size="mini" icon="el-icon-delete">删除</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getPagePromise } from '@/utils/auth'

export default {
  name: 'DictionaryEdit',
  data() {
    return {
      labelPosition: 'left',
      form: {
        name: '',
        region: '',
        account: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formInline: {
        account: '',
        region: ''
      },
      tableData: [],
      pagePromise: []
    }
  },
  mounted() {
    getPagePromise().then((res) => (this.pagePromise = res))
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/icon/iconfont.css";
.dictionaryEdit {
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
  .dictionaryEdit_data {
    min-width: 1200px;
    height: calc(100% - 100px);
    background-color: #fff;
    padding: 0px 30px;
    box-sizing: border-box;
    box-shadow: -1px 0px 4px rgba(217, 217, 217, 0.5);
    .tab {
      margin-top: 80px;
      display: flex;
      .tab_label {
        width: 150px;
        font-size: 13px;
        line-height: 30px;
      }
      .dictionaryEdit_tab {
        .el-table tr,
        .el-table th {
          padding: 0;
          height: 30px;
        }
        .el-table__body tr,
        .el-table__body td {
          padding: 0;
          height: 30px;
        }
      }
    }
  }
  .mt {
    margin-top: 20px;
  }
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
