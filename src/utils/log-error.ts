import format from 'date-fns/format'
import { red } from 'console-log-colors'

export function logError(errorMessage: string, e: any = null) {
  console.error(
    `${red(errorMessage)}: `,
    format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    e,
  )
}
