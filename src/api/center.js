import request from '@/utils/request'

const api = {
  role: '/api/Management/Role',
  account: '/api/Management/Account'
}

export function getCenterList(data) {
  return request({
    url: '/api/Personal/Entrance',
    data
  })
}

// 字典
// export function getDictionary(params) {
//   return request({
//     url: "/api/Management/Dictionary",
//     params
//   });
// }
export function getDictionary(data) {
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
    url: `/api/Management/Dictionary${t ? `/${t}` : ``}`,
    method: data.method,
    params: data.method === 'get' ? data.condition : {},
    data: data.method !== 'get' ? data.condition : {}
  })
}

/** start*/
/* 角色*/
export function addRoles(data) {
  return request({
    url: '/api/Management/Role',
    method: 'post',
    data
  })
}
export function getRoleList(params) {
  return request({
    url: '/api/Management/Role',
    params
  })
}
export function getRoleDetail(id) {
  return request({
    url: `/api/Management/Role/${id}`
  })
}
export function getRoleEdit(id, data) {
  return request({
    url: `/api/Management/Role/${id}`,
    method: 'put',
    data
  })
}
export function getRoleListById(id, params) {
  return request({
    url: `/api/Management/Account/${id}/DispatchRole`,
    params
  })
}
export function roleSystemTree(data) {
  return request({
    // url: `/api/Management/Role/${data.id}/Authority`,
    url: `api/Management/Role/${data.id}`,
    method: data.method,
    data: data.data
  })
}
export function getRoleAccountList(id, params) {
  return request({
    url: `/api/Management/Role/${id}/AccountPage`,
    params
  })
}
export function setRoleAccount(id, data) {
  return request({
    url: `/api/Management/Role/${id}/Dispatch`,
    // url: `/api/Management/Account/${id}/DispatchRole`,
    method: 'put',
    data
  })
}
/** end*/

/** start*/
/* 账户*/
export function setAccount(data) {
  return request({
    url: '/api/Management/Account' + (data.method === 'post' ? '' : `/${data.id}`),
    method: data.method,
    data: data.data
  })
}
export function getAccountDetails(id) {
  return request({
    url: `/api/Management/Account/${id}`
  })
}
export function getDictionaryDetails(id) {
  return request({
    url: `/api/Management/Dictionary/${id}`
  })
}
export function getLoanDetails() {
  return request({
    url: `/api/Personal/Tree`
  })
}
export function getDepartmentData() {
  return request({
    url: `/api/Management/Organization/Tree`,
    params: { parentCode: 'root' }
  })
}
export function changeAccountRoles(id, data) {
  return request({
    url: `/api/Management/Account/${id}/DispatchRole`,
    method: 'put',
    data
  })
}
export function changePassword(data) {
  return request({
    url: '/api/Personal/Password',
    method: 'put',
    data
  })
}
export function getSync(params) {
  return request({
    // url: '/api/Management/Account/SyncWxUsers',
    url: '/api/YunHome/SyncPersons',
    method: 'get',
    params
  })
}
/** end*/

/** start*/
/* 系统*/
export function getSystemTree(params) {
  return request({
    url: '/api/Management/Authority/Tree',
    params
  })
}
export function getSystemTreeDetails(params) {
  return request({
    url: `/api/Management/Authority/${params}`
  })
}
export function setSystemTreeDetails(data) {
  return request({
    url: '/api/Management/Authority' + (data.method === 'put' ? `/${data.id}` : ''),
    method: data.method,
    data: data.data
  })
}
export function deleteSystemTreeNode(id) {
  return request({
    url: `/api/Management/Authority/${id}`,
    method: 'delete'
  })
}
export function getOperationLog(data) {
  // return request({
  //   url: '/api/Management/OperationLog',
  //   params
  // })
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
    default:
      t = ''
  }
  return request({
    url: `/api/Management/OperationLog${t ? `/${t}` : ``}`,
    method: data.method,
    params: data.method === 'get' ? data.condition : {},
    data: data.method !== 'get' ? data.condition : {}
  })
}
/** end*/

