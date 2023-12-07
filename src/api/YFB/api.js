import request from '@/utils/request'

export function getWorkbenchDoneList(params) {
  return request({
    url: '/api/Yfb/Task/Done',
    params
  })
}

export function getWorkbenchTodoList(params) {
  return request({
    url: '/api/Yfb/Task/Todo',
    params
  })
}

export function ruleProcess(data) {
  return request({
    url: `/api/Management/Rule` +
      (typeof data.status === 'number' ? `/chagestatus/${data.status}` : ``) +
      (data.id ? `/${data.id}` : ``),
    method: data.method,
    params: data.method === 'get' ? data.condition : {},
    data: data.method !== 'get' ? data.condition : {}
  })
}

export function loanProcess(data) {
  let t = ''
  switch (data.type) {
    case 'list':
      t = ''
      break
    case '':
      t = ''
      break
    default:
      t = ''
  }
  return request({
    url: `/api/Yfb/BookLoan` + (t ? `/${t}` : ``),
    method: data.method,
    params: data.method === 'get' ? data.condition : {},
    data: data.method !== 'get' ? data.condition : {}
  })
}
// 加急管理
export function getloanUrgentList(data) {
  let t = ''
  switch (data.type) {
    case 'list':
      t = ''
      break
    case '':
      t = ''
      break
    default:
      t = ''
  }
  return request({
    url: `/api/Yfb/BookLoan/Urgent` + (t ? `/${t}` : ``),
    method: data.method,
    params: data.method === 'get' ? data.condition : {},
    data: data.method !== 'get' ? data.condition : {}
  })
}
export function getloanUrgentTab(data) {
  let t = ''
  switch (data.type) {
    case 'list':
      t = ''
      break
    case '':
      t = ''
      break
    default:
      t = ''
  }
  return request({
    url: `/api/Yfb/BookLoan/ToUrgent` + (t ? `/${t}` : ``),
    method: data.method,
    params: data.method === 'get' ? data.condition : {},
    data: data.method !== 'get' ? data.condition : {}
  })
}

export function getFirstAndMasterScoreList(yfbBookLoanId) {
  return request({
    url: `/api/Yfb/BookLoan/FirstAndMasterAuditScoreTable/${yfbBookLoanId}`
  })
}

export function getPlaceFilesList(yfbBookLoanId) {
  return request({
    url: `/api/Yfb/BookLoan/DocMgrAuditScoreTable/${yfbBookLoanId}`
  })
}

export function setPlaceFilesList(id, data) {
  return request({
    url: `/api/Yfb/BookLoan/DocMgrFilling/${id}`,
    method: 'put',
    data
  })
}
/* 归档暂存*/
export function setTemporary(data) {
  return request({
    url: `/api/Yfb/BookLoan/DocMgrFillingTempSave`,
    method: 'put',
    data
  })
}

export function getBusinessLine() {
  return request({
    url: `/api/Yfb/BusinessLine/Tree?parentId=root`
  })
}

export function getBusinessLineByPId(pid, size, index) {
  return request({
    url: `/api/Yfb/BusinessLine`,
    params: { parentId: pid, pageSize: size, pageIndex: index }
  })
}

export function getLoanAccount(data) {
  console.log(data, '4444')
  return request({
    url: `/api/Yfb/BookLoan/FirstAuditAccount`,
    params: { yfbBookLoanId: data.yfbBookLoanId, pageSize: data.pageSize, pageIndex: data.pageIndex }
  })
}

/* 暂存*/
export function setLoanTemp(data) {
  return request({
    url: '/api/Yfb/BookLoan/TemporarySave',
    method: 'post',
    data
  })
}

/* 提交*/
export function setLoan(id, data) {
  return request({
    url: `/api/Yfb/BookLoan/Submit/${id}`,
    method: 'put',
    data
  })
}
/* 提交*/
export function setLoanUrgent(id, data) {
  return request({
    url: `/api/Yfb/BookLoan/SubmitUrgent/${id}`,
    method: 'put',
    data
  })
}

/* 初审*/
export function examineLoan(id, data) {
  return request({
    url: `/api/Yfb/BookLoan/FirstAudit/${id}`,
    method: 'put',
    data
  })
}
/* 初审暂存*/
export function temporary(id, data) {
  return request({
    url: `/api/Yfb/BookLoan/firstAuditTempSave`,
    method: 'put',
    data
  })
}

/* 初审等待计时*/
export function firstAuditWait(data) {
  return request({
    url: `/api/Yfb/BookLoan/FirstAuditWait`,
    method: 'put',
    data: data
  })
}

