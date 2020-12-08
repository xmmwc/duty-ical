import chineseHolidays from 'chinese-holidays'
import * as dateFns from 'date-fns'
import * as ics from 'ics'

export interface ICalenderOptions {
  name: string[]
  start?: string
  duration?: number
  number?: number
  filter?: string
}

interface IWorkingPlan {
  date: Date,
  names: string[]
}

const EVENT_TEMPLATE = {
  title: '值班日程',
  busyStatus: 'FREE',
  status: 'CONFIRMED',
  duration: {
    hours: 3
  }
}

const getWorkingDays = async (start: string, days: number) => {
  const startDate = dateFns.parse(start, 'yyyy-MM-dd', new Date())
  const endDate = dateFns.addDays(startDate, days)
  const allDays = dateFns.eachDayOfInterval({
    start: startDate,
    end: endDate
  })
  const holiday = await chineseHolidays.ready()
  return allDays.filter(day => !holiday.isHoliday(day))
}

const getPlan = (names: string[], workingDays: Date[], namePerDay: number): IWorkingPlan[] => {
  let pool = [...names]
  const workingPlan = []
  for (const day of workingDays) {
    const plan: IWorkingPlan = {
      date: day,
      names: []
    }
    for (let index = 0; index < namePerDay; index++) {
      if (pool.length < 1) {
        pool = [...names]
      }
      const name = pool.shift()
      plan.names.push(name)
    }
    workingPlan.push(plan)
  }
  return workingPlan
}

export default async (options: ICalenderOptions) => {
  const defaultOptions: ICalenderOptions = {
    name: [],
    start: dateFns.format(Date.now(), 'yyyy-MM-dd'),
    duration: 365,
    number: 3,
    filter: ''
  }
  const opts = Object.assign({}, defaultOptions, options)
  const workingDays = await getWorkingDays(opts.start, opts.duration)
  const plans = getPlan(opts.name, workingDays, opts.number)
  const events: any = plans.filter(plan => !opts.filter || plan.names.indexOf(opts.filter)).map(plan => {
    const year = dateFns.getYear(plan.date)
    const month = dateFns.getMonth(plan.date) + 1
    const day = dateFns.getDate(plan.date)
    return {
      ...EVENT_TEMPLATE,
      description: plan.names.join('、'),
      start: [year, month, day, 18, 0]
    }
  })
  const { error, value } = ics.createEvents(events)
  if (error) {
    throw error
  }
  return value
}