/** start*/
/* 统一*/
export function getList(d) {
  return request({
    url: api[d.type],
    params: d.condition
  })
}

export function getEditDictionaryItems(id, d) {
  return request({
    url: `api/Management/Dictionary/${id}`,
    method: 'post',
    data: d.data
  })
}
export function getDictionaryItems(d) {
  return request({
    // url: `api/Management/Dictionary` + (d.data.id ? `/${d.data.id}` : ``),
    url: d.data.id ? `api/Management/Dictionary/${d.data.id}` : `api/Management/Dictionary`,
    method: d.data.id ? 'put' : 'post',
    data: d.data
  })
}
export function deleteItems(d) {
  return request({
    url: api[d.type],
    method: 'delete',
    data: d.data
  })
}
export function deleteDictionaryItems(d) {
  return request({
    url: `api/Management/Dictionary`,
    method: 'delete',
    data: d.data
  })
}
export function deleteOneDictionaryItems(id, d) {
  return request({
    url: `api/Management/Dictionary` + `/${id.data}`,
    method: 'delete'
  })
}
// 基础数据
export function deleteOneItems(d) {
  return request({
    url: `api/Management/BusinessBlock`,
    method: 'delete',
    data: d.data
  })
}

export function getBusiness(data) {
  let t = ''
  switch (data.type) {
    case 'list':
      t = ''
      break
    case 'msg':
      t = data.id
      break
    case 'edit':
      t = `${data.id}`
      break
    case 'dispatch':
      t = `Dispatch`
      break
    default:
      t = ''
  }
  return request({
    url: `/api/Management/BusinessBlock${t ? `/${t}` : ``}`,
    method: data.method,
    params: data.method === 'get' ? data.condition : {},
    data: data.method !== 'get' ? data.condition : {}
  })
}
// 码头管理
export function deleteWharfItems(d) {
  return request({
    url: `/api/Management/DockPart`,
    method: 'delete',
    data: d.data
  })
}

export function getWharf(data) {
  let t = ''
  switch (data.type) {
    case 'list':
      t = ''
      break
    case 'msg':
      t = data.id
      break
    case 'edit':
      t = `${data.id}`
      break
    case 'dispatch':
      t = `Dispatch`
      break
    default:
      t = ''
  }
  return request({
    url: `/api/Management/DockPart${t ? `/${t}` : ``}`,
    method: data.method,
    params: data.method === 'get' ? data.condition : {},
    data: data.method !== 'get' ? data.condition : {}
  })
}
// 航线管理
export function deleteAirLineItems(d) {
  return request({
    url: `/api/Management/AirLine`,
    method: 'delete',
    data: d.data
  })
}

export function getAirLine(data) {
  let t = ''
  switch (data.type) {
    case 'list':
      t = ''
      break
    case 'msg':
      t = data.id
      break
    case 'edit':
      t = `${data.id}`
      break
    case 'dispatch':
      t = `Dispatch`
      break
    default:
      t = ''
  }
  return request({
    url: `/api/Management/AirLine${t ? `/${t}` : ``}`,
    method: data.method,
    params: data.method === 'get' ? data.condition : {},
    data: data.method !== 'get' ? data.condition : {}
  })
}
// 指标管理
export function deleteIndicatorItems(d) {
  return request({
    url: `/api/Management/IndicatorCategory`,
    method: 'delete',
    data: d.data
  })
}

export function getIndicator(data) {
  let t = ''
  switch (data.type) {
    case 'list':
      t = ''
      break
    case 'msg':
      t = data.id
      break
    case 'edit':
      t = `${data.id}`
      break
    case 'dispatch':
      t = `Dispatch`
      break
    default:
      t = ''
  }
  return request({
    url: `/api/Management/IndicatorCategory${t ? `/${t}` : ``}`,
    method: data.method,
    params: data.method === 'get' ? data.condition : {},
    data: data.method !== 'get' ? data.condition : {}
  })
}

