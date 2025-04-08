import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
const HOUR_MINUTE_SECOND = 'YYYY-MM-DD HH:mm:ss'
export function parseTime(utc, format = HOUR_MINUTE_SECOND) {
  return dayjs(utc).format(format)
}
