# Zasady polskiego wydania

To niezależna polska adaptacja HowToLiveBetter: „Jak żyć lepiej. Praktyczny poradnik oparty na dowodach”. Te zasady są wspólne dla wszystkich narzędzi redakcyjnych i programistycznych. CLAUDE.md odsyła do tego pliku.

## Zakres i źródła

- Autorytatywne repozytorium: https://github.com/mikomiel/HowToLiveBetter-PL. PR kieruj do jego gałęzi main, nigdy do eternity4719/HowToLiveBetter.
- Pracuj na gałęzi zadania. Jeden autor zapisuje gałąź. Zachowaj cudze zmiany. Nie używaj reset, clean, stash, rebase ani force-push do usuwania lub obchodzenia cudzej pracy.
- Zatrzymaj się przed scaleniem przez człowieka. Bez osobnej zgody nie scalaj PR, nie publikuj wydań, nie włączaj GitHub Pages ani automatycznego wdrożenia.
- Do prac repozytoryjnych używaj git i gh zgodnie z lokalnymi uprawnieniami.
- Kanoniczną polską treścią są rozdziały w book/pl/. Czytnik czyta te pliki Markdown. Jedyny rejestr CHAPTERS w reader.mjs zawiera identyfikatory i ścieżki plików, nie kopie porad ani ich weryfikacji. Nie kopiuj porad do HTML, JavaScript ani osobnej bazy.
- Chińskie book/*.md, docs/, selfcheck.html, skills/ i historyczne narzędzia są materiałem upstream, nie ukończonym polskim wydaniem. Nie stosuj odziedziczonego chińskiego skilla do polskich porad.
- Uzgodniony zakres obejmuje rozdziały 03, 04 i 14. Nie dodawaj innych rozdziałów bez uzgodnienia. Zachowaj pochodzenie i jawne powody zmian w istniejącej treści.

## Redakcja i dowody

- Pisz naturalną polszczyzną dla osób mieszkających w Polsce. Tłumacz sens, nie szyk zdania. Wyjaśnij termin specjalistyczny przy pierwszym użyciu.
- Tytuł porady ma wskazywać działanie i być zrozumiały bez rozmowy z autorem. Zachowaj warunki, populację, niepewność i ograniczenia źródła.
- Oddziel koszt pieniędzy, czasu i wysiłku od oczekiwanej korzyści. Nie przeliczaj automatycznie czasu na pieniądze lub długość życia.
- Oddziel ocenę dowodów od oceny opłacalności redakcyjnej. Oceny A/B/C są opisane w README; to nie system GRADE. Nie przedstawiaj ich jako gwarancji prawdziwości.
- Używaj oryginalnych badań i oficjalnych dokumentów. Syntezę badań nazwij syntezą. Przy braku pełnego tekstu podaj, co sprawdzono w abstrakcie. Metadane i streszczenie innej osoby nie potwierdzają wyniku.
- Nie wymyślaj cytowań, DOI, cen, efektów ani wniosków prawnych. Każda liczba musi mieć sprawdzone źródło lub jawne założenia rachunku redakcyjnego.
- Nie zamieniaj korelacji w przyczynę. Nie zamieniaj d, HR lub OR w procent skuteczności. Rozróżniaj ryzyko względne, różnicę ryzyka i punkty procentowe.
- Dla prawa, świadczeń, ochrony zdrowia, pracy i finansów sprawdzaj aktualne źródła polskie lub UE. Nie zastępuj mechanicznie chińskich instytucji ani przepisów polskimi nazwami. Porady zdrowotne nie zastępują diagnozy ani leczenia. Nie publikuj bezwarunkowych instrukcji medycznych ani chińskich numerów pomocowych jako polskich.
- Nie przenoś chińskich terminów postępowań, progów pieniężnych, telefonu alarmowego, zasad odpowiedzialności ani hierarchii wartościowania beneficjentów do polskich zaleceń.
- Nie zachowuj błędu tylko dlatego, że występuje w oryginale. Popraw lub pomiń twierdzenie i opisz zmianę w adaptacji.
- Przed dodaniem porady sprawdź, czy działanie już nie występuje. Nie zmieniaj numerów oryginału, aby zapełnić luki.

## Stan i format treści

Każda oceniana pozycja nowych rozdziałów ma jeden jawny Status. Niepełna pozycja jest rekordem redakcyjnym, nie gotową poradą:

- verified: przetłumaczona, sprawdzona i dopuszczona do polskiego wydania;
- needs_verification: istotne twierdzenie lub proponowane działanie nie ma wystarczającego potwierdzenia;
- needs_localization: zastosowanie zależy od chińskich instytucji, prawa, rynku lub procedur;
- not_applicable: brak odpowiedniego zastosowania w Polsce.

Czytnik publikuje wyłącznie verified. Brak lub nieznany stan jest błędem, nie zgodą na publikację. Rekord niepublikowany zawiera powód, wymagane źródła, przypięty oryginał oraz datę i zakres oceny. Nie oznaczaj go jako gotowej porady. Osiem wyłączeń rozdziału 04 pozostaje w dotychczasowej tabeli; nie zmieniaj ich decyzji bez nowych dowodów.

Zachowaj format nagłówków rozdziału i porad, jawne kotwice porada-R-N (numer rozdziału bez zera wiodącego i numer oryginalnej pozycji) oraz pojedyncze wiersze pól. Odsyłacz między rozdziałami ma postać plik.md#porada-R-N; musi działać także w Markdown. Każda verified wymaga pól: Status, Koszt, W praktyce, Korzyść i dowody, Ocena dowodów, Ocena redakcyjna, Ograniczenia, Źródła, Oryginał, Weryfikacja, Zmiany w adaptacji. Weryfikacja zawiera datę YYYY-MM-DD i zakres sprawdzenia. Oryginał zawiera identyfikator rozdziału i pozycji oraz odsyłacz przypięty do konkretnego commita upstream. Nie dodawaj HTML do pól.

## Sprawdzenie i publikacja

- Uruchom npm ci --ignore-scripts, npm test i npm run test:browser. Instalacja przeglądarki testowej: npx playwright install chromium. Nie dodawaj zależności do działania czytnika.
- Testy jednostkowe sprawdzają treść i bezpieczeństwo workflow. Testy przeglądarkowe muszą uruchamiać rzeczywisty czytnik z rzeczywistym Markdown, także na małym ekranie i z klawiaturą.
- Po zmianie treści sprawdź źródła, liczby, odnośniki, kotwice i liczbę opublikowanych porad w README oraz czytniku. Sprawdź wszystkie decyzje źródłowe, nawigację i błąd odczytu jednego rozdziału. Nie pokazuj części zbioru jako całości po błędzie. Starszy sync-stats.mjs dotyczy chińskiego wydania; nie uruchamiaj go do polskiej treści.
- Przejrzyj cały diff i nowe pliki. Zrób osobny przegląd języka oraz zgodności wniosków z dowodami. Użyj niezależnego przeglądu, jeśli jest dostępny. Nie deklaruj takiego przeglądu, jeśli się nie odbył.
- Raportuj kontrole jako PASS, FAIL, NOT_RUN lub UNAVAILABLE. Podaj testowany commit. Przegląd PR musi dotyczyć dokładnego opublikowanego HEAD.
- Teksty adaptacji są na CC BY 4.0. Zachowaj autorstwo eternity4719, tytuł oryginału, odnośnik do źródła i informację o zmianach. Zachowaj LICENSE oraz pełne zawiadomienie MIT w LICENSE-CODE dla kodu. Nie sugeruj oficjalnego zatwierdzenia przez autora upstream.
- Nie umieszczaj odziedziczonych reklam, zbiórek, analityki ani cudzych grafik w polskiej prezentacji.
