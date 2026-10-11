import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('rejestr posiłków', () => {
  beforeEach(() => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue('00000000-0000-4000-8000-000000000001')
  })

  it('pokazuje komunikaty dla nieprawidłowych danych formularza', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /dodaj posiłek/i }))
    await user.clear(screen.getByLabelText('Kalorie (kcal)'))
    await user.click(screen.getByRole('button', { name: 'Zapisz posiłek' }))
    expect(screen.getByText('Podaj nazwę posiłku.')).toBeInTheDocument()
    expect(screen.getByText('Wpisz liczbę równą lub większą od zera.')).toBeInTheDocument()
  })

  it('pozwala dodać, edytować i usunąć posiłek', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /dodaj posiłek/i }))
    await user.type(screen.getByLabelText('Nazwa'), 'Owsianka')
    for (const [label, value] of [['Kalorie (kcal)', '400'], ['Białko (g)', '14'], ['Tłuszcze (g)', '10'], ['Węglowodany (g)', '65']] as const) {
      const input = screen.getByLabelText(label)
      await user.clear(input)
      await user.type(input, value)
    }
    await user.click(screen.getByRole('button', { name: 'Zapisz posiłek' }))
    expect(screen.getByText('Owsianka')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Edytuj' }))
    const name = screen.getByLabelText('Nazwa')
    await user.clear(name)
    await user.type(name, 'Zupa')
    await user.click(screen.getByRole('button', { name: 'Zapisz posiłek' }))
    expect(screen.getByText('Zupa')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Usuń: Zupa' }))
    expect(screen.queryByText('Zupa')).not.toBeInTheDocument()
    expect(window.confirm).toHaveBeenCalledWith('Usunąć posiłek „Zupa”?')
  })
})
