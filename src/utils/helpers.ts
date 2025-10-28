import { ZodError } from 'zod'

export class HttpError extends Error {
  public code: number

  constructor(code: number, message: string) {
    super(message)
    this.code = code
    Object.setPrototypeOf(this, HttpError.prototype)
  }
}

export class HttpResponse {
  public code: number
  public data: object

  constructor(code: number, data: object) {
    this.data = data
    this.code = code
  }
}

export function ZodErrorsHandler(err: ZodError) {
  const formatted: Record<string, string> = {}

  for (const issue of err.errors) {
    const path = issue.path.join('.') || 'root'
    formatted[path] = issue.message
  }

  return formatted
}

export function emptyObject(object: any): boolean {
  if (Object.keys(object).length === 0) {
    return true
  }

  return false
}

export function ParseToMoney(n: number | string): number {
  if (typeof n === 'string') return parseFloat(Number(n).toFixed(2))
  else return parseFloat(n.toFixed(2))
}

export function CreateTimestampZ() {
  const timestamp = new Date().toLocaleString('sv-SE') // Retorna "2025-10-15 13:03:21"

  return timestamp.replace(' ', 'T') + '.000'
}

export function StringValuesToFloat(values: number[]) {
  return values.map(n => ParseToMoney(n))
}

export const DefaultTransactionCategories: string[] = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Salário'
]

export function CreateCurrentMonthTimestamp() {
  const now = new Date()

  // Primeiro dia do mês (ex: 2025-10-01T00:00:00.000)
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)

  // Último dia do mês (ex: 2025-10-31T23:59:59.999)
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

  // Formata para 'YYYY-MM-DDTHH:mm:ss.SSS'
  const format = (date: Date) =>
    date.toISOString().slice(0, 23) // corta o 'Z' do final

  const start_time = format(firstDay)
  const end_time = format(lastDay)

  return [start_time, end_time]
}

export function CreateCurrentWeekTimestamp() {
  const now = new Date()

  // Dia da semana atual (0 = domingo, 1 = segunda, ..., 6 = sábado)
  const dayOfWeek = now.getDay()

  // Considerando que a semana começa na segunda-feira:
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const firstDay = new Date(now)
  firstDay.setDate(now.getDate() + diffToMonday)
  firstDay.setHours(0, 0, 0, 0)

  // Último dia (domingo)
  const lastDay = new Date(firstDay)
  lastDay.setDate(firstDay.getDate() + 6)
  lastDay.setHours(23, 59, 59, 999)

  // Formata para 'YYYY-MM-DDTHH:mm:ss.SSS'
  const format = (date: Date) => date.toISOString().slice(0, 23)

  const start_time = format(firstDay)
  const end_time = format(lastDay)

  return [start_time, end_time]
}