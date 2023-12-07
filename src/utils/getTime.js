export function getTimeDiffer(beginTime, endTime) {
  const dateBegin = new Date(beginTime)
  const dateEnd = new Date(endTime)
  const dateDiff = dateEnd.getTime() - dateBegin.getTime() // 时间差的毫秒数
  const dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)) // 计算出相差天数
  const leave1 = dateDiff % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  const hours = Math.floor(leave1 / (3600 * 1000)) // 计算出小时数
  // 计算相差分钟数
  const leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
  const minutes = Math.floor(leave2 / (60 * 1000)) // 计算相差分钟数
  // 计算相差秒数
  const leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
  const seconds = Math.round(leave3 / 1000)

  let result = ''
  if (dayDiff > 0) {
    result = result + dayDiff + '天'
  }
  if (dayDiff > 0 || hours > 0) {
    result = result + hours + '小时'
  }

  if (dayDiff > 0 || hours > 0 || minutes > 0) {
    result = result + minutes + '分钟'
  }

  if (dayDiff > 0 || hours > 0 || minutes > 0 || seconds > 0) {
    result = result + seconds + '秒'
  }

  return result
}