/* 主审暂存*/
export function temporaryMain(id, data) {
  return request({
    url: `/api/Yfb/BookLoan/masterAuditTempSave`,
    method: 'put',
    data
  })
}

/* 主审等待计时*/
export function masterAuditWait(data) {
  return request({
    url: `/api/Yfb/BookLoan/MasterAuditWait`,
    method: 'put',
    data: data
  })
}

/* 加急*/
export function examineLoanUrgent(id, data) {
  return request({
    url: `/api/Yfb/BookLoan/Urgent/${id}`,
    method: 'put',
    data
  })
}

/* 确认扣分*/
export function examineLoanDeduct(id, data) {
  return request({
    url: `/api/Yfb/BookLoan/CustomerMgrAudit/${id}`,
    method: 'put',
    data
  })
}

/* 主管审*/
export function examineMaster(id, data) {
  return request({
    url: `/api/Yfb/BookLoan/MasterAudit/${id}`,
    method: 'put',
    data
  })
}

/* 放款*/
export function loaned(id, data) {
  return request({
    url: `/api/Yfb/BookLoan/MasterConfirm/${id}`,
    method: 'put',
    data
  })
}

/* 档案整理*/
export function loanFiles(id, data) {
  return request({
    url: `/api/Yfb/BookLoan/CustomerMgrDeal/${id}`,
    method: 'put',
    data
  })
}

/* 档案签收*/
export function loanFilesSign(id, data) {
  return request({
    url: `/api/Yfb/BookLoan/DocMgrSign/${id}`,
    method: 'put',
    data
  })
}

/* 归档*/
export function placeFilesLoan(id, data) {
  return request({
    url: `/api/Yfb/BookLoan/DocMgrFilling/${id}`,
    method: 'put',
    data
  })
}

export function getLoanData(id) {
  return request({
    url: `/api/Yfb/BookLoan/${id}`
  })
}

export function getLoanExamineData(id) {
  return request({
    url: `/api/Yfb/BookLoan/${id}/ScoreAudit`
  })
}

export function getExamineProgress(id) {
  return request({
    url: `/api/Yfb/BookLoan/${id}/ProcessBar`
  })
}

export function getBookLoanUrgentRecord(id) {
  return request({
    url: `/api/Yfb/BookLoan/${id}/UrgentRecord`
  })
}

export function getBookLoanUrgentDetail(id) {
  return request({
    url: `api/Yfb/BookLoan/Urgent/${id}`
  })
}

export function getRequirement(id) {
  return request({
    url: `/api/Yfb/BusinessLine/Guide/${id}`
  })
}

export function getFilesList(id) {
  return request({
    url: `/api/Yfb/BookLoan/CustomerMgrDoc/${id}`
  })
}

/* 编辑*/
export function setLoanData(id, data) {
  return request({
    url: `/api/Yfb/BookLoan/Modify/${id}`,
    method: 'put',
    data
  })
}
/* 工作台公告列表*/
export function getNotice(data) {
  return request({
    url: `/api/Personal/Notice`,
    params: data.condition
    // data: data.condition,
  })
}
export function getNoticeList(data) {
  return request({
    url: `/api/Management/Notice`,
    params: data.condition
    // data: data.condition,
  })
}

/* 台账入库*/
export function customerMortgageInStandingBook(data) {
  let t = ''
  switch (data.type) {
    case 'list':
      t = ''
      break
    case 'export':
      t = `Export`
      break
    default:
      t = ''
  }
  return request({
    url: `/api/Yfb/StandingBook/CustomerMortgageIn${t ? `/${t}` : ``}`,
    method: data.method,
    responseType: data.type === 'export' ? 'blob' : '',
    params: data.method === 'get' ? data.condition : {},
    data: data.method !== 'get' ? data.condition : {}
  })
}

/* 总台账入库*/
export function summaryMortgageInStandingBook(data) {
  let t = ''
  switch (data.type) {
    case 'list':
      t = ''
      break
    case 'export':
      t = `Export`
      break
    default:
      t = ''
  }
  return request({
    url: `/api/Yfb/StandingBook/SummaryMortgageIn${t ? `/${t}` : ``}`,
    method: data.method,
    responseType: data.type === 'export' ? 'blob' : '',
    params: data.method === 'get' ? data.condition : {},
    data: data.method !== 'get' ? data.condition : {}
  })
}
/* 总台账入库*/
export function summaryMortgageOutStandingBook(data) {
  let t = ''
  switch (data.type) {
    case 'list':
      t = ''
      break
    case 'export':
      t = `Export`
      break
    default:
      t = ''
  }
  return request({
    url: `/api/Yfb/StandingBook/SummaryMortgageOut${t ? `/${t}` : ``}`,
    method: data.method,
    responseType: data.type === 'export' ? 'blob' : '',
    params: data.method === 'get' ? data.condition : {},
    data: data.method !== 'get' ? data.condition : {}
  })
}

