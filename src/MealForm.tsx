import { useEffect, useState, type FormEvent } from 'react'
import { dateLabel } from './date'
import { emptyNutrition } from './nutrition'
import { mealSlots, type Meal, type MealSlot, type Nutrition } from './types'

const nutritionFields = [
  { key: 'calories', label: 'Kalorie', unit: 'kcal' },
  { key: 'protein', label: 'Białko', unit: 'g' },
  { key: 'fat', label: 'Tłuszcze', unit: 'g' },
  { key: 'carbohydrates', label: 'Węglowodany', unit: 'g' },
] as const
type NutritionKey = keyof Nutrition
type MealDraft = Omit<Meal, NutritionKey> & Record<NutritionKey, string>
type FormErrors = Partial<Record<keyof MealDraft, string>>

export interface MealPreset {
  date: string
  slot?: MealSlot
}

function toDraft(meal: Meal | null, preset: MealPreset): MealDraft {
  const source = meal ?? { id: crypto.randomUUID(), name: '', date: preset.date, slot: preset.slot ?? 'Śniadanie', ...emptyNutrition }
  return { ...source, calories: String(source.calories), protein: String(source.protein), fat: String(source.fat), carbohydrates: String(source.carbohydrates) }
}

function validateDraft(draft: MealDraft): FormErrors {
  const errors: FormErrors = {}
  if (!draft.name.trim()) errors.name = 'Podaj nazwę posiłku.'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date)) errors.date = 'Wybierz poprawny dzień.'
  nutritionFields.forEach(({ key }) => {
    const value = Number(draft[key])
    if (draft[key].trim() === '' || !Number.isFinite(value) || value < 0) errors[key] = 'Wpisz liczbę równą lub większą od zera.'
  })
  return errors
}

function mealFromDraft(draft: MealDraft): Meal {
  return { ...draft, name: draft.name.trim(), calories: Number(draft.calories), protein: Number(draft.protein), fat: Number(draft.fat), carbohydrates: Number(draft.carbohydrates) }
}

interface MealFormProps {
  initialMeal: Meal | null
  preset: MealPreset
  onClose: () => void
  onSave: (meal: Meal) => void
  onDelete: (meal: Meal) => void
}

export function MealForm({ initialMeal, preset, onClose, onSave, onDelete }: MealFormProps) {
  const [draft, setDraft] = useState(() => toDraft(initialMeal, preset))
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  function updateField<Key extends keyof MealDraft>(key: Key, value: MealDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateDraft(draft)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) onSave(mealFromDraft(draft))
  }

  const hasErrors = Object.values(errors).some(Boolean)
  const hasValidDate = /^\d{4}-\d{2}-\d{2}$/.test(draft.date)
  const [caloriesField, ...macroFields] = nutritionFields

  function renderNutritionField({ key, label, unit }: (typeof nutritionFields)[number]) {
    return (
      <div key={key} className="field">
        <label htmlFor={`meal-${key}`}>
          {key !== 'calories' && <span className={`dot dot-${key}`} aria-hidden="true" />}
          {label}<span className="visually-hidden"> ({unit})</span>
        </label>
        <div className="input-with-unit">
          <input id={`meal-${key}`} min="0" step="0.1" type="number" inputMode="decimal" value={draft[key]} onChange={(event) => updateField(key, event.target.value)} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `meal-${key}-error` : undefined} />
          <span aria-hidden="true">{unit}</span>
        </div>
        {errors[key] && <span className="field-error" id={`meal-${key}-error`}>{errors[key]}</span>}
      </div>
    )
  }

  return (
    <div className="dialog-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <form className="meal-form" onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="meal-form-title" noValidate>
        <div className="sheet-handle" aria-hidden="true" />
        <div className="form-header">
          <div>
            <h2 id="meal-form-title">{initialMeal ? 'Edytuj posiłek' : 'Dodaj posiłek'}</h2>
            <p className="form-subtitle">{hasValidDate && `${dateLabel(new Date(`${draft.date}T12:00:00`))} · `}{draft.slot}</p>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Zamknij formularz">×</button>
        </div>

        <div className="field">
          <label htmlFor="meal-name">Nazwa</label>
          <input id="meal-name" autoFocus value={draft.name} onChange={(event) => updateField('name', event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'meal-name-error' : undefined} />
          {errors.name && <span className="field-error" id="meal-name-error">{errors.name}</span>}
        </div>

        <fieldset className="field">
          <legend>Pora posiłku</legend>
          <div className="slot-options">
            {mealSlots.map((slot) => (
              <label key={slot} className="slot-option">
                <input type="radio" name="slot" value={slot} checked={draft.slot === slot} onChange={() => updateField('slot', slot)} />
                <span>{slot}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="form-row">
          <div className="field">
            <label htmlFor="meal-date">Dzień</label>
            <input id="meal-date" type="date" value={draft.date} onChange={(event) => updateField('date', event.target.value)} aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? 'meal-date-error' : undefined} />
            {errors.date && <span className="field-error" id="meal-date-error">{errors.date}</span>}
          </div>
          {renderNutritionField(caloriesField)}
        </div>

        <div className="nutrition-fields">
          {macroFields.map(renderNutritionField)}
        </div>

        {hasErrors && <p className="form-error" role="alert">Popraw pola oznaczone komunikatem.</p>}

        <div className="form-actions">
          {!initialMeal && <span className="keyboard-hint" aria-hidden="true"><kbd>Esc</kbd> zamyka</span>}
          {initialMeal && <button type="button" className="danger" onClick={() => onDelete(initialMeal)}>Usuń</button>}
          <button type="button" className="secondary" onClick={onClose}>Anuluj</button>
          <button className="primary" type="submit">Zapisz posiłek</button>
        </div>
      </form>
    </div>
  )
}
