import {
  getCenterList,
  getRoleList,
  getRoleDetail,
  getRoleEdit,
  addNotice,
  getNoticeEdit,
  getRoleListById,
  addRoles,
  roleSystemTree,
  getRoleAccountList,
  setRoleAccount,
  setAccount,
  getAccountDetails,
  getDictionaryDetails,
  getLoanDetails,
  getDepartmentData,
  changeAccountRoles,
  changePassword,
  getSystemTree,
  getOperationLog,
  getSync,
  getSystemTreeDetails,
  setSystemTreeDetails,
  deleteSystemTreeNode,
  getList,
  getDictionary,
  getDictionaryItems,
  deleteOneDictionaryItems,
  deleteItems,
  deleteDictionaryItems,
  changeStatus,
  changeDictionaryStatus,
  noticeProcess,
  noticeRead,
  getDictionaryOption,
  getPagePromise,
  getBusiness,
  deleteOneItems,
  getWharf,
  deleteWharfItems,
  getAirLine,
  getShipIndex,
  getbusinessOption,
  getIndicatorOption,
  getWharfOption,
  getAirOption,
  deleteAirLineItems,
  deleteIndicatorItems,
  deleteShipIndexItems,
  getbusinessData,
  getAcquireData,
  getIndicator
} from '@/api/center'
const mutations = {
  getIndicatorOption({ commit }, data) {
    return getIndicatorOption(data)
  }
}
const actions = {
  getCenterList({ commit }, data) {
    return getCenterList().then()
  },

  // 字典
  getDictionary({ commit }, data) {
    data.container && (data.container.flag = false)
    return getDictionary({
      id: data.id,
      method: data.method,
      condition: data.data,
      type: data.type
    }).then(res => {
      if (res.data && data.container) {
        data.container.data = res.data.list
        data.container.total = res.data.totalCount
        data.container.current = res.data.pageIndex
      }
      data.container && (data.container.flag = true)
      return res
    })
  },

  /* 角色*/
  getRoleList({ commit }, data) {
    return getRoleList(data).then()
  },
  getRoleDetail({ commit }, data) {
    return getRoleDetail(data.id, data).then()
  },
  getRoleEdit({ commit }, data) {
    return getRoleEdit(data.id, data.data).then()
  },
  getRoleListById({ commit }, data) {
    return getRoleListById(data.id, data).then()
  },
  addRoles({ commit }, data) {
    return addRoles(data).then()
  },
  deleteRoles({ commit }, data) {
    return deleteRoles(data).then()
  },
  changeRolesStatus({ commit }, data) {
    return changeRolesStatus(data.status, data.list).then()
  },
  roleSystemTree({ commit }, data) {
    return roleSystemTree(data).then()
  },
  getRoleAccountList({ commit }, data) {
    data.container.flag = false
    return getRoleAccountList(data.id, data.condition)
  },
  setRoleAccount({ commit }, data) {
    data.list.length
      ? setRoleAccount(data.id, data.list)
      : data.t.$alert('未选中操作项', '提示', { type: 'warning' })
  },

  /* 用户*/
  getAccountList({ commit }, data) {
    return getAccountList(data).then()
  },
  setAccount({ commit }, data) {
    return setAccount(data).then()
  },
  deleteAccounts({ commit }, data) {
    return deleteAccounts(data).then()
  },
  getAccountDetails({ commit }, data) {
    return getAccountDetails(data).then()
  },
  // 字典
  getDictionaryDetails({ commit }, data) {
    return getDictionaryDetails(data).then()
  },
  // 获取总台账树形结构组织
  getLoanDetails({ commit }, data) {
    return getLoanDetails(data).then()
  },
  getDepartmentData({ commit }) {
    return getDepartmentData()
  },
  changeAccountRoles({ commit }, data) {
    return changeAccountRoles(data.id, data.ids).then()
  },
  changePassword({ commit }, data) {
    return changePassword(data)
  },
  getSync({ commit }, data) {
    return getSync(data).then()
  },

  /* 系统*/
  getSystemTree({ commit }, data) {
    return getSystemTree(data).then()
  },
  // getOperationLog({ commit }, data) {
  //   return getOperationLog(data).then();
  // },
  getOperationLog({ commit }, data) {
    data.container && (data.container.flag = false)
    return getOperationLog({
      id: data.id,
      method: data.method,
      condition: data.data,
      type: data.type
    }).then(res => {
      if (res.data && data.container) {
        data.container.data = res.data.list
        data.container.total = res.data.totalCount
        data.container.current = res.data.pageIndex
      }
      data.container && (data.container.flag = true)
      return res
    })
  },
  getSystemTreeDetails({ commit }, data) {
    return getSystemTreeDetails(data).then()
  },
  setSystemTreeDetails({ commit }, data) {
    return setSystemTreeDetails(data).then()
  },
  deleteSystemTreeNode({ commit }, data) {
    return deleteSystemTreeNode(data).then()
  },

  // 基础数据
  getBusiness({ commit }, data) {
    data.container && (data.container.flag = false)
    return getBusiness({
      id: data.id,
      method: data.method,
      condition: data.data,
      type: data.type
    }).then(res => {
      if (res.data && data.container) {
        data.container.data = res.data.list
        data.container.total = res.data.totalCount
        data.container.current = res.data.pageIndex
      }
      data.container && (data.container.flag = true)
      return res
    })
  },
  // 码头管理
  getWharf({ commit }, data) {
    data.container && (data.container.flag = false)
    return getWharf({
      id: data.id,
      method: data.method,
      condition: data.data,
      type: data.type
    }).then(res => {
      if (res.data && data.container) {
        data.container.data = res.data.list
        data.container.total = res.data.totalCount
        data.container.current = res.data.pageIndex
      }
      data.container && (data.container.flag = true)
      return res
    })
  },
  // 航线管理
  getAirLine({ commit }, data) {
    data.container && (data.container.flag = false)
    return getAirLine({
      id: data.id,
      method: data.method,
      condition: data.data,
      type: data.type
    }).then(res => {
      if (res.data && data.container) {
        data.container.data = res.data.list
        data.container.total = res.data.totalCount
        data.container.current = res.data.pageIndex
      }
      data.container && (data.container.flag = true)
      return res
    })
  },
  // 船舶管理
  getShipIndex({ commit }, data) {
    data.container && (data.container.flag = false)
    return getShipIndex({
      id: data.id,
      method: data.method,
      condition: data.data,
      type: data.type
    }).then(res => {
      if (res.data && data.container) {
        data.container.data = res.data.list
        data.container.total = res.data.totalCount
        data.container.current = res.data.pageIndex
      }
      data.container && (data.container.flag = true)
      return res
    })
  },
  // 指标管理
  getIndicator({ commit }, data) {
    data.container && (data.container.flag = false)
    return getIndicator({
      id: data.id,
      method: data.method,
      condition: data.data,
      type: data.type
    }).then(res => {
      if (res.data && data.container) {
        data.container.data = res.data.list
        data.container.total = res.data.totalCount
        data.container.current = res.data.pageIndex
      }
      data.container && (data.container.flag = true)
      return res
    })
  },
  // 经营数据查询
  getbusinessData({ commit }, data) {
    data.container && (data.container.flag = false)
    return getbusinessData({
      id: data.id,
      method: data.method,
      condition: data.data,
      type: data.type
    }).then(res => {
      if (res.data && data.container) {
        data.container.data = res.data.list
        data.container.total = res.data.totalCount
        data.container.current = res.data.pageIndex
      }
      data.container && (data.container.flag = true)
      return res
    })
  },
  // 获取数据
  getAcquireData({ commit }, data) {
    data.container && (data.container.flag = false)
    return getAcquireData({
      id: data.id,
      method: data.method,
      condition: data.data,
      type: data.type
    }).then(res => {
      if (res.data && data.container) {
        data.container.data = res.data.list
        data.container.total = res.data.totalCount
        data.container.current = res.data.pageIndex
      }
      data.container && (data.container.flag = true)
      return res
    })
  },

  /* 公告*/
  noticeProcess({ commit }, data) {
    data.t && (data.t.table.flag = false)
    return noticeProcess({
      id: data.id,
      condition: data.condition,
      method: data.method,
      status: data.status
    }).then(res => {
      if (data.t && res.data) {
        data.t.table.data = res.data.list
        data.t.table.total = res.data.totalCount
        data.t.table.current = res.data.pageIndex
      }
      data.t && (data.t.table.flag = true)
      return res
    })
  },

  noticeRead({ commit }, data) {
    data.t && (data.t.table.flag = false)
    return noticeRead({
      id: data.id,
      condition: data.condition,
      method: data.method,
      status: data.status
    }).then(res => {
      if (data.t && res.data) {
        data.t.table.data = res.data.list
        data.t.table.total = res.data.totalCount
        data.t.table.current = res.data.pageIndex
      }
      data.t && (data.t.table.flag = true)
      return res
    })
  },
  addNotice({ commit }, data) {
    return addNotice(data).then()
  },

  getNoticeEdit({ commit }, data) {
    return getNoticeEdit(data.id, data.data).then()
  },
  getDictionaryOption({ commit }, dictionaryCode) {
    return getDictionaryOption({ dictionaryCode, isEnable: 1 })
  },

  /* 统一*/
  getList({ commit }, data) {
    data.container && (data.container.flag = false)
    return getList({
      type: data.t.currentType,
      condition: data.condition
    }).then(res => {
      if (data.container) {
        data.container.flag = true
        data.container.data = res.data.list
        data.container.total = res.data.totalCount
        data.container.current = res.data.pageIndex
      }
      return res
    })
  },

  getDictionaryItems({ commit }, data) {
    console.log(data, 'yy6666')
    // return
    return getDictionaryItems({
      data: data.list
    }).then(res => {
      data.t.$message.success(res.message ? res.message : '请求成功')
      data.t.dictionaryFormVisible = false
      data.t.getDictionaryList()
    })
  },
  deleteOneDictionaryItems({ commit }, data) {
    console.log(data)
    data.t
      .$confirm('确定删除选中项？', '警告', { type: 'warning' })
      .then(() =>
        deleteOneDictionaryItems({
          data: data.id
        }).then(res => {
          data.t.$message.success(res.message ? res.message : '删除成功')
          data.t.getDictionaryList()
        })
      )
      .catch()
  },
  deleteDictionaryItems({ commit }, data) {
    console.log(data)
    data.list.length
      ? data.t
        .$confirm('确定删除选中项？', '警告', { type: 'warning' })
        .then(() =>
          deleteDictionaryItems({
            data: data.list
          }).then(res => {
            data.t.$message.success(res.message ? res.message : '删除成功')
            data.t.multipleSelection = []
            data.t.getDictionaryList()
          })
        )
        .catch()
      : data.t.$alert('未选中操作项', '提示', { type: 'warning' })
  },
  // 基础数据删除
  deleteOneItems({ commit }, data) {
    console.log(data, 'lenth')
    // return
    data.id.length
      ? data.t
        .$confirm('确定删除选中项？', '警告', { type: 'warning' })
        .then(() =>
          deleteOneItems({
            data: { ids: data.id }
          }).then(res => {
            data.t.$message.success('删除成功')
            data.t.multipleSelection = []
            data.t.getItemList()
          })
        )
        .catch()
      : data.t.$alert('未选中操作项', '提示', { type: 'warning' })
  },
  // 码头删除
  deleteWharfItems({ commit }, data) {
    console.log(data, 'lenth')
    // return
    data.id.length
      ? data.t
        .$confirm('确定删除选中项？', '警告', { type: 'warning' })
        .then(() =>
          deleteWharfItems({
            data: { ids: data.id }
          }).then(res => {
            data.t.$message.success('删除成功')
            data.t.multipleSelection = []
            data.t.getItemList()
          })
        )
        .catch()
      : data.t.$alert('未选中操作项', '提示', { type: 'warning' })
  },
  // 航线删除
  deleteAirLineItems({ commit }, data) {
    console.log(data, 'lenth')
    // return
    data.id.length
      ? data.t
        .$confirm('确定删除选中项？', '警告', { type: 'warning' })
        .then(() =>
          deleteAirLineItems({
            data: { ids: data.id }
          }).then(res => {
            data.t.$message.success('删除成功')
            data.t.multipleSelection = []
            data.t.getItemList()
          })
        )
        .catch()
      : data.t.$alert('未选中操作项', '提示', { type: 'warning' })
  },
  // 指标删除
  deleteIndicatorItems({ commit }, data) {
    console.log(data, 'lenth')
    // return
    data.id.length
      ? data.t
        .$confirm('确定删除选中项？', '警告', { type: 'warning' })
        .then(() =>
          deleteIndicatorItems({
            data: { ids: data.id }
          }).then(res => {
            data.t.$message.success('删除成功')
            data.t.multipleSelection = []
            data.t.getItemList()
          })
        )
        .catch()
      : data.t.$alert('未选中操作项', '提示', { type: 'warning' })
  },
  // 船舶删除
  deleteShipIndexItems({ commit }, data) {
    console.log(data, 'lenth')
    // return
    data.id.length
      ? data.t
        .$confirm('确定删除选中项？', '警告', { type: 'warning' })
        .then(() =>
          deleteShipIndexItems({
            data: { ids: data.id }
          }).then(res => {
            data.t.$message.success('删除成功')
            data.t.multipleSelection = []
            data.t.getItemList()
          })
        )
        .catch()
      : data.t.$alert('未选中操作项', '提示', { type: 'warning' })
  },
  // 公共删除
  deleteItems({ commit }, data) {
    data.list.length
      ? data.t
        .$confirm('确定删除选中项？', '警告', { type: 'warning' })
        .then(() =>
          deleteItems({
            type: data.t.currentType,
            data: data.list
          }).then(res => {
            data.t.$message.success(res.message ? res.message : '删除成功')
            data.t.multipleSelection = []
            data.t.onSubmit()
          })
        )
        .catch()
      : data.t.$alert('未选中操作项', '提示', { type: 'warning' })
  },

  changeStatus({ commit }, data) {
    data.list.length
      ? data.t
        .$confirm(`确定${data.status ? '启用' : '停用'}选中项？`, '警告', {
          type: 'warning'
        })
        .then(() =>
          changeStatus(data.status, {
            type: data.t.currentType,
            data: data.list
          }).then(res => {
            data.t.multipleSelection = []
            data.t.onSubmit()
          })
        )
        .catch()
      : data.t.$alert('未选中操作项', '提示', { type: 'warning' })
  },
  changeDictionaryStatus({ commit }, data) {
    console.log(data, 'fata')
    // return
    data.list.length
      ? data.t
        .$confirm(`确定${data.status ? '启用' : '停用'}选中项？`, '警告', {
          type: 'warning'
        })
        .then(() =>
          changeDictionaryStatus(data.status, {
            type: data.t.currentType,
            data: { ids: data.list, status: data.status }
          }).then(res => {
            data.t.multipleSelection = []
            data.t.getDictionaryList()
            data.t.$message.success(data.status ? '启用成功' : '停用成功')
          })
        )
        .catch()
      : data.t.$alert('未选中操作项', '提示', { type: 'warning' })
  },
  getPagePromise({ commit }, data) {
    return getPagePromise(data)
  },
  getWharfOption({ commit }, data) {
    return getWharfOption(data)
  },
  getbusinessOption({ commit }, data) {
    return getbusinessOption(data)
  },
  getIndicatorOption({ commit }, data) {
    return getIndicatorOption(data)
  },
  getAirOption({ commit }, data) {
    return getAirOption(data)
  }
}

export default {
  namespaced: true,
  mutations,
  actions
}