// 船舶管理
export function deleteShipIndexItems(d) {
  return request({
    url: `/api/Management/Ship`,
    method: 'delete',
    data: d.data
  })
}

export function getShipIndex(data) {
  let t = ''
  switch (data.type) {
    case 'list':
      t = ''
      break
    case 'msg':
      t = data.id
      break
    case 'edit':
      t = `${data.id}`
      break
    case 'dispatch':
      t = `Dispatch`
      break
    default:
      t = ''
  }
  return request({
    url: `/api/Management/Ship${t ? `/${t}` : ``}`,
    method: data.method,
    params: data.method === 'get' ? data.condition : {},
    data: data.method !== 'get' ? data.condition : {}
  })
}

export function getbusinessData(data) {
  console.log(data, 'export')
  let t = ''
  switch (data.type) {
    case 'list':
      t = ''
      break
    case 'msg':
      t = data.id
      break
    case 'edit':
      t = `${data.id}`
      break
    case 'export':
      t = `export`
      break
    default:
      t = ''
  }
  return request({
    url: `/api/Management/IndicatorStorage${t ? `/${t}` : ``}`,
    method: data.method,
    responseType: data.type === 'export' ? 'blob' : '',
    params: data.method === 'get' ? data.condition : {},
    data: data.method !== 'get' ? data.condition : {}
  })
}

export function getAcquireData(data) {
  let t = ''
  switch (data.type) {
    case 'list':
      t = ''
      break
    case 'msg':
      t = data.id
      break
    case 'edit':
      t = `${data.id}`
      break
    case 'export':
      t = `Export`
      break
    case 'download':
      t = `download/template`
      break
    default:
      t = ''
  }
  return request({
    url: `/api/Management/DataAcquisition${t ? `/${t}` : ``}`,
    method: data.method,
    responseType: data.type === 'export' || data.type === 'download' ? 'blob' : '',
    params: data.method === 'get' ? data.condition : {},
    data: data.method !== 'get' ? data.condition : {}
  })
}

export function changeStatus(status, d) {
  return request({
    url: `${api[d.type]}/Status/${status}`,
    method: 'put',
    data: d.data
  })
}
//
export function changeDictionaryStatus(status, d) {
  return request({
    url: `api/Management/Dictionary/enable`,
    method: 'put',
    data: d.data
  })
}
/** end*/

/** 公告*/
/** start*/
export function noticeProcess(data) {
  return request({
    url:
      `/api/Management/Notice` +
      (typeof data.status === 'number' ? `/chagestatus/${data.status}` : ``) +
      (data.id ? `/${data.id}` : ``),
    method: data.method,
    params: data.method === 'get' ? data.condition : {},
    data: data.method !== 'get' ? data.condition : {}
  })
}

export function noticeRead(data) {
  return request({
    url:
      `/api/Personal/Notice` + (data.id ? `/${data.id}` : ``),
    method: data.method,
    params: data.method === 'get' ? data.condition : {},
    data: data.method !== 'get' ? data.condition : {}
  })
}

export function addNotice(data) {
  return request({
    url: 'api/Management/Notice',
    method: 'post',
    data
  })
}

export function getNoticeEdit(id, data) {
  return request({
    url: `/api/Management/Notice/${id}`,
    method: 'put',
    data
  })
}
/** end*/

/** 获取字典*/
/** start*/
export function getDictionaryOption(params) {
  return request({
    url: `/api/Basic/DictionaryOption`,
    params
  })
}

export function getWharfOption(params) {
  return request({
    url: `/api/Management/DockPart`,
    params
  })
}
export function getbusinessOption(params) {
  return request({
    url: `/api/Management/BusinessBlock`,
    params
  })
}
export function getIndicatorOption(params) {
  return request({
    url: `/api/Management/IndicatorCategory/Tree`,
    params
  })
}

export function getAirOption(params) {
  return request({
    url: `/api/Management/Dictionary/Option`,
    params
  })
}

/** end*/

export function getPagePromise(params) {
  return request({
    url: `/api/Personal/PageElement`,
    params
  })
}
