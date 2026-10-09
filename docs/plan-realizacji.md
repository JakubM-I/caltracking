# Plan realizacji — CalTracking

## Etap 0 — przygotowanie projektu

**Cel:** stworzenie powtarzalnego środowiska pracy.

- Konfiguracja Vite, React, TypeScript i ESLint.
- Komendy `dev`, `build`, `lint` oraz dokumentacja uruchomienia.
- Definicja typu `Meal` i adaptera lokalnego zapisu.

**Rezultat:** aplikacja buduje się lokalnie, a kod ma podstawowe zasady jakości.

## Etap 1 — rejestr posiłków (MVP)

**Cel:** użytkownik może utworzyć, zmienić i usunąć wpis.

- Formularz z walidacją wymaganych pól i wartości nieujemnych.
- Podział dnia na pory posiłków.
- Odczyt i zapis w `localStorage`, także bezpieczne zachowanie przy uszkodzonych danych.

**Kryterium ukończenia:** wpis po odświeżeniu pozostaje widoczny, a edycja i usunięcie aktualizują widok bez błędów.

## Etap 2 — czas i podsumowania

**Cel:** wygodne przeglądanie danych tygodniowych.

- Nawigacja po tygodniach i wybór dnia.
- Suma kalorii oraz makroskładników dla tygodnia.
- Widok sum dla każdego dnia tygodnia i rozróżnienie aktualnego dnia.

**Kryterium ukończenia:** suma jest zgodna z wpisami po dodaniu, edycji i usunięciu dowolnego posiłku.

## Etap 3 — dopracowanie UX i dostępności

**Cel:** aplikacja jest czytelna oraz wygodna na telefonie i komputerze.

- Test widoków 320 px, 768 px i 1280 px.
- Obsługa klawiaturą, widoczne focusy, komunikaty walidacyjne oraz potwierdzenie usuwania.
- Stan pusty, błąd braku możliwości zapisu i czytelne formatowanie liczb.

**Kryterium ukończenia:** podstawowy przepływ można wykonać klawiaturą, a żaden widok nie przewija się poziomo.

## Etap 4 — testy i wydanie

**Cel:** gotowość do użycia przez pierwszych użytkowników.

- Testy jednostkowe dla sumowania, obsługi tygodni i walidacji danych z pamięci lokalnej.
- Testy komponentowe dla dodawania/edycji/usuwania.
- Przegląd prywatności i wydajności, uruchomienie `npm run lint` oraz `npm run build`.
- Publikacja statycznego katalogu `dist/` na wybranym hostingu.

**Kryterium ukończenia:** wszystkie kontrole CI są zielone, a wdrożona aplikacja nie wykonuje żądań z danymi użytkownika.

## Kolejność i ryzyka

Etapy 0–2 tworzą pierwszą użyteczną wersję; etapy 3–4 są warunkiem publikacji. Największe ryzyka to format stref czasowych oraz niespójny zapis w przeglądarce. Minimalizujemy je, zapisując daty jako `YYYY-MM-DD`, używając południa przy konwersji do obiektu `Date` oraz walidując dane z `localStorage` przed użyciem.
