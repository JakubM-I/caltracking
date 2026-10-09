# Wskazówki dla agentów

## Cel projektu

Tworzymy niewielką, responsywną aplikację webową do lokalnego śledzenia
spożytych kalorii i wartości odżywczych. Zakres produktu opisuje
[`docs/opis-aplikacji.md`](docs/opis-aplikacji.md).

## Zasady pracy

- Przed większą zmianą przeczytaj opis produktu i zachowaj zgodność z jego
  zakresem.
- Stawiaj na prostą, czytelną implementację bez przedwczesnego rozbudowywania
  architektury.
- Projektuj mobile-first: na małych ekranach najważniejszy jest widok dnia,
  a na desktopie widok tygodnia.
- Dane użytkownika przechowuj wyłącznie lokalnie w przeglądarce, dopóki
  wymagania nie wprowadzą backendu lub synchronizacji.
- Interfejs, komunikaty i dokumentację pisz po polsku, chyba że istniejący
  kod lub wymaganie stanowi inaczej.
- Zachowuj dostępność: semantyczny HTML, obsługa klawiaturą, czytelne etykiety
  formularzy i odpowiedni kontrast.
- Po zmianach uruchom dostępne formatowanie, testy i sprawdzenie budowania.

## Granice pierwszej wersji

Nie dodawaj logowania, kont użytkowników, zdalnej bazy danych, integracji
zewnętrznych ani wyliczeń dietetycznych poza wartościami wpisanymi przez
użytkownika, o ile nie zostanie to wyraźnie zlecone.
