# CalTracking

Responsywna aplikacja do lokalnego zapisywania posiłków, kalorii i podstawowych makroskładników. Nie wymaga konta ani połączenia z serwerem — dane pozostają w przeglądarce użytkownika.

## Uruchomienie

Wymagany jest Node.js 20+ oraz npm.

```bash
npm install
npm run dev
```

Następnie otwórz adres podany przez Vite (domyślnie `http://localhost:5173`).

## Dostępne polecenia

| Polecenie | Opis |
| --- | --- |
| `npm run dev` | Uruchamia środowisko programistyczne. |
| `npm run build` | Sprawdza TypeScript i buduje wersję produkcyjną w `dist/`. |
| `npm run lint` | Sprawdza styl i podstawowe błędy w kodzie. |
| `npm run preview` | Lokalnie serwuje zbudowaną wersję produkcyjną. |

## Dokumentacja

- [Opis produktu](docs/opis-aplikacji.md)
- [Specyfikacja realizacyjna](docs/specyfikacja-realizacyjna.md)
- [Plan wdrożenia](docs/plan-realizacji.md)

## Technologia

React, TypeScript i Vite. Dane są zapisywane w `localStorage` pod kluczem `caltracking.meals.v1`.
