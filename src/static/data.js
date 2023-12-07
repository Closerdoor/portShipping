export const loanTypes = [
  { state: -1, label: '预约失败' },
  { state: 0, label: '退回' },
  { state: 1, label: '待提交' },
  // { state:2, label:'待加急审核' },
  { state: 3, label: '待初审审核' },
  { state: 4, label: '待主管审核' },
  { state: 5, label: '待确认放款' },
  { state: 6, label: '已放款' },
  { state: 7, label: '档案移交' },
  { state: 8, label: '待归档' },
  { state: 20, label: '归档完毕' }
]

export const pickerOptions = {
  shortcuts: [
    {
      text: '最近一周',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '最近一个月',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      }
    },
    {
      text: '最近三个月',
      onClick(picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        picker.$emit('pick', [start, end])
      }
    }
  ]
}
