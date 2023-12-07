import {
  getWorkbenchDoneList,
  getWorkbenchTodoList,
  ruleProcess,
  getNoticeList,
  getNotice,
  summaryMortgageInStandingBook,
  summaryMortgageOutStandingBook,
  customerMortgageInStandingBook,
  customerMortgageOutStandingBook,
  customerLoanStandingBook,
  summaryLoanStandingBook,
  summaryComplianceStandingBook,
  loanProcess,
  getloanUrgentList,
  getFirstAndMasterScoreList,
  getPlaceFilesList,
  setPlaceFilesList,
  setTemporary,
  getBusinessLine,
  getBusinessLineByPId,
  getLoanAccount,
  setLoanTemp,
  setLoan,
  setLoanUrgent,
  examineLoan,
  temporary,
  temporaryMain,
  examineLoanUrgent,
  examineLoanDeduct,
  examineMaster,
  loaned,
  loanFiles,
  loanFilesSign,
  placeFilesLoan,
  getLoanData,
  getExamineProgress,
  getBookLoanUrgentRecord,
  getBookLoanUrgentDetail,
  getLoanExamineData,
  getFilesList,
  setLoanData,
  getRequirement,
  storageProcess,
  removalProcess,
  schedulingProcess,
  firstAuditWait,
  masterAuditWait,
  getloanUrgentTab
} from '@/api/YFB/api'

