# Opis aplikacji — tracker kalorii

## Cel

Aplikacja pomaga rejestrować posiłki i kontrolować spożycie kalorii oraz
podstawowych makroskładników w obrębie bieżącego tygodnia. Jest przeznaczona
do użytku osobistego i działa bez konta oraz bez połączenia z serwerem.

## Główne funkcje

### Planowanie i rejestrowanie posiłków

- Użytkownik może przeglądać dni bieżącego tygodnia.
- Do wybranego dnia i pory posiłku można dodać posiłek.
- Posiłek można edytować i usunąć.
- Każdy posiłek ma co najmniej nazwę, przypisany dzień i porę.
- Do posiłku można zapisać wartości odżywcze: kalorie, białko, tłuszcze oraz
  węglowodany. Wartości są liczbowe i dotyczą całego zapisanego posiłku.

### Widoki responsywne

- Na desktopie podstawowym ekranem jest widok tygodnia, który pozwala szybko
  porównać posiłki i sumy dla kolejnych dni.
- Na urządzeniach mobilnych podstawowym ekranem jest widok jednego dnia w
  formie prostej listy posiłków.
- Przełączanie dni i tygodni powinno być jasne oraz wygodne w obu widokach.

### Podsumowanie

- Widok podsumowania pokazuje dane z bieżącego tygodnia.
- Prezentuje łączną liczbę kalorii i makroskładników dla całego tygodnia.
- Prezentuje też osobne podsumowanie dla każdego dnia tygodnia.

## Dane i prywatność

- Dane są zapisywane lokalnie w przeglądarce i pozostają dostępne po ponownym
  otwarciu aplikacji na tym samym urządzeniu.
- Pierwsza wersja nie wysyła danych na serwer i nie wymaga logowania.
- Należy przewidzieć bezpieczną obsługę pustego lub uszkodzonego lokalnego
  zapisu, bez blokowania działania interfejsu.

## Poza zakresem pierwszej wersji

- konta użytkowników i synchronizacja między urządzeniami,
- baza produktów, skaner kodów kreskowych i automatyczne wyliczanie wartości,
- cele kaloryczne, rekomendacje dietetyczne oraz rozbudowane raporty,
- integracje z urządzeniami lub serwisami zewnętrznymi.
