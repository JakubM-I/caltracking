export type MealSlot = 'Śniadanie' | 'II śniadanie' | 'Obiad' | 'Kolacja' | 'Przekąska'

export interface Nutrition {
  calories: number
  protein: number
  fat: number
  carbohydrates: number
}

export interface Meal extends Nutrition {
  id: string
  name: string
  date: string
  slot: MealSlot
}

export const mealSlots: MealSlot[] = ['Śniadanie', 'II śniadanie', 'Obiad', 'Kolacja', 'Przekąska']
