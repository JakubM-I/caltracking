import { useCallback, useMemo, useState, useSyncExternalStore } from 'react'
import { addDays, dateLabel, formatDate, startOfWeek, weekLabel } from './date'
import { MealForm, type MealPreset } from './MealForm'
import { sumMeals } from './nutrition'
import { loadMeals, saveMeals } from './storage'
import { mealSlots, type Meal, type MealSlot, type Nutrition } from './types'

const DESKTOP_QUERY = '(min-width: 960px)'
const numberFormat = new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 1 })
const format = (value: number) => numberFormat.format(value)
const weekdayFormat = new Intl.DateTimeFormat('pl-PL', { weekday: 'short' })
const weekdayLongFormat = new Intl.DateTimeFormat('pl-PL', { weekday: 'long' })

function useMediaQuery(query: string) {
  const subscribe = useCallback((onChange: () => void) => {
    if (typeof window.matchMedia !== 'function') return () => {}
    const media = window.matchMedia(query)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [query])
  return useSyncExternalStore(subscribe, () => typeof window.matchMedia === 'function' && window.matchMedia(query).matches, () => false)
}

interface DaySummary {
  date: string
  day: Date
  meals: Meal[]
  totals: Nutrition
}

function App() {
  const [meals, setMeals] = useState<Meal[]>(loadMeals)
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()))
  const [selectedDate, setSelectedDate] = useState(() => formatDate(new Date()))
  const [form, setForm] = useState<{ meal: Meal | null; preset: MealPreset } | null>(null)
  const [saveMessage, setSaveMessage] = useState('')
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  const today = formatDate(new Date())

  const days = useMemo<DaySummary[]>(() => Array.from({ length: 7 }, (_, index) => {
    const day = addDays(weekStart, index)
    const date = formatDate(day)
    const dayMeals = meals.filter((meal) => meal.date === date)
    return { date, day, meals: dayMeals, totals: sumMeals(dayMeals) }
  }), [meals, weekStart])
  const weekTotals = sumMeals(days.flatMap((day) => day.meals))
  const selectedDay = days.find((day) => day.date === selectedDate) ?? days[0]

  function updateMeals(nextMeals: Meal[]) {
    setMeals(nextMeals)
    setSaveMessage(saveMeals(nextMeals) ? '' : 'Nie udało się zapisać zmian w pamięci przeglądarki. Dane pozostają widoczne do zamknięcia strony.')
  }

  function openForm(meal: Meal | null, preset: MealPreset = { date: selectedDate }) {
    if (meal) setSelectedDate(meal.date)
    setForm({ meal, preset })
  }
  const closeForm = useCallback(() => setForm(null), [])

  function saveMeal(meal: Meal) {
    updateMeals(form?.meal ? meals.map((item) => item.id === meal.id ? meal : item) : [...meals, meal])
    setSelectedDate(meal.date)
    const mealWeek = startOfWeek(new Date(`${meal.date}T12:00:00`))
    if (mealWeek.getTime() !== weekStart.getTime()) setWeekStart(mealWeek)
    setForm(null)
  }

  function deleteMeal(meal: Meal) {
    if (!window.confirm(`Usunąć posiłek „${meal.name}”?`)) return
    updateMeals(meals.filter((item) => item.id !== meal.id))
    setForm(null)
  }

  function showWeek(start: Date, date = formatDate(start)) {
    setWeekStart(start)
    setSelectedDate(date)
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">C</span>
          <div>
            <p className="eyebrow">Twój dziennik</p>
            <h1>CalTracking</h1>
          </div>
        </div>

        <nav className="week-navigation" aria-label="Nawigacja po tygodniach">
          <button className="icon-button" onClick={() => showWeek(addDays(weekStart, -7))} aria-label="Poprzedni tydzień">‹</button>
          <strong aria-live="polite">{weekLabel(weekStart)}</strong>
          <button className="icon-button" onClick={() => showWeek(addDays(weekStart, 7))} aria-label="Następny tydzień">›</button>
          <button className="today-button" onClick={() => showWeek(startOfWeek(new Date()), today)}>Dziś</button>
        </nav>

        <button className="primary add-button" onClick={() => openForm(null)}><span aria-hidden="true">+</span> Dodaj posiłek</button>
      </header>

      <main className="app-main">
        {saveMessage && <p className="status-message" role="alert">{saveMessage}</p>}

        <WeekSummary totals={weekTotals} />

        {isDesktop
          ? <WeekPlanner days={days} today={today} selectedDate={selectedDate} onSelect={setSelectedDate} onEdit={(meal) => openForm(meal)} onAdd={(preset) => openForm(null, preset)} />
          : <>
            <DayStrip days={days} today={today} selectedDate={selectedDay.date} onSelect={setSelectedDate} />
            <DayView day={selectedDay} isToday={selectedDay.date === today} onEdit={(meal) => openForm(meal)} onAdd={(slot) => openForm(null, { date: selectedDay.date, slot })} />
          </>}

        <p className="legend">
          <span><span className="dot dot-protein" aria-hidden="true" />Białko</span>
          <span><span className="dot dot-fat" aria-hidden="true" />Tłuszcze</span>
          <span><span className="dot dot-carbohydrates" aria-hidden="true" />Węglowodany</span>
          <span className="legend-note">Dane zapisywane lokalnie w przeglądarce</span>
        </p>
      </main>

      {form && <MealForm initialMeal={form.meal} preset={form.preset} onClose={closeForm} onSave={saveMeal} onDelete={deleteMeal} />}
    </div>
  )
}

