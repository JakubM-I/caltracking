import type { Meal } from './types'

const STORAGE_KEY = 'caltracking.meals.v1'

export function loadMeals(): Meal[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    if (!Array.isArray(value)) return []

    return value.filter(isMeal)
  } catch {
    return []
  }
}

export function saveMeals(meals: Meal[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(meals))
    return true
  } catch {
    return false
  }
}

function isMeal(value: unknown): value is Meal {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Record<string, unknown>
  return ['id', 'name', 'date', 'slot'].every((key) => typeof item[key] === 'string') &&
    ['calories', 'protein', 'fat', 'carbohydrates'].every((key) => typeof item[key] === 'number')
}
