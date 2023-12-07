<template>
  <div class="dictionary">
    <div class="title">系统字典</div>
    <div class="dictionary_data">
      <el-form
        ref="form"
        :inline="true"
        label-width="90px"
        :label-position="labelPosition"
        :model="form"
        class="top_form demo-form-inline"
      >
        <el-form-item label="字典名称：" class="input_style_max">
          <el-input v-model="form.title" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-search"
            @click="getDictionaryList"
          >查询</el-button>
          <el-button
            size="mini"
            icon="el-icon-refresh-left"
            @click="resetForm"
          >重置</el-button>
        </el-form-item>
      </el-form>
      <div class="dictionary_data_btn">
        <el-button v-if="tp('system:dictionary:add')" type="primary" size="mini" @click="addDictionary('new')"><i class="iconfont icon-adduser-btn" />创建</el-button>
        <el-button v-if="tp('system:dictionary:enable')" plain size="mini" icon="el-icon-circle-check" @click="changeDictionaryStatus(1)">启用</el-button>
        <el-button v-if="tp('system:dictionary:disable')" plain size="mini" @click="changeDictionaryStatus(0)"><i class="iconfont icon-tingyong_line" />停用</el-button>
        <el-button v-if="tp('system:dictionary:delete')" plain size="mini" icon="el-icon-delete" @click="deleteDictionary">删除</el-button>
      </div>
      <page-table
        v-if="table.flag"
        :column="table.column"
        :source="table.data"
        :selection="table.selection"
        :total="table.total"
        :current="table.current"
        @selectData="getSelectData"
        @currentChange="(v) => (this.table.current = v)"
      />

      <!-- 弹窗 -->
      <el-dialog :title="changeTitle" class="dictionaryForm" :visible.sync="dictionaryFormVisible">
        <el-form ref="dictionaryForm" :label-position="labelPosition" :rules="rules" class="dictionary_form" :inline="true" :model="dictionaryForm" label-width="100px" size="mini">
          <el-form-item label="字典编码：" prop="code">
            <el-input v-if="isEdit == 'msg'" v-model="dictionaryForm.code" class="input_style" disabled />
            <el-input v-else v-model="dictionaryForm.code" class="input_style" />
          </el-form-item>
          <el-form-item label="字典名称：" prop="title">
            <el-input v-if="isEdit == 'msg'" v-model="dictionaryForm.title" class="input_style" disabled />
            <el-input v-else v-model="dictionaryForm.title" class="input_style" />
          </el-form-item>
          <el-form-item label="状态：">
            <el-select v-if="isEdit == 'msg'" v-model="dictionaryForm.isEnable" size="mini" disabled placeholder="是否启用">
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
            <el-select v-else v-model="dictionaryForm.isEnable" size="mini" placeholder="是否启用">
              <el-option label="启用" :value="1" />
              <el-option label="禁用" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="说明：">
            <el-input v-if="isEdit == 'msg'" v-model="dictionaryForm.remark" type="textarea" disabled />
            <el-input v-else v-model="dictionaryForm.remark" type="textarea" />
          </el-form-item>
        </el-form>

        <el-table max-height="350" :data="dictionaryForm.options" border>
          <el-table-column label="字典项编码值" width="230">
            <template slot-scope="scope">
              <el-input v-if="isEdit == 'msg'" v-model="scope.row.optionValue" size="mini" maxlength="50" disabled class="input_style" />
              <el-input v-else v-model="scope.row.optionValue" size="mini" maxlength="50" class="input_style" />
            </template>
          </el-table-column>
          <el-table-column label="字典项" width="300">
            <template slot-scope="scope">
              <el-input v-if="isEdit == 'msg'" v-model="scope.row.optionText" size="mini" maxlength="50" disabled class="input_style" />
              <el-input v-else v-model="scope.row.optionText" size="mini" maxlength="50" class="input_style" />
            </template>
          </el-table-column>
          <el-table-column label="排序号" width="130">
            <template slot-scope="scope">
              <el-input v-if="isEdit == 'msg'" v-model.number="scope.row.sortNo" size="mini" disabled maxlength="10" class="input_style" @input="(v)=>scope.row.sortNo = v.replace(/[^\d.]/g,'')" />
              <el-input v-else v-model.number="scope.row.sortNo" size="mini" maxlength="10" class="input_style" @input="(v)=>scope.row.sortNo = v.replace(/[^\d.]/g,'')" />
            </template>
          </el-table-column>
          <el-table-column label="是否启用" width="130">
            <template slot-scope="scope">
              <el-select v-if="isEdit == 'msg'" v-model="scope.row.isEnable" size="mini" disabled placeholder="是否启用">
                <el-option label="启用" :value="1" />
                <el-option label="禁用" :value="0" />
              </el-select>
              <el-select v-else v-model="scope.row.isEnable" size="mini" placeholder="是否启用">
                <el-option label="启用" :value="1" />
                <el-option label="禁用" :value="0" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column v-if="isEdit!=='msg'" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row v-if="isEdit!=='msg'">
          <el-col :span="20">
            <div class="grid-content title bg-purple-light">
              <el-button size="mini" class="commit_btn" @click="addValue">添加字典值</el-button>
            </div>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button class="cancel_btn" @click="dictionaryFormVisible = false">取 消</el-button>
          <el-button v-if="isEdit == 'edit'" type="primary" @click="onSubmit(1)">提 交</el-button>
          <el-button v-else-if="isEdit == 'msg'" type="primary" style="display:none" />
          <el-button v-else type="primary" @click="onSubmit(0)">提 交</el-button>
        </div>
        <!-- <div slot="footer" class="dialog-footer">
          <el-button @click="dictionaryFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dictionaryFormVisible = false">提 交</el-button>
        </div> -->
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { getPagePromise } from '@/utils/auth'
import pageTable from '@/views/table/index'
import { clearObject } from '@/utils/tool'
export default {
  name: 'Dictionary',
  components: {
    pageTable
  },
  data() {
    return {
      changeTitle: (this.isEdit === 'msg' ? '查看' : (this.isEdit === 'edit' ? '编辑' : '创建')) + '字典',
      labelPosition: 'left',
      dictionaryFormVisible: false,
      currentType: 'dictionary',
      form: {
        title: '',
        pageSize: 10,
        pageIndex: 1
      },
      dictionaryForm: {
        title: '',
        remark: '',
        code: '',
        isEnable: 1,
        id: '',
        created: '',
        updated: '',
        readonly: 0,
        options: [

        ]
      },
      table: {
        flag: false,
        selection: true,
        column: [
          { prop: 'code', label: '字典编码' },
          { prop: 'title', label: '字典名称' },
          {
            prop: 'isEnable',
            label: '状态',
            symbol: true,
            formatter: (row) => {
              return row.isEnable ? '启用' : '停用'
            }
          },
          // { prop: "isEnable", label: "状态" },
          { prop: 'updated', label: '更新时间' },
          { label: '操作', button: true, actions: [] }
        ],
        data: [],
        total: 0,
        current: 1
      },
      pagePromise: [],
      multipleSelection: [],
      type: 'new',
      isEdit: '',
      dictionaryId: '',
      rules: {
        code: [{ required: true, message: '请输入字典编码', trigger: 'blur' }],
        title: [{ required: true, message: '请输入字典名称', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    setTimeout(() => {
      getPagePromise().then((res) => {
        this.pagePromise = res
        this.tp('system:dictionary:detail') &&
          this.table.column[this.table.column.length - 1].actions.push({
            label: '查看',
            click: (data) => this.addDictionary('msg', data),
            type: 'text'
          //   icon:"el-icon-edit"
          })
        this.tp('system:dictionary:edit') &&
          this.table.column[this.table.column.length - 1].actions.push({
            label: '编辑',
            click: (data) => this.addDictionary('edit', data),
            type: 'text'
          //   icon:"el-icon-edit"
          })
        this.tp('system:dictionary:edit') &&
          this.table.column[this.table.column.length - 1].actions.push({
            label: '删除',
            click: (data) => this.deleteOneDictionary(data),
            type: 'text'
          })
        // this.getAccountList(this.accountForm);
        this.getDictionaryList()
      })
    }, 200)
  },
  updated() {
    if (this.table.current !== this.form.pageIndex) {
      this.form.pageIndex = this.table.current
      this.getDictionaryList(this.form)
    }
  },
  methods: {
    onSubmit(num) {
      this.$refs.dictionaryForm.validate(valid => {
        if (valid) {
          console.log(this.dictionaryForm, 'vvvvvv')
          // return
          this.$store.dispatch('center/getDictionaryItems', {
            list: this.dictionaryForm,
            t: this,
            id: this.dictionaryId
          })
        }
      })
    },
    tp(k) {
      return this.pagePromise.indexOf(k) > -1
    },
    getDictionaryList() {
      this.$store.dispatch('center/getDictionary', { method: 'get', data: this.form, type: 'list', container: this.table }).then()
    },
    resetForm() {
      this.form.pageIndex = 1
      this.table.current = 1
      clearObject(this.form)
      this.getDictionaryList()
    },
    getSelectData(list) {
      this.multipleSelection = list.map(i => i.id)
    },
    deleteDictionary() {
      this.$store.dispatch('center/deleteDictionaryItems', {
        list: this.multipleSelection,
        t: this
      })
    },
    deleteOneDictionary(data) {
      this.$store.dispatch('center/deleteOneDictionaryItems', {
        id: data.row.id,
        t: this
      })
    },
    addDictionary(type, data) {
      this.isEdit = type
      this.changeTitle = (this.isEdit === 'msg' ? '查看' : (this.isEdit === 'edit' ? '编辑' : '创建')) + '字典'
      if (type == 'edit' || type == 'msg') {
        this.dictionaryId = data.row.id
        this.$store.dispatch('center/getDictionaryDetails', data.row.id).then(res => {
          this.dictionaryForm = res.data
        })
        this.dictionaryFormVisible = true
      } else if (type == 'new') {
        this.dictionaryId = ''
        this.dictionaryFormVisible = true
        this.dictionaryForm = {
          title: '',
          remark: '',
          code: '',
          isEnable: 1,
          id: '',
          created: '',
          updated: '',
          readonly: 0,
          options: [

          ]
        }
      }
    },
    addValue() {
      // let newOptions =
      if (this.dictionaryForm.options.length) {
        if (this.dictionaryForm.options[this.dictionaryForm.options.length - 1].dictionaryCode !== '' && this.dictionaryForm.options[this.dictionaryForm.options.length - 1].optionText) {
          this.dictionaryForm.options.push({
            sortNo: this.dictionaryForm.options.length,
            dictionaryCode: '',
            optionText: '',
            isEnable: 1,
            readonly: 0,
            created: '',
            id: '',
            optionValue: '',
            // parentOptionValue:"",
            remark: '',
            sortNo: 0,
            updated: ''
          })
        } else {
          this.$message.error('字典项及编码值不能为空！')
        }
      } else {
        this.dictionaryForm.options.push({
          sortNo: 0,
          dictionaryCode: '',
          optionText: '',
          isEnable: 1,
          readonly: 0,
          created: '',
          id: '',
          optionValue: '',
          // parentOptionValue:"",
          remark: '',
          sortNo: 0,
          updated: ''
        })
      }
    },
    changeDictionaryStatus(status) {
      this.$store.dispatch('center/changeDictionaryStatus', {
        status,
        list: this.multipleSelection,
        t: this
      })
    },
    handleDelete(index, row) {
      this.dictionaryForm.options.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/icon/iconfont.css";
.dictionary {
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
  .dictionary_data_btn{
    margin-bottom: 10px;
  }
  .dictionary_data {
    min-width: 1320px;
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
      .dictionary_data {
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
  // 弹窗

}
</style>
