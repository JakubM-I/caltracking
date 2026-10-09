# Specyfikacja realizacyjna — CalTracking

## 1. Cel i granice produktu

CalTracking umożliwia jednej osobie ręczne zapisywanie posiłków i kontrolę sum kalorii, białka, tłuszczów oraz węglowodanów w tygodniu. Jest to aplikacja działająca całkowicie po stronie przeglądarki.

Wersja 1 nie zawiera kont, serwera, synchronizacji, bazy produktów, skanera kodów, celów żywieniowych, rekomendacji ani integracji zewnętrznych.

## 2. Role i scenariusze użytkownika

Jedyną rolą jest użytkownik lokalny.

1. Otwiera aplikację i widzi bieżący tydzień oraz łączne wartości odżywcze.
2. Wybiera dzień, dodaje posiłek z nazwą, porą i wartościami odżywczymi.
3. W razie potrzeby edytuje wpis lub go usuwa.
4. Przechodzi do poprzedniego albo kolejnego tygodnia, aby przejrzeć zapisane dane.

## 3. Wymagania funkcjonalne

| Id | Wymaganie | Kryterium akceptacji |
| --- | --- | --- |
| FR-01 | Nawigacja po tygodniach | Użytkownik przełącza tydzień przyciskami poprzedni/następny; tydzień zaczyna się w poniedziałek. |
| FR-02 | Wybór dnia | Można wybrać każdy z siedmiu dni aktualnie wyświetlanego tygodnia. |
| FR-03 | Dodanie posiłku | Formularz wymaga nazwy, dnia, pory, kalorii, białka, tłuszczów i węglowodanów; wartości liczbowe nie są ujemne. |
| FR-04 | Edycja i usunięcie | Każdy zapisany posiłek można zaktualizować lub usunąć z widoku dnia. |
| FR-05 | Podsumowania | Widok pokazuje sumę tygodnia oraz wartości pojedynczych posiłków. Dalszy etap rozszerza go o sumy każdego dnia. |
| FR-06 | Trwałość danych | Po odświeżeniu aplikacji poprawne wpisy pozostają dostępne na tym samym urządzeniu. |
| FR-07 | Odporność na zapis | Pusty, uszkodzony lub niezgodny zapis lokalny nie blokuje aplikacji; jest traktowany jak brak danych. |

## 4. Wymagania niefunkcjonalne

- Interfejs jest po polsku, responsywny i projektowany mobile-first.
- Semantyczne etykiety pól oraz przyciski mają dostępne nazwy; obsługa formularza działa z klawiaturą.
- Aplikacja nie wysyła danych użytkownika przez sieć.
- Kod jest w TypeScript ze ścisłym sprawdzaniem typów; lint i build muszą przechodzić przed wydaniem.
- Widok ma pozostać użyteczny od szerokości 320 px; na desktopie grupy posiłków układają się w siatkę.

## 5. Model danych

Każdy posiłek ma następujący kształt:

```ts
interface Meal {
  id: string
  name: string
  date: string // ISO: YYYY-MM-DD
  slot: 'Śniadanie' | 'II śniadanie' | 'Obiad' | 'Kolacja' | 'Przekąska'
  calories: number
  protein: number
  fat: number
  carbohydrates: number
}
```

Wartości żywieniowe dotyczą całego posiłku, a nie produktu lub porcji. Wpisy są przechowywane jako tablica JSON w `localStorage`, pod kluczem `caltracking.meals.v1`.

## 6. Architektura

```text
Przeglądarka
  └─ React (widok i formularz)
       ├─ date.ts       — tygodnie, daty i formatowanie
       ├─ types.ts      — model domenowy
       ├─ storage.ts    — odczyt/walidacja/zapis localStorage
       └─ App.tsx       — stan posiłków i interakcje
```

Nie ma API ani bazy danych. `storage.ts` jest wydzielony, aby w przyszłości można było dodać import/eksport lub synchronizację bez mieszania jej z widokiem.

## 7. Zachowanie interfejsu

- Na telefonie użytkownik najpierw widzi podsumowanie i listę grup posiłków dla wybranego dnia.
- Na większym ekranie grupy posiłków są prezentowane w dwóch kolumnach, co ułatwia porównanie dnia.
- Przycisk „Dodaj posiłek” otwiera modalny formularz. Formularz domyślnie używa wybranego dnia i pory „Śniadanie”.
- Usunięcie usuwa wpis bez dodatkowego ekranu potwierdzenia; dodanie potwierdzenia jest zaplanowane przed wydaniem produkcyjnym.

## 8. Zależności

| Zależność | Cel |
| --- | --- |
| React + React DOM | Renderowanie interfejsu i zarządzanie stanem. |
| TypeScript | Typowanie modelu danych i logiki. |
| Vite + plugin React | Serwer lokalny i budowanie aplikacji. |
| ESLint + wtyczki TypeScript/React | Statyczna kontrola jakości. |

Nie są wymagane biblioteki UI, router, baza danych ani biblioteka do zarządzania stanem — zakres V1 uzasadnia prosty stan komponentu.
