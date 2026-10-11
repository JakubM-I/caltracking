import type { Meal, Nutrition } from './types'

export const emptyNutrition: Nutrition = {
  calories: 0,
  protein: 0,
  fat: 0,
  carbohydrates: 0,
}

export function sumMeals(meals: Meal[]): Nutrition {
  return meals.reduce<Nutrition>(
    (total, meal) => ({
      calories: total.calories + meal.calories,
      protein: total.protein + meal.protein,
      fat: total.fat + meal.fat,
      carbohydrates: total.carbohydrates + meal.carbohydrates,
    }),
    emptyNutrition,
  )
}
