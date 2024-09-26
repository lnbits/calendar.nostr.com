export function daysInMonth(month, year) {
  return new Date(parseInt(year), parseInt(month) + 1, 0).getDate()
}

export function timeFromNow(date) {
  const timeDiff = new Date(date) - new Date()
  const timeUnits = {
    day: 86400000,
    hour: 3600000,
    minute: 60000,
    second: 1000
  }
  const timeUnit = Object.keys(timeUnits).find(
    unit => Math.abs(timeDiff) >= timeUnits[unit]
  )
  const timeValue = Math.floor(Math.abs(timeDiff) / timeUnits[timeUnit])

  return new Intl.RelativeTimeFormat().format(
    timeValue * (timeDiff > 0 ? 1 : -1),
    timeUnit
  )
}

export const extractUnavailableDates = arr => {
  const unavailableSet = new Set()
  arr.forEach(obj => {
    const startDate = new Date(obj.start_time)
    const endDate = new Date(obj.end_time)

    for (
      let date = startDate;
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const formattedDate = `${date.getFullYear()}/${
        date.getMonth() + 1
      }/${date.getDate()}`
      unavailableSet.add(formattedDate)
    }
  })
  return unavailableSet
}

const toMinutes = str => str.split(':').reduce((h, m) => h * 60 + +m)

const toString = min =>
  (Math.floor(min / 60) + ':' + (min % 60)).replace(/\b\d\b/, '0$&')

export function timeslotsByInterval(startStr, endStr, interval = 30) {
  let start = toMinutes(startStr)
  let end = toMinutes(endStr)
  return Array.from(
    {length: Math.floor((end - start) / interval) + 1},
    (_, i) => toString(start + i * interval)
  )
}
