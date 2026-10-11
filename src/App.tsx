import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { addDays, dateLabel, formatDate, startOfWeek, weekLabel } from './date'
import { emptyNutrition, sumMeals } from './nutrition'
import { loadMeals, saveMeals } from './storage'
import { mealSlots, type Meal, type MealSlot, type Nutrition } from './types'

const nutritionFields = [['calories', 'Kalorie (kcal)'], ['protein', 'Białko (g)'], ['fat', 'Tłuszcze (g)'], ['carbohydrates', 'Węglowodany (g)']] as const
type NutritionKey = keyof Nutrition
type MealDraft = Omit<Meal, NutritionKey> & Record<NutritionKey, string>
type FormErrors = Partial<Record<keyof MealDraft, string>>

function toDraft(meal: Meal | null, date: string): MealDraft {
  const source = meal ?? { id: crypto.randomUUID(), name: '', date, slot: 'Śniadanie' as MealSlot, ...emptyNutrition }
  return { ...source, calories: String(source.calories), protein: String(source.protein), fat: String(source.fat), carbohydrates: String(source.carbohydrates) }
}

function validateDraft(draft: MealDraft): FormErrors {
  const errors: FormErrors = {}
  if (!draft.name.trim()) errors.name = 'Podaj nazwę posiłku.'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date)) errors.date = 'Wybierz poprawny dzień.'
  nutritionFields.forEach(([key]) => {
    const value = Number(draft[key])
    if (draft[key].trim() === '' || !Number.isFinite(value) || value < 0) errors[key] = 'Wpisz liczbę równą lub większą od zera.'
  })
  return errors
}

function mealFromDraft(draft: MealDraft): Meal {
  return { ...draft, name: draft.name.trim(), calories: Number(draft.calories), protein: Number(draft.protein), fat: Number(draft.fat), carbohydrates: Number(draft.carbohydrates) }
}

function App() {
  const [meals, setMeals] = useState<Meal[]>(loadMeals)
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()))
  const [selectedDate, setSelectedDate] = useState(() => formatDate(new Date()))
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
  const [saveMessage, setSaveMessage] = useState('')
  const days = useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)), [weekStart])
  const weekMeals = meals.filter((meal) => days.some((day) => meal.date === formatDate(day)))
  const totals = sumMeals(weekMeals)

  function updateMeals(nextMeals: Meal[]) {
    setMeals(nextMeals)
    setSaveMessage(saveMeals(nextMeals) ? '' : 'Nie udało się zapisać zmian w pamięci przeglądarki. Dane pozostają widoczne do zamknięcia strony.')
  }

  function showForm(meal?: Meal) {
    setEditingMeal(meal ?? null)
    if (meal) setSelectedDate(meal.date)
    setIsFormOpen(true)
  }
  function saveMeal(meal: Meal) {
    updateMeals(editingMeal ? meals.map((item) => item.id === meal.id ? meal : item) : [...meals, meal])
    setIsFormOpen(false)
  }
  function deleteMeal(meal: Meal) {
    if (window.confirm(`Usunąć posiłek „${meal.name}”?`)) updateMeals(meals.filter((item) => item.id !== meal.id))
  }
  function changeWeek(offset: number) {
    const next = addDays(weekStart, offset * 7)
    setWeekStart(next)
    setSelectedDate(formatDate(next))
  }

  return <main className="app-shell">
    <header className="app-header"><div><p className="eyebrow">TWÓJ DZIENNIK</p><h1>CalTracking</h1></div><button className="primary" onClick={() => showForm()}>+ Dodaj posiłek</button></header>
    {saveMessage && <p className="status-message" role="alert">{saveMessage}</p>}
    <section className="week-navigation" aria-label="Nawigacja po tygodniach"><button onClick={() => changeWeek(-1)} aria-label="Poprzedni tydzień">←</button><strong>{weekLabel(weekStart)}</strong><button onClick={() => changeWeek(1)} aria-label="Następny tydzień">→</button></section>
    <NutritionSummary totals={totals} />
    <section className="day-tabs" aria-label="Wybór dnia">{days.map((day) => {
      const date = formatDate(day); const dayTotals = sumMeals(meals.filter((meal) => meal.date === date)); const isToday = date === formatDate(new Date())
      return <button key={date} className={`${date === selectedDate ? 'selected' : ''} ${isToday ? 'today' : ''}`} onClick={() => setSelectedDate(date)} aria-pressed={date === selectedDate}>{new Intl.DateTimeFormat('pl-PL', { weekday: 'short', day: 'numeric' }).format(day)}<span>{dayTotals.calories} kcal</span></button>
    })}</section>
    <section className="daily-summary" aria-label="Podsumowania dni tygodnia">{days.map((day) => {
      const date = formatDate(day); const dayTotals = sumMeals(meals.filter((meal) => meal.date === date)); const isToday = date === formatDate(new Date())
      return <article className={isToday ? 'today' : ''} key={date}><h2>{new Intl.DateTimeFormat('pl-PL', { weekday: 'short', day: 'numeric', month: 'short' }).format(day)}</h2><strong>{dayTotals.calories} kcal</strong><p>B {dayTotals.protein} g · T {dayTotals.fat} g · W {dayTotals.carbohydrates} g</p></article>
    })}</section>
    <section className="day-view" aria-labelledby="selected-day"><h2 id="selected-day">{dateLabel(new Date(`${selectedDate}T12:00:00`))}</h2>{mealSlots.map((slot) => <MealGroup key={slot} slot={slot} meals={meals.filter((meal) => meal.date === selectedDate && meal.slot === slot)} onEdit={showForm} onDelete={deleteMeal} />)}</section>
    {isFormOpen && <MealForm initialMeal={editingMeal} initialDate={selectedDate} onClose={() => setIsFormOpen(false)} onSave={saveMeal} />}
  </main>
}

