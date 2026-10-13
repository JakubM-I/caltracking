import { describe, expect, it } from 'vitest'
import { addDays, formatDate, startOfWeek, weekLabel } from './date'

describe('narzędzia dat', () => {
  it('wyznaczają poniedziałek dla dowolnego dnia tygodnia', () => {
    expect(formatDate(startOfWeek(new Date('2026-10-11T12:00:00')))).toBe('2026-10-05')
  })

  it('dodają dni bez zmieniania oryginalnej daty', () => {
    const date = new Date('2026-10-05T12:00:00')
    expect(formatDate(addDays(date, 7))).toBe('2026-10-12')
    expect(formatDate(date)).toBe('2026-10-05')
  })

  it('skracają etykietę tygodnia w obrębie jednego miesiąca', () => {
    expect(weekLabel(new Date('2026-10-12T12:00:00'))).toBe('12–18 paź')
    expect(weekLabel(new Date('2026-10-26T12:00:00'))).toBe('26 paź – 1 lis')
  })
})
