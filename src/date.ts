export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function startOfWeek(date: Date): Date {
  const result = new Date(date)
  const day = result.getDay() || 7
  result.setDate(result.getDate() - day + 1)
  result.setHours(0, 0, 0, 0)
  return result
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function dateLabel(date: Date): string {
  return new Intl.DateTimeFormat('pl-PL', { weekday: 'long', day: 'numeric', month: 'short' }).format(date)
}

export function weekLabel(start: Date): string {
  const end = addDays(start, 6)
  const formatter = new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'short' })
  return `${formatter.format(start)} – ${formatter.format(end)}`
}