function NutritionSummary({ totals }: { totals: Nutrition }) {
  return <section className="summary" aria-label="Podsumowanie tygodnia"><div><span>Kalorie</span><strong>{totals.calories} kcal</strong></div><div><span>Białko</span><strong>{totals.protein} g</strong></div><div><span>Tłuszcze</span><strong>{totals.fat} g</strong></div><div><span>Węglowodany</span><strong>{totals.carbohydrates} g</strong></div></section>
}
function MealGroup({ slot, meals, onEdit, onDelete }: { slot: MealSlot; meals: Meal[]; onEdit: (meal: Meal) => void; onDelete: (meal: Meal) => void }) {
  return <section className="meal-group"><h3>{slot}</h3>{meals.length === 0 ? <p className="empty">Brak zapisanych posiłków</p> : meals.map((meal) => <article className="meal-card" key={meal.id}><div><strong>{meal.name}</strong><p>{meal.calories} kcal · B {meal.protein} g · T {meal.fat} g · W {meal.carbohydrates} g</p></div><div className="meal-actions"><button onClick={() => onEdit(meal)}>Edytuj</button><button onClick={() => onDelete(meal)} aria-label={`Usuń: ${meal.name}`}>Usuń</button></div></article>)}</section>
}
function MealForm({ initialMeal, initialDate, onClose, onSave }: { initialMeal: Meal | null; initialDate: string; onClose: () => void; onSave: (meal: Meal) => void }) {
  const [draft, setDraft] = useState(() => toDraft(initialMeal, initialDate)); const [errors, setErrors] = useState<FormErrors>({})
  useEffect(() => { const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }; window.addEventListener('keydown', closeOnEscape); return () => window.removeEventListener('keydown', closeOnEscape) }, [onClose])
  function updateField<Key extends keyof MealDraft>(key: Key, value: MealDraft[Key]) { setDraft((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: undefined })) }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const nextErrors = validateDraft(draft); setErrors(nextErrors); if (Object.keys(nextErrors).length === 0) onSave(mealFromDraft(draft)) }
  return <div className="dialog-backdrop" role="presentation"><form className="meal-form" onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="meal-form-title" noValidate><div className="form-header"><h2 id="meal-form-title">{initialMeal ? 'Edytuj posiłek' : 'Dodaj posiłek'}</h2><button type="button" onClick={onClose} aria-label="Zamknij formularz">×</button></div><FormField label="Nazwa" error={errors.name}><input autoFocus value={draft.name} onChange={(event) => updateField('name', event.target.value)} aria-invalid={Boolean(errors.name)} /></FormField><FormField label="Dzień" error={errors.date}><input type="date" value={draft.date} onChange={(event) => updateField('date', event.target.value)} aria-invalid={Boolean(errors.date)} /></FormField><label>Pora<select value={draft.slot} onChange={(event) => updateField('slot', event.target.value as MealSlot)}>{mealSlots.map((slot) => <option key={slot}>{slot}</option>)}</select></label><div className="nutrition-fields">{nutritionFields.map(([key, label]) => <FormField key={key} label={label} error={errors[key]}><input min="0" step="0.1" type="number" inputMode="decimal" value={draft[key]} onChange={(event) => updateField(key, event.target.value)} aria-invalid={Boolean(errors[key])} /></FormField>)}</div>{Object.keys(errors).length > 0 && <p className="form-error" role="alert">Popraw pola oznaczone komunikatem.</p>}<div className="form-actions"><button type="button" onClick={onClose}>Anuluj</button><button className="primary" type="submit">Zapisz posiłek</button></div></form></div>
}
function FormField({ label, error, children }: { label: string; error?: string; children: ReactNode }) { return <label>{label}{children}{error && <span className="field-error">{error}</span>}</label> }
export default App
