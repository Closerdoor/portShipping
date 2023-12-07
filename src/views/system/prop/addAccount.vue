<template>
  <div class="addAccountBox">
    <el-dialog title="提示" :visible.sync="dialogVisible" :close-on-click-modal="false" @close="close">
      <div class="search_wrap">
        <el-input v-model="searchText" placeholder="支持姓名搜索" size="mini" clearable @clear="search">
          <el-button slot="append" class="search_btn" size="mini" icon="el-icon-search" @click="search" />
        </el-input>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="openNewDialog"
        >新增</el-button>
      </div>
      <div>
        <el-table stripe style="width: 100%" :data="tableData" size="mini">
          <el-table-column prop="loginName" label="用户名" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="organizationName" label="所属机构" width="300" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          :page-sizes="[10]"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="totalCount"
          @current-change="handleCurrentChange"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="close"
        >关 闭</el-button>
      </span>
    </el-dialog>

    <el-dialog class="addNew_container" :visible.sync="addNew" title="添加用户" @close="addNew = false">
      <el-row>
        <el-col :span="8">
          <div class="grid-content bg-purple" />
        </el-col>
        <el-col :span="16">
          <!-- <el-checkbox>备选项</el-checkbox> -->
        </el-col>
      </el-row>
      <el-row class="tree_wrap" type="flex">
        <el-col class="left_box">
          <el-tree
            ref="systemTree"
            class="scrollbar"
            :props="defaultProps"
            :data="treeData"
            node-key="id"
            :default-expanded-keys="['3DDD67AC-AF99-46ED-A5B4-31408BADAC72']"
            accordion
            :highlight-current="true"
            :expand-on-click-node="false"
          />
        </el-col>
        <el-col class="right_box">
          <el-checkbox-group>
            <el-checkbox label="复选框 A" />
            <el-checkbox label="复选框 B" />
            <el-checkbox label="复选框 C" />
            <el-checkbox label="复选框 C" />
            <el-checkbox label="复选框 C" />
          </el-checkbox-group>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addNew = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addNew = false"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AddAccount',
  components: {},
  props: ['isShow', 'RoleId'],
  data() {
    return {
      dialogVisible: this.isShow,
      addNew: false,
      tableData: [],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      totalPage: 0,
      searchText: '',
      treeData: []
    }
  },
  computed: {},
  mounted() {
    this.getAccountTree()
    this.getTableData().then(res => {
      this.tableData = res.data.list
      this.pageIndex = res.data.pageIndex
      this.pageSize = +res.data.pageSize
      this.totalCount = +res.data.totalCount
      this.totalPage = res.data.totalPage
    })
  },
  methods: {
    // 获取当前角色 用户列表
    getTableData() {
      return this.$store.dispatch('center/getRoleAccountList', { id: this.RoleId,
        condition: {
          pageIndex: this.pageIndex,
          name: this.searchText
        }, container: { flag: false }}
      )
    },
    // 获取公司部门组织架构树
    getAccountTree() {
      this.$store.dispatch('center/getDepartmentData').then(res => {
        this.treeData = res.data
      })
    },
    close() {
      this.$emit('changeState', { state: false })
    },
    // 打开弹窗
    openNewDialog() {
      this.addNew = true
    },
    // 删除角色用户
    handleDelete(index, data) {
      /* this.$store.dispatch('center/roleSystemTree',{
        id:data.id,
        method:'delete',
      }) */
    },
    // 分页器
    handleCurrentChange(val) {
      console.log(val)
      this.pageIndex = val
      this.getTableData().then(res => {
        this.tableData = res.data.list
      })
    },
    search() {
      this.getTableData().then(res => {
        this.tableData = res.data.list
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.addAccountBox{
    .el-dialog{
        width: 800px;
    }
    .search_wrap{
        display: flex;
        margin-bottom: 20px;
        .el-input{
            width: 300px;
            margin-right: 30px;
            .search_btn{
                width: 40px;
                text-align: center;
            }
        }
        .el-button{
            height: 28px;
        }
    }
}
.addNew_container{
  .tree_wrap{
    background-color: rgb(248, 251, 251);
    padding: 10px;
    .left_box{
      border-right: 1px solid #D1DDF0;
      .el-tree{
        height: 400px;width: 300px;
        background-color: rgb(248, 251, 251);
        overflow-y: auto;
      }
    }
    .right_box{
      width: 600px;
      height: 400px;
      padding-left: 10px;
    }
  }
}
/* 滚动条样式 */
  .scrollbar::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 6px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 6px;
  }

  .scrollbar::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    cursor: pointer;
    background-color: rgba(144, 147, 153, 0.3);
    transition: background-color 0.3s;
    border-radius: 3px;
  }
</style>
