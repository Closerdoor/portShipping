export function clearObject(obj) {
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (typeof obj[i] === 'string') { obj[i] = '' } else if (i === 'pageIndex') { obj[i] = 1 } else if (typeof obj[i] === 'number' && i !== 'pageSize') { obj[i] = 0 } else if (typeof obj[i] === 'boolean') { obj[i] = false } else if (obj[i] instanceof Array) { obj[i] = [] } else if (obj[i] instanceof Object) { clearObject(obj[i]) }
    }
  }
}
