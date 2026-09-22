import { appendFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { formatWithOptions } from 'node:util'
import consola from 'consola'
import type { ConsolaReporter, LogObject } from 'consola'
import { format } from 'date-fns'

const LOG_DIRECTORY = join(process.cwd(), 'logs')

function formatLog(log: LogObject): string {
  const timestamp = format(log.date, 'yyyy-MM-dd HH:mm:ss.SSS')
  const type = log.type.toUpperCase()
  const tag = log.tag ? ` [${log.tag}]` : ''
  const message = formatWithOptions({ colors: false }, ...log.args)

  return `[${timestamp}] [${type}]${tag} ${message}\n`
}

const fileReporter: ConsolaReporter = {
  log(log) {
    try {
      mkdirSync(LOG_DIRECTORY, { recursive: true })
      const filePath = join(LOG_DIRECTORY, `${format(log.date, 'yyyy-MM')}.log`)
      appendFileSync(filePath, formatLog(log), 'utf8')
    }
    catch (error) {
      process.stderr.write(`Failed to write log file: ${String(error)}\n`)
    }
  },
}

/** consolaの出力をコンソールに加えて月別ファイルにも保存する。 */
export function setupFileLogging(): void {
  mkdirSync(LOG_DIRECTORY, { recursive: true })
  consola.addReporter(fileReporter)
}
