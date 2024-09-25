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