function MacroBar({ totals }: { totals: Nutrition }) {
  const sum = totals.protein + totals.fat + totals.carbohydrates
  return (
    <div className="macro-bar" aria-hidden="true">
      {sum > 0 && (['protein', 'fat', 'carbohydrates'] as const).map((key) => <span key={key} className={`macro-${key}`} style={{ width: `${(totals[key] / sum) * 100}%` }} />)}
    </div>
  )
}

function macroText(totals: Nutrition, compact = false) {
  if (compact) return `B ${format(totals.protein)} · T ${format(totals.fat)} · W ${format(totals.carbohydrates)} g`
  return `B ${format(totals.protein)} g · T ${format(totals.fat)} g · W ${format(totals.carbohydrates)} g`
}

function WeekSummary({ totals }: { totals: Nutrition }) {
  return (
    <section className="week-summary" aria-labelledby="week-summary-title">
      <div className="summary-card summary-calories">
        <h2 id="week-summary-title">Kalorie w tym tygodniu</h2>
        <p className="summary-value">{format(totals.calories)} <span>kcal</span></p>
        <MacroBar totals={totals} />
      </div>
      {([['protein', 'Białko'], ['fat', 'Tłuszcze'], ['carbohydrates', 'Węglowodany']] as const).map(([key, label]) => (
        <div key={key} className="summary-card">
          <h3><span className={`dot dot-${key}`} aria-hidden="true" />{label}</h3>
          <p className="summary-value">{format(totals[key])} <span>g</span></p>
        </div>
      ))}
    </section>
  )
}

interface WeekPlannerProps {
  days: DaySummary[]
  today: string
  selectedDate: string
  onSelect: (date: string) => void
  onEdit: (meal: Meal) => void
  onAdd: (preset: MealPreset) => void
}

