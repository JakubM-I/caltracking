import { mealSlots, type Meal } from './types'

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
  return typeof item.id === 'string' && item.id.length > 0 &&
    typeof item.name === 'string' && item.name.trim().length > 0 &&
    typeof item.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date) &&
    typeof item.slot === 'string' && mealSlots.includes(item.slot as Meal['slot']) &&
    ['calories', 'protein', 'fat', 'carbohydrates'].every((key) => typeof item[key] === 'number' && Number.isFinite(item[key]) && item[key] >= 0)
  const hasText = (key: string) => typeof item[key] === 'string' && item[key].trim().length > 0
  const hasNutritionValue = (key: string) => typeof item[key] === 'number' &&
    Number.isFinite(item[key]) && item[key] >= 0

  return hasText('id') &&
    hasText('name') &&
    typeof item.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date) &&
    typeof item.slot === 'string' && mealSlots.includes(item.slot as Meal['slot']) &&
    ['calories', 'protein', 'fat', 'carbohydrates'].every(hasNutritionValue)
}