/* 台账出库*/
export function customerMortgageOutStandingBook(data) {
  let t = ''
  switch (data.type) {
    case 'list':
      t = ''
      break
    case 'export':
      t = `Export`
      break
    default:
      t = ''
  }
  return request({
    url: `/api/Yfb/StandingBook/CustomerMortgageOut${t ? `/${t}` : ``}`,
    method: data.method,
    responseType: data.type === 'export' ? 'blob' : '',
    params: data.method === 'get' ? data.condition : {},
    data: data.method !== 'get' ? data.condition : {}
  })
}

/* 台账放款*/
export function customerLoanStandingBook(data) {
  let t = ''
  switch (data.type) {
    case 'list':
      t = ''
      break
    case 'export':
      t = `Export`
      break
    default:
      t = ''
  }
  return request({
    url: `/api/Yfb/StandingBook/CustomerLoan${t ? `/${t}` : ``}`,
    method: data.method,
    responseType: data.type === 'export' ? 'blob' : '',
    params: data.method === 'get' ? data.condition : {},
    data: data.method !== 'get' ? data.condition : {}
  })
}

/* 总台账放款*/
export function summaryLoanStandingBook(data) {
  let t = ''
  switch (data.type) {
    case 'list':
      t = ''
      break
    case 'export':
      t = `Export`
      break
    default:
      t = ''
  }
  return request({
    url: `/api/Yfb/StandingBook/SummaryLoan${t ? `/${t}` : ``}`,
    method: data.method,
    responseType: data.type === 'export' ? 'blob' : '',
    params: data.method === 'get' ? data.condition : {},
    data: data.method !== 'get' ? data.condition : {}
  })
}

/* 专业合规管理台账*/
export function summaryComplianceStandingBook(data) {
  let t = ''
  switch (data.type) {
    case 'list':
      t = ''
      break
    case 'export':
      t = `Export`
      break
    default:
      t = ''
  }
  return request({
    url: `/api/Yfb/StandingBook/SummaryCompliance${t ? `/${t}` : ``}`,
    method: data.method,
    responseType: data.type === 'export' ? 'blob' : '',
    params: data.method === 'get' ? data.condition : {},
    data: data.method !== 'get' ? data.condition : {}
  })
}

/* 入库*/
export function storageProcess(data) {
  let t = ''
  switch (data.type) {
    case 'list':
      t = ''
      break
    case 'msg':
      t = data.id
      break
    case 'edit':
      t = `Modify/${data.id}`
      break
    case 'pass':
      t = `Confirm/${data.id}`
      break
    case 'batchPass':
      t = `BatchConfirm`
      break
    case 'export':
      t = `Export`
      break
    default:
      t = ''
  }
  return request({
    url: `/api/Yfb/BookMortgageIn${t ? `/${t}` : ``}`,
    method: data.method,
    responseType: data.type === 'export' ? 'blob' : '',
    params: data.method === 'get' ? data.condition : {},
    data: data.method !== 'get' ? data.condition : {}
  })
}

/* 出库*/
export function removalProcess(data) {
  let t = ''
  switch (data.type) {
    case 'list':
      t = ''
      break
    case 'msg':
      t = data.id
      break
    case 'edit':
      t = `Modify/${data.id}`
      break
    case 'pass':
      t = `Confirm/${data.id}`
      break
    case 'batchPass':
      t = `BatchConfirm`
      break
    case 'export':
      t = `Export`
      break
    default:
      t = ''
  }
  return request({
    url: `/api/Yfb/BookMortgageOut${t ? `/${t}` : ``}`,
    method: data.method,
    responseType: data.type === 'export' ? 'blob' : '',
    params: data.method === 'get' ? data.condition : {},
    data: data.method !== 'get' ? data.condition : {}
  })
}

/* 调度*/
export function schedulingProcess(data) {
  let t = ''
  switch (data.type) {
    case 'list':
      t = ''
      break
    case 'msg':
      t = data.id
      break
    case 'edit':
      t = `Modify/${data.id}`
      break
    case 'dispatch':
      t = `Dispatch`
      break
    default:
      t = ''
  }
  return request({
    url: `/api/Yfb/TaskScheduleMgr${t ? `/${t}` : ``}`,
    method: data.method,
    params: data.method === 'get' ? data.condition : {},
    data: data.method !== 'get' ? data.condition : {}
  })
}

