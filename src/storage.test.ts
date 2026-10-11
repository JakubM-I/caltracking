import { describe, expect, it, vi } from 'vitest'
import { loadMeals, saveMeals } from './storage'

describe('lokalny zapis', () => {
  it('ignoruje uszkodzone i niepoprawne dane', () => {
    localStorage.setItem('caltracking.meals.v1', '{')
    expect(loadMeals()).toEqual([])

    localStorage.setItem('caltracking.meals.v1', JSON.stringify([{ id: '1' }, { id: '2', name: 'Ujemne', date: '2026-10-05', slot: 'Śniadanie', calories: -1, protein: 14, fat: 10, carbohydrates: 65 }, { id: '3', name: 'Owsianka', date: '2026-10-05', slot: 'Śniadanie', calories: 400, protein: 14, fat: 10, carbohydrates: 65 }]))
    expect(loadMeals()).toHaveLength(1)
  })

  it('sygnalizuje błąd zapisu bez rzucania wyjątku', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('pełna pamięć') })
    expect(saveMeals([])).toBe(false)
    setItem.mockRestore()
  })
})