function WeekPlanner({ days, today, selectedDate, onSelect, onEdit, onAdd }: WeekPlannerProps) {
  return (
    <section className="week-planner" aria-label="Posiłki w tygodniu">
      <table>
        <thead>
          <tr>
            <td />
            {days.map(({ date, day, totals }) => (
              <th key={date} scope="col" className={[date === today && 'today', date === selectedDate && 'selected'].filter(Boolean).join(' ')}>
                <button className="day-heading" onClick={() => onSelect(date)} aria-pressed={date === selectedDate} aria-current={date === today ? 'date' : undefined}>
                  <span className="day-heading-top">
                    <span className="day-name">{weekdayLongFormat.format(day)}</span>
                    <span className="day-number">{day.getDate()}</span>
                  </span>
                  <span className="day-calories">{format(totals.calories)} <span>kcal</span></span>
                  <MacroBar totals={totals} />
                  <span className="day-macros">{macroText(totals, true)}</span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mealSlots.map((slot) => (
            <tr key={slot}>
              <th scope="row">{slot}</th>
              {days.map(({ date, day, meals }) => (
                <td key={date} className={date === today ? 'today' : undefined}>
                  <div className="planner-cell">
                    {meals.filter((meal) => meal.slot === slot).map((meal) => (
                      <button key={meal.id} className="planner-meal" onClick={() => onEdit(meal)}>
                        <span className="meal-name">{meal.name}</span>
                        <span className="meal-meta">{format(meal.calories)} kcal</span>
                      </button>
                    ))}
                    <button className="planner-add" onClick={() => onAdd({ date, slot })} aria-label={`Dodaj posiłek: ${slot}, ${dateLabel(day)}`}>+ Dodaj</button>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function DayStrip({ days, today, selectedDate, onSelect }: { days: DaySummary[]; today: string; selectedDate: string; onSelect: (date: string) => void }) {
  return (
    <div className="day-strip" role="group" aria-label="Wybór dnia">
      {days.map(({ date, day, meals }) => (
        <button key={date} className={[date === selectedDate && 'selected', date === today && 'today'].filter(Boolean).join(' ')} onClick={() => onSelect(date)} aria-pressed={date === selectedDate} aria-current={date === today ? 'date' : undefined} aria-label={`${dateLabel(day)}${meals.length ? `, posiłki: ${meals.length}` : ''}`}>
          <span className="strip-weekday">{weekdayFormat.format(day)}</span>
          <span className="strip-number">{day.getDate()}</span>
          <span className={`strip-dot${meals.length ? ' has-meals' : ''}`} />
        </button>
      ))}
    </div>
  )
}

function DayView({ day, isToday, onEdit, onAdd }: { day: DaySummary; isToday: boolean; onEdit: (meal: Meal) => void; onAdd: (slot: MealSlot) => void }) {
  const { totals } = day
  return (
    <section className="day-view" aria-labelledby="selected-day">
      <div className="day-summary">
        <h2 id="selected-day">{dateLabel(day.day)}{isToday && ' · dziś'}</h2>
        <p className="summary-value">{format(totals.calories)} <span>kcal</span></p>
        <MacroBar totals={totals} />
        <dl className="day-macros-list">
          {([['protein', 'Białko'], ['fat', 'Tłuszcze'], ['carbohydrates', 'Węglowodany']] as const).map(([key, label]) => (
            <div key={key}>
              <dt><span className={`dot dot-${key}`} aria-hidden="true" />{label}</dt>
              <dd>{format(totals[key])} g</dd>
            </div>
          ))}
        </dl>
      </div>

      {mealSlots.map((slot) => {
        const slotMeals = day.meals.filter((meal) => meal.slot === slot)
        const calories = sumMeals(slotMeals).calories
        return (
          <section key={slot} className="meal-group" aria-labelledby={`slot-${slot}`}>
            <div className="meal-group-header">
              <h3 id={`slot-${slot}`}>{slot}</h3>
              {slotMeals.length > 0 && <span>{format(calories)} kcal</span>}
            </div>
            {slotMeals.length > 0 && (
              <ul>
                {slotMeals.map((meal) => (
                  <li key={meal.id}>
                    <button className="meal-row" onClick={() => onEdit(meal)}>
                      <span className="meal-name">{meal.name}</span>
                      <span className="meal-meta">{format(meal.calories)} kcal · {macroText(meal)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button className="meal-group-add" onClick={() => onAdd(slot)} aria-label={`Dodaj posiłek: ${slot}`}>+ Dodaj</button>
          </section>
        )
      })}
    </section>
  )
}

export default App
