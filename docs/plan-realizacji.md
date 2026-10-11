# Plan realizacji — CalTracking

## Etap 0 — przygotowanie projektu

**Cel:** stworzenie powtarzalnego środowiska pracy.

- Konfiguracja Vite, React, TypeScript i ESLint.
- Komendy `dev`, `build`, `lint` oraz dokumentacja uruchomienia.
- Definicja typu `Meal` i adaptera lokalnego zapisu.

**Rezultat:** aplikacja buduje się lokalnie, a kod ma podstawowe zasady jakości.

**Sprawdzenie realizacji:**

1. Uruchom `npm install`, `npm run lint` oraz `npm run build` — wszystkie polecenia kończą się powodzeniem.
2. Uruchom `npm run dev` i otwórz adres podany przez Vite; aplikacja wyświetla się bez błędu w konsoli.
3. Sprawdź, że `src/types.ts` definiuje `Meal`, a `src/storage.ts` udostępnia odczyt i zapis danych lokalnych.

## Etap 1 — rejestr posiłków (MVP)

**Cel:** użytkownik może utworzyć, zmienić i usunąć wpis.

- Formularz z walidacją wymaganych pól i wartości nieujemnych.
- Podział dnia na pory posiłków.
- Odczyt i zapis w `localStorage`, także bezpieczne zachowanie przy uszkodzonych danych.

**Kryterium ukończenia:** wpis po odświeżeniu pozostaje widoczny, a edycja i usunięcie aktualizują widok bez błędów.

**Sprawdzenie realizacji:**

1. Dodaj posiłek z poprawnymi danymi do wybranego dnia i pory, a następnie odśwież stronę — wpis pozostaje widoczny.
2. Spróbuj wysłać pustą nazwę oraz wartość ujemną — formularz nie pozwala zapisać niepoprawnych danych.
3. Edytuj zapisany posiłek, potem go usuń — widok dnia od razu pokazuje aktualny stan.
4. W narzędziach przeglądarki ustaw pod kluczem `caltracking.meals.v1` niepoprawny JSON, odśwież stronę i potwierdź, że aplikacja nadal działa z pustą listą.

## Etap 2 — czas i podsumowania

**Cel:** wygodne przeglądanie danych tygodniowych.

- Nawigacja po tygodniach i wybór dnia.
- Suma kalorii oraz makroskładników dla tygodnia.
- Widok sum dla każdego dnia tygodnia i rozróżnienie aktualnego dnia.

**Kryterium ukończenia:** suma jest zgodna z wpisami po dodaniu, edycji i usunięciu dowolnego posiłku.

**Sprawdzenie realizacji:**

1. Dodaj wpisy w co najmniej dwóch dniach tygodnia i porównaj sumę tygodnia z ręcznym zsumowaniem kalorii oraz makroskładników.
2. Wybierz każdy dzień, przełącz poprzedni i następny tydzień, a potem wróć — wybór dnia i zakres tygodnia są poprawne.
3. Zmień lub usuń jeden z wpisów i potwierdź, że suma tygodnia oraz suma jego dnia aktualizują się bez odświeżania strony.

## Etap 3 — dopracowanie UX i dostępności

**Cel:** aplikacja jest czytelna oraz wygodna na telefonie i komputerze.

- Test widoków 320 px, 768 px i 1280 px.
- Obsługa klawiaturą, widoczne focusy, komunikaty walidacyjne oraz potwierdzenie usuwania.
- Stan pusty, błąd braku możliwości zapisu i czytelne formatowanie liczb.

**Kryterium ukończenia:** podstawowy przepływ można wykonać klawiaturą, a żaden widok nie przewija się poziomo.

**Sprawdzenie realizacji:**

1. Przejdź przez dodawanie, edycję i usuwanie wyłącznie klawiszem Tab, Shift+Tab, Enter i Spacją.
2. Sprawdź widoki o szerokości 320 px, 768 px i 1280 px; żaden nie ma poziomego przewijania.
3. Potwierdź, że fokus jest widoczny, a komunikaty walidacyjne i stan pusty są zrozumiałe.

## Etap 4 — testy i wydanie

**Cel:** gotowość do użycia przez pierwszych użytkowników.

- Testy jednostkowe dla sumowania, obsługi tygodni i walidacji danych z pamięci lokalnej.
- Testy komponentowe dla dodawania/edycji/usuwania.
- Przegląd prywatności i wydajności, uruchomienie `npm run lint` oraz `npm run build`.
- Publikacja statycznego katalogu `dist/` na wybranym hostingu.

**Kryterium ukończenia:** wszystkie kontrole CI są zielone, a wdrożona aplikacja nie wykonuje żądań z danymi użytkownika.

**Sprawdzenie realizacji:**

1. Uruchom testy, `npm run lint` i `npm run build`; wszystkie kontrole przechodzą pomyślnie.
2. Sprawdź w narzędziach deweloperskich, że aplikacja nie wysyła żądań zawierających dane posiłków.
3. Otwórz wdrożoną wersję, wykonaj podstawowy przepływ i potwierdź działanie wpisów oraz widoków na telefonie i komputerze.

## Kolejność i ryzyka

Etapy 0–2 tworzą pierwszą użyteczną wersję; etapy 3–4 są warunkiem publikacji. Największe ryzyka to format stref czasowych oraz niespójny zapis w przeglądarce. Minimalizujemy je, zapisując daty jako `YYYY-MM-DD`, używając południa przy konwersji do obiektu `Date` oraz walidując dane z `localStorage` przed użyciem.
