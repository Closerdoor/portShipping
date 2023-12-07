<template>
  <div class="organization">
    <div class="title">组织结构管理</div>
    <div class="organization_table">
      <div class="tree_one">
        <el-tree
          ref="systemTree"
          :props="defaultProps"
          :data="treeData"
          node-key="id"
          accordion

          :expand-on-click-node="false"
        />

      </div>
      <!-- <div class="tree_two">
                 <el-tree
                    ref="systemCategoryTree"
                    :props="defaultProps"
                    :data="treeDataCategory"
                    node-key="id"
                    accordion
                    show-checkbox
                    :expand-on-click-node="false"
                >
              </el-tree>
            </div> -->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      treeData: [],
      treeDataCategory: [],
      roleForm: {
        name: '',
        status: '',
        pageSize: 10,
        pageIndex: 1
      },
      multipleSelection: [],
      multipleSelectionAll: [],
      checkAll: [],
      idkey: 'id',
      checkedCount: 0,
      formLabelWidth: '120px',
      defaultProps: {
        label: 'label',
        children: 'children'
      },
      count: 1,
      targetId: '',
      checkList: ['选中且禁用', '复选框 A'],
      pagePromise: [],
      selectData: [],
      selectDataLength: 0
    }
  },
  mounted() {
    this.$store.dispatch('center/getDepartmentData').then(res => {
      console.log(res)
      this.treeData = res.data
    })
  },
  methods: {

  }

}
</script>
<style lang="scss">
.organization {
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
  .el-form {
    background-color: #fff;
    box-sizing: border-box;
  }
  .organization_table_btn{
     margin-bottom: 10px;
  }
  .organization_table {
    min-width: 1320px;
    height: calc(100% - 100px);
    background-color: #fff;
    padding: 0px 30px;
    box-sizing: border-box;
    box-shadow: -1px 0px 4px rgba(217, 217, 217, 0.5);
    display: flex;
    align-items: center;
    // justify-content: space-between;
    .tree_one,.tree_two{
        width: 48%;
        height: 90%;
        background: #F2F2F2;
        box-sizing: border-box;
        padding: 20px;
        overflow-y: auto;
    }
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
