import { describe, expect, it } from 'vitest'
import { sumMeals } from './nutrition'

describe('sumMeals', () => {
  it('sumuje wszystkie wartości odżywcze', () => {
    expect(sumMeals([
      { id: '1', name: 'Owsianka', date: '2026-10-05', slot: 'Śniadanie', calories: 400, protein: 14, fat: 10, carbohydrates: 65 },
      { id: '2', name: 'Obiad', date: '2026-10-05', slot: 'Obiad', calories: 600, protein: 35, fat: 20, carbohydrates: 70 },
    ])).toEqual({ calories: 1000, protein: 49, fat: 30, carbohydrates: 135 })
  })
})
