export default function daysInMonth(month, year) {
  return new Date(parseInt(year), parseInt(month) + 1, 0).getDate()
}
