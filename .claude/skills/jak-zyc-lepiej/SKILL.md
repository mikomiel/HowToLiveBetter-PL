---
name: jak-zyc-lepiej
description: Odpowiada na konkretne pytania o decyzje życiowe (czy warto, jak zacząć, co zrobić najpierw) wyłącznie na podstawie opracowanych polskich porad w stanie verified z "Jak żyć lepiej" w tym repozytorium. Najpierw wyszukuje porady narzędziem tools/pl/search.mjs, potem odpowiada: działanie, koszt, korzyść i dowody, ograniczenia, numer porady. Użyj przy pytaniach o bezpieczeństwo i profilaktykę zdrowotną, rzucanie palenia, ruch i żywienie, sen, uwagę i koncentrację, planowanie czasu i spotkania, hasła, konta i dane. Nie zastępuje lekarza, prawnika ani numeru alarmowego.
---

# Decyzje życiowe: najpierw znajdź poradę, potem odpowiadaj

Reguły redakcyjne repozytorium są w AGENTS.md. Ten plik opisuje tylko, jak z nich korzystać przy odpowiadaniu na pytania. Nie zawiera żadnych porad ani źródeł.

## Co książka obejmuje

Opublikowane są tylko opracowane porady w stanie verified z kilku rozdziałów. Stan verified nie oznacza zatwierdzenia przez lekarza lub prawnika; zakres sprawdzenia jest przy każdej poradzie. Narzędzie wyszukiwania podaje w pierwszym wierszu, ile ich jest i z których rozdziałów. Powiedz o tym zakresie, gdy pytanie wykracza poza niego. Rekordy redakcyjne i porady niezweryfikowane nie są wynikami i nie wolno ich cytować ani streszczać.

## Krok 0: zagrożenie

Jeśli opis wskazuje na bezpośrednie zagrożenie życia lub zdrowia, najpierw wskaż numer alarmowy 112 i nie analizuj opłacalności. Przy kryzysie emocjonalnym osoby dorosłej wskaż telefon 116 123, tak jak w poradzie 03.18; porada 01.25 opisuje też aktualne wsparcie. Inne kontakty podawaj tylko po odczytaniu właściwej opublikowanej porady i z jej ograniczeniami. Nie proś o opis metody samouszkodzenia i nie porównuj śmiertelności metod.

## Krok 1: wyszukaj

```bash
node tools/pl/search.mjs "kilka słów kluczowych" --limit 5
```

Zrób dwa lub trzy zapytania z różnymi słowami (rdzenie, synonimy, rzeczowniki). Wyniki są uszeregowane orientacyjnie: sam oceń, czy porada naprawdę dotyczy pytania.

## Krok 2: odpowiedz tylko tym, co znalazłeś

- Każde twierdzenie z porady oznacz jej numerem (na przykład 03.4) i odsyłaczem z wyniku.
- Podaj osobno: co zrobić, koszt (pieniądze, czas i wysiłek oddzielnie), korzyść i dowody, ocenę dowodów A, B lub C z jej znaczeniem według README ("Jak czytać dowody") oraz ograniczenia.
- Nie przeliczaj czasu na pieniądze ani na długość życia. Nie zamieniaj d, HR ani OR w procenty. Nie zamieniaj korelacji w przyczynę.
- Nie dodawaj liczb, nazw instytucji, cen, przepisów ani dawek, których nie ma w znalezionej poradzie.
- Nie przedstawiaj znalezionej porady ani konsultacji z agentem AI jako zatwierdzenia przez specjalistę. Nie rozstrzygaj indywidualnego roszczenia i nie proś o dane zdrowotne, numery kont ani dokumenty prywatnej sprawy.
- Jeśli ograniczenia porady pasują do sytuacji pytającego (choroba, ciąża, wiek, leki), powiedz to i odeślij do lekarza lub innego specjalisty. Porada zdrowotna nie zastępuje diagnozy ani leczenia.

## Krok 3: gdy nic nie znaleziono

Powiedz wprost, że w opublikowanych poradach nie ma pozycji na ten temat. Możesz dodać ogólną uwagę zdroworozsądkową, jeśli wyraźnie oznaczysz ją jako własną i niepochodzącą z książki, bez dawek, przepisów, kwot i obietnic. Nie sugeruj, że odpowiedź "pewnie jest w książce".

## Atrybucja

Przy pierwszym użyciu treści podaj: Jak żyć lepiej, niezależna polska adaptacja HowToLiveBetter (eternity4719), CC BY 4.0. Adaptacja nie jest oficjalnie zatwierdzona przez autora oryginału.
