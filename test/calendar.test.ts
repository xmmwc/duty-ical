import calendar from '../src/calendar'

calendar({
  names: ['谢沐沐', '胡凡', '吴航宇', '马芳艳']
}).then((calendarVal) => {
  console.log(calendarVal)
}).catch(err => {
  console.error(err)
})

