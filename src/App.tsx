import { useEffect, useMemo, useState } from 'react'
import { addDays, dateLabel, formatDate, startOfWeek, weekLabel } from './date'
import { loadMeals, saveMeals } from './storage'
import { mealSlots, type Meal, type MealSlot, type Nutrition } from './types'

const emptyNutrition: Nutrition = { calories: 0, protein: 0, fat: 0, carbohydrates: 0 }

function sumMeals(meals: Meal[]): Nutrition {
  return meals.reduce<Nutrition>((total, meal) => ({
    calories: total.calories + meal.calories,
    protein: total.protein + meal.protein,
    fat: total.fat + meal.fat,
    carbohydrates: total.carbohydrates + meal.carbohydrates,
  }), emptyNutrition)
}

function App() {
  const [meals, setMeals] = useState<Meal[]>(loadMeals)
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()))
  const [selectedDate, setSelectedDate] = useState(() => formatDate(new Date()))
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)

  const days = useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)), [weekStart])
  const weekMeals = meals.filter((meal) => days.some((day) => meal.date === formatDate(day)))
  const totals = sumMeals(weekMeals)

  useEffect(() => saveMeals(meals), [meals])

  function showForm(meal?: Meal) {
    setEditingMeal(meal ?? null)
    if (meal) setSelectedDate(meal.date)
    setIsFormOpen(true)
  }

  function saveMeal(meal: Meal) {
    setMeals((current) => editingMeal ? current.map((item) => item.id === meal.id ? meal : item) : [...current, meal])
    setIsFormOpen(false)
  }

  function changeWeek(offset: number) {
    const next = addDays(weekStart, offset * 7)
    setWeekStart(next)
    setSelectedDate(formatDate(next))
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div><p className="eyebrow">TWÓJ DZIENNIK</p><h1>CalTracking</h1></div>
        <button className="primary" onClick={() => showForm()}>+ Dodaj posiłek</button>
      </header>

      <section className="week-navigation" aria-label="Nawigacja po tygodniach">
        <button onClick={() => changeWeek(-1)} aria-label="Poprzedni tydzień">←</button>
        <strong>{weekLabel(weekStart)}</strong>
        <button onClick={() => changeWeek(1)} aria-label="Następny tydzień">→</button>
      </section>

      <section className="summary" aria-label="Podsumowanie tygodnia">
        <div><span>Kalorie</span><strong>{totals.calories} kcal</strong></div>
        <div><span>Białko</span><strong>{totals.protein} g</strong></div>
        <div><span>Tłuszcze</span><strong>{totals.fat} g</strong></div>
        <div><span>Węglowodany</span><strong>{totals.carbohydrates} g</strong></div>
      </section>

      <section className="day-tabs" aria-label="Wybór dnia">
        {days.map((day) => {
          const date = formatDate(day)
          return <button key={date} className={date === selectedDate ? 'selected' : ''} onClick={() => setSelectedDate(date)}>
            {new Intl.DateTimeFormat('pl-PL', { weekday: 'short', day: 'numeric' }).format(day)}
          </button>
        })}
      </section>

      <section className="day-view" aria-labelledby="selected-day">
        <h2 id="selected-day">{dateLabel(new Date(`${selectedDate}T12:00:00`))}</h2>
        {mealSlots.map((slot) => <MealGroup key={slot} slot={slot} meals={meals.filter((meal) => meal.date === selectedDate && meal.slot === slot)} onEdit={showForm} onDelete={(id) => setMeals((current) => current.filter((meal) => meal.id !== id))} />)}
      </section>

      {isFormOpen && <MealForm initialMeal={editingMeal} initialDate={selectedDate} onClose={() => setIsFormOpen(false)} onSave={saveMeal} />}
    </main>
  )
}

function MealGroup({ slot, meals, onEdit, onDelete }: { slot: MealSlot; meals: Meal[]; onEdit: (meal: Meal) => void; onDelete: (id: string) => void }) {
  return <section className="meal-group"><h3>{slot}</h3>{meals.length === 0 ? <p className="empty">Brak zapisanych posiłków</p> : meals.map((meal) => <article className="meal-card" key={meal.id}><div><strong>{meal.name}</strong><p>{meal.calories} kcal · B {meal.protein} g · T {meal.fat} g · W {meal.carbohydrates} g</p></div><div className="meal-actions"><button onClick={() => onEdit(meal)}>Edytuj</button><button onClick={() => onDelete(meal.id)} aria-label={`Usuń: ${meal.name}`}>Usuń</button></div></article>)}</section>
}

function MealForm({ initialMeal, initialDate, onClose, onSave }: { initialMeal: Meal | null; initialDate: string; onClose: () => void; onSave: (meal: Meal) => void }) {
  const [form, setForm] = useState(() => initialMeal ?? { id: crypto.randomUUID(), name: '', date: initialDate, slot: 'Śniadanie' as MealSlot, ...emptyNutrition })
  function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); onSave(form) }
  function updateNumber(key: keyof Nutrition, value: string) { setForm((current) => ({ ...current, [key]: Math.max(0, Number(value)) })) }
  return <div className="dialog-backdrop" role="presentation"><form className="meal-form" onSubmit={submit}><div className="form-header"><h2>{initialMeal ? 'Edytuj posiłek' : 'Dodaj posiłek'}</h2><button type="button" onClick={onClose} aria-label="Zamknij formularz">×</button></div><label>Nazwa<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label>Dzień<input required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label><label>Pora<select value={form.slot} onChange={(event) => setForm({ ...form, slot: event.target.value as MealSlot })}>{mealSlots.map((slot) => <option key={slot}>{slot}</option>)}</select></label><div className="nutrition-fields">{([['calories', 'Kalorie (kcal)'], ['protein', 'Białko (g)'], ['fat', 'Tłuszcze (g)'], ['carbohydrates', 'Węglowodany (g)']] as const).map(([key, label]) => <label key={key}>{label}<input min="0" step="0.1" type="number" required value={form[key]} onChange={(event) => updateNumber(key, event.target.value)} /></label>)}</div><div className="form-actions"><button type="button" onClick={onClose}>Anuluj</button><button className="primary" type="submit">Zapisz posiłek</button></div></form></div>
}

export default App