const actions = {
  getWorkbenchDoneList({ commit }, data) {
    data.container.flag = false
    return getWorkbenchDoneList({
      pageSize: data.pageSize,
      pageIndex: data.pageIndex,
      businessLine: data.businessLine,
      businessCategory: data.businessCategory,
      borrowerName: data.borrowerName
    }).then(res => {
      data.container.data = res.data.list
      data.container.total = res.data.totalCount
      data.container.current = res.data.pageIndex
      data.container.flag = true
    })
  },
  getWorkbenchTodoList({ commit }, data) {
    data.container.flag = false
    return getWorkbenchTodoList({
      pageSize: data.pageSize,
      pageIndex: data.pageIndex,
      businessLine: data.businessLine,
      businessCategory: data.businessCategory,
      borrowerName: data.borrowerName
    }).then(res => {
      data.container.data = res.data.list
      data.container.total = res.data.totalCount
      data.container.current = res.data.pageIndex
      data.container.flag = true
    })
  },
  ruleProcess({ commit }, data) {
    data.t && (data.t.table.flag = false)
    return ruleProcess({
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
  getLoanList({ commit }, data) {
    data.container.flag = false
    return loanProcess({
      method: data.method,
      condition: data.condition,
      type: data.type
    }).then(res => {
      if (res.data) {
        data.container.data = res.data.list
        data.container.total = res.data.totalCount
        data.container.current = res.data.pageIndex
      }
      data.container.flag = true
    })
  },
  // 加急管理
  getloanUrgentList({ commit }, data) {
    data.container.flag = false
    return getloanUrgentList({
      method: data.method,
      condition: data.condition,
      type: data.type
    }).then(res => {
      if (res.data) {
        data.container.data = res.data.list
        data.container.total = res.data.totalCount
        data.container.current = res.data.pageIndex
      }
      data.container.flag = true
    })
  },
  getloanUrgentTab({ commit }, data) {
    data.container.flag = false
    return getloanUrgentTab({
      method: data.method,
      condition: data.condition,
      type: data.type
    })
    // .then(res => {
    //   if (res.data) {
    //     data.container.data = res.data.list;
    //     data.container.total = res.data.totalCount;
    //     data.container.current = res.data.pageIndex;
    //   }
    //   data.container.flag = true;
    // });
  },
  getFirstAndMasterScoreList({ commit }, data) {
    return getFirstAndMasterScoreList(data.yfbBookLoanId)
  },
  getPlaceFilesList({ commit }, data) {
    return getPlaceFilesList(data.yfbBookLoanId)
  },
  setPlaceFilesList({ commit }, data) {
    return setPlaceFilesList(data.id, data.data)
  },
  setTemporary({ commit }, data) {
    return setTemporary(data.data)
  },
  getNoticeList({ commit }, data) {
    return getNoticeList({
      condition: data.condition
    })
  },
  getNotice({ commit }, data) {
    return getNotice({
      condition: data.condition
    })
  },
  getBusinessLine({ commit }) {
    return getBusinessLine()
  },
  getBusinessLineByPId({ commit }, data) {
    return getBusinessLineByPId(data.pid, 10000, 1)
  },
  getLoanAccount({ commit }, data) {
    return getLoanAccount(data)
  },
  setLoanTemp({ commit }, data) {
    return setLoanTemp(data)
  },
  setLoan({ commit }, data) {
    return setLoan(data.id, data.data)
  },
  setLoanUrgent({ commit }, data) {
    return setLoanUrgent(data.id, data.data)
  },
  examineLoan({ commit }, data) {
    return examineLoan(data.id, data.data)
  },
  firstAuditWait({ commit }, data) {
    return firstAuditWait(data)
  },
  masterAuditWait({ commit }, data) {
    return masterAuditWait(data)
  },
  temporary({ commit }, data) {
    return temporary(data.id, data.data)
  },
  temporaryMain({ commit }, data) {
    return temporaryMain(data.id, data.data)
  },
  examineLoanUrgent({ commit }, data) {
    return examineLoanUrgent(data.id, data.data)
  },
  examineLoanDeduct({ commit }, data) {
    return examineLoanDeduct(data.id, data.data)
  },
  examineMaster({ commit }, data) {
    return examineMaster(data.id, data.data)
  },
  loaned({ commit }, data) {
    return loaned(data.id, data.data)
  },
  loanFiles({ commit }, data) {
    return loanFiles(data.id, data.data)
  },
  loanFilesSign({ commit }, data) {
    return loanFilesSign(data.id, data.data)
  },
  placeFilesLoan({ commit }, data) {
    return placeFilesLoan(data.id, data.data)
  },
  getLoanData({ commit }, data) {
    return getLoanData(data.id)
  },
  getExamineProgress({ commit }, data) {
    return getExamineProgress(data.id)
  },
  getBookLoanUrgentRecord({ commit }, data) {
    return getBookLoanUrgentRecord(data.id)
  },
  getBookLoanUrgentDetail({ commit }, data) {
    return getBookLoanUrgentDetail(data.id)
  },
  getLoanExamineData({ commit }, data) {
    return getLoanExamineData(data.id)
  },
  getFilesList({ commit }, id) {
    return getFilesList(id)
  },
  setLoanData({ commit }, data) {
    return setLoanData(data.id, data.data)
  },
  getRequirement({ commit }, id) {
    return getRequirement(id)
  },
  // 总台账入库
  summaryMortgageInStandingBook({ commit }, data) {
    data.container && (data.container.flag = false)
    return summaryMortgageInStandingBook({
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
  // 总台账出库
  summaryMortgageOutStandingBook({ commit }, data) {
    data.container && (data.container.flag = false)
    return summaryMortgageOutStandingBook({
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

  // 台账入库
  customerMortgageInStandingBook({ commit }, data) {
    data.container && (data.container.flag = false)
    return customerMortgageInStandingBook({
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

  // 台账出库
  customerMortgageOutStandingBook({ commit }, data) {
    data.container && (data.container.flag = false)
    return customerMortgageOutStandingBook({
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
  // 台账放款
  customerLoanStandingBook({ commit }, data) {
    data.container && (data.container.flag = false)
    return customerLoanStandingBook({
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

  // 台账放款
  summaryLoanStandingBook({ commit }, data) {
    data.container && (data.container.flag = false)
    return summaryLoanStandingBook({
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

  // 专业合规管理台账
  summaryComplianceStandingBook({ commit }, data) {
    data.container && (data.container.flag = false)
    return summaryComplianceStandingBook({
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

  storageProcess({ commit }, data) {
    data.container && (data.container.flag = false)
    return storageProcess({
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

  removalProcess({ commit }, data) {
    data.container && (data.container.flag = false)
    return removalProcess({
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

  schedulingProcess({ commit }, data) {
    data.container && (data.container.flag = false)
    return schedulingProcess({
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
  }
}

export default {
  namespaced: true,
  actions
}
