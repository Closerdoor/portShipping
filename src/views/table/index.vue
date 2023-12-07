<template>
  <div ref="table" class="table-cus">
    <el-table
      ref="multipleTable"
      class="table_style"
      :data="tableData"
      :row-key="(row)=>row.id"
      tooltip-effect="dark"
      style="width: 100%"
      :height="tableHeight"
      :row-class-name="tableRowClassName"
      :header-cell-style="getRowClass"
      @selection-change="handleSelectionChange"
      @select="handleSelect"
    >
      <el-table-column
        v-if="sort"
        label="序号"
        align="center"
        type="index"
      />

      <el-table-column
        v-if="selection"
        type="selection"
        :reserve-selection="true"
        fixed="left"
      />

      <el-table-column
        v-for="(ti, index) in column"
        :key="index"
        :column-key="ti.id"
        :prop="ti.prop"
        :formatter="ti.formatter"
        :type="ti.type"
        :label="ti.label"
        :fixed="ti.fixed"
        :width="ti.width"
      >
        <template v-if="ti.type!=='selection'" slot-scope="scope">
          <span v-if="ti.symbol">{{ ti['formatter'](scope.row, scope.$index) }}</span>
          <span v-else-if="ti.hover" :title="scope.row[ti.title]">{{ scope.row[ti.prop] }}</span>
          <span v-else-if="ti.grade === 10">
            <span v-for="(y,index) in scope.row[ti.prop]" :key="y.index">
              {{ index+1 }}.分数：{{ y.scoreValue>0?'-'+y.scoreValue:y.scoreValue }}；扣分项：{{ y.sort==null || y.sort==''?'无':y.sort }}；<br>原因：{{ y.reason==null || y.reason==''?'无':y.reason }}<br>
            </span>
          </span>
          <span v-else-if="ti.grade === 20">
            <span v-for="(y) in handleDocGrage(scope.row[ti.prop])" :key="y.index">
              <span>{{ y.name }}</span><br>
              <span v-for="(s,sIndex) in y.scores" :key="s.sIndex">
                {{ sIndex+1 }}.分数：{{ s.scoreValue>0?'-'+s.scoreValue:s.scoreValue }}；扣分项：{{ s.reason }}<br>
              </span>
            </span>
          </span>
          <span v-else-if="ti.grade === 30">
            <span v-for="(s) in scope.row[ti.prop]" :key="s.index">
              【{{ s.handleUserTypeText }}扣分】{{ s.handleUserName }}；借款人：{{ s.borrowerName }}；分数：{{ s.score>0?'-'+s.score:s.score }}<br>
            </span>
          </span>

          <el-badge v-else-if="ti.tag" :value="scope.row[ti.tagName]" class="item_tag">
            <span>{{ scope.row[ti.prop] }}</span>
          </el-badge>
          <span v-else-if="ti.button">
            <!-- <el-button
            :key="index"
            v-for="(fi, index) in filterActions(ti, scope)"
            :icon="fi.icon"
            @click="fi.click(scope)"
            ></el-button> -->
            <el-button
              v-for="(fi, index) in filterActions(ti, scope)"
              :key="index"
              class="text_btn"
              :type="fi.type"
              @click="fi.click(scope)"
            >{{ fi.label }}</el-button>
          </span>
          <span v-else>{{ scope.row[ti.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- layout="prev, pager, next, total" -->
    <div class="paging_class">
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next, jumper, total"
        :page-size="size"
        :total="total"
        :current-page="current"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: 'PageTable',
  props: ['column', 'source', 'sort', 'selection', 'total', 'size', 'current', 'height', 'checkeds'],
  data() {
    return {
      tableData: this.source,
      multipleSelection: [],
      tableHeight: null
    }
  },
  updated() {
    this.tableHeight = this.height ? this.height : this.$refs.table.clientHeight - 240
    // this.tableHeight = 550;
  },
  mounted() {
    if (this.checkeds) {
      this.$nextTick(() => {
        for (let index = 0; index < this.checkeds.length; index++) {
          for (let i = 0; i < this.source.length; i++) {
            const row = this.source[i]
            if (row.id === this.checkeds[index]) {
              this.$refs.multipleTable.toggleRowSelection(row)
            }
          }
        }
      })
    }

    window.onresize = () => {
      this.tableHeight = this.height ? this.height : this.$refs.table.clientHeight - 240
      // this.tableHeight = 550;
    }
  },
  methods: {
    handleDocGrage(list) {
      const grades = []
      const problem = { name: '【存在问题】', scores: [] }
      const sign = { name: '【档案移交状况】', scores: [] }

      for (let index = 0; index < list.length; index++) {
        const item = list[index]
        if (item.type === 20) {
          problem.scores.push(item)
        } else {
          sign.scores.push(item)
        }
      }

      if (problem.scores.length > 0) {
        grades.push(problem)
      }

      if (sign.scores.length > 0) {
        grades.push(sign)
      }

      return grades
    },
    // 实现单选
    // setChecks(){
    // if(this.checkeds){
    //     for (let index = 0; index < this.checkeds.length; index++) {
    //       for (let i = 0; i < this.source.length; i++) {
    //         const row = this.source[i];
    //         if(row.id === this.checkeds[index]){
    //           this.$refs.multipleTable.toggleRowSelection(row,true)
    //         }
    //       }
    //     }
    // }
    // },
    filterActions(ti, scope) {
      return ti.filterKey
        ? ti.actions.filter(item => {
          if (item[ti.filterKey] instanceof Array) { return item[ti.filterKey].indexOf(scope.row[ti.filterKey]) > -1 } else { return item[ti.filterKey] === scope.row[ti.filterKey] }
        })
        : ti.actions
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.$emit('selectData', val)
    },
    handleSelect(val) {
      this.multipleSelection = val
      this.$emit('selectTab', val)
    },
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    handleCurrentChange(val) {
      this.$emit('currentChange', val)
    },
    // 控制行颜色
    tableRowClassName({ row, rowIndex }) {
      if ((rowIndex + 1) % 2 === 0) {
        return 'double' // 对应的类
      } else {
        return 'single' // 对应的类
      }
    },
    // 控制表格头部颜色
    getRowClass({ rowIndex }) {
      if (rowIndex == 0) {
        return 'background:#ECEFF1'
      } else {
        return ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.table-cus {
  height: 100%;
  overflow: hidden;
  // .paging_class{
  //   >.pagination{
  //     margin-top: 8px;
  //     >.el-pagination__total{
  //       margin-left: 10px !important;
  //     }
  //   }
  // }
}

/*更改表格颜色*/
.double {
  background: #ECEFF1 !important;
}
.single {
  background: #fff !important;
}

.text_btn{
  width: auto;
}

.item_tag{
  margin-top: 10px;
  margin-right: 40px;
}
</style>